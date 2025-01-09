/*------------------------------------------------------------------------------

|This function was provided by Jeanne Chalk of Accela to automatically invoice

|the fee item after the void occurs.  This is not a standard Accela MasterScript.

|2/26/2019

|------------------------------------------------------------------------------*/

var triggerEvent = aa.env.getValue("EventName");
var controlString = null;
var documentOnly = false;						// Document Only -- displays hierarchy of std choice steps


var preExecute = "PreExecuteForAfterEvents";  		//Assume after event unless before decected
var eventType = "After";				//Assume after event
if (triggerEvent != "") {
    controlString = triggerEvent;			// Standard choice for control
    if (triggerEvent.indexOf("Before") > 0) {
        preExecute = "PreExecuteForBeforeEvents";
        eventType = "Before";
    }
}

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
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

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
    var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
    doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
    var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
    doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
    var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
    if (bvr3.getSuccess()) { if (bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false };
}

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

if (documentOnly) {
    doStandardChoiceActions(controlString, false, 0);
    aa.env.setValue("ScriptReturnCode", "0");
    aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
    aa.abortScript();
}

var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}


var showMessage = false;                                         // Set to true to see results in popup window
var showDebug = false;                                             // Set to true to see debug messages in popup window
var message = "";                                                       // Message String
var debug = "";                                                            // Debug String
var br = "<BR>";                                           // Break Tag
var capId = getCapId();                                              // CapId object
var cap = aa.cap.getCap(capId).getOutput();        // Cap object
var capStatus = cap.getCapStatus();                       // Cap status
var capType = cap.getCapType();     // Cap type



var feeSeqListString = aa.env.getValue("FeeItemsSeqNbrArray");              // invoicing fee item list in string type
var feeSeqList = new Array();                                                               // fee item list in number type
for (xx in feeSeqListString) {
    feeSeqList.push(Number(feeSeqListString[xx])); // convert the string type array to number type array
}

logDebug("feeSeqListString: " + feeSeqListString);
logDebug("InvoiceNbrArray:" + aa.env.getValue("InvoiceNbrArray"));
logDebug("VoidPaymentFeeItemArray: " + aa.env.getValue("VoidPaymentFeeItemArray"));
logDebug("VoidPaymentNbrArray: " + aa.env.getValue("VoidPaymentNbrArray"));
logDebug("");



var paymentPeriodList = new Array();     // payment periods, system need not this parameter for daily side
// The fee item should not belong to a POS before set the fee item status to "CREDITED".
if (feeSeqList.length && !(capStatus == '#POS' && capType == '_PER_GROUP/_PER_TYPE/_PER_SUB_TYPE/_PER_CATEGORY')) {
    // the following method will set the fee item status from 'VOIDED' to 'CREDITED' after void the fee item;
    invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
    if (invoiceResult.getSuccess()) {
        logMessage("Invoicing assessed fee items is successful.");
    }
    else {
        logDebug("ERROR: Invoicing the fee items assessed to app # " + capId + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
    }
}


if (debug.indexOf("ERROR") > 0) {

    aa.env.setValue("ScriptReturnCode", "1");

    aa.env.setValue("ScriptReturnMessage", debug);

}

else {

    aa.env.setValue("ScriptReturnCode", "0");

    if (showMessage) {

        aa.env.setValue("ScriptReturnMessage", message);

    }

    if (showDebug) {

        aa.env.setValue("ScriptReturnMessage", debug);

    }

}



function getCapId() {



    var s_id1 = aa.env.getValue("PermitId1");

    var s_id2 = aa.env.getValue("PermitId2");

    var s_id3 = aa.env.getValue("PermitId3");



    var s_capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);

    if (s_capResult.getSuccess()) {

        return s_capResult.getOutput();

    }

    else {

        logDebug("ERROR: Failed to get capId: " + s_capResult.getErrorMessage());

        return null;

    }

}



function logDebug(dstr) {

    debug += dstr + br;

}



function logMessage(dstr) {

    message += dstr + br;

}
