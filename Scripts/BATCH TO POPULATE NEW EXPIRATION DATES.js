/*------------------------------------------------------------------------------------------------------/
| Program: Additional Information Required.js
| Trigger: Batch
| Client: North Port
| Version 1.0 8/24/2023
| Author:
| This batch script will loop through EconomicDev/Business Tax Receipt/Application/NA records and close the Application Intake or Zoning review task with a status of denied if the task due date matches todays date and the  current workflow status is Additional Info Required.
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
currentUserID = "ADMIN";
useAppSpecificGroupName = false;
/*------------------------------------------------------------------------------------------------------/
| GLOBAL VARIABLES
/------------------------------------------------------------------------------------------------------*/
br = "<br>";
debug = "";
systemUserObj = aa.person.getUser(currentUserID).getOutput();
publicUser = false;
/*------------------------------------------------------------------------------------------------------/
| INCLUDE SCRIPTS (Core functions, batch includes, custom functions)
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess()) {
        SAScript = bzr.getOutput().getDescription();
    }
}

if (SA) {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
    eval(getMasterScriptText(SAScript, SA));
} else {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName) {
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1)
        servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

function getScriptText(vScriptName) {
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1)
        servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var showDebug = true; // Set to true to see debug messages in email confirmation
var maxSeconds = 60 * 5; // number of seconds allowed for batch processing, usually < 5*60
var timeExpired = false;
var emailAddress = "";
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
var pgParms = aa.env.getParamValues();
var pgParmK = pgParms.keys();
while (pgParmK.hasNext()) {
    k = pgParmK.next();
    if (k == "Send Batch log to:") {
        emailAddress = pgParms.get(k);
    }
}
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    logMessage("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
} else {
    logMessage("Batch job ID not found " + batchJobResult.getErrorMessage());
}
/*------------------------------------------------------------------------------------------------------/
|
| START: END CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var message = "";
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer
var todayDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
var fromDate = aa.date.parseDate("1/1/1980");
var toDate = aa.date.parseDate((new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear());
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS//
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
// Default showDebug to false. Update if provided as an environmental variable
showDebug = false;
if (String(aa.env.getValue("showDebug")).length > 0) {
    if (aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y")) {
        showDebug = true;
    }
}

// Default showMessage to true. Update if provided as an environmental variable
showMessage = true;
if (String(aa.env.getValue("showMessage")).length > 0) {
    if (aa.env.getValue("showMessage").substring(0, 1).toUpperCase().equals("N")) {
        showMessage = false;
    }
}
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
var paramsOK = true;

if (paramsOK) {
    logMessage("Start Date: " + startDate + br);
    if (!timeExpired) {
        mainProcess();
        handleExpirations();
        //logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");
        logMessage("End Date: " + startDate);
        aa.sendMail("cgutierrez@trustvip.com", emailAddress, "", "Batch Job Additional Info Required", emailText);
    }
}
/*------------------------------------------------------------------------------------------------------/
| <===========End Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", debug);
} else {
    aa.env.setValue("ScriptReturnCode", "0");
    if (showMessage) {
        aa.env.setValue("ScriptReturnMessage", message);
    }
    if (showDebug) {
        aa.env.setValue("ScriptReturnMessage", debug);
    }
}

function mainProcess() {
    try {
        var dtFmt = dateFormatted(startDate.getMonth() + 1, startDate.getDate(), startDate.getFullYear(), "MM/DD/YYYY")
        var appGroup = "EconomicDev";
        var appTypeType = "Business Tax Receipt";
        var subTypeArray = null;
        var appCategory = "NA";
        var thisCapId;
        var errorCount = 0;

        var recordListResult = aa.cap.getByAppType(appGroup, appTypeType, subTypeArray, appCategory);
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get thisCapId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {
                var capModel = recArray[j].getCapModel();
                thisCapId = capModel.getCapID();
                capId = thisCapId;
                cap = aa.cap.getCap(capId).getOutput();
                appTypeResult = cap.getCapType();
                appTypeString = appTypeResult.toString();
                appTypeArray = appTypeString.split("/");
                var thisCapIdString = capModel.getAltID();
                var toSkip = thisCapIdString.toString().substring(2, 3);
                if (toSkip.toLowerCase() == 't' || toSkip.toLowerCase() == 'm') {
                    continue;
                };
                if (appTypeType == "Business Tax Receipt") {
                    //get Additional Required Status from Workflow
                    var workflowResult = aa.workflow.getTasks(capId);
                    if (!workflowResult.getSuccess()) {
                        logDebug("**WARN failed to get WF-Tasks, Err:" + workflowResult.getErrorMessage());
                        continue;
                    }
                    var wfTasks = workflowResult.getOutput();
                    for (var tt in wfTasks) {
                        var wfTask = wfTasks[tt];
                        if (wfTask.getTaskDescription().toUpperCase() == "APPLICATION INTAKE" && wfTask.getDisposition().toUpperCase() == "ADDITIONAL INFO REQUIRED") {
                            var appWfDate = getTaskDueDateLocal("Application Intake");
                            if (todayDate == appWfDate && (wfTask.getDisposition().toUpperCase() == "ADDITIONAL INFO REQUIRED")) {
                                logMessage('Workflow Task Application Intake will be statused to denied and closed for record ' + thisCapIdString + ' as the due date is equivalent to todays date.');
                                closeTask("Application Intake", "Denied", "Closed via Batch Job", "");
                                if (appMatch("EconomicDev/Business Tax Receipt/Renewal/NA", capId)) {
                                    var projIncomplete = aa.cap.getProjectByChildCapID(capId, "Renewal", "Incomplete");
                                    if (projIncomplete.getSuccess()) {
                                        var projInc = projIncomplete.getOutput();
                                        for (var pi in projInc) {
                                            projInc[pi].setStatus("Complete");
                                            var updateResult = aa.cap.updateProject(projInc[pi]);
                                        }
                                        aa.cap.updateAccessByACA(capId, "Y");
                                    }
                                }
                                logMessage("<br>");
                            }
                        } else if (wfTask.getTaskDescription().toUpperCase() == "ZONING REVIEW" && wfTask.getDisposition().toUpperCase() == "ADDITIONAL INFO REQUIRED") {
                            var zoneWfDate = getTaskDueDateLocal("Zoning Review");
                            if (todayDate == zoneWfDate && (wfTask.getDisposition().toUpperCase() == "ADDITIONAL INFO REQUIRED")) {
                                logMessage('Workflow Task Zoning Review will be statused to denied and closed for record ' + thisCapIdString + ' as the due date is equivalent to todays date.');
                                closeTask("Zoning Review", "Denied", "Closed via Batch Job", "");
                            }
                        }
                    }

                }

            }
        }
    } catch (err) {
        logMessage("**ERROR** runtime error " + err.message + " at " + err.lineNumber + " stack: " + err.stack);
    }
    logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");
}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/

function closeTask(wfstr, wfstat, wfcomment, wfnote) // optional process name
{
    var useProcess = false;
    var processName = "";
    if (arguments.length == 5) {
        processName = arguments[4]; // subprocess
        useProcess = true;
    }

    var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else {
        logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
        return false;
    }

    if (!wfstat)
        wfstat = "NA";

    for (i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var dispositionDate = aa.date.getCurrentDate();
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();

            if (useProcess)
                aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");
            else
                aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");

            logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
            logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
        }
    }
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function sendEmail(fromEmail, toEmail, CC, template, eParams, files) { // optional: itemCap
    capId = thisCapId;
    var itemCap = capId;
    if (arguments.length == 7)
        itemCap = arguments[6]; // use cap ID specified in args

    //var sent = aa.document.sendEmailByTemplateName(fromEmail, toEmail, CC, template, eParams, files);
    toEmail = runEmailThroughSLEmailFilter(toEmail);
    var itempAltIDScriptModel = aa.cap.createthisCapIdScriptModel(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());
    var sent = aa.document.sendEmailAndSaveAsDocument(fromEmail, toEmail, CC, template, eParams, itempAltIDScriptModel, files);
    if (!sent.getSuccess()) {
        logMessage("**WARN sending email failed, error:" + sent.getErrorMessage());
    }
}

function getContactName(vConObj) {
    if (vConObj.people.getContactTypeFlag() == "organization") {
        if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
            return vConObj.people.getBusinessName();

        return vConObj.people.getBusinessName2();
    } else {
        if (vConObj.people.getFullName() != null && vConObj.people.getFullName() != "") {
            return vConObj.people.getFullName();
        }
        if (vConObj.people.getFirstName() != null && vConObj.people.getLastName() != null) {
            return vConObj.people.getFirstName() + " " + vConObj.people.getLastName();
        }
        if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
            return vConObj.people.getBusinessName();

        return vConObj.people.getBusinessName2();
    }
}

function getTaskDueDateLocal(wfstr) // optional process name.
{
    var useProcess = false;
    var processName = "";
    if (arguments.length == 2) {
        processName = arguments[1]; // subprocess
        useProcess = true;
    }

    var taskDesc = wfstr;
    if (wfstr == "*") {
        taskDesc = "";
    }
    var workflowResult = aa.workflow.getTaskItems(capId, taskDesc, processName, null, null, null);
    if (workflowResult.getSuccess())
        wfObj = workflowResult.getOutput();
    else {
        logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
        return false;
    }

    for (i in wfObj) {
        var fTask = wfObj[i];
        if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var dueDate = wfObj[i].getDueDate();
            var dueDateMS = dueDate.getEpochMilliseconds();
            if (dueDateMS) {
                var dateObject = new Date(dueDateMS);
                var thisDate = jsDateToMMDDYYYY(dateObject);

                return thisDate;
            }
        }
    }
}
function handleExpirations()
{
    appGroup = "Cannabis";
    appTypeType = null;
    appSubtype = "Permit";
    appCategory = null;
    var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;
    var emptyCm1 = aa.cap.getCapModel().getOutput();
    var emptyCt1 = emptyCm1.getCapType();
    emptyCt1.setGroup(appGroup);
    emptyCt1.setType(appTypeType);
    emptyCt1.setSubType(appSubtype);
    emptyCt1.setCategory(appCategory);
    //emptyCm1.setCapStatus("Active");
    var recordListResult = aa.cap.getCapIDListByCapModel(emptyCm1);
    var count = 0;
    if (!recordListResult.getSuccess())
    {
        logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
    }
    else
    {
        var recArray = recordListResult.getOutput();
        logMessage("Looping through " + recArray.length + " Records" );
        for (var j in recArray)
        {
            capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
            capIDString = capId.getCustomID();
            cap = aa.cap.getCap(capId).getOutput();
            var newExpDate = getAppSpecific("New Expiration Date");
            var expDate = getAppSpecific("Expiration Date");
            if((!newExpDate || (newExpDate == "") || typeof newExpDate === 'undefined'))
            {
                //aa.print(capId.getCustomID());
                count ++;
                editAppSpecific("New Expiration Date",expDate,capId);
            }

        }
    }
    aa.print("count: "+ count);
}
function getRecExpDate() {
    var itemCap = capId
    if (arguments.length > 0)
        itemCap = arguments[0]; // use cap ID specified in args

    var b1ExpDate = null;

    var b1ExpResult = aa.expiration.getLicensesByCapID(itemCap)
    if (!b1ExpResult.getSuccess())
    { logDebug("**ERROR: No expiration info object : " + b1ExpResult.getErrorMessage()) ; return false; }

    var b1Exp = b1ExpResult.getOutput();

    if (!b1Exp)
    { logDebug("**ERROR: No expiration info") ; return false; }

    b1ExpDate = b1Exp.getExpDate();

    if(b1ExpDate != null)
        return b1ExpDate;
    else
        return "";
}