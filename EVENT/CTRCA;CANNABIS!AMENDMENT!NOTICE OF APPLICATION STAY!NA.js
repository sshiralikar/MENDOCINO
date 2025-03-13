if (AInfo["Paying in Person"] == "No") {
    updateAppStatus("Amendment Review", "Approved");
    updateTask("Amendment Review", "Approved", "", "");
    aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);
    if (parentCapId) {
        editAppSpecific("NOAS Submitted Date", sysDateMMDDYYYY, parentCapId);
        var today = new Date();
        today.setFullYear(today.getFullYear() + 1);
        var newDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
        editAppSpecific("NOAS Expiration Date", newDate, parentCapId);
        updateAppStatus("Notice of Application Stay", "updated via script", parentCapId);
    }
}

// CAMEND-852
if (!feeExists("CANNAS01") && AInfo["Paying in Person"] == "Yes") {
    addFee("CANNAS01", "CAN_NAS", "FINAL", "1", "Y");
    addStdConditionX("General", "Pay in Person");
}
