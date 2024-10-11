var newAltId = "";
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
    createRefLicProfFromLicProf();
}
catch (err) {
    logDebug("LP Update not necessary");
}

if (publicUser) {
    //CAMEND-574
    if (appMatch("Cannabis/Amendment/Assignment/NA")) {
        if (AInfo["Vegetation Removal Purpose"] == "Yes") {
            addStdConditionX("Vegetation", "Tree Removal Identified");
        }
    }
}