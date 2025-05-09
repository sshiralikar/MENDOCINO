/*------------------------------------------------------------------------------------------------------/
| Program : ACA_CAN_APPLICATION_DOC_ONLOAD.js
| Event   : ACA Page Flow attachments before event
|
| Usage   : Master Script by Shashank.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

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
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));


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


var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
    currentUserID = "ADMIN";
    publicUser = true
} // ignore public users
var capIDString = capId.getCustomID(); // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var parcelArea = 0;

var estValue = 0;
var calcValue = 0;
var feeFactor // Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput(); // Calculated valuation
if (valobj.length) {
    estValue = valobj[0].getEstimatedValue();
    calcValue = valobj[0].getCalculatedValue();
    feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
}

var balanceDue = 0;
var houseCount = 0;
feesInvoicedTotal = 0; // Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
if (capDetailObjResult.getSuccess()) {
    capDetail = capDetailObjResult.getOutput();
    var houseCount = capDetail.getHouseCount();
    var feesInvoicedTotal = capDetail.getTotalFee();
    var balanceDue = capDetail.getBalance();
}

var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
//loadTaskSpecific(AInfo);                      // Add task specific info
//loadParcelAttributes(AInfo);                      // Add parcel attributes
var isAppeal = appMatch("Cannabis/Amendment/Appeal/NA");
var isAssignment = appMatch("Cannabis/Amendment/Assignment/NA");
var isNOF = appMatch("Cannabis/Amendment/Notice of Fallowing/NA");
var isNOFAffidavit = appMatch("Cannabis/Amendment/Notice of Fallowing/Affidavit");
var isNOFRevocation = appMatch("Cannabis/Amendment/Notice of Fallowing/Revocation");
var isTaxAppeal = appMatch("Cannabis/Amendment/Tax Appeal/NA");
// CAMEND-468
var isContactChange = appMatch("Cannabis/Amendment/Contact Change/NA");
if (!isAppeal && !isAssignment && !isNOF && !isNOFAffidavit && !isNOFRevocation && !isTaxAppeal && !isContactChange)
    loadASITables4ACA();

logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
logDebug("capId = " + capId.getClass());
logDebug("cap = " + cap.getClass());
logDebug("currentUserID = " + currentUserID);
logDebug("currentUserGroup = " + currentUserGroup);
logDebug("systemUserObj = " + systemUserObj.getClass());
logDebug("appTypeString = " + appTypeString);
logDebug("capName = " + capName);
logDebug("capStatus = " + capStatus);
logDebug("sysDate = " + sysDate.getClass());
logDebug("sysDateMMDDYYYY = " + sysDateMMDDYYYY);
logDebug("parcelArea = " + parcelArea);
logDebug("estValue = " + estValue);
logDebug("calcValue = " + calcValue);
logDebug("feeFactor = " + feeFactor);

logDebug("houseCount = " + houseCount);
logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
logDebug("balanceDue = " + balanceDue);

// page flow custom code begin

try {

    showDebug = false;
    docsMissing = false;
    showList = true;
    addConditions = true;
    addTableRows = false;
    cancel = false;
    showMessage = false;
    capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();
    r = getRequiredDocumentsForCanCult();
    submittedDocList = aa.document.getDocumentListByEntity(capIdString, "TMP_CAP").getOutput().toArray();
    uploadedDocs = new Array();
    for (var i in submittedDocList) uploadedDocs[submittedDocList[i].getDocCategory()] = true;
    conditionType = "Cannabis Required Document";
    var capCondResult = aa.capCondition.getCapConditions(capId, conditionType);

    if (capCondResult.getSuccess()) {
        var ccs = capCondResult.getOutput();
        for (var pc1 in ccs) {
            var rmCapCondResult = aa.capCondition.deleteCapCondition(capId, ccs[pc1].getConditionNumber());
        }
    }
    if (r.length > 0 && showList) {
        for (x in r) {
            if (uploadedDocs[r[x].document] == undefined) {
                showMessage = true;
                if (!docsMissing) {
                    comment("<div class='docList'><span class='fontbold font14px ACA_Title_Color'>The following documents are required based on the information you have provided: </span><ol>");
                    docsMissing = true;
                }

                dr = r[x].condition;
                publicDisplayCond = null;
                if (dr) {
                    ccr = aa.capCondition.getStandardConditions(conditionType, dr).getOutput();
                    logDebug(ccr.length);
                    for (var i = 0; i < ccr.length; i++)
                        if (ccr[i].getConditionDesc().toUpperCase() == dr.toUpperCase()) publicDisplayCond = ccr[i];
                }

                if (dr && ccr.length > 0 && showList && publicDisplayCond) {
                    if (publicDisplayCond.getPublicDisplayMessage())
                        message += "<li><span>" + dr + "</span>: " + publicDisplayCond.getPublicDisplayMessage() + "</li>";
                    else
                        message += "<li><span>" + dr + "</span></li>";
                }
                logDebug(r[x].document);
                if (dr && (r[x].document == dr) && ccr.length > 0 && addConditions && !appHasConditionX(conditionType, null, dr, null)) {
                    addStdConditionX(conditionType, dr);
                }
            }
        }
    }
    //LP Docs
    var isAppeal = appMatch("Cannabis/Amendment/Appeal/NA");
    var isAssignment = appMatch("Cannabis/Amendment/Assignment/NA");
    var isNOF = appMatch("Cannabis/Amendment/Notice of Fallowing/NA");
    var isNOFAffidavit = appMatch("Cannabis/Amendment/Notice of Fallowing/Affidavit");
    var isNOFRevocation = appMatch("Cannabis/Amendment/Notice of Fallowing/Revocation");
    var isTaxAppeal = appMatch("Cannabis/Amendment/Tax Appeal/NA");

    if (!isAppeal && isAssignment && isNOF && isNOFAffidavit && isNOFRevocation && isTaxAppeal) {
        var flag = false;
        var licProfList = cap.getLicenseProfessionalList();
        if (licProfList != null && licProfList.size() > 0) {
            for (var i = licProfList.size(); i > 0; i--) {
                var lpModel = licProfList.get(i - 1);
                var licNum = lpModel.getLicenseNbr();
                var docType = "State License - [" + licNum + "]"
                message += "<li><span>" + docType + "</span></li>";
                aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
            }
            flag = true;
        }
        var licProfResult = aa.licenseScript.getLicenseProf(capId);
        var licProfList = licProfResult.getOutput();
        if (licProfList && !flag) {
            for (i in licProfList) {

                var licNum = licProfList[i].getLicenseNbr();
                var docType = "State License - [" + licNum + "]"
                message += "<li><span>" + docType + "</span></li>";
                aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
            }
        }
    }
    //LP Docs

    //Employee List
    var emplTable = loadASITable("EMPLOYEE LIST");
    if (typeof (EMPLOYEELIST) == "object")
        emplTable = EMPLOYEELIST;

    if (emplTable && emplTable.length > 0) {
        for (var i in emplTable) {
            /*var docType = "Government Issued ID - ["+emplTable[i]["Employee Name"]+"]"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/

            /*var docType = "Mendocino County Live Scan - ["+emplTable[i]["Employee Name"]+"]"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/
        }
    }

    //Employee List

    //Applicant
    var conObj = getContactObjX(cap, "Applicant");
    if (conObj) {
        var name = conObj.getContactName();
        /*var docType = "Government Issued ID - ["+name+"]"
        message += "<li><span>" + docType + "</span></li>";
        aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/

        /*var docType = "Mendocino County Live Scan - ["+name+"]"
        message += "<li><span>" + docType + "</span></li>";
        aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/
    }

    //Applicant

    // CAMEND-703
    var SupportingDocs = AInfo["Supporting Documentation"];
    if (String(SupportingDocs).toUpperCase() == "YES") {
        var numberOfFiles = AInfo["How many documents"];
        numberOfFiles = parseInt(numberOfFiles);
        if (numberOfFiles >= 1) {
            var docType = "Supporting Documentation"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 2) {
            var docType = "Supporting Documentation 2"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 3) {
            var docType = "Supporting Documentation 3"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 4) {
            var docType = "Supporting Documentation 4"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 5) {
            var docType = "Supporting Documentation 5"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 6) {
            var docType = "Supporting Documentation 6"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 7) {
            var docType = "Supporting Documentation 7"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 8) {
            var docType = "Supporting Documentation 8"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 9) {
            var docType = "Supporting Documentation 9"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
        if (numberOfFiles >= 10) {
            var docType = "Supporting Documentation 10"
            message += "<li><span>" + docType + "</span></li>";
            aa.capCondition.addCapCondition(capId, conditionType, docType, docType, sysDate, null, sysDate, null, null, "Notice", systemUserObj, systemUserObj, "Applied", "ADMIN", "A", "Y");
        }
    }


    if (r.length > 0 && showList && docsMissing) {
        comment("</ol></div>");
    }




} catch (err) {

    logDebug(err)
}

// page flow custom code end


if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
} else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    } else {
        aa.env.setValue("ErrorCode", "0");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    }
}