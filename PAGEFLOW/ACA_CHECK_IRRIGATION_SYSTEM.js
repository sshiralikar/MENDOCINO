/*------------------------------------------------------------------------------------------------------/
| Program : ACA_
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
    // CAMEND-162
    /*var irrigationSystem = 0;
    var totalWater = 0;
    var other = 0;
    var monitor = 0;
    if (AInfo["Irrigation system"] == "Yes") {
        irrigationSystem++;
    }
    if (AInfo["Drip"] == "CHECKED") {
        totalWater++;
    }
    if (AInfo["Flood"] == "CHECKED") {
        totalWater++;
    }
    if (AInfo["Micro-spray"] == "CHECKED") {
        totalWater++;
    }
    if (AInfo["Hand Watering"] == "CHECKED") {
        totalWater++;
    }
    if (AInfo["How monitored"] != " ") {
        monitor++;

    }
    if (AInfo["Other"] == null) {
        other++;

    }

    if (irrigationSystem > 0  && totalWater == 0) {
        showMessage = true;
        comment("'Do you have an irrigation system' has been marked as Yes, please make at least one selection from the four checkboxes below this option and provide detail within the 'How is irrigation water monitored?' field.");
        cancel = true;
    } else if (other == 0 && monitor == 0) {
        showMessage = true;
        comment("You have populated the other text box, please provide additional detail inside of the 'How is irrigation water monitored field.");
        cancel = true;
    }*/
    //CAMEND-162

    // CAMEND-198
    parentCapIdString = "" + cap.getParentCapID();
    if (parentCapIdString) {
        pca = parentCapIdString.split("-");
        parentCapId = aa.cap.getCapID(pca[0], pca[1], pca[2]).getOutput();
    }

    var messageList = "";

    var z = 0;
    for (z in AInfo) {
        logDebug(z + " : " + AInfo[z]);
    }

    //loadASITables4ACA();

    // var waterOnsite = AInfo["Water onsite"];
    // var waterSource = AInfo["Water source"];
    // // CAMEND-831
    // var irrigationSystem = AInfo["Irrigation system"];
    // logDebug("Water onsite value is: " + waterOnsite);
    // if (waterOnsite == "Yes" || waterSource == "Yes" || irrigationSystem == "Yes") {
    //     var table = loadASITable_ACA("WATER SOURCE");
    //     logDebug("WATERSOURCE: " + table);
    //     if (!table) {
    //         messageList += "You must enter at least one row in the following table: " + "Water Source" + br;
    //     }
    // }

    // var flag = false;
    // // CAMEND-830
    // var siur = AInfo["SIUR"];
    // logDebug("SIUR value is: " + siur);
    // if (siur == "Yes") {

    //     logDebug("type of WATERSOURCE is: " + typeof (WATERSOURCE));
    //     var waterCounter;
    //     if (typeof (WATERSOURCE) == "object") {
    //         waterCounter = WATERSOURCE.length;
    //         for (var i in WATERSOURCE) {
    //             if (WATERSOURCE[i]["Water Source Type"] == "Small Irrigation") {
    //                 flag = true;
    //                 break;
    //             }
    //         }
    //     }
    //     logDebug("number of rows: " + waterCounter);

    //     if ((waterCounter == 0) || (waterCounter > 0 && !flag)) {
    //         messageList += "Please add a row with 'Water Source Type': 'Small Irrigation' in the following table: " + "Water Source" + br;
    //     }
    // }

    loadASITables4ACA();
    var flag = false;
    // CAMEND-830
    var siur = AInfo["SIUR"];
    var waterOnsite = AInfo["Water onsite"];
    var waterSource = AInfo["Water source"];
    var irrigationSystem = AInfo["Irrigation system"];


    logDebug("type of WATERSOURCE is: " + typeof (WATERSOURCE));
    var waterCounter;
    if (typeof (WATERSOURCE) == "object") {
        waterCounter = WATERSOURCE.length;
        for (var i in WATERSOURCE) {
            if (WATERSOURCE[i]["Water Source Type"] == "Small Irrigation") {
                flag = true;
                break;
            }
        }
    }

    if ((waterOnsite == "Yes" || waterSource == "Yes" || irrigationSystem == "Yes") && siur == "No") {
        if (waterCounter == 0) {
            messageList += "You must enter at least one row in the following table: " + "Water Source" + br;
        }
    } else if (siur == "Yes") {
        if ((waterCounter == 0) || (waterCounter > 0 && !flag)) {
            messageList += "Please add a row with 'Water Source Type': 'Small Irrigation' in the following table: " + "Water Source" + br;
        }
    }

    if (messageList != "") {
        cancel = true;
        showMessage = true;
        comment(messageList);
    }
    // CAMEND-198


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
function loadASITable_ACA(e) {
    var n = cap.getAppSpecificTableGroupModel();
    var r = n.getTablesMap().values();
    var i = r.iterator();
    while (i.hasNext()) {
        var s = i.next();
        var o = s.getTableName();
        if (!o.equals(e))
            continue;
        if (s.rowIndex.isEmpty()) {
            logDebug("Couldn't load ASI Table " + e + " it is empty");
            return false
        }
        var u = new Array;
        var a = new Array;
        var f = s.getTableField().iterator();
        var l = s.getColumns().iterator();
        var c = s.getReadonlyField().iterator();
        var h = 1;
        while (f.hasNext()) {
            if (!l.hasNext()) {
                var l = s.getColumns().iterator();
                a.push(u);
                var u = new Array;
                h++;
            }
            var p = l.next();
            var d = f.next();
            var v = "N";
            if (c.hasNext()) {
                v = c.next();
                // errorMsg+=v+"\n";
            }
            var m = new asiTableValObj(p.getColumnName(), d, v);
            u[p.getColumnName()] = m
        }
        a.push(u)
    }
    return a
}