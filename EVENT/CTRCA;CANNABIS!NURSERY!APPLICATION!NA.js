// CAMEND-852
if (AInfo["Paying in Person"] == "Yes") {
    if (!feeExists("CANNURS01") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"] != "Yes") {
        addFee("CANNURS01", "CAN_NURS", "FINAL", "1", "Y");
    addStdConditionX("General", "Pay in Person");
    }
}