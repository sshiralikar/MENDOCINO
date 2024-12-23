var newAltId = "";
if( getAppStatus()!="Approved")
    assignCap("KMILLER");
try {
    newAltId = setRecordAltID(capId);
    if (parentCapId == "undefined" || parentCapId == null) {
        parentCapId = aa.env.getValue("ParentCapID");
        if (!parentCapId)
            parentCapId = getParent();
    }
    if (parentCapId && (appMatch("Cannabis/*/Renewal/*") || appMatch("Cannabis/Amendment/*/*")))
        updateShortNotes(getShortNotes(parentCapId));
    else
        updateShortNotes("PH3");
}
catch (err) {
    aa.print("Error on changing sequence CTRCA: " + err);
    aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "Error on changing sequence CTRCA", err);
}
if (appTypeArray[1] == "Amendment" || appTypeArray[2] == "Application" || appTypeArray[2] == "Renewal") {
    var envParameters = aa.util.newHashMap();
    if (newAltId != "")
        envParameters.put("capIdStr", newAltId + "");
    else
        envParameters.put("capIdStr", capId.getCustomID() + "");
    aa.runAsyncScript("ASYNC_SEND_SUBMISSION_EMAIL", envParameters);
}
//Populate Geographic Information
include("POPULATE_GEOGRAPHIC_INFORMATION");
//Populate Geographic Information

try {
    //createRefLicProfFromLicProf();
}
catch (err) {
    logDebug("LP Update not necessary");
}

//CAMEND-574 & CAMEND-640
if (appMatch("Cannabis/Amendment/Assignment/NA")) {
    if (AInfo["Vegetation Removal Purpose"] == "Yes") {
        addStdConditionX("Vegetation", "Tree Removal Identified");
    }
}
if (appMatch("Cannabis/*/Renewal/NA")) {
    if (AInfo["Trees Removed"] == "Yes") {
        addStdConditionX("Vegetation", "Tree Removal Identified");
    }
}
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