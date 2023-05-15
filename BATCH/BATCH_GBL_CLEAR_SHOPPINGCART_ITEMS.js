/*------------------------------------------------------------------------------------------------------/
| TESTING PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_GBL_CLEAR_SHOPPINGCART_ITEMS.js
| Trigger: Batch
| Client: MENDOCINO
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
currentUserID = "ADMIN";
useAppSpecificGroupName = false;
/*------------------------------------------------------------------------------------------------------/
| GLOBAL VARIABLES
/------------------------------------------------------------------------------------------------------*/
message = "";
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
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
try {
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

    sysDate = aa.date.getCurrentDate();
    var startDate = new Date();
    var startTime = startDate.getTime(); // Start timer
    var systemUserObj = aa.person.getUser("ADMIN").getOutput();

    sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
    batchJobResult = aa.batchJob.getJobID();
    batchJobName = "" + aa.env.getValue("BatchJobName");
    batchJobID = 0;

    if (batchJobResult.getSuccess()) {
        batchJobID = batchJobResult.getOutput();
        logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
        logMessage("Batch Job " + batchJobName + " Job ID is " + batchJobID);
    } else {
        logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
    }

    var vEmailFrom = ""; //Testing Only
    var vEmailTo = ""; //Testing Only
    var vEmailCC = ""; //Testing Only
    vEmailFrom = ""; //Testing Only
    vEmailTo = ""; //Testing Only
    vEmailCC = ""; //Testing Only

    if (aa.env.getValue("FromEmail") != null && aa.env.getValue("FromEmail") != "") {
        vEmailFrom = aa.env.getValue("FromEmail");
    }
    if (aa.env.getValue("ToEmail") != null && aa.env.getValue("ToEmail") != "") {
        vEmailTo = aa.env.getValue("ToEmail");
    }
    if (aa.env.getValue("CCEmail") != null && aa.env.getValue("CCEmail") != "") {
        vEmailCC = aa.env.getValue("CCEmail");
    }

    /*------------------------------------------------------------------------------------------------------/
    | <===========Main=Loop================>
    /-----------------------------------------------------------------------------------------------------*/

    logDebug("Start of Job");
    logMessage("Start of Job");

    mainProcess();



    /*------------------------------------------------------------------------------------------------------/
    | <===========END=Main=Loop================>
    /-----------------------------------------------------------------------------------------------------*/
} catch (err) {
    handleError(err, "Batch Job:" + batchJobName + " Job ID:" + batchJobID);
}

/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", debug);
    aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " - Error", debug);
} else {
    aa.env.setValue("ScriptReturnCode", "0");
    if (showMessage) {
        aa.env.setValue("ScriptReturnMessage", message);
        aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results", message);
    }
    if (showDebug) {
        aa.env.setValue("ScriptReturnMessage", debug);
        aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results - Debug", debug);
    }
}
/*------------------------------------------------------------------------------------------------------/
| FUNCTIONS (mainProcess is the core function for processing expiration records)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
    var removeResult = aa.shoppingCart.removeExpireShoppingCartItems();
    if (removeResult.getSuccess()) {
        logDebug("Shoppping cart items removed.");
        logMessage("Shoppping cart items removed.");
    } else {
        logDebug("Error removing shoppping cart items.");
        logMessage("Error removing shoppping cart items.");
    }
}