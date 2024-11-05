var newAltId = "";
try {
    if (!publicUser) {
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
}
catch (err) {
    aa.print("Error on changing sequence ASA: " + err);
    aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "Error on changing sequence ASA", err);
}
if (!publicUser) {
    var isAppeal = appMatch("Cannabis/Amendment/Appeal/NA");
    var isAssignment = appMatch("Cannabis/Amendment/Assignment/NA");
    var isNOF = appMatch("Cannabis/Amendment/Notice of Fallowing/NA");
    var isNOFAffidavit = appMatch("Cannabis/Amendment/Notice of Fallowing/Affidavit");
    var isNOFRevocation = appMatch("Cannabis/Amendment/Notice of Fallowing/Revocation");
    var isTaxAppeal = appMatch("Cannabis/Amendment/Tax Appeal/NA");

    if (!isAppeal && isAssignment && isNOF && isNOFAffidavit && isNOFRevocation && isTaxAppeal) {
        if (appTypeArray[1] == "Amendment" || appTypeArray[2] == "Application") {
            var hm = new Array();
            var conName = "";
            var contactResult = aa.people.getCapContactByCapID(capId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                        conName = getContactName(capContacts[i]);
                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", capId.getCustomID() + "");
                        addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                        addParameter(params, "$$capName$$", capName);
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                        addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                        addParameter(params, "$$FullNameBusName$$", conName);
                        addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                        addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                        if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_APPLICATION_SUBMITTED", params, null, capId);
                            hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                        }
                    }
                }
            }
        }
    }
    if (appTypeArray[2] == "Renewal") {
        // Updated email for CAMEND-478 to use Async script so Renewal in back office (clone) pulls new Alt Id
        var envParameters = aa.util.newHashMap();
        logDebug("capIdStr: " + newAltId + "");
        if (newAltId != "")
            envParameters.put("capIdStr", newAltId + "");
        else
            envParameters.put("capIdStr", capId.getCustomID() + "");
        aa.runAsyncScript("ASYNC_SEND_SUBMISSION_EMAIL", envParameters);
    }

    //CAMEND-574 & CAMEND-640
    if (appMatch("Cannabis/Amendment/Assignment/NA") || appMatch("Cannabis/*/Renewal/NA")) {
        if (AInfo["Vegetation Removal Purpose"] == "Yes") {
            addStdConditionX("Vegetation", "Tree Removal Identified");
        }
    }
}

//Populate Geographic Information
include("POPULATE_GEOGRAPHIC_INFORMATION");
//Populate Geographic Information
if (!publicUser) {
    try {
        //createRefLicProfFromLicProf();
    }
    catch (err) {
        logDebug("LP Update not necessary");
    }
}