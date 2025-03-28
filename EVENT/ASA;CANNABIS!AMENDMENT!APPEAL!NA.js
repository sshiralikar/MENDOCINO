//CAMEND-661
removeFee("CANAPPL1", "FINAL");
if (!publicUser) {
    var licCapId = getParent();
    if (parentCapId != null && parentCapId != "")
        licCapId = parentCapId;
    editAppSpecific("Appeal Submitted Date", sysDateMMDDYYYY, licCapId);
    
    // CAMEND-852
    if (!feeExists("CANAPPL1", "INVOICED", "NEW")){
        addFee("CANAPPL1", "CAN_APPEAL", "FINAL", "1", "Y");
    } 
}

// CAMEND-852

if (!feeExists("CANAPPL1", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANAPPL1", "CAN_APPEAL", "FINAL", "1", "Y");
} 