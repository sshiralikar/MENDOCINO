// CAMEND-852
if (!feeExists("CANAPEL01") && AInfo["Paying in Person"] == "Yes") {
    addFee("CANAPEL01", "CAN_TAX", "FINAL", "1", "Y");
    addStdConditionX("General", "Pay in Person");
}