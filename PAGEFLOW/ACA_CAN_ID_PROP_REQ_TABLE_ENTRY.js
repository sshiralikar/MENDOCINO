/*------------------------------------------------------------------------------------------------------/
| Program : ACA_CAN_ID_PROP_REQ_TABLE_ENTRY.js
| Event   : ACA Page Flow before
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
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
    if (!servProvCode)
        servProvCode = aa.getServiceProviderCode();
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
if (currentUserGroupObj)
    currentUserGroup = currentUserGroupObj.getGroupName();
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
//loadTaskSpecific(AInfo);            // Add task specific info
//loadParcelAttributes(AInfo);            // Add parcel attributes
loadASITables();

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

// page flow custom code begin

try {

    parentCapIdString = "" + cap.getParentCapID();
    if (parentCapIdString) {
        pca = parentCapIdString.split("-");
        parentCapId = aa.cap.getCapID(pca[0], pca[1], pca[2]).getOutput();
    }

    //showDebug = false;
    //showMessage = true;
    //cancel = true;

    var messageList = "";
    var z = 0;
    for (z in AInfo) {
        logDebug(z + " : " + AInfo[z]);
    }

    loadASITables4ACA();
    // var flag = false;
    // CAMEND-526
    // var primaryLeach = AInfo["Primary Leach fields"];
    // logDebug("primary leach value is: " + primaryLeach);
    // if (primaryLeach == "Yes") {

    //     logDebug("type of structuresiteplanidlist is: " + typeof(STRUCTURESITEPLANIDLIST));
    //     var structureCounter;
    //     if (typeof(STRUCTURESITEPLANIDLIST) == "object") {
    //         structureCounter = STRUCTURESITEPLANIDLIST.length;
    //         for (var i in STRUCTURESITEPLANIDLIST) {
    //             if (STRUCTURESITEPLANIDLIST[i]["Type of Structure"] == "Septic/Leach") {
    //                 flag = true;
    //                 break;
    //             }
    //         }
    //     }
    //     logDebug("number of rows: " + structureCounter);

    //     if ((structureCounter == 0) || (structureCounter > 0 && !flag)) {
    //         messageList += "Please add a row with 'Type of Structure': 'Septic/Leach' in the following table: " + "Structure/Site Plan ID" + br;
    //     }
    // }

    //CAMEND-895
    var flag = false;
    if (AInfo["Indoor SF"] > 0 || AInfo["Mixed Light SF"] > 0) {
        var structureCounter;
        if (typeof (STRUCTURESITEPLANIDLIST) == "object") {
            structureCounter = STRUCTURESITEPLANIDLIST.length;
            for (var i in STRUCTURESITEPLANIDLIST) {
                if (STRUCTURESITEPLANIDLIST[i]["Type of Structure"] == "Cargo Container") {
                    flag = true;
                    break;
                } else if (STRUCTURESITEPLANIDLIST[i]["Type of Structure"] == "Greenhouse") {
                    flag = true;
                    break;
                } else if (STRUCTURESITEPLANIDLIST[i]["Type of Structure"] == "Hoop House") {
                    flag = true;
                    break;
                }
            }
        }
        logDebug("number of rows: " + structureCounter);

        if ((structureCounter == 0) || (structureCounter > 0 && !flag)) {
            messageList += "Indoor SF and/or Mixed Light SF are greater than 0. Please add a row with Type of Structure: 'Cargo Container', 'Greenhouse', or 'Hoop House' in the following table: " + "Structure/Site Plan ID" + br;
        }
    }

    //CAMEND-895
    // var flag = false;
    // var table = getASITablesRowsFromSession4ACA("STRUCTURE/SITE PLAN ID LIST");
    // if (AInfo["Indoor SF"] > 0 || AInfo["Mixed Light SF"] > 0) {
    //     if (table && table.length > 0) {
    //         for (var i in table) {
    //             if (table[i]["Type of Structure"] != "Cargo Container" && table[i]["Type of Structure"] != "Greenhouse" && table[i]["Type of Structure"] != "Hoop House") {
    //                 flag = true
    //             } else {
    //                 flag = false
    //             }
    //         }
    //     }
    // }
    // if (flag) {
    //     messageList += "Indoor SF and/or Mixed Light SF are greater than 0. You must enter at least one row with 'Cargo Container', 'Greenhouse', or 'Hoop House' as a Structure Type in the following table: " + "Structure/Site Plan ID" + br;
    // }

    if (AInfo["Structure Change"] == "Yes") {
        var structureCounter;
        if (typeof (STRUCTURESITEPLANIDLIST) == "object") {
            structureCounter = STRUCTURESITEPLANIDLIST.length;
        }
        if (structureCounter < 1) {
            messageList += "You must enter at least one row in the following table: " + "Structure/Site Plan ID" + br;
        }
    }



    if (messageList != "") {
        cancel = true;
        showMessage = true;
        comment(messageList);
    }
    //CAMEND-192




} catch (err) {

    logDebug(err);

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



function getASITablesRowsFromSession4ACA(tableName) {
    var gm = null;
    if (String(cap.getClass()).indexOf("CapScriptModel") != -1) {
        gm = cap.getCapModel().getAppSpecificTableGroupModel();
    } else {
        gm = cap.getAppSpecificTableGroupModel();
    }
    if (gm == null) {
        return false;
    }
    var ta = gm.getTablesMap();
    var tai = ta.values().iterator();
    while (tai.hasNext()) {
        var tsm = tai.next();
        if (tsm.rowIndex.isEmpty())
            continue;

        var asitRow = new Array;
        var asitTables = new Array;
        var tn = tsm.getTableName();
        if (tn != tableName) {
            continue;
        }

        var tsmfldi = tsm.getTableField().iterator();
        var tsmcoli = tsm.getColumns().iterator();
        while (tsmfldi.hasNext()) {

            var tcol = tsmcoli.next();
            var tval = tsmfldi.next();

            asitRow[tcol.getColumnName()] = tval;

            if (!tsmcoli.hasNext()) {
                tsmcoli = tsm.getColumns().iterator();
                asitTables.push(asitRow);
                asitRow = new Array;
            }
        }
        return asitTables;
    }
    return false;
}