//Add Fee
// CAMEND-852
if (!publicUser) {
    if (!feeExists("CANNURS01", "INVOICED", "NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"] != "Yes") {
        addFee("CANNURS01", "CAN_NURS", "FINAL", "1", "Y");
    }
}
if (AInfo["Paying in Person"] == "No") {
    if (!feeExists("CANNURS01", "INVOICED", "NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"] != "Yes") {
        addFee("CANNURS01", "CAN_NURS", "FINAL", "1", "Y");
    }
}
//Add Fee