//CAMEND-846
updateTask("Amendment Review", "Approved", "", "");
aa.workflow.adjustTask(capId, "Amendment Review", "N", "Y", null, null);
updateAppStatus("Approved","",capId);

var licCapId = getParent();
copyContactsByType(capId, licCapId, "Authorized Agent")
copyContactsByType(capId, licCapId, "Property Owner")

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

function copyContactsByType(srcCapId, targetCapId, ContactTypeArr) {
	//1. Get people with source CAPID.
	var capPeoples = getPeople3_0(srcCapId);
	if (capPeoples == null || capPeoples.length == 0) {
		return;
	}
	//2. Get people with target CAPID.
	var targetPeople = getPeople3_0(targetCapId);
	//3. Check to see which people is matched in both source and target.
	for (loopk in capPeoples) {
		sourcePeopleModel = capPeoples[loopk];
		//Check if contact type should be ignored
		doCopy = false;
		for (kk in ContactTypeArr) {
			if (ContactTypeArr[kk] == sourcePeopleModel.getCapContactModel().getContactType())
				doCopy = true;
		}
		if (doCopy) {
			//3.1 Set target CAPID to source people.
			sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
			targetPeopleModel = null;
			//3.2 Check to see if sourcePeople exist.
			if (targetPeople != null && targetPeople.length > 0) {
				for (loop2 in targetPeople) {
					if (isMatchPeople3_0(sourcePeopleModel, targetPeople[loop2])) {
						targetPeopleModel = targetPeople[loop2];
						break;
					}
				}
			}
			//3.3 It is a matched people model.
			if (targetPeopleModel != null) {
				//3.3.1 Copy information from source to target.
				aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
				//3.3.2 Copy contact address from source to target.
				if (targetPeopleModel.getCapContactModel().getPeople() != null && sourcePeopleModel.getCapContactModel().getPeople()) {
					targetPeopleModel.getCapContactModel().getPeople().setContactAddressList(sourcePeopleModel.getCapContactModel().getPeople().getContactAddressList());
				}
				//3.3.3 Edit People with source People information.
				aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
			}
			//3.4 It is new People model.
			else {
				//3.4.1 Create new people.
				aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
			}
		}
	}
}

function getPeople3_0(capId) {
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
        } else {
            logDebug("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    } else {
        logDebug("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;
    }
    return capPeopleArr;
}