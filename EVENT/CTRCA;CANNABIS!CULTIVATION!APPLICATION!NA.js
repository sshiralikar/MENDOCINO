// CAMEND-852
if (AInfo["Paying in Person"] == "Yes") {
    if (!feeExists("CANCULT01") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"] != "Yes") {
        addFee("CANCULT01", "CAN_CULT", "FINAL", "1", "Y");
        addStdConditionX("General", "Pay in Person");
    }
}