//Add Fee
// CAMEND-852
if (!publicUser) {
    if (!feeExists("CANCULT01", "INVOICED", "NEW") && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"] != "Yes") {
        addFee("CANCULT01", "CAN_CULT", "FINAL", "1", "Y");
    }
}
removeFee("CANCULT01", "FINAL");
if (AInfo["Paying in Person"] == "No") {
    if (!feeExists("CANCULT01", "INVOICED", "NEW") && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"] != "Yes") {
        addFee("CANCULT01", "CAN_CULT", "FINAL", "1", "Y");
    }
}
//Add Fee



