//Add Fee
if(!feeExists("CANNURS01","INVOICED","NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes")
    addFee("CANNURS01", "CAN_NURS", "FINAL", "1", "Y");
//Add Fee