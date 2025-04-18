updateAppStatus("Submitted", "Updated through script");
if (parentCapId)
    updateAppStatus("Renewal Under Review", "Updated through script", parentCapId);
// CAMEND-805
if (AInfo["Structure Change"] == "Yes" ||
    AInfo["Permit Type Change"] == "Yes" ||
    AInfo["Trees Removed"] == "Yes") {
    taskCloseAllExcept("Modification Required", "Closing via script");
    updateAppStatus("Modification Required", "Updating via Script");
    updateAppStatus("Modification Required", "Updating via Script", parentCapId);
}
// CAMEND-852
if (AInfo["Paying in Person"] == "Yes") {
    if (!feeExists("CANREN01", "INVOICED", "NEW") && AInfo["Exempt"] != "Yes") {
        addFee("CANREN01", "CAN_REN", "FINAL", "1", "Y");
        addStdConditionX("General", "Pay in Person");
    }
}