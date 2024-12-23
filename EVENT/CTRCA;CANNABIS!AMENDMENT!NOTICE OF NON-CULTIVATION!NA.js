try {

    updateAppStatus("Amendment Review","Approved");
    updateTask("Amendment Review","Approved","","");
    aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);

    if(parentCapId)
    {
        editAppSpecific("NONC Submitted Date", sysDateMMDDYYYY, parentCapId);
        var today = new Date();
        today.setFullYear(today.getFullYear() + 1);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("NONC Expiration Date", newDate, parentCapId);
        setLicExpirationDate(parentCapId,"",newDate);
        editAppSpecific("New Expiration Date", newDate, parentCapId);

        var today = new Date();
        today.setFullYear(today.getFullYear() + 5);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("NONC Requested Expiration Date", newDate, parentCapId);
        updateAppStatus("Notice of Non Cultivation","updated via script", parentCapId);

        var conName = "";
        var contactResult = aa.people.getCapContactByCapID(parentCapId);
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (var i in capContacts) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", parentCapId.getCustomID() + "");
                addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$parentAltId$$", parentCapId.getCustomID()+"");
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                addParameter(params, "$$FullNameBusName$$", conName);
                addParameter(params, "$$capAlias$$", aa.cap.getCap(parentCapId).getOutput().getCapType().getAlias() + "");
                addParameter(params, "$$parentCapId$$", parentCapId.getCustomID());
                addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                addParameter(params, "$$Location$$", getAddressInALine());
                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", String(lookup("TTC EMAIL", "EMAIL"))+"", "CAN_NONC_APPROVED", params, null, capId);
            }
        }
    }

} catch (err) {
    logDebug("A Javascript error has occurred within the following file: ASA:Cannabis/Amendment/Notice of Non-Cultivation/NA" + err.message);
}