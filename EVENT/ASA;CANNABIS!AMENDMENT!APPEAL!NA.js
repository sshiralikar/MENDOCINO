//CAMEND-661
if (!publicUser) {
    var licCapId = getParent();
    if (parentCapId != null && parentCapId != "")
        licCapId = parentCapId;
    editAppSpecific("Appeal Submitted Date", sysDateMMDDYYYY, licCapId);

    
}

// CAMEND-852
if (!feeExists("CANAPPL1", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CANAPPL1", "CAN_APPEAL", "FINAL", "1", "Y");
} else if (!feeExists("CANAPPL1") && AInfo["Paying in Person"] == "Yes") {
    addFee("CANAPPL1", "CAN_APPEAL", "FINAL", "1", "N");
    addStdConditionX("General", "Pay in Person");
}