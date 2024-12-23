/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_CAN_NOF_ACTIVATE.js  Trigger: Batch
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
        capTypeModel = capModel.getCapType();
        capTypeModel.setGroup("Cannabis");
        //capTypeModel.setType(appTypeArray[1]);
        capTypeModel.setSubType("Permit");
       // capTypeModel.setCategory(appTypeArray[3]);
        capModel.setCapType(capTypeModel);
        capModel.setCapStatus("Active");
        var recordListResult = aa.cap.getCapIDListByCapModel(capModel);
        if (!recordListResult.getSuccess())
        {
            logDebugBatch("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        }
        else
        {
            var recArray = recordListResult.getOutput();
            logDebugBatch("Looping through " + recArray.length + " Records with status Active" );
            for (var j in recArray)
            {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                cap = aa.cap.getCap(capId).getOutput();
                if (cap)
                {
                    var first = new Date(lookup("CAN_NOF_CONTROLS", "First Reminder")+"").setHours(0,0,0,0);
                    var second = new Date(lookup("CAN_NOF_CONTROLS", "Second Reminder")+"").setHours(0,0,0,0);
                    var third = new Date(lookup("CAN_NOF_CONTROLS", "Third Reminder")+"").setHours(0,0,0,0);
                    var open = lookup("CAN_NOF_CONTROLS", "NOF Window Open Date")+"";
                    var close = lookup("CAN_NOF_CONTROLS", "NOF Window Close Date")+"";
                    var t = lookup("CAN_NOF_CONTROLS", "Today Date")+"";

                    var today = null;
                    if(t == "SYSTEM")
                        today = new Date().setHours(0,0,0,0);
                    else
                        today = new Date(t).setHours(0,0,0,0);

                    if((today == first) || (today == second) || (today == third))
                    {
                        var hm = new Array();
                        var conName = "";
                        var contactResult = aa.people.getCapContactByCapID(capId);
                        if (contactResult.getSuccess()) {
                            var capContacts = contactResult.getOutput();
                            for (var i in capContacts) {
                                conName = getContactName(capContacts[i]);
                                var params = aa.util.newHashtable();
                                addParameter(params, "$$altId$$", capId.getCustomID() + "");
                                addParameter(params, "$$date$$", todayDateX);
                                addParameter(params, "$$contactName$$", conName);
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                                addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                                addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                                addParameter(params, "$$openDate$$", open);
                                addParameter(params, "$$closeDate$$",close);
                                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_NOF_WINDOW", params, null, capId);
                                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                                }
                            }
                        }
                    }
                }
                //break;
            }
        }

        var capModel = aa.cap.getCapModel().getOutput();
        capTypeModel = capModel.getCapType();
        capTypeModel.setGroup("Cannabis");
        //capTypeModel.setType(appTypeArray[1]);
        capTypeModel.setSubType("Permit");
        //capTypeModel.setCategory(appTypeArray[3]);
        capModel.setCapType(capTypeModel);
        capModel.setCapStatus("About to Expire");
        var recordListResult = aa.cap.getCapIDListByCapModel(capModel);
        if (!recordListResult.getSuccess())
        {
            logDebugBatch("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        }
        else
        {
            var recArray = recordListResult.getOutput();
            logDebugBatch("Looping through " + recArray.length + " Records for status About to Expire");
            for (var j in recArray)
            {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                cap = aa.cap.getCap(capId).getOutput();
                if (cap)
                {
                    var first = new Date(lookup("CAN_NOF_CONTROLS", "First Reminder")+"").setHours(0,0,0,0);
                    var second = new Date(lookup("CAN_NOF_CONTROLS", "Second Reminder")+"").setHours(0,0,0,0);
                    var third = new Date(lookup("CAN_NOF_CONTROLS", "Third Reminder")+"").setHours(0,0,0,0);
                    var open = lookup("CAN_NOF_CONTROLS", "NOF Window Open Date")+"";
                    var close = lookup("CAN_NOF_CONTROLS", "NOF Window Close Date")+"";
                    var t = lookup("CAN_NOF_CONTROLS", "Today Date")+"";

                    var today = null;
                    if(t == "SYSTEM")
                        today = new Date().setHours(0,0,0,0);
                    else
                        today = new Date(t).setHours(0,0,0,0);

                    if((today == first) || (today == second) || (today == third))
                    {
                        var hm = new Array();
                        var conName = "";
                        var contactResult = aa.people.getCapContactByCapID(capId);
                        if (contactResult.getSuccess()) {
                            var capContacts = contactResult.getOutput();
                            for (var i in capContacts) {
                                conName = getContactName(capContacts[i]);
                                var params = aa.util.newHashtable();
                                addParameter(params, "$$altId$$", capId.getCustomID() + "");
                                addParameter(params, "$$date$$", todayDateX);
                                addParameter(params, "$$contactName$$", conName);
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                                addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                                addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                                addParameter(params, "$$openDate$$", open);
                                addParameter(params, "$$closeDate$$",close);
                                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_NOF_WINDOW", params, null, capId);
                                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                                }
                            }
                        }
                    }
                }
                //break;
            }
        }
        //CAMEND-698
        var capModel = aa.cap.getCapModel().getOutput();
        capTypeModel = capModel.getCapType();
        capTypeModel.setGroup("Cannabis");
        //capTypeModel.setType(appTypeArray[1]);
        capTypeModel.setSubType("Permit");
        //capTypeModel.setCategory(appTypeArray[3]);
        capModel.setCapType(capTypeModel);
        capModel.setCapStatus("Notice of Fallowing");
        var recordListResult = aa.cap.getCapIDListByCapModel(capModel);
        if (!recordListResult.getSuccess())
        {
            logDebugBatch("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        }
        else
        {
            var recArray = recordListResult.getOutput();
            logDebugBatch("Looping through " + recArray.length + " Records for status About to Expire");
            for (var j in recArray)
            {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                cap = aa.cap.getCap(capId).getOutput();
                if (cap)
                {
                    var nofDateStr = getAppSpecific("NOF Expiration Date", capId);
                    var today = new Date();
                    today.setDate(today.getDate() - 1);
                    today.setHours(0,0,0,0);
                    var nofDate = new Date(nofDateStr).setHours(0,0,0,0);
                    if(nofDate == today)
                        updateAppStatus("Active","updated by batch as NOF Exp date is past expiration",capId);
                }
            }
        }
    }
    catch (err)
    {
        logDebugBatch("error found: " + err.message);
    }
}
function getAddressInALine() {

    var capAddrResult = aa.address.getAddressByCapId(capId);
    var addressToUse = null;
    var strAddress = "";

    if (capAddrResult.getSuccess()) {
        var addresses = capAddrResult.getOutput();
        if (addresses) {
            for (zz in addresses) {
                capAddress = addresses[zz];
                if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y"))
                    addressToUse = capAddress;
            }
            if (addressToUse == null)
                addressToUse = addresses[0];

            if (addressToUse) {
                strAddress = addressToUse.getHouseNumberStart();
                var addPart = addressToUse.getStreetDirection();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getStreetName();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getStreetSuffix();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getCity();
                if (addPart && addPart != "")
                    strAddress += " " + addPart + ",";
                var addPart = addressToUse.getState();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getZip();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                return strAddress
            }
        }
    }
    return null;
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