/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_CAN_INVOICE_BILLABLE.js
| Trigger: Batch
| Client: MENDOCINO
| Author: SHashank
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
var feeSeqList = new Array(); // invoicing fee list
var paymentPeriodList = new Array(); // invoicing pay periods
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
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");

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

        var sqlCmd = "SELECT * FROM BAPPSPECTABLE_VALUE ";
        sqlCmd += "WHERE SERV_PROV_CODE = 'MENDOCINO' ";
        sqlCmd += "AND  COLUMN_NAME ='Billable Hours' ";
        sqlCmd += "AND B1_PER_ID1 NOT LIKE '%EST%' ";
        sqlCmd += "AND REC_STATUS = 'A' ";
        sqlCmd += "AND ATTRIBUTE_VALUE IS NOT NULL";

        var capIDsList = doSQLSelect(sqlCmd);

        logDebug("Records Found: " + capIDsList.length + " Record.");
        logMessage("Records Found: " + capIDsList.length + " Record.");

        if (!capIDsList || capIDsList.length == 0) {
            logDebug("No data returned by query, batch aborted.");
            return;
        }

        var vErrorCount = 0;

        for (var c in capIDsList) {

            capId = null;
            // Get CapID
            var id1 = capIDsList[c]['B1_PER_ID1'];
            var id2 = capIDsList[c]['B1_PER_ID2'];
            var id3 = capIDsList[c]['B1_PER_ID3'];
            //logDebug("Processing " + altID);
            //logMessage("Processing " + altID);

            var capIdRes = aa.cap.getCapID(id1,id2,id3);
            if (!capIdRes.getSuccess()) {
                logDebug("Get CapID " + altID + ": " + capIdRes.getErrorMessage());
                vErrorCount++;
                continue;
            }
            capId = capIdRes.getOutput();
            if (capId == null) {
                logDebug("Get CapID Res " + altID + " returned NULL");
                vErrorCount++;
                continue;
            }

            var capResult = aa.cap.getCap(capId);
            if (!capResult.getSuccess()) {
                logDebug("Get Cap " + altID + " returned NULL");
                vErrorCount++;
                continue;
            } else {
                cap = capResult.getOutput();
            }
            appTypeResult = cap.getCapType();
            appTypeString = appTypeResult.toString();
            appTypeArray = appTypeString.split("/");
            capName = cap.getSpecialText();
            appStatus = cap.getCapStatus();
            var table = loadASITable("MEETINGS");
            var newTable = new Array();
            if(table && table.length > 0)
            {
                for(var i in table) {
                    if((table[i]["Invoice Number"].fieldValue == null || table[i]["Invoice Number"].fieldValue == "")
                        && table[i]["Exempt"].fieldValue !="CHECKED")
                    {
                        var feeSeq = addFee("CANHOUR01", "CAN_CULT", "FINAL", parseInt(table[i]["Billable Hours"].fieldValue), "Y");
                        var invoiceNbr = null;
                        var invoiceResult = aa.finance.getFeeItemInvoiceByFeeNbr(capId, feeSeq, null);
                        if (!invoiceResult.getSuccess()) {
                            logDebug("**ERROR: error retrieving invoice items " + invoiceResult.getErrorMessage());
                            return false
                        }
                        var invoiceItem = invoiceResult.getOutput();
                        if (invoiceItem.length != 1) {
                            logDebug("**WARNING: fee item " + feeItem.getFeeSeqNbr() + " returned " + invoiceItem.length + " invoice matches")
                        } else {
                            invoiceNbr = invoiceItem[0].getInvoiceNbr();
                        }
                        if(invoiceNbr)
                        {
                            var vRow = new Array();
                            vRow["Meeting Type"] = new asiTableValObj("Meeting Type", table[i]["Meeting Type"].fieldValue, "N");
                            vRow["Meeting Date"] = new asiTableValObj("Meeting Date", table[i]["Meeting Date"].fieldValue, "N");
                            vRow["Meeting Start Time"] = new asiTableValObj("Meeting Start Time", table[i]["Meeting Start Time"].fieldValue, "N");
                            vRow["Meeting End Time"] = new asiTableValObj("Meeting End Time", table[i]["Meeting End Time"].fieldValue, "N");
                            vRow["Meeting Total Hours"] = new asiTableValObj("Meeting Total Hours", table[i]["Meeting Total Hours"].fieldValue, "N");
                            vRow["Billable Hours"] = new asiTableValObj("Billable Hours", table[i]["Billable Hours"].fieldValue, "N");
                            vRow["Attendees"] = new asiTableValObj("Attendees", table[i]["Attendees"].fieldValue, "N");
                            vRow["Decision"] = new asiTableValObj("Decision", table[i]["Decision"].fieldValue, "N");
                            vRow["Invoice Number"] = new asiTableValObj("Invoice Number", invoiceNbr+"", "Y");
                            vRow["Exempt"] = new asiTableValObj("Exempt", table[i]["Exempt"].fieldValue, "N");
                            vRow["Exempt Reason"] = new asiTableValObj("Exempt Reason", table[i]["Exempt Reason"].fieldValue, "N");
                            newTable.push(vRow);
                        }
                        else
                            newTable.push(table[i]);

                    }
                    else
                        newTable.push(table[i]);
                }
                removeASITable("MEETINGS", capId);
                addASITable("MEETINGS", newTable, capId);
            }
        }
    }
    catch (err) {
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
function logDebugBatch(dstr) {
    vLevel = 1
    if (arguments.length > 1)
        vLevel = arguments[1];
    if ((showDebugBatch & vLevel) == vLevel || vLevel == 1)
        debug += dstr + br;
    if ((showDebugBatch & vLevel) == vLevel)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
    aa.print(dstr);
}
function doSQLSelect(sql) {
    var dq = aa.db.select(sql, []);
    if (dq.getSuccess()) {
        var dso = dq.getOutput();
        if (dso) {
            var a = [];
            var ds = dso.toArray();
            for (var x in ds) {
                var r = {};
                var row = ds[x];
                var ks = ds[x].keySet().toArray();
                for (var c in ks) {
                    r[ks[c]] = String(row.get(ks[c]));
                    //aa.print(ks[c] + ": " + (row.get(ks[c])));
                }
                a.push(r);
            }
        }
        //aa.print(JSON.stringify(a) + "<br>");
        return a;
    } else {
        aa.print("error " + dq.getErrorMessage());
    }
}
