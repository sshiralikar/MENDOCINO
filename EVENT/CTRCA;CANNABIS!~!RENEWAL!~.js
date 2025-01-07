updateAppStatus("Pending", "Updated through script");
if (parentCapId)
    updateAppStatus("Renewal Under Review", "Updated through script", parentCapId);
if (AInfo["Structure Change"] == "Yes") {
    taskCloseAllExcept("Modification Required", "Closing via script");
    updateAppStatus("Modification Required", "Updating via Script");
    updateAppStatus("Modification Required", "Updating via Script", parentCapId);
}

// CAMEND-527
if (AInfo["Permit Type Change"] == "Yes") {
    var pCapId = getParent();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(pCapId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", pCapId.getCustomID() + "");
            addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
            addParameter(params, "$$date$$", sysDateMMDDYYYY);
            addParameter(params, "$$parentAltId$$", pCapId.getCustomID() + "");
            addParameter(params, "$$contactname$$", conName);
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
            addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
            addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
            addParameter(params, "$$FullNameBusName$$", conName);
            addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
            addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$Location$$", getAddressInALine());
            if (wfComment != "" && wfComment != null)
                addParameter(params, "$$wfComment$$", "Comments: " + wfComment);
            else
                addParameter(params, "$$wfComment$$", "");
            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_MODIFICATION REQUIRED", params, null, capId);
        }
    }
}