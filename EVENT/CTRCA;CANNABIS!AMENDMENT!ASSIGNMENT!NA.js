// CAMEND-852
if (!feeExists("CANREAS01") && AInfo["Paying in Person"] == "Yes") {
    addFee("CANREAS01", "CAN_ASGN", "FINAL", "1", "Y");
    addStdConditionX("General", "Pay in Person");
}