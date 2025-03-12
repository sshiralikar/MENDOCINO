// CAMEND-852
if (!feeExists("CANREAS01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANREAS01", "CAN_ASGN", "FINAL", "1", "Y");
}