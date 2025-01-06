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
    // CAMEND-527
    // if (AInfo["Permit Type Change"] == "Yes") {
    //     addStdConditionX("General", "Modification Required");

    //     var pCapId = getParent();
    //     var conName = "";
    //     var contactResult = aa.people.getCapContactByCapID(pCapId);
    //     if (contactResult.getSuccess()) {
    //         var capContacts = contactResult.getOutput();
    //         for (var i in capContacts) {
    //             conName = getContactName(capContacts[i]);
    //             var params = aa.util.newHashtable();
    //             addParameter(params, "$$altID$$", pCapId.getCustomID() + "");
    //             addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
    //             addParameter(params, "$$date$$", sysDateMMDDYYYY);
    //             addParameter(params, "$$parentAltId$$", pCapId.getCustomID()+"");
    //             addParameter(params, "$$contactname$$", conName);
    //             addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
    //             addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
    //             addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
    //             addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
    //             addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
    //             addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
    //             addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
    //             addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
    //             addParameter(params, "$$FullNameBusName$$", conName);
    //             addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
    //             addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
    //             addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
    //             addParameter(params, "$$Location$$", getAddressInALine());
    //             if(wfComment!="" && wfComment!= null)
    //                 addParameter(params, "$$wfComment$$", "Comments: "+ wfComment);
    //             else
    //                 addParameter(params, "$$wfComment$$", "");
    //             sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_MODIFICATION REQUIRED", params, null, capId);
    //         }
    //     }
    // }
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