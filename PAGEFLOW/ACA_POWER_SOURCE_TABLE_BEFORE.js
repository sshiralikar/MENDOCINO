/*------------------------------------------------------------------------------------------------------/
| Program : ACA CAN_CULT_APP
|
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
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag
var useProductScripts = true;

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


eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var capIDString = capId.getCustomID();
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();
var appTypeArray = appTypeString.split("/");
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
var publicUser = true;
var currentUserID = aa.env.getValue("CurrentUserID");
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var asiGroups = cap.getAppSpecificInfoGroups();
var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info

cancel = false;
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

    // CAMEND-832
    var flag = false;
    if (AInfo["Generators"] == "CHECKED") {
        var structureCounter;
        if (typeof (POWERSOURCES) == "object") {
            structureCounter = POWERSOURCES.length;
            for (var i in POWERSOURCES) {
                if (POWERSOURCES[i]["Type of Power"] == "Generator") {
                    flag = true;
                    break;
                }
            }
        }
        logDebug("number of rows: " + structureCounter);

        if ((structureCounter == 0) || (structureCounter > 0 && !flag)) {
            messageList += "Generators was checked. Please add a row with Type of Power: 'Generators' in the following table: " + "POWER SOURCE(S)" + br;
        }
    }
    // CAMEND-832

    //
    var useExistingASIT = getASITablesRowsFromSession4ACA("POWER SOURCE(S)");

    if (AInfo["Power source" == "Yes"] && useExistingASIT.length == 0 || AInfo["Power source"] == "Yes" && !useExistingASIT) {
        // cancel = true;
        // showMessage = true;
        // comment("Power Source must have at least one row to continue.");
        messageList += "Power Source must have at least one row to continue." + br;
    }

    

    if (messageList != "") {
        cancel = true;
        showMessage = true;
        comment(messageList);
    }

} catch (error) {
    logDebug(error.message);
    cancel = true;
    showDebug = true;
}


/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
} else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    } else {
        aa.env.setValue("ErrorCode", "0");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/--------------------------------------------------------------------------------------------------*/
function getFieldValue(fieldName, asiGroups) {
    if (asiGroups == null) {
        return null;
    }

    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext()) {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null) {
            var iteFields = fields.iterator();
            while (iteFields.hasNext()) {
                var field = iteFields.next();
                if (fieldName == field.getCheckboxDesc()) {
                    return field.getChecklistComment();
                }
            }
        }
    }
    return null;
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