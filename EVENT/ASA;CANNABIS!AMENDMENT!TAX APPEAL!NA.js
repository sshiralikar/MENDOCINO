// CAMEND-852
if (!publicUser) {
    if (!feeExists("CANAPEL01", "INVOICED", "NEW")){
        addFee("CANAPEL01", "CAN_TAX", "FINAL", "1", "Y");
    } 
}

if (!feeExists("CANAPEL01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANAPEL01", "CAN_TAX", "FINAL", "1", "Y");
}