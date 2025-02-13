//CAMEND-846
updateTask("Amendment Review", "Approved", "", "");
aa.workflow.adjustTask(capId, "Amendment Review", "N", "Y", null, null);
updateAppStatus("Approved","",capId);

//var licCapId = getParent();
//copyContactsFromContTypeToContType(capId, parentCapId, "Authorized Agent", "Authorized Agent");
//copyContactsFromContTypeToContType(capId, licCapId, "Property Owner", "Property Owner");
removeContacts(parentCapId);
copyContacts(capId, parentCapId);
var capCondResult = aa.capCondition.getCapConditions(capId);
if (capCondResult.getSuccess()) {
    var coArray = capCondResult.getOutput();
    for (co in coArray) {
        if (coArray[co].getConditionDescription() == "Agent Consent Form" || coArray[co].getConditionDescription() == "Property Owner Consent") {
            coArray[co].setConditionStatus("Met");
            aa.capCondition.editCapCondition(coArray[co]);
            logDebug("Agent Consent Form and/or Property Owner Consent has been Met");
        }
    }
}

function copyContactsFromContTypeToContType(srcCapId, targetCapId, pContactType, pToContactType) {
    try {
        logDebug("copyContactsFromContTypeToContType() started");
        var capPeoples = getPeople(srcCapId);
        if (capPeoples == null || capPeoples.length == 0) {
            return;
        } copyContactsFromContTypeToContType
        var targetPeople = getPeople(targetCapId);
        for (loopk in capPeoples) {
            var sourcePeopleModel = capPeoples[loopk];
            sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
            var targetPeopleModel = null;
            var doSkip = true;
            var vContactTypeTemp = sourcePeopleModel.getCapContactModel().getContactType();
            logDebug("vContactTypeTemp:" + vContactTypeTemp);
            if (pContactType != null && pContactType == vContactTypeTemp) {
                if (pToContactType != null) {
                    sourcePeopleModel.getCapContactModel().setContactType(pToContactType);
                }
                doSkip = false;
            }
            if (!doSkip) {
                if (targetPeople != null && targetPeople.length > 0) {
                    for (loop2 in targetPeople) {
                        if (isMatchPeople(sourcePeopleModel, targetPeople[loop2])) {
                            targetPeopleModel = targetPeople[loop2];
                            break;
                        }
                    }
                }
                if (targetPeopleModel != null) {
                    aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
                    if (targetPeopleModel.getCapContactModel().getPeople() != null && sourcePeopleModel.getCapContactModel().getPeople()) {
                        targetPeopleModel.getCapContactModel().getPeople().setContactAddressList(sourcePeopleModel.getCapContactModel().getPeople().getContactAddressList());
                    }
                    aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
                } else {
                    aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
                }
            }
        }
    } catch (err) {
        logDebug("**Error: copyContactsFromContTypeToContType()" + err.message);
    }
}

function getPeople(capId) {
    capPeopleArr = null;
    var s_result = aa.people.getCapContactByCapID(capId);
    if (s_result.getSuccess()) {
        capPeopleArr = s_result.getOutput();
        if (capPeopleArr != null || capPeopleArr.length > 0) {
            for (loopk in capPeopleArr) {
                var capContactScriptModel = capPeopleArr[loopk];
                var capContactModel = capContactScriptModel.getCapContactModel();
                var peopleModel = capContactScriptModel.getPeople();
                var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
                if (contactAddressrs.getSuccess()) {
                    var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                    peopleModel.setContactAddressList(contactAddressModelArr);
                }
            }
        }
        else {
            aa.print("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    }
    else {
        aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;
    }
    return capPeopleArr;
}
