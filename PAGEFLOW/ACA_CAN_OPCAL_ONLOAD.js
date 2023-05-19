/*------------------------------------------------------------------------------------------------------/
| Program : ACA_CAN_OPCAL_ONLOAD.js
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
var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
//loadTaskSpecific(AInfo);            // Add task specific info
//loadParcelAttributes(AInfo);            // Add parcel attributes
//loadASITables();
// page flow custom code begin
try {
    var operationsCalendar = getASITablesRowsFromSession4ACA("OPERATIONS CALENDAR");
    if(!operationsCalendar)
    {
        var newTable = new Array();

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","January", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","February", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","March", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","April", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","May", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","June", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","July", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","August", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","September", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","October", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","November", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vRow = new Array();
        vRow["Month"] = new asiTableValObj("Month","December", "Y");
        vRow["Activity"] = new asiTableValObj("Activity", "", "N");
        vRow["Approximate Date"] = new asiTableValObj("Approximate Date", "", "N");
        newTable.push(vRow);

        var vToASITGroup = cap.getAppSpecificTableGroupModel();
        addASITable4ACAPageFlow_local(vToASITGroup, "OPERATIONS CALENDAR", newTable);
    }
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

function addASITable4ACAPageFlow_local(destinationTableGroupModel, tableName, tableValueArray) // optional capId
{
    //  tableName is the name of the ASI table
    //  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
    //

    var itemCap = capId
    if (arguments.length > 3)
        itemCap = arguments[3]; // use cap ID specified in args

    var ta = destinationTableGroupModel.getTablesMap().values();
    var tai = ta.iterator();

    var found = false;
    while (tai.hasNext()) {
        var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
        if (tsm.getTableName().equals(tableName)) {
            found = true;
            break;
        }
    }

    if (!found) {
        logDebug("cannot update asit for ACA, no matching table name");
        return false;
    }

    var i = -1; // row index counter
    if (tsm.getTableFields() != null) {
        i = 0 - tsm.getTableFields().size()
    }

    for (thisrow in tableValueArray) {
        var fld = aa.util.newArrayList(); // had to do this since it was coming up null.
        var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
        var col = tsm.getColumns()
        var coli = col.iterator();
        while (coli.hasNext()) {
            var colname = coli.next();

            if (!tableValueArray[thisrow][colname.getColumnName()]) {
                logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
                tableValueArray[thisrow][colname.getColumnName()] = "";
            }

            if (typeof(tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") // we are passed an asiTablVal Obj
            {
                var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "", colname);
                var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
                fldToAdd.setRowIndex(i);
                fldToAdd.setFieldLabel(colname.getColumnName());
                fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
                fldToAdd.setReadOnly(true);
                fld.add(fldToAdd);
                fld_readonly.add("Y");

            } else // we are passed a string
            {
                var args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "", colname);
                var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
                fldToAdd.setRowIndex(i);
                fldToAdd.setFieldLabel(colname.getColumnName());
                fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
                fldToAdd.setReadOnly(true);
                fld.add(fldToAdd);
                fld_readonly.add("Y");

            }
        }

        i--;

        if (tsm.getTableFields() == null) {
            tsm.setTableFields(fld);
        } else {
            tsm.getTableFields().addAll(fld);
        }

        //if (tsm.getReadonlyField() == null) {
        tsm.setReadonlyField(fld_readonly); // set readonly field
        //} else {
        //	tsm.getReadonlyField().addAll(fld_readonly);
        //}
    }

    tssm = tsm;
    return destinationTableGroupModel;
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

function matches(eVal, argList) {
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] == eVal) {
            return true;
        }
    }
    return false;
}