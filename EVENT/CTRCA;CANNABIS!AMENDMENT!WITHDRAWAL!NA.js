try
{
    if (parentCapId == "undefined" || parentCapId == null) {
        parentCapId = aa.env.getValue("ParentCapID");
    }
    var pCapId = parentCapId;
    if(parentCapId)
    {
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
                            addParameter(params, "$$date$$", sysDateMMDDYYYY);
                            addParameter(params, "$$parentAltId$$", pCapId.getCustomID() + "");
                            addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias()+"");
                            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                            addParameter(params, "$$contactName$$", conName);
                            if(hm[capContacts[i].getPeople().getEmail()+""] != 1) {
                                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_WITHDRAWAL APPROVED", params, null, capId);
                                hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                            }
                        }
                    }
                }
            }
            else
            {
                updateTask("Amendment Review","Pending","","");
                aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);
                updateAppStatus("Submitted","Updated via script",capId);
            }
        }
        //CAMEND-603
        var cChildren = getChildren("Cannabis/*/*/*", pCapId);
        if (cChildren != null) {
            for (var c in cChildren) {
                var vCapId = cChildren[c];
                var vCap = aa.cap.getCap(vCapId).getOutput();
                if(vCap.isCompleteCap() && vCapId+""!=capId+"")
                {
                    updateAppStatus("Withdrawn","Updated via script",vCapId);
                    var temp = capId;
                    capId = vCapId;
                    taskCloseAllExcept("Withdrawn","Closing via script");
                    capId = temp;
                    var capDetailObjResult = aa.cap.getCapDetail(vCapId); // Detail
                    if (capDetailObjResult.getSuccess()) {
                        capDetail = capDetailObjResult.getOutput();
                        var balanceDue = capDetail.getBalance();
                        if (balanceDue > 0) {
                            inspCancelAll();
                            var temp = capId;
                            capId = vCapId;
                            addLicenseCondition("Balance","Applied","Out of Program Balance Due","Out of Program Balance Due","Notice");
                            capId = temp;
                        }
                    }
                }
            }
        }
    }
}
catch(err)
{
    logDebug("Error: "+ err);
}