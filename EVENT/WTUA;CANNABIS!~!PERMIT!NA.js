if(wfTask == "Permit Status" && wfStatus == "Terminated")
{
    updateAppStatus("Terminated","");
    createCapComment("Update via Script, parent license was Terminated", capId);
    var parent = getParent();
    if(parent)
    {
        updateAppStatus("Terminated","Update via Script, parent license was Terminated", parent);
        createCapComment("Update via Script, parent license was Terminated", parent);
    }
    var cChildren = getChildren("Cannabis/*/*/*", capId);
    if (cChildren != null) {
        for (var c in cChildren) {
            var vCapId = cChildren[c];
            var vCap = aa.cap.getCap(vCapId).getOutput();
            if(vCap.isCompleteCap())
            {
                var appStatus = getAppStatus(vCapId);
                if(appStatus!="Withdrawn" && appStatus!="Void" && appStatus!="Closed" && appStatus!="Open" && appStatus!="Issued")
                {
                    updateAppStatus("Terminated","Update via Script, parent license was Terminated", vCapId);
                    createCapComment("Update via Script, parent license was Terminated", vCapId);
                    var tmp = capId;
                    capId = vCapId;
                    taskCloseAllExcept("Terminated","Update via Script, parent license was Terminated");
                    capId = tmp;
                }
            }
        }
    }
}

// CAMEND-690
if (wfStatus == "Terminated" || wfStatus == "Withdrawn" || wfStatus == "Expired" || wfStatus == "Non Renewal") {
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (c in capContacts) {
            if (capContacts[c].getCapContactModel().getPrimaryFlag() == "Y") {
                logDebug("Primary Contact: " + getContactName(capContacts[c]));
                conName = getContactName(capContacts[c]);
            }
        }
    }
    var hm = new Array();
    var parent = getParent();
    // var parentCap = aa.cap.getCap(parentCapId).getOutput();
    var capStatus = aa.cap.getCap(capId).getOutput();
    var thisCapStatus = capStatus.getCapStatus();
    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", capId.getCustomID() + "");
    addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
    addParameter(params, "$$date$$", sysDateMMDDYYYY);
    addParameter(params, "$$capStatus$$", thisCapStatus);
    addParameter(params, "$$contactName$$", conName);
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
    // addParameter(params, "$$parentCapId$$", parent.getCustomID());
    addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
    addParameter(params, "$$Location$$", getAddressInALine());
    sendEmail("no-reply@mendocinocounty.org", String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email")), "", "CAN_TTC_LICENSE_STATUS", params, null, capId);
}

function createCapComment(vComment)  //optional CapId
{
    var vCapId = capId;
    if (arguments.length == 2)
        vCapId = arguments[1];
    var comDate = aa.date.getCurrentDate();
    var capCommentScriptModel= aa.cap.createCapCommentScriptModel();
    capCommentScriptModel.setCapIDModel(vCapId);
    capCommentScriptModel.setCommentType("APP LEVEL COMMENT");
    capCommentScriptModel.setSynopsis("");
    capCommentScriptModel.setText(vComment);
    capCommentScriptModel.setAuditUser(currentUserID);
    capCommentScriptModel.setAuditStatus("A");
    capCommentScriptModel.setAuditDate(comDate);
    var capCommentModel=capCommentScriptModel.getCapCommentModel();
    aa.cap.createCapComment(capCommentModel);
    logDebug("Comment Added");
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