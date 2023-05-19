/*------------------------------------------------------------------------------------------------------/
| Program : ACA_CAN_PERMIT_TYPE_BEFORE.js
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
    if (appMatch("Cannabis/Cultivation/*/*", capId)) {
        var permitType = AInfo["Permit Type"];
        logDebug("permitType: "+ permitType);
        var zoningValues = getZoningValuesFromGIS();
        logDebug("zoningValues: "+ zoningValues);
        if(zoningValues)
        {
            logDebug("Looking for: "+ permitType+"||"+String(zoningValues[0]).toUpperCase()+"||"+String(zoningValues[1]).toUpperCase());
            if(lookup("ZONING STOP CRITERIA",permitType+"||"+String(zoningValues[0]).toUpperCase()+"||"+String(zoningValues[1]).toUpperCase()) == "STOP")
            {
                cancel = true;
                showMessage = true;
                comment(lookup("ZONING STOP CRITERIA","MESSAGE"));
            }
        }
        if(parseInt(AInfo["Total SF"]) <= 0)
        {
            cancel = true;
            showMessage = true;
            comment("Total Square Footage cannot be 0.");
        }
        else if(parseInt(AInfo["Total SF"]) > 10000)
        {
            cancel = true;
            showMessage = true;
            comment("You exceed the maximum allowance of 10000 sq. ft.");
        }
    }
    else if (appMatch("Cannabis/Nursery/*/*", capId)) {
        var permitType = AInfo["Nursery Permit Type"];
        logDebug("permitType: "+ permitType);
        var zoningValues = getZoningValuesFromGIS();
        logDebug("zoningValues: "+ zoningValues);
        if(zoningValues)
        {
            logDebug("Looking for: "+ permitType+"||"+String(zoningValues[0]).toUpperCase()+"||"+String(zoningValues[1]).toUpperCase());
            if(lookup("ZONING STOP CRITERIA",permitType+"||"+String(zoningValues[0]).toUpperCase()+"||"+String(zoningValues[1]).toUpperCase()) == "STOP")
            {
                cancel = true;
                showMessage = true;
                comment(lookup("ZONING STOP CRITERIA","MESSAGE"));
            }
        }
        if(parseInt(AInfo["Total Nursery SF"]) <= 0)
        {
            cancel = true;
            showMessage = true;
            comment("Total Square Footage cannot be 0.");
        }
        else if(parseInt(AInfo["Total Nursery SF"]) > 12000)
        {
            cancel = true;
            showMessage = true;
            comment("You exceed the maximum allowance of 12000 sq. ft.");
        }
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
function getZoningValuesFromGIS()
{
    var baseZone = "";
    var minPar = "";
    currentUserID = "ADMIN";
    var newTable = new Array();
    var today = new Date();
    var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
    var capParcelObj = cap.getParcelModel();
    if(capParcelObj)
    {
        var parcelNum = capParcelObj.getParcelNumber();
        var bizDomScriptResult = aa.bizDomain.getBizDomain("GEOGRAPHIC INFORMATION");
        if (bizDomScriptResult.getSuccess()) {
            bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
            for (var i in bizDomScriptArray) {
                var outFields = String(bizDomScriptArray[i].getDescription()).split("||")[1] + "";
                var url = String(bizDomScriptArray[i].getDescription()).split("||")[0] + "";
                var layer = bizDomScriptArray[i].getBizdomainValue() + "";
                if(layer == "Parcels")
                {
                    var finalUrl = url+"query?where=APNFULL="+ parcelNum+"&outFields="+outFields+"&f=pjson";
                    aa.print("finalUrl: "+ finalUrl);
                    var JSONObj = getServiceData(finalUrl);
                    if(typeof (JSONObj.features)!== 'undefined') {
                        var attributes = JSONObj.features[0].attributes;
                        for (var i in attributes) {
                            if (attributes[i] && attributes[i] != "" && attributes[i] != " " && attributes[i] != 0) {
                                if(i == "BASEZONE")
                                    baseZone = attributes[i];
                                if(i == "MIN_PAR")
                                    minPar = attributes[i];
                            }
                        }
                    }
                }
            }
        }
    }
    if(baseZone!="" && minPar!="")
    {
        return [baseZone, minPar];
    }
    return null;
}function getServiceData(url) {
    try {
        var resObj = null;
        var result = aa.httpClient.get(url);
        if (result.getSuccess()) {
            var response = result.getOutput();
            //logDebug("  getServiceData returned data");
            //aa.print("getServiceData:returned data: " + response);
            var resObj = JSON.parse(response);
        } else {
            aa.print("getServiceData:no data returned");
        }
        return resObj;
    } catch (err) {
        aa.print("Exception getting attribute values " + err)
    }
}