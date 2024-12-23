/*------------------------------------------------------------------------------------------------------/
| Program: BATHC_REPORTING_EMAILS.js
| Trigger: Batch
| Client: MENDOCINO
| Version 1.0 12/23/2024
| Author: Shashank
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
    mainProcess();
    logMessage("End Date: " + startDate);

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

        var today = new Date();
        var todayObj = new Date().setHours(0,0,0,0);
        var fallowListDate = String(lookup("CAN_NOF_CONTROLS", "Report to TTC"))+"/"+today.getFullYear();
        var taxAppealDate = String(lookup("CAN_TAXAPP_CONTROLS", "Report to TTC"))+"/"+today.getFullYear();
        var ttcEmail =  String(lookup("TTC EMAIL", "EMAIL"));
        var fallowListDateObj = new Date(fallowListDate).setHours(0,0,0,0);
        var taxAppealDateObj = new Date(taxAppealDate).setHours(0,0,0,0);
        if(fallowListDateObj == todayObj)
        {
            var open = lookup("CAN_NOF_CONTROLS", "NOF Window Open Date")+"";
            var close = lookup("CAN_NOF_CONTROLS", "NOF Window Close Date")+"";
            var rFiles = [];
            var VRFiles = null;
            var rParams = aa.util.newHashMap();
            rParams.put("StartDT", open);
            rParams.put("EndDT", close);
            var report = aa.reportManager.getReportInfoModelByName("TTC Fallow List");
            report = report.getOutput();
            report.setModule("Cannabis");
            report.setReportParameters(rParams);
            var permit = aa.reportManager.hasPermission("TTC Fallow List",currentUserID);

            if (permit.getOutput().booleanValue()) {
                logDebug("User has Permission to run the report....");
                var reportResult = aa.reportManager.getReportResult(report);
                if(reportResult) {
                    reportOutput = reportResult.getOutput();
                    var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                    logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                    reportFile=reportFile.getOutput();
                    rFiles.push(reportFile);
                }
            }
            VRFiles = rFiles;
            if(ttcEmail && ttcEmail!= "")
            {
                var params = aa.util.newHashtable();
                addParameter(params, "$$reportType$$", "TTC Fallow List");
                addParameter(params, "$$open$$", open);
                addParameter(params, "$$close$$", close);
                var itempAltIDScriptModel = aa.cap.createCapIDScriptModel(null, null, null);
                aa.document.sendEmailAndSaveAsDocument("no-reply@mendocinocounty.gov",  ttcEmail+"", "", "BATCH_REPORTS", params, itempAltIDScriptModel, VRFiles);
            }
        }
        if(taxAppealDateObj == todayObj)
        {
            var open = lookup("CAN_TAXAPP_CONTROLS", "Tax Appeal Window Open Date")+"";
            var close = lookup("CAN_TAXAPP_CONTROLS", "Tax Appeal Window Close Date")+"";
            var rFiles = [];
            var VRFiles = null;
            var rParams = aa.util.newHashMap();
            rParams.put("StartDT", open);
            rParams.put("EndDT", close);
            var report = aa.reportManager.getReportInfoModelByName("TTC Tax Appeal List");
            report = report.getOutput();
            report.setModule("Cannabis");
            report.setReportParameters(rParams);
            var permit = aa.reportManager.hasPermission("TTC Tax Appeal List",currentUserID);

            if (permit.getOutput().booleanValue()) {
                logDebug("User has Permission to run the report....");
                var reportResult = aa.reportManager.getReportResult(report);
                if(reportResult) {
                    reportOutput = reportResult.getOutput();
                    var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                    logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                    reportFile=reportFile.getOutput();
                    rFiles.push(reportFile);
                }
            }
            VRFiles = rFiles;
            if(ttcEmail && ttcEmail!= "")
            {
                var params = aa.util.newHashtable();
                addParameter(params, "$$reportType$$", "TTC Tax Appeal List");
                addParameter(params, "$$open$$", open);
                addParameter(params, "$$close$$", close);
                var itempAltIDScriptModel = aa.cap.createCapIDScriptModel(null, null, null);
                aa.document.sendEmailAndSaveAsDocument("no-reply@mendocinocounty.gov",  ttcEmail+"", "", "BATCH_REPORTS", params, itempAltIDScriptModel, VRFiles);
            }
        }
    } catch (err) {
        logMessage("**ERROR** runtime error " + err.message + " at " + err.lineNumber + " stack: " + err.stack);
    }
    //logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");
}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/