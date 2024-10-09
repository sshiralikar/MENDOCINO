// CAMEND-563
if (wfStatus == "Approved") {
    var pCapId = getParent();
    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if (balanceDue <= 0) {
            // var today = new Date();
            // var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
            // editAppSpecific("Withdrawal Date", newDate, pCapId);
            // //taskCloseAllExcept("Approved","Closing via script");
            // var temp = capId;
            // capId = pCapId;
            // taskCloseAllExcept("Withdrawn","Closing via script");
            // capId = temp;
            // updateAppStatus("Withdrawn","Updated via script",pCapId);
            // updateAppStatus("Approved","Updated via script",capId);

            var conName = "";
            var contactResult = aa.people.getCapContactByCapID(pCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    // if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
                    if (capContacts[i].getPeople().getContactType() != null) {
                        conName = getContactName(capContacts[i]);
                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", capId.getCustomID() + "");
                        addParameter(params, "$$year$$", new Date().getFullYear());
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                        addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                        addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                        addParameter(params, "$$FullNameBusName$$", conName);
                        addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
                        addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
                        addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                        addParameter(params, "$$Location$$", vAddress);
                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_NOF_APPROVED", params, null, capId);
                    }
                }
            }
        }
    }
}