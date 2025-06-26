/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_COURTESY.js
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
sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
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
    var hm1 = new Array();
    var vCurrentYr = new Date().getFullYear().toString();
    try {
        var sql = "select B1_PER_ID1, B1_PER_ID2, B1_PER_ID3,B1_CHECKLIST_COMMENT from bchckbox where serv_prov_code = 'MENDOCINO' and  b1_checkbox_desc = 'New Expiration Date' and b1_checklist_comment LIKE '%"+vCurrentYr+"%'";
        var res = doSQLSelect(sql);
        for(var i in res) {
            var id1 = res[i].B1_PER_ID1;
            var id2 = res[i].B1_PER_ID2;
            var id3 = res[i].B1_PER_ID3;
            var b1_checklist_comment = res[i].B1_CHECKLIST_COMMENT;
            capId = aa.cap.getCapID(id1,id2,id3).getOutput();
            cap = aa.cap.getCap(capId).getOutput();
            var vCapType = aa.cap.getCap(capId).getOutput().getCapType().toString();
            var level3 = vCapType.split("/")[2];
            var altId = capId.getCustomID();
            if(hm1[altId+""]!=1)
                hm1[altId]=1;
            if(level3 == "Permit")
            {
                aa.print("PICKED: "+ altId + "---> New Exp Date: "+ b1_checklist_comment);
                var hm = new Array();
                var contactResult = aa.people.getCapContactByCapID(capId);
                if (contactResult.getSuccess()) {
                    var capContacts = contactResult.getOutput();
                    for (var i in capContacts) {
                        if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent"))
                        {
                            var conName = getContactName(capContacts[i]);
                            var applicantEmail = capContacts[i].getPeople().getEmail()+"";
                            var params = aa.util.newHashtable();
                            addParameter(params, "$$altID$$", capId.getCustomID()+"");
                            addParameter(params, "$$contactName$$", conName);
                            addParameter(params, "$$date$$", sysDateMMDDYYYY);
                            var parent = getParent();
                            if (parent)
                                addParameter(params, "$$parentAltId$$", parent.getCustomID() + "");
                            else
                                addParameter(params, "$$parentAltId$$", capId.getCustomID() + "");
                            addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                            //addParameter(params, "$$address$$", vAddress);
                            addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                            var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                            addParameter(params, "$$acaRecordUrl$$", acaUrl);
                            if(hm[applicantEmail+""] != 1) {
                                sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "CAN_RENEWAL_COURTESY_REMINDER", params, null, capId);
                                aa.print("Sending courtesy email to: "+ applicantEmail);
                                hm[applicantEmail+""] = 1;
                            }
                        }
                    }
                }
            }
        }
        aa.print("---");
        var sql = "select B1_PER_ID1, B1_PER_ID2,B1_PER_ID3,B1_CHECKLIST_COMMENT from bchckbox where serv_prov_code = 'MENDOCINO' and  b1_checkbox_desc = 'Expiration Date' and b1_checklist_comment LIKE '%"+vCurrentYr+"%'";
        var res = doSQLSelect(sql);
        for(var i in res) {
            var id1 = res[i].B1_PER_ID1;
            var id2 = res[i].B1_PER_ID2;
            var id3 = res[i].B1_PER_ID3;
            var b1_checklist_comment = res[i].B1_CHECKLIST_COMMENT;
            capId = aa.cap.getCapID(id1,id2,id3).getOutput();
            cap = aa.cap.getCap(capId).getOutput();
            var vCapType = aa.cap.getCap(capId).getOutput().getCapType().toString();
            var level3 = vCapType.split("/")[2];
            var altId = capId.getCustomID();
            if(hm1[altId+""]!=1 && level3 == "Permit")
            {
                aa.print("PICKED: "+ altId + "---> Exp Date: "+ b1_checklist_comment);
                var hm = new Array();
                var contactResult = aa.people.getCapContactByCapID(capId);
                if (contactResult.getSuccess()) {
                    var capContacts = contactResult.getOutput();
                    for (var i in capContacts) {
                        if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent"))
                        {
                            var conName = getContactName(capContacts[i]);
                            var applicantEmail = capContacts[i].getPeople().getEmail()+"";
                            var params = aa.util.newHashtable();
                            addParameter(params, "$$altID$$", capId.getCustomID()+"");
                            addParameter(params, "$$contactName$$", conName);
                            addParameter(params, "$$date$$", sysDateMMDDYYYY);
                            var parent = getParent();
                            if (parent)
                                addParameter(params, "$$parentAltId$$", parent.getCustomID() + "");
                            else
                                addParameter(params, "$$parentAltId$$", capId.getCustomID() + "");
                            addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                            //addParameter(params, "$$address$$", vAddress);
                            addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                            var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                            addParameter(params, "$$acaRecordUrl$$", acaUrl);
                            if(hm[applicantEmail+""] != 1) {
                                sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "CAN_RENEWAL_COURTESY_REMINDER", params, null, capId);
                                aa.print("Sending courtesy email to: "+ applicantEmail);
                                hm[applicantEmail+""] = 1;
                            }
                        }
                    }
                }
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