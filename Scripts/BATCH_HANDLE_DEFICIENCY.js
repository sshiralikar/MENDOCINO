/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_HANDLE_DEFICIENCY.js  Trigger: Batch
| This batch script will run daily
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;

function getScriptText(vScriptName, servProvCode, useProductScripts)
{
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try
    {
        if (useProductScripts)
        {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else
        {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err)
    {
        return "";
    }
}

var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I")
{
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess())
    {
        SAScript = bzr.getOutput().getDescription();
    }
}

if (SA)
{
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    // eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else
{
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    // eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

var emailText = "";
var debug = "";
var showDebug = true;// Set to true to see debug messages in email confirmation
var showDebugBatch = true;
var maxSeconds = 60 * 5;// number of seconds allowed for batch processing, usually < 5*60
var showMessage = false;
var useAppSpecificGroupName = false;
var br = "<BR>";
var currentUserID = "ADMIN";
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;
batchJobID = 0;
if (batchJobResult.getSuccess())
{
    batchJobID = batchJobResult.getOutput();
    logDebugBatch("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
}
else
{
    logDebugBatch("Batch job ID not found " + batchJobResult.getErrorMessage());
}
var message = "";
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer
var todayDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
var todayDateX = ('0' + (startDate.getMonth()+1)).slice(-2) + '/'
    + ('0' + startDate.getDate()).slice(-2) + '/'
    + startDate.getFullYear();
dateCheckString = String(todayDate).split("/")
var dateToCheck = (String('0' + dateCheckString[0]).slice(-2) + '/' + String('0' + dateCheckString[1]).slice(-2) + '/' + dateCheckString[2]);
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
var paramsOK = true;

if (paramsOK)
{
    logDebugBatch("Start Date: " + startDate + br);
    logDebugBatch("Starting the timer for this job.  If it takes longer than 5 minutes an error will be listed at the bottom of the email." + br);

    mainProcess();
    //logDebugBatch("End of Job: Elapsed Time : " + elapsed() + " Seconds");
    logDebugBatch("End Date: " + startDate);

}
/*------------------------------------------------------------------------------------------------------/
| <===========End Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
function mainProcess()
{
    try
    {
        var capModel = aa.cap.getCapModel().getOutput();
        /*var appTypeArray = thisType.split("/");
        capTypeModel = capModel.getCapType();
        capTypeModel.setGroup(appTypeArray[0]);
        capTypeModel.setType(appTypeArray[1]);
        capTypeModel.setSubType(appTypeArray[2]);
        capTypeModel.setCategory(appTypeArray[3]);
        capModel.setCapType(capTypeModel);*/
        capModel.setCapStatus("Additional Info Required");
        var recordListResult = aa.cap.getCapIDListByCapModel(capModel);
        if (!recordListResult.getSuccess())
        {
            logDebugBatch("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        }
        else
        {
            var recArray = recordListResult.getOutput();
            logDebugBatch("Looping through " + recArray.length + " Records" );
            for (var j in recArray)
            {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                cap = aa.cap.getCap(capId).getOutput();
                if (cap)
                {
                    var wfObj = aa.workflow.getTasks(capId).getOutput();;
                    if(wfObj)
                    {
                        for (var i in wfObj)
                        {
                            var fTask = wfObj[i];
                            //logDebugBatch(capIDString);
                            //logDebugBatch(fTask.getTaskDescription()+" --> "+ getTaskDueDateX(fTask.getTaskDescription()+""));
                            //logDebugBatch("todayDate: "+ todayDate);

                            if (fTask.getDisposition() && fTask.getDisposition().toUpperCase().equals("DEFICIENCY")
                                && (getTaskDueDateX(fTask.getTaskDescription()+"") == todayDate || getTaskDueDateX(fTask.getTaskDescription()+"") == todayDateX))
                            {
                                logDebugBatch("Eligible for a Denial: "+ capIDString);
                                taskCloseAllExcept("Denied","Closing via script","Appeal");
                                updateAppStatus("Denied","Updating via Script");
                                updateTask("Appeal","In Progress","","");
                                aa.workflow.adjustTask(capId, "Appeal", "Y", "N", null, null);
                                editTaskDueDate("Appeal", dateAdd(todayDate, 10));
                                var VRFiles = [];
                                var rParams = aa.util.newHashMap();
                                rParams.put("RecordID", capId.getCustomID()+"");
                                logDebug("Report parameter RecordID set to: "+ capId.getCustomID()+"");
                                var report = aa.reportManager.getReportInfoModelByName("Cannabis Denial Decision Letter");
                                report = report.getOutput();
                                report.setModule("Cannabis");
                                report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
                                report.setReportParameters(rParams);
                                report.getEDMSEntityIdModel().setAltId(capId.getCustomID());

                                var permit = aa.reportManager.hasPermission("Cannabis Denial Decision Letter",currentUserID);

                                if (permit.getOutput().booleanValue()) {
                                    logDebug("User has Permission to run the report....");
                                    var reportResult = aa.reportManager.getReportResult(report);
                                    if(reportResult) {
                                        reportOutput = reportResult.getOutput();
                                        var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                                        logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                                        reportFile=reportFile.getOutput();
                                        VRFiles.push(reportFile);
                                    }
                                }

                                var hm = new Array();
                                var conName = "";
                                var contactResult = aa.people.getCapContactByCapID(capId);
                                if (contactResult.getSuccess()) {
                                    var capContacts = contactResult.getOutput();
                                    for (var i in capContacts) {
                                        conName = getContactName(capContacts[i]);
                                        var params = aa.util.newHashtable();
                                        addParameter(params, "$$altID$$", capId.getCustomID()+"");
                                        addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                        addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                        addParameter(params, "$$contactname$$", conName);
                                        addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                                        addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                                        if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                                            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_DENIED", params, VRFiles, capId);
                                            hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                                        }
                                    }
                                }
                            }


                            var threeDayDate = new Date();
                            threeDayDate.setDate(threeDayDate.getDate() + 3);
                            var threeDayDateStr = (threeDayDate.getMonth() + 1) + "/" + threeDayDate.getDate() + "/" + threeDayDate.getFullYear();
                            var threeDayDateStrX = ('0' + (threeDayDate.getMonth()+1)).slice(-2) + '/'
                                + ('0' + threeDayDate.getDate()).slice(-2) + '/'
                                + threeDayDate.getFullYear();

                            var sevenDayDate = new Date();
                            sevenDayDate.setDate(sevenDayDate.getDate() + 7);
                            var sevenDayDateStr = (sevenDayDate.getMonth() + 1) + "/" + sevenDayDate.getDate() + "/" + sevenDayDate.getFullYear();
                            var sevenDayDateStrX = ('0' + (sevenDayDate.getMonth()+1)).slice(-2) + '/'
                                + ('0' + sevenDayDate.getDate()).slice(-2) + '/'
                                + sevenDayDate.getFullYear();


                            if (fTask.getDisposition() && fTask.getTaskDescription()+"" != "Cannabis Review"
                                && fTask.getDisposition().toUpperCase().equals("DEFICIENCY")
                                && (getTaskDueDateX(fTask.getTaskDescription()+"") == sevenDayDateStr
                                    || getTaskDueDateX(fTask.getTaskDescription()+"") == sevenDayDateStrX
                                    || getTaskDueDateX(fTask.getTaskDescription()+"") == threeDayDateStr
                                    || getTaskDueDateX(fTask.getTaskDescription()+"") == threeDayDateStrX))
                            {
                                logDebugBatch("Eligible of a deficiency warning: "+capIDString);
                                var hm = new Array();
                                var conName = "";
                                var contactResult = aa.people.getCapContactByCapID(capId);
                                if (contactResult.getSuccess()) {
                                    var COAs = "";
                                    var capContacts = contactResult.getOutput();
                                    for (var i in capContacts) {
                                        if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
                                            var condResult = aa.capCondition.getCapConditions(capId);
                                            if (condResult.getSuccess()) {
                                                var capConds = condResult.getOutput();
                                                for (var cc in capConds) {
                                                    var thisCondX = capConds[cc];
                                                    var cNbr = thisCondX.getConditionNumber();
                                                    var thisCond = aa.capCondition.getCapCondition(capId, cNbr).getOutput();
                                                    var cStatus = thisCond.getConditionStatus();
                                                    var isCOA = thisCond.getConditionOfApproval();
                                                    if (matches(cStatus, "Applied","Pending") && isCOA == "Y") {
                                                        COAs+= "  - "+thisCond.getConditionDescription();+", ";
                                                    }
                                                }
                                            }
                                            if(COAs!="")
                                                COAs = "The following documents are missing:\n" + COAs;
                                            conName = getContactName(capContacts[i]);
                                            var params = aa.util.newHashtable();
                                            addParameter(params, "$$altID$$", capId.getCustomID()+"");
                                            addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                            addParameter(params, "$$capName$$", cap.getSpecialText());
                                            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                            addParameter(params, "$$contactname$$", conName);
                                            addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                                            addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                                            wfComment = fTask.getDispositionComment();
                                            if(wfComment!="" && wfComment!= null)
                                                addParameter(params, "$$wfComment$$", "Comments: "+ wfComment+" \nand "+COAs);
                                            else
                                                addParameter(params, "$$wfComment$$", ""+COAs);
                                            if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                                                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_ADDITIONAL INFO REQUIRED", params, null, capId);
                                                hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        var capModel = aa.cap.getCapModel().getOutput();
        /*var appTypeArray = thisType.split("/");
        capTypeModel = capModel.getCapType();
        capTypeModel.setGroup(appTypeArray[0]);
        capTypeModel.setType(appTypeArray[1]);
        capTypeModel.setSubType(appTypeArray[2]);
        capTypeModel.setCategory(appTypeArray[3]);
        capModel.setCapType(capTypeModel);*/
        //capModel.setCapStatus("Additional Info Required"); 
        var recordListResult = aa.cap.getCapIDListByCapModel(capModel);
        if (!recordListResult.getSuccess())
        {
            logDebugBatch("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        }
        else
        {
            var recArray = recordListResult.getOutput();
            logDebugBatch("Looping through " + recArray.length + " Records for No response from referral for due date: "+ todayDateX );
            for (var j in recArray)
            {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                cap = aa.cap.getCap(capId).getOutput();
                if (cap)
                {
                    var wfObj = aa.workflow.getTasks(capId).getOutput();;
                    if(wfObj)
                    {
                        for (var i in wfObj)
                        {
                            var fTask = wfObj[i];
                            //logDebugBatch(capIDString+ " - "+ fTask.getTaskDescription()+ " - "+ getTaskDueDateX(fTask.getTaskDescription()) +" ===> "+ todayDate);
                            if (fTask.getTaskDescription() && (fTask.getTaskDescription().equals("AQMD Review")
                                    || fTask.getTaskDescription().equals("Vegetation Review")
                                    || fTask.getTaskDescription().equals("CDFW Review")
                                    || fTask.getTaskDescription().equals("Building Review") )
                                && (getTaskDueDateX(fTask.getTaskDescription()+"") == todayDate
                                    || getTaskDueDateX(fTask.getTaskDescription()+"") == todayDateX) && fTask.getActiveFlag().equals("Y"))
                            {
                                logDebugBatch("No response on the referral, closing task with no response: "+ capIDString);
                                updateTask(fTask.getTaskDescription(),"No Response","","");
                                aa.workflow.adjustTask(capId, fTask.getTaskDescription(), "N", "Y", null, null);
                                aa.workflow.adjustTask(capId, "Plans Coordination", "Y", "N", null, null);
                            }

                            var tenDayDate = new Date();
                            tenDayDate.setDate(tenDayDate.getDate() + 10);
                            var tenDayDateStr = (tenDayDate.getMonth() + 1) + "/" + tenDayDate.getDate() + "/" + tenDayDate.getFullYear();
                            var tenDayDateStrX = ('0' + (tenDayDate.getMonth()+1)).slice(-2) + '/'
                                + ('0' + tenDayDate.getDate()).slice(-2) + '/'
                                + tenDayDate.getFullYear();
                            if (fTask.getTaskDescription() && fTask.getTaskDescription().equals("Appeal")
                                && (getTaskDueDateX(fTask.getTaskDescription()+"") == tenDayDateStr
                                    || getTaskDueDateX(fTask.getTaskDescription()+"") == tenDayDateStrX) && fTask.getActiveFlag().equals("Y"))
                            {
                                logDebugBatch("New Appeal with date : "+ tenDayDateStrX+" -> "+capIDString);
                                var pCapId = getParent(capId);
                                if(pCapId)
                                {
                                    updateAppStatus("Revocation Pending","Updating via Script", pCapId);
                                }
                                updateAppStatus("Appeal Pending","Updating via Script", capId);
                            }
                            if (fTask.getTaskDescription() && fTask.getTaskDescription().equals("Appeal")
                                && (getTaskDueDateX(fTask.getTaskDescription()+"") == todayDate
                                    || getTaskDueDateX(fTask.getTaskDescription()+"") == todayDateX) && fTask.getActiveFlag().equals("Y"))
                            {
                                logDebugBatch("No appeal recieved - Denied Appeal: "+ capIDString);
                                updateAppStatus("Denied","Updating via Script");
                                updateTask("Appeal","Denied","","");
                                aa.workflow.adjustTask(capId, "Appeal", "N", "Y", null, null);
                                updateTask("Issuance","Denied","","");
                                aa.workflow.adjustTask(capId, "Issuance", "N", "Y", null, null);
                                var pCapId = getParent(capId);
                                if(pCapId)
                                {
                                    var tmp = capId;
                                    capId = pCapId;
                                    taskCloseAllExcept("Denied - Appeal","Closing via script");
                                    capId = tmp;
                                    updateAppStatus("Revocation","Updating via Script",pCapId);
                                    setLicExpirationDate(pCapId,"",todayDateX);
                                    editAppSpecific("New Expiration Date",todayDateX, pCapId);
                                    editAppSpecific("New Expiration Date",todayDateX, capId);
                                    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
                                    if (capDetailObjResult.getSuccess()) {
                                        var capDetail = capDetailObjResult.getOutput();
                                        var balanceDue = capDetail.getBalance();
                                        if (balanceDue > 0) {
                                            addStdConditionX("Balance", "Denied with Balance Due", pCapId);
                                        }
                                    }
                                }
                                var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
                                if (capDetailObjResult.getSuccess()) {
                                    var capDetail = capDetailObjResult.getOutput();
                                    var balanceDue = capDetail.getBalance();
                                    if (balanceDue > 0) {
                                        addStdConditionX("Balance", "Denied with Balance Due", capId);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    catch (err)
    {
        logDebugBatch("error found: " + err.message);
    }
}

function elapsed()
{
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function closeTaskLOCAL(wfstr, wfstat, wfcomment, wfnote) // optional process name
{
    var useProcess = false;
    var processName = "";
    if (arguments.length == 5)
    {
        processName = arguments[4]; // subprocess
        useProcess = true;
    }

    var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
    {
        logDebugBatch("Workflow get success!");
        var wfObj = workflowResult.getOutput();
    }
    else
    {
        logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
        return false;
    }

    if (!wfstat)
        wfstat = "NA";

    for (i in wfObj)
    {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
        {
            var dispositionDate = aa.date.getCurrentDate();
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();

            if (useProcess)
                aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");
            else
                aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "Y");

            logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
            logDebugBatch("Closing Workflow Task: " + wfstr + " with status " + wfstat);
        }
    }
}

function logDebugBatch(dstr)
{
    vLevel = 1
    if (arguments.length > 1)
        vLevel = arguments[1];
    if ((showDebugBatch & vLevel) == vLevel || vLevel == 1)
        debug += dstr + br;
    if ((showDebugBatch & vLevel) == vLevel)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
    aa.print(dstr);
}

function logMessage(dstr)
{
    message += dstr + br;
}
function getTaskDueDateX(wfstr) // optional process name.
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
        logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
        return false;
    }

    for (i in wfObj) {
        var fTask = wfObj[i];
        if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var dueDate = wfObj[i].getDueDate();
            if (dueDate){
                var newDate = new Date(dueDate.getMonth() + "/" + dueDate.getDayOfMonth() + "/" + dueDate.getYear());
                newDate.setDate(newDate.getDate() + 1);
                return (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear();
            }
        }
    }
}