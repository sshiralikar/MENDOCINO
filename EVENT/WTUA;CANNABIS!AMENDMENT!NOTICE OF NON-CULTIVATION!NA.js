// CAMEND-563
if (wfStatus == "Approved") {
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (c in capContacts) {
            if (capContacts[c].getCapContactModel().getPrimaryFlag() == "Y") {
                logDebug("Primary Contact: " + getContactName(capContacts[c]));
                conName = getContactName(capContacts[c]);
            } else if (capContacts[i].getPeople().getContactType() == "Applicant") {
                conName = getContactName(capContacts[i]);
            }
        }
    }
    // CAMEND-868
    var taxYear = getAppSpecific("Tax Year", capId);
    // CAMEND-882
    var ttcNumber = getAppSpecific("TTC Account Number", getParent());

    var pCapId = getParent();
    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", pCapId.getCustomID() + "");
    addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
    addParameter(params, "$$date$$", sysDateMMDDYYYY);
    addParameter(params, "$$parentAltId$$", pCapId.getCustomID() + "");
    addParameter(params, "$$contactname$$", conName);
    addParameter(params, "$$taxYear$$", taxYear);
    addParameter(params, "$$TTCAccountNumber$$", ttcNumber);
    addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
    addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
    addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
    addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
    addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
    addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
    addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
    addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
    addParameter(params, "$$FullNameBusName$$", conName);
    addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
    addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
    addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
    addParameter(params, "$$Location$$", getAddressInALine());
    // CAMEND-893
    var parent = getParent();
    var parentCap = aa.cap.getCap(parent).getOutput();
    parentAppTypeResult = parentCap.getCapType();
    parentAppTypeString = parentAppTypeResult.toString();
    parentAppTypeArray = parentAppTypeString.split("/");
    if (parentAppTypeArray[1] != "Nursery") {
        // sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email"))+"", "CAN_NONC_APPROVED", params, null, capId);
        sendEmail("no-reply@mendocinocounty.org", String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email")), "", "CAN_NONC_APPROVED", params, null, capId);
    }
}

