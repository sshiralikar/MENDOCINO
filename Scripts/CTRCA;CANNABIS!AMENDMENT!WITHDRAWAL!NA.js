try
{
    if (parentCapId == "undefined" || parentCapId == null) {
        parentCapId = aa.env.getValue("ParentCapID");
    }
    var pCapId = parentCapId;
    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if(balanceDue <= 0)
        {
            var today = new Date();
            var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
            editAppSpecific("Withdrawal Date", newDate, parentCapId);
            taskCloseAllExcept("Approved","Closing via script");
            var temp = capId;
            capId = pCapId;
            taskCloseAllExcept("Withdrawn","Closing via script");
            capId = temp;
            updateAppStatus("Withdrawn","Updated via script",pCapId);
            updateAppStatus("Approved","Updated via script",capId);
            var conName = "";
            var hm = new Array();
            var contactResult = aa.people.getCapContactByCapID(pCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
                        conName = getContactName(capContacts[i]);
                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", pCapId.getCustomID()+"");
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                        addParameter(params, "$$contactname$$", conName);
                        if(hm[applicantEmail+""] != 1) {
                            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_WITHDRAWAL APPROVED", params, null, capId);
                            hm[applicantEmail + ""] = 1;
                        }
                    }
                }
            }
        }
        else
        {
            updateTask("Amendment Review","Pending","","");
            aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);
            updateAppStatus("Pending","Updated via script",capId);
        }
    }
}
catch(err)
{
    logDebug("Error: "+ err);
}