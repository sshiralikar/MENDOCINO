// CAMEND-707
if (wfTask == "Appeal" && wfStatus == "Approved") {
    var hm = new Array();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if (matches(capContacts[i].getPeople().getContactType(), "Applicant")) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID() + "");
                addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$parentAltId$$", newAltId + "");
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                addParameter(params, "$$deptEmail2$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail2"));
                addParameter(params, "$$financeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "financeHours"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_TAX_APPROVED", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
}