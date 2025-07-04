if (wfStatus == "Approved") {
    // CAMEND-695
    var pCapId = getParent();
    var gParent = getParentByCapId(pCapId);
    if(gParent)
        pCapId = gParent;
    editAppSpecific("Appeal Decision Date", sysDateMMDDYYYY, pCapId);
    //CAMEND-663
    var newExpDate = getAppSpecific("New Expiration Date", pCapId);
    if (newExpDate == null || newExpDate == "") {
        updateAppStatus("Active", "", pCapId);
        moveWFTask("Permit Status", "Active", " ", "", pCapId, null, sysDateMMDDYYYY);
    }
    else {
        var hm = new Array();
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date().setHours(0, 0, 0, 0);
        var secondDate = new Date(getAppSpecific("New Expiration Date", pCapId)).setHours(0, 0, 0, 0);
        var diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        logDebug("diffDays: " + diffDays);
        if (diffDays < 90) {
            var template = "GLOBAL_ABOUT TO EXPIRE";
            updateAppStatus("Pending Non Renewal", "", pCapId);
            setLicExpirationDate(pCapId, "", newExpDate, "About to Expire");
            var pCap = aa.cap.getCap(pCapId).getOutput();
            var contactResult = aa.people.getCapContactByCapID(pCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                        var conName = getContactName(capContacts[i]);
                        var applicantEmail = capContacts[i].getPeople().getEmail() + "";
                        var params = aa.util.newHashtable();
                        // CAMEND-654
                        if (pCapId) {
                            addParameter(params, "$$parentAltId$$", pCapId.getCustomID() + "");
                        }
                        else {
                            addParameter(params, "$$parentAltId$$", capId.getCustomID() + "");
                        }
                        addParameter(params, "$$date$$", sysDateMMDDYYYY);
                        addParameter(params, "$$contactName$$", conName);
                        addParameter(params, "$$altID$$", pCapId.getCustomID() + "");
                        addParameter(params, "$$FullNameBusName$$", conName);
                        addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
                        addParameter(params, "$$expirDate$$", newExpDate);
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                        addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                        addParameter(params, "$$capName$$", pCap.getSpecialText() + "");
                        var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                        addParameter(params, "$$acaRecordUrl$$", acaUrl);
                        if (hm[applicantEmail + ""] != 1) {
                            sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", template, params, null, pCapId);
                            hm[applicantEmail + ""] = 1;
                        }
                    }
                }
            }
        }
        else {
            updateAppStatus("Active", "", pCapId);
            moveWFTask("Permit Status", "Active", " ", "", pCapId, null, sysDateMMDDYYYY);
        }
    }

    // CAMEND-661
    var licCapId = getParent();
    var newExpDate = getAppSpecific("New Expiration Date", licCapId);
    var expDate = getAppSpecific("Expiration Date", licCapId);
    var today = new Date();
    var expDateObj = new Date(expDate);
    newExpDate = new Date(newExpDate);

    if (newExpDate != null) {
        if (today > newExpDate) {
            today.setFullYear(today.getFullYear() + 5);
            var newDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
            editAppSpecific("New Expiration Date", newDate);
            editAppSpecific("New Expiration Date", newDate, licCapId);
        }
        else {
            newExpDate.setFullYear(newExpDate.getFullYear() + 5);
            var newDate = newExpDate.getMonth() + 1 + "/" + newExpDate.getDate() + "/" + newExpDate.getFullYear();
            editAppSpecific("New Expiration Date", newDate);
            editAppSpecific("New Expiration Date", newDate, licCapId);
        }
    } else {
        if (today > expDateObj) {
            today.setFullYear(today.getFullYear() + 5);
            var newDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
            editAppSpecific("New Expiration Date", newDate);
            editAppSpecific("New Expiration Date", newDate, licCapId);
        }
        else {
            expDateObj.setFullYear(expDateObj.getFullYear() + 5);
            var newDate = expDateObj.getMonth() + 1 + "/" + expDateObj.getDate() + "/" + expDateObj.getFullYear();
            editAppSpecific("New Expiration Date", newDate);
            editAppSpecific("New Expiration Date", newDate, licCapId);
        }
    }
}

if (wfStatus == "Denied") {
    // CAMEND-695
    var pCapId = getParent();
    editAppSpecific("Appeal Decision Date", sysDateMMDDYYYY, pCapId);
    // CAMEND-661
    updateAppStatus("Denied - Appeal", "Updating via Script", pCapId);
    moveWFTask("Permit Status", "Denied - Appeal", " ", "", pCapId, null, null);

    var cChildren = getChildren("Cannabis/*/*/*", pCapId);
    if (cChildren != null) {
        for (var c in cChildren) {
            var vCapId = cChildren[c];
            var vCap = aa.cap.getCap(vCapId).getOutput();
            if (vCap.isCompleteCap()) {
                var appStatus = getAppStatus(vCapId);
                if (appStatus != "Withdrawn" && appStatus != "Void" && appStatus != "Closed" && appStatus != "Open" && appStatus != "Issued" && appStatus != "Denied - Appeal") {
                    updateAppStatus("Denied", "Update via Script, parent license was Terminated", vCapId);
                    createCapComment("Update via Script, Appeal was Denied", vCapId);
                    var tmp = capId;
                    capId = vCapId;
                    taskCloseAllExcept("Denied", "Update via Script, Appeal was Denied");
                    capId = tmp;
                }
            }
        }
    }
}

if (wfStatus == "Pending Decision") {
    // CAMEND-661
    var c = new Date();
    var newDate = c.getMonth() + 1 + "/" + c.getDate() + "/" + c.getFullYear();
    editTaskDueDate("Appeal", dateAdd(newDate, 10));
}
function moveWFTask(ipTask, ipStatus, ipComment, ipNote) // Optional CapID, Process, StatusDate
{
    var vCapId = capId;
    if (arguments.length > 4 && arguments[4] != null) {
        var vCapId = arguments[4];
    }

    if (ipTask == "")
        ipTask = getCurrentTask(vCapId).getTaskDescription();

    var vUseProcess = false;
    var vProcessName = "";
    if (arguments.length > 5 && arguments[5] != null && arguments[5] != "") {
        vProcessName = arguments[5]; // subprocess
        vUseProcess = true;
    }

    var vUseStatusDate = false;
    var vStatusDate = null;
    var vToday = new Date();
    if (arguments.length > 6 && arguments[6] != null && arguments[6] != "") {
        vStatusDate = new Date(arguments[6]);
        vUseStatusDate = true;
    }

    var vWFResult = aa.workflow.getTaskItems(vCapId, ipTask, vProcessName, null, null, null);
    if (vWFResult.getSuccess())
        var vWFObj = vWFResult.getOutput();
    else {
        logMessage("**ERROR: Failed to get workflow object: " + vWFResult.getErrorMessage());
        return false;
    }

    if (!ipStatus)
        ipStatus = "NA";

    if (vWFObj.length == 0)
        return false;

    var vMoved = false;
    for (var vCounter in vWFObj) {
        var vTaskObj = vWFObj[vCounter];
        if (vTaskObj.getTaskDescription().toUpperCase().equals(ipTask.toUpperCase()) && (!vUseProcess || vTaskObj.getProcessCode().equals(vProcessName))) {
            var vTaskStatusObj = aa.workflow.getTaskStatus(vTaskObj, ipStatus).getOutput();
            if (!vTaskStatusObj)
                continue;
            if (vUseStatusDate) {
                var vTaskModel = vTaskObj.getTaskItem();
                vTaskModel.setStatusDate(vStatusDate);
                vTaskModel.setDisposition(ipStatus);
                vTaskModel.setDispositionNote(ipNote);
                vTaskModel.setDispositionComment(ipComment);
                vTaskModel.setDispositionDate(vToday);
                aa.workflow.handleDisposition(vTaskModel, vCapId);
                vMoved = true;
                logMessage("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
                logDebug("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
            }
            else {
                var vResultAction = vTaskStatusObj.resultAction;
                var vStepNumber = vTaskObj.getStepNumber();
                var vProcessID = vTaskObj.getProcessID();
                var vDispositionDate = aa.date.getCurrentDate();

                if (vUseProcess)
                    aa.workflow.handleDisposition(vCapId, vStepNumber, vProcessID, ipStatus, vDispositionDate, ipNote, ipComment, systemUserObj, vResultAction);
                else
                    aa.workflow.handleDisposition(vCapId, vStepNumber, ipStatus, vDispositionDate, ipNote, ipComment, systemUserObj, vResultAction);

                vMoved = true;
                logMessage("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
                logDebug("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
            }
        }
    }
    return vMoved;
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