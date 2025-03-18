updateAppStatus("Pending", "Updated through script");
if (parentCapId)
    updateAppStatus("Renewal Under Review", "Updated through script", parentCapId);
if (AInfo["Structure Change"] == "Yes") {
    taskCloseAllExcept("Modification Required", "Closing via script");
    updateAppStatus("Modification Required", "Updating via Script");
    updateAppStatus("Modification Required", "Updating via Script", parentCapId);
}
// CAMEND-852
if (AInfo["Paying in Person"] == "Yes") {
    if (!feeExists("CANREN01", "INVOICED", "NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes") {
        addFee("CANREN01", "CAN_REN", "FINAL", "1", "Y");
        addStdConditionX("General", "Pay in Person");
    }
}