//CAMEND-620 & CAMEND-586
if (!publicUser) {
    updateAppStatus("Amendment Review", "Approved");
    updateTask("Amendment Review", "Approved", "", "");
    aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);
    var licCapId = getParent();
    if (parentCapId != null && parentCapId != "")
        licCapId = parentCapId;
    editAppSpecific("FA Submitted Date", sysDateMMDDYYYY, licCapId);

    var capCondResult = aa.capCondition.getCapConditions(parentCapId);
    if (capCondResult.getSuccess()) {
        var coArray = capCondResult.getOutput();
        for (co in coArray) {
            if (coArray[co].getConditionDescription() == "Fallowing Affidavit Required" && coArray[co].getConditionStatus() == "Applied") {
                coArray[co].setConditionStatus("Met");
                aa.capCondition.editCapCondition(coArray[co]);
                logDebug("Fallowing Affidavit Required has been Met");
            }
        }
    }
}