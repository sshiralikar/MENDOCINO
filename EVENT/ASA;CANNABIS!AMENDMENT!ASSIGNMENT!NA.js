// CAMEND-852
removeFee("CANREAS01", "FINAL");
if (!publicUser) {
    if (!feeExists("CANREAS01", "INVOICED", "NEW")){
        addFee("CANREAS01", "CAN_ASGN", "FINAL", "1", "Y");
    } 
}

if (!feeExists("CANREAS01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANREAS01", "CAN_ASGN", "FINAL", "1", "Y");
}