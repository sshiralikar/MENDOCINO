// CAMEND-852
if (!feeExists("CANAPEL01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANAPEL01", "CAN_TAX", "FINAL", "1", "Y");
}