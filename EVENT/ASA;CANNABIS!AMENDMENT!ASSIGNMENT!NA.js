// CAMEND-852
if (!publicUser) {
    if (!feeExists("CANREAS01", "INVOICED", "NEW")){
        addFee("CANREAS01", "CAN_ASGN", "FINAL", "1", "Y");
    } 
}
removeFee("CANREAS01", "FINAL");
if (!feeExists("CANREAS01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANREAS01", "CAN_ASGN", "FINAL", "1", "Y");
}