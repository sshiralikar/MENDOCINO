/*------------------------------------------------------------------------------------------------------/
| TESTING PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
/*
//Testing Variables
aa.env.setValue("showDebug", "No");
aa.env.setValue("showMessage", "Yes");
aa.env.setValue("eventType", "Batch Process");
 */
/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_CANNABIS_SEND_PIN_EMAILS.js  Trigger: Batch
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
logDebug = function (edesc) {
    var msg = "";
    if (showDebug)
        msg = edesc;
    else
        msg = "<color='black' size=2>" + edesc + "</><BR>";
    aa.print(msg);
}
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

    logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
    logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");

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
    /*----------------------------------------------------------------------------------------------------/
    | BATCH PARAMETERS
    /------------------------------------------------------------------------------------------------------*/
    var paramStdChoice = aa.env.getValue("paramStdChoice"); // use this standard choice for parameters instead of batch jobs

    var sqlCmd = "SELECT B.B1_ALT_ID FROM B1PERMIT B ";
    sqlCmd += "WHERE B.SERV_PROV_CODE = 'MENDOCINO' ";
    sqlCmd += "	AND	 B.B1_PER_GROUP ='Cannabis' ";
    sqlCmd += " AND  B.B1_CREATED_BY not like 'PUBLICUSER%' "
    sqlCmd += " AND B.B1_ALT_ID NOT LIKE '%TMP%' "
    sqlCmd += " AND B.B1_ALT_ID NOT LIKE '%EST%' "

    var capIDsList = doSQLSelect(sqlCmd);

    logDebug("Records Found: " + capIDsList.length + " Record.");
    logMessage("Records Found: " + capIDsList.length + " Record.");

    if (!capIDsList || capIDsList.length == 0) {
        logDebug("No data returned by query, batch aborted.");
        return;
    }

    var vCapCount = 0;
    var vSetCount = 1;
    var vErrorCount = 0;
    var vSkipCount = 0;
    var vTmpId;
    var vReadyForNewSet = false;
    var newSet = getNewSet("Cannabis Registration", "Open", vSetCount);
    vSetCount++;

    for (var c in capIDsList) {
        if ((vCapCount == 0 || vCapCount % 5000 == 0) && vReadyForNewSet) {
            vReadyForNewSet = false;
            newSet = getNewSet("Cannabis Registration", "Open", vSetCount);
            logDebug("**Created new Set: " + newSet.name);
            logMessage("**Created new Set: " + newSet.name);
            vSetCount++;
        }

        capId = null;
        // Get CapID
        var altID = capIDsList[c]['B1_ALT_ID'];
        logDebug("Processing " + altID);
        logMessage("Processing " + altID);

        var capIdRes = aa.cap.getCapID(altID);
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

        /*if (appMatch("Fire/Registration/NA/NA", capId) || appMatch("Fire/TIMEACCOUNTING/NA/NA", capId)) {
            logDebug(altID + ": Not applicable record type, skipping...");
            logMessage(altID + ": Not applicable record type, skipping...");
            vSkipCount++;
            continue;
        }*/

        if (appStatus == "Closed" || appStatus == "Voided" || appStatus == "Withdrawn") {
            logDebug(altID + ": Not applicable record status, skipping...");
            logMessage(altID + ": Not applicable record status, skipping...");
            vSkipCount++;
            continue;
        }

        //VAFFXPLUS-34604
        //Purpose: Only send PIN registration notifications to contacts who haven't yet registered
        //Author: CGray
        var emailString = "";
        var otherEmail = "";
        var conEmail = "";
        try {
            var contactsresult = aa.people.getCapContactByCapID(capId);
            if (contactsresult.getSuccess()) {
                var contactsArray = contactsresult.getOutput();
                for (con in contactsArray) {
                    conEmail = contactsArray[con].getPeople().getEmail();
                    if (contactsArray[con].getPeople().getContactType() == "Individual") {
                        otherEmail = conEmail;
                        break;
                    }
                }
                for (con in contactsArray) {
                    conEmail = contactsArray[con].getPeople().getEmail();
                    if (contactsArray[con].getPeople().getContactType() != "Individual") {
                        if (!matches(conEmail, "", undefined, null)) {
                            if (conEmail.toUpperCase() != otherEmail.toUpperCase()) {
                                var sqlCmd = "SELECT USER_ID FROM PUBLICUSER WHERE UPPER(EMAIL_ID) LIKE UPPER('{0}')";
                                sqlCmd = sqlCmd.replace("{0}", conEmail);
                                var pubEmail = doSQLSelect(sqlCmd);
                                if (pubEmail.length == 0) {
                                    //VAFFXPLUS-37783
                                    //Purpose: Check for duplicate e-mail before adding to emailString
                                    //Author: CGray
                                    if (emailString.search(conEmail) == -1) {
                                        emailString += conEmail + ",";
                                    }
                                }
                                else if (pubEmail.length >= 1) {
                                    //don't include
                                    continue;
                                }
                            }
                            else {
                                //don't include
                                continue;
                            }
                        }
                    }
                }
            }
            if (!emailString) {
                logDebug(altID + ": All contacts have registered or no e-mails to process, skipping...");
                logMessage(altID + ": All contacts have registered or no e-mails to process, skipping...");
                vSkipCount++;
                continue;
            }
        }
        catch (error) {
            logDebug("Error in checking for contact's email: " + error.message);
            logMessage("Error in checking for contact's email: " + error.message);
            continue;
        }
        if (emailString) {
            var capModel = cap.getCapModel();
            var qud2 = capModel.getQUD2();
            /*if ("PIN_SENT".equals(qud2))
            {
                logDebug(altID + ": PIN notification already sent, skipping...");
                vSkipCount++;
                continue;
            }*/

            //add to set
            newSet.add(capId);
            vReadyForNewSet = true;
            vCapCount++;

            // Send PIN Notice
            var vEParams = aa.util.newHashtable();
            var address = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Address");
            var am = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "AM");
            var agencyEmail = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Email");
            var hours = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Hours");
            var name = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Name");
            var deptName = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Official Department Name");
            var phone = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Phone");
            var pm = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "PM");
            var pOfficial = lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "Primary Official");
            var applicantPeople = getContactByType("Applicant", capId);
            var fullNameBusName = "";
            if (applicantPeople)
                fullNameBusName = getFullNameBusName(applicantPeople);

            addParameter(vEParams, "$$altId$$", altID);
            addParameter(vEParams, "$$FullNameBusName$$", fullNameBusName);
            addParameter(vEParams, "$$deptName$$", name);
            addParameter(vEParams, "$$deptPhone$$", phone);
            addParameter(vEParams, "$$deptHours$$", hours);
            addParameter(vEParams, "$$deptFormalName$$", deptName);
            addParameter(vEParams, "$$deptEmail$$", agencyEmail);
            addParameter(vEParams, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
            addParameter(vEParams, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
            var vAmendment = "";
            if (appMatch("*/*/Amendment/*") || (!matches(capName, null, undefined, 'undefined', ""))) {
                vAmendment = ", ";
                addParameter(vEParams, "$$Amendment$$", vAmendment);
            }

            var vPIN = capId + "";
            addParameter(vEParams, "$$capID$$", vPIN);

            //emailWithReportLinkASync(emailString, 'FIRE_PIN_NOTIFICATION', vEParams);
            sendEmail("no-reply@mendocinocounty.org", emailString + "", "", "ACA_PIN_REGISTRATION", vEParams, null, capId);
            setRecordQUD(null, "PIN_SENT", null, null, capId);
            logDebug("Sending Email to: " + emailString);
            logMessage("Sending Email to: " + emailString);
        }
    }

    logDebug("=================================================");
    logDebug("=================================================");
    logDebug("Total records qualified: " + capIDsList.length);
    logDebug("Total records skipped: " + vSkipCount);
    logDebug("Total record errors: " + vErrorCount);
    logDebug("Total CAPS processed: " + vCapCount);

    logMessage("=================================================");
    logMessage("=================================================");
    logMessage("Total records qualified: " + capIDsList.length);
    logMessage("Total records skipped: " + vSkipCount);
    logMessage("Total record errors: " + vErrorCount);
    logMessage("Total CAPS processed: " + vCapCount);
}

function setRecordQUD(QUD1, QUD2, QUD3, QUD4) {
    var itemCap = capId;
    if (arguments.length > 4)
        itemCap = arguments[4];
    var thisCap = aa.cap.getCap(itemCap).getOutput();
    var thisCapModel = thisCap.getCapModel();

    if (QUD1) thisCapModel.setQUD1(QUD1);
    if (QUD2) thisCapModel.setQUD2(QUD2);
    if (QUD3) thisCapModel.setQUD3(QUD3);
    if (QUD4) thisCapModel.setQUD4(QUD4);

    var editCapResult = aa.cap.editCapByPK(thisCapModel);
    if (editCapResult.getSuccess())
    {
        logDebug("Successfully updated QUD");
        return true;
    }
    else{
        logDebug("Unable to updated QUD " + editCapResult.getErrorMessage());
        return false;
    }
}

function getNewSet(setType, setStatus, setCount) {
    var date = new Date();
    var setName = setType +" - "+ (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getFullYear() + " F" + setCount;
    var set = new capSet(setName,setName,setType);
    set.status = setStatus;
    set.type = setType;
    set.update();
    return set;
}