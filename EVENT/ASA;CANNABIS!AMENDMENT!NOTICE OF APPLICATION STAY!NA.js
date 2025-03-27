if (!publicUser) {
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
    if (!feeExists("CANNAS01", "INVOICED", "NEW")) {
        addFee("CANNAS01", "CAN_NAS", "FINAL", "1", "Y");
    }
}

// CAMEND-852
removeFee("CANNAS01", "FINAL");
if (!feeExists("CANNAS01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANNAS01", "CAN_NAS", "FINAL", "1", "Y");
}