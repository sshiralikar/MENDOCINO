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
                if(appStatus!="Withdrawn" && appStatus!="Void" && appStatus!="Closed" && appStatus!="Open")
                {
                    var tmp = capId;
                    capId = vCapId;
                    taskCloseAllExcept("Terminated","Update via Script, parent license was Terminated");
                    capId = tmp;
                }
            }
        }
    }
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