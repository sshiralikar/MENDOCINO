if(wfStatus == "Approved")
{
    var pCapId = getParent();
    updateAppStatus("Active","",pCapId);
    //updateTask("Permit Status","Active","","",pCapId);
    moveWFTask("Permit Status","Active", " ", "", pCapId, null, sysDateMMDDYYYY);
    editAppSpecific("ROF Date", sysDateMMDDYYYY, pCapId);
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
            addParameter(params, "$$parentAltId$$", pCapId.getCustomID()+"");
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
            addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
            addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$Location$$", getAddressInALine());
            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ROF_APPROVED", params, null, capId);
        }
    }
}
if(wfStatus == "Denied")
{
    var pCapId = getParent();
    updateAppStatus("Active","",pCapId);
    //updateTask("Permit Status","Active","","",pCapId);
    moveWFTask("Permit Status","Active", " ", "", pCapId, null, sysDateMMDDYYYY);
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(pCapId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", capId.getCustomID() + "");
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
            addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
            addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$Location$$", getAddressInALine());
            if (wfComment != "" && wfComment != null)
                addParameter(params, "$$wfComment$$", "Comments: " + wfComment);
            else
                addParameter(params, "$$wfComment$$", "");
            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ROF_DENIED", params, null, capId);
        }
    }
}
function getAddressInALine() {

    var capAddrResult = aa.address.getAddressByCapId(capId);
    var addressToUse = null;
    var strAddress = "";

    if (capAddrResult.getSuccess()) {
        var addresses = capAddrResult.getOutput();
        if (addresses) {
            for (zz in addresses) {
                capAddress = addresses[zz];
                if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y"))
                    addressToUse = capAddress;
            }
            if (addressToUse == null)
                addressToUse = addresses[0];

            if (addressToUse) {
                strAddress = addressToUse.getHouseNumberStart();
                var addPart = addressToUse.getStreetDirection();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getStreetName();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getStreetSuffix();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getCity();
                if (addPart && addPart != "")
                    strAddress += " " + addPart + ",";
                var addPart = addressToUse.getState();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getZip();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                return strAddress
            }
        }
    }
    return null;
}
function moveWFTask(ipTask,ipStatus,ipComment,ipNote) // Optional CapID, Process, StatusDate
{
    var vCapId = capId;
    if (arguments.length > 4 && arguments[4] != null)
    {
        var vCapId = arguments[4];
    }

    if (ipTask == "")
        ipTask = getCurrentTask(vCapId).getTaskDescription();

    var vUseProcess = false;
    var vProcessName = "";
    if (arguments.length > 5 && arguments[5] != null && arguments[5] != "")
    {
        vProcessName = arguments[5]; // subprocess
        vUseProcess = true;
    }

    var vUseStatusDate = false;
    var vStatusDate = null;
    var vToday = new Date();
    if (arguments.length > 6 && arguments[6] != null && arguments[6] != "")
    {
        vStatusDate = new Date(arguments[6]);
        vUseStatusDate = true;
    }

    var vWFResult = aa.workflow.getTaskItems(vCapId,ipTask,vProcessName,null,null,null);
    if (vWFResult.getSuccess())
        var vWFObj = vWFResult.getOutput();
    else
    {
        logMessage("**ERROR: Failed to get workflow object: " + vWFResult.getErrorMessage());
        return false;
    }

    if (!ipStatus)
        ipStatus = "NA";

    if (vWFObj.length == 0)
        return false;

    var vMoved = false;
    for (var vCounter in vWFObj)
    {
        var vTaskObj = vWFObj[vCounter];
        if (vTaskObj.getTaskDescription().toUpperCase().equals(ipTask.toUpperCase())  && (!vUseProcess || vTaskObj.getProcessCode().equals(vProcessName)))
        {
            var vTaskStatusObj = aa.workflow.getTaskStatus(vTaskObj,ipStatus).getOutput();
            if (!vTaskStatusObj)
                continue;
            if (vUseStatusDate)
            {
                var vTaskModel = vTaskObj.getTaskItem();
                vTaskModel.setStatusDate(vStatusDate);
                vTaskModel.setDisposition(ipStatus);
                vTaskModel.setDispositionNote(ipNote);
                vTaskModel.setDispositionComment(ipComment);
                vTaskModel.setDispositionDate(vToday);
                aa.workflow.handleDisposition(vTaskModel,vCapId);
                vMoved = true;
                logMessage("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
                logDebug("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
            }
            else
            {
                var vResultAction = vTaskStatusObj.resultAction;
                var vStepNumber = vTaskObj.getStepNumber();
                var vProcessID = vTaskObj.getProcessID();
                var vDispositionDate = aa.date.getCurrentDate();

                if (vUseProcess)
                    aa.workflow.handleDisposition(vCapId,vStepNumber,vProcessID,ipStatus,vDispositionDate,ipNote,ipComment,systemUserObj,vResultAction);
                else
                    aa.workflow.handleDisposition(vCapId,vStepNumber,ipStatus,vDispositionDate,ipNote,ipComment,systemUserObj,vResultAction);

                vMoved = true;
                logMessage("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
                logDebug("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
            }
        }
    }
    return vMoved;
}