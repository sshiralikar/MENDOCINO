/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_PERMIT_ABOUT_TO_EXPIRE.js
| Trigger: Batch
| Client: MENDOCINO
| Version 1.0 5/9/2023
| Author: Shashank Shiralikar
| This batch script will run daily @11:30 PM.
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
var showDebug = true;// Set to true to see debug messages in email confirmation
var maxSeconds = 60 * 5;// number of seconds allowed for batch processing, usually < 5*60
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
}
else {
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
        //logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");
        logMessage("End Date: " + startDate);
        aa.sendMail("plusdev@fairfaxcounty.gov", emailAddress, "", "Batch Job - BATCH_PLANNING_WETLANDS_ABOUT_TO_EXPIRE", emailText);
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
        logMessage("PERMITS ABOUT TO EXPIRE....90 Day Reminder");
        var numberOfDays = 90;
        var hm = new Array();
        var dateCalc = dateAdd(todayDate, numberOfDays);
        /*dateCalc = ('0' + dateCalc.getDate()).slice(-2) + '/'
             + ('0' + (dateCalc.getMonth()+1)).slice(-2) + '/'
             + dateCalc.getFullYear();*/
        logMessage("Now getting records with Expiration date of " + dateCalc);
        //dateCalc = aa.date.parseDate(dateCalc);
        //var recordListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DETAILS", "New Expiration Date", dateCalc, dateCalc);
        var recordListResult = aa.cap.getCapIDsByAppSpecificInfoField("New Expiration Date", String(dateCalc));
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();

                cap = aa.cap.getCap(capId).getOutput();

                targetAppType = cap.getCapType();     //create CapTypeModel object
                targetAppTypeString = targetAppType.toString();
                if(targetAppTypeString.split("/")[2] == "Permit")
                {
                    logMessage(capIDString);
                    var thisCapModel = cap.getCapModel();
                    var thisTypeResult = cap.getCapType();
                    var appStatus = getAppStatus(capId);
                    var perfFlag = getAppSpecific("Performance Standard Violation",capId);
                    if(perfFlag == "CHECKED" && appStatus != "Modification Under Review")
                    {
/*                        var pCapId = getParent(capId);
                        if(pCapId)
                        {*/
                            updateAppStatus("Modification Required","",capId);
                            setLicExpirationDate(capId,"","","About to Expire");
                        //}
                    }
                    else if(appStatus != "Modification Under Review")
                    {
                        updateAppStatus("About to Expire","",capId);
                        setLicExpirationDate(capId,"",dateCalc,"About to Expire");
                    }
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
                                addParameter(params, "$$FullNameBusName$$", conName);addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                                addParameter(params, "$$acaRecordUrl$$", acaUrl);
                                if(hm[applicantEmail+""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "GLOBAL_ABOUT TO EXPIRE", params, null, capId);
                                    hm[applicantEmail+""] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        var numberOfDays = 90;
        var dateCalc = new Date(dateAdd(todayDate, numberOfDays));
        dateCalc = ('0' + (dateCalc.getMonth()+1)).slice(-2) + '/'
            + ('0' + dateCalc.getDate()).slice(-2) + '/'
            + dateCalc.getFullYear();
        logMessage("Now getting records with Expiration date of " + dateCalc);
        //dateCalc = aa.date.parseDate(dateCalc);
        //var recordListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DETAILS", "New Expiration Date", dateCalc, dateCalc);
        var recordListResult = aa.cap.getCapIDsByAppSpecificInfoField("New Expiration Date", String(dateCalc));
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();

                cap = aa.cap.getCap(capId).getOutput();

                targetAppType = cap.getCapType();     //create CapTypeModel object
                targetAppTypeString = targetAppType.toString();
                if(targetAppTypeString.split("/")[2] == "Permit")
                {
                    logMessage(capIDString);
                    var thisCapModel = cap.getCapModel();
                    var thisTypeResult = cap.getCapType();
                    var appStatus = getAppStatus(capId);
                    var perfFlag = getAppSpecific("Performance Standard Violation",capId);
                    if(perfFlag == "CHECKED" && appStatus != "Modification Under Review")
                    {
                        //var pCapId = getParent(capId);
                        //if(pCapId)
                        //{
                            updateAppStatus("Modification Required","",capId);
                            setLicExpirationDate(capId,"","","About to Expire");
                        //}
                    }
                    else if(appStatus != "Modification Under Review")
                    {
                        updateAppStatus("About to Expire","",capId);
                        setLicExpirationDate(capId,"",dateCalc,"About to Expire");
                    }
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
                                addParameter(params, "$$FullNameBusName$$", conName);addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                                addParameter(params, "$$acaRecordUrl$$", acaUrl);
                                if(hm[applicantEmail+""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "GLOBAL_ABOUT TO EXPIRE", params, null, capId);
                                    hm[applicantEmail+""] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        logMessage("PERMITS ABOUT TO EXPIRE....60 Day Reminder");
        var numberOfDays = 60;
        var hm = new Array();
        var dateCalc = dateAdd(todayDate, numberOfDays);
        logMessage("Now getting records with Expiration date of " + dateCalc);
        //dateCalc = aa.date.parseDate(dateCalc);
        //var recordListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DETAILS", "New Expiration Date", dateCalc, dateCalc);
        var recordListResult = aa.cap.getCapIDsByAppSpecificInfoField("New Expiration Date", String(dateCalc));
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {
                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                logMessage(capIDString);
                cap = aa.cap.getCap(capId).getOutput();
                targetAppType = cap.getCapType();     //create CapTypeModel object
                targetAppTypeString = targetAppType.toString();
                if(targetAppTypeString.split("/")[2] == "Permit")
                {
                    var thisCapModel = cap.getCapModel();
                    var thisTypeResult = cap.getCapType();
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
                                addParameter(params, "$$FullNameBusName$$", conName);addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                                addParameter(params, "$$acaRecordUrl$$", acaUrl);
                                if(hm[applicantEmail+""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "GLOBAL_ABOUT TO EXPIRE", params, null, capId);
                                    hm[applicantEmail+""] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        var numberOfDays = 60;
        var dateCalc = new Date(dateAdd(todayDate, numberOfDays));
        dateCalc = ('0' + (dateCalc.getMonth()+1)).slice(-2) + '/'
            + ('0' + dateCalc.getDate()).slice(-2) + '/'
            + dateCalc.getFullYear();
        logMessage("Now getting records with Expiration date of " + dateCalc);
        //dateCalc = aa.date.parseDate(dateCalc);
        //var recordListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DETAILS", "New Expiration Date", dateCalc, dateCalc);
        var recordListResult = aa.cap.getCapIDsByAppSpecificInfoField("New Expiration Date", String(dateCalc));
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {

                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                logMessage(capIDString);
                cap = aa.cap.getCap(capId).getOutput();
                targetAppType = cap.getCapType();     //create CapTypeModel object
                targetAppTypeString = targetAppType.toString();
                if(targetAppTypeString.split("/")[2] == "Permit")
                {
                    var thisCapModel = cap.getCapModel();
                    var thisTypeResult = cap.getCapType();
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
                                addParameter(params, "$$FullNameBusName$$", conName);addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                                addParameter(params, "$$acaRecordUrl$$", acaUrl);
                                if(hm[applicantEmail+""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "GLOBAL_ABOUT TO EXPIRE", params, null, capId);
                                    hm[applicantEmail+""] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }

        logMessage("PERMITS ABOUT TO EXPIRE....30 Day Reminder");
        var hm = new Array();
        var numberOfDays = 30;
        var dateCalc = dateAdd(todayDate, numberOfDays);
        logMessage("Now getting records with Expiration date of " + dateCalc);
        //dateCalc = aa.date.parseDate(dateCalc);
        //var recordListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DETAILS", "New Expiration Date", dateCalc, dateCalc);
        var recordListResult = aa.cap.getCapIDsByAppSpecificInfoField("New Expiration Date", String(dateCalc));
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {

                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                logMessage(capIDString);
                cap = aa.cap.getCap(capId).getOutput();
                targetAppType = cap.getCapType();     //create CapTypeModel object
                targetAppTypeString = targetAppType.toString();
                if(targetAppTypeString.split("/")[2] == "Permit")
                {
                    var thisCapModel = cap.getCapModel();
                    var thisTypeResult = cap.getCapType();
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
                                addParameter(params, "$$FullNameBusName$$", conName);addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                                addParameter(params, "$$acaRecordUrl$$", acaUrl);
                                if(hm[applicantEmail+""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "GLOBAL_ABOUT TO EXPIRE", params, null, capId);
                                    hm[applicantEmail+""] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        var numberOfDays = 30;
        var dateCalc = new Date(dateAdd(todayDate, numberOfDays));

        dateCalc = ('0' + (dateCalc.getMonth()+1)).slice(-2) + '/'
            + ('0' + dateCalc.getDate()).slice(-2) + '/'
            + dateCalc.getFullYear();
        logMessage("Now getting records with Expiration date of " + dateCalc);
        //dateCalc = aa.date.parseDate(dateCalc);
        //var recordListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DETAILS", "New Expiration Date", dateCalc, dateCalc);
        var recordListResult = aa.cap.getCapIDsByAppSpecificInfoField("New Expiration Date", String(dateCalc));
        if (!recordListResult.getSuccess())
            logMessage("**ERROR: Failed to get capId List : " + recordListResult.getErrorMessage());
        else {
            var recArray = recordListResult.getOutput();
            logMessage("Looping through " + recArray.length + " records");
            for (var j in recArray) {

                capId = aa.cap.getCapID(recArray[j].getID1(), recArray[j].getID2(), recArray[j].getID3()).getOutput();
                capIDString = capId.getCustomID();
                logMessage(capIDString);
                cap = aa.cap.getCap(capId).getOutput();
                targetAppType = cap.getCapType();     //create CapTypeModel object
                targetAppTypeString = targetAppType.toString();
                if(targetAppTypeString.split("/")[2] == "Permit")
                {
                    var thisCapModel = cap.getCapModel();
                    var thisTypeResult = cap.getCapType();
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
                                addParameter(params, "$$FullNameBusName$$", conName);addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                                addParameter(params, "$$expirDate$$", getAppSpecific("New Expiration Date",capId));
                                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                                addParameter(params, "$$capName$$", cap.getSpecialText()+"");
                                var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                                addParameter(params, "$$acaRecordUrl$$", acaUrl);
                                if(hm[applicantEmail+""] != 1) {
                                    sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "GLOBAL_ABOUT TO EXPIRE", params, null, capId);
                                    hm[applicantEmail+""] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    catch (err) {
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

function getAppStatus() {
    var itemCap = capId;
    if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args

    var appStatus = null;
    var capResult = aa.cap.getCap(itemCap);
    if (capResult.getSuccess()) {
        licCap = capResult.getOutput();
        if (licCap != null) {
            appStatus = "" + licCap.getCapStatus();
        }
    } else {
        logDebug("ERROR: Failed to get app status: " + capResult.getErrorMessage());
    }
    return appStatus;
}
function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}
function runEmailThroughSLEmailFilter(vEmail)
{
    var filter = lookup("SL_EMAIL_CONTROL", "FILTER");
    if(filter == "ON")
    {
        var domains = String(lookup("SL_EMAIL_CONTROL", "DOMAIN_EXCEPTIONS"));
        var emails = String(lookup("SL_EMAIL_CONTROL", "EMAIL_EXCEPTIONS"));
        var vOriginalDomain = vEmail.substring(vEmail.indexOf("@") + 1, vEmail.length).toLowerCase();

        if(domains.toLowerCase().indexOf(String(vOriginalDomain).toLowerCase()) != -1)
            return vEmail;
        if(emails.toLowerCase().indexOf(String(vOriginalDomain).toLowerCase()) != -1)
            return vEmail;


        vEmail = vEmail.replace(vOriginalDomain, "DoNotSend.com");
    }
    return vEmail;
}
function sendEmail(fromEmail, toEmail, CC, template, eParams, files) { // optional: itemCap
    var itemCap = capId;
    if (arguments.length == 7)
        itemCap = arguments[6]; // use cap ID specified in args

    //var sent = aa.document.sendEmailByTemplateName(fromEmail, toEmail, CC, template, eParams, files);
    toEmail = runEmailThroughSLEmailFilter(toEmail);
    var itempAltIDScriptModel = aa.cap.createCapIDScriptModel(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());
    var sent = aa.document.sendEmailAndSaveAsDocument(fromEmail, toEmail, CC, template, eParams, itempAltIDScriptModel, files);
    if (!sent.getSuccess()) {
        logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
    }
}
function getContactName(vConObj) {
    if (vConObj.people.getContactTypeFlag() == "organization") {
        if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
            return vConObj.people.getBusinessName();

        return vConObj.people.getBusinessName2();
    }
    else {
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