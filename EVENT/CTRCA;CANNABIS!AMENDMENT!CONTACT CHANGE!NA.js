//CAMEND-846
updateTask("Amendment Review", "Approved", "", "");
aa.workflow.adjustTask(capId, "Amendment Review", "N", "Y", null, null);
updateAppStatus("Approved", "", capId);

//var licCapId = getParent();
var cons = aa.people.getCapContactByCapID(parentCapId).getOutput();
for (var x in cons) {
	var conSeqNum = cons[x].getPeople().getContactSeqNumber();
	if (conSeqNum && (cons[x].getPeople().getContactType() == "Property Owner" || cons[x].getPeople().getContactType() == "Authorized Agent")) {
		aa.people.removeCapContact(parentCapId, conSeqNum);
	}
}
copyContactsByType(capId, parentCapId, "Authorized Agent");
copyContactsByType(capId, parentCapId, "Property Owner");

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

function copyContactsByType(pFromCapId, pToCapId, pContactType) {
	//Copies all contacts from pFromCapId to pToCapId
	//where type == pContactType
	if (pToCapId == null)
		var vToCapId = capId;
	else
		var vToCapId = pToCapId;

	var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
	var copied = 0;
	if (capContactResult.getSuccess()) {
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts) {
			if (Contacts[yy].getCapContactModel().getContactType() == pContactType) {
				var newContact = Contacts[yy].getCapContactModel();
				newContact.setCapID(vToCapId);
				aa.people.createCapContact(newContact);
				copied++;
				logDebug("Copied contact from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
			}

		}
	}
	else {
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage());
		return false;
	}
	return copied;
}