//Add Fee
if(!feeExists("CANCULT01","INVOICED","NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes" && AInfo["Modification Approved for Conversion"]!="Yes")
    addFee("CANCULT01", "CAN_CULT", "FINAL", "1", "Y");
//Add Fee



