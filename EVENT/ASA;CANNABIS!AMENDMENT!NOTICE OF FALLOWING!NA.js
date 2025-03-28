//CAMEND-620
removeFee("CAN_FAL01", "FINAL");
if (!publicUser) {
    var licCapId = getParent();
    if (parentCapId != null && parentCapId != "")
        licCapId = parentCapId;
    editAppSpecific("NOF Submitted Date", sysDateMMDDYYYY, licCapId);

    // CAMEND-633
    var totalSFinUse = 0;
    if (AInfo["Partial SF/Partial Nursery SF"] != null) {
        totalSFinUse = AInfo["Total SF/Total Nursery SF"] - AInfo["Partial SF/Partial Nursery SF"];
    }
    logDebug("Total SF In Use: " + totalSFinUse);
    editAppSpecific("Total SF In Use", totalSFinUse, licCapId);

    // CAMEND-852
    if (!feeExists("CAN_FAL01", "INVOICED", "NEW")){
        addFee("CAN_FAL01", "CAN_NOF", "FINAL", "1", "Y");
    } 
}

// CAMEND-852

if (!feeExists("CAN_FAL01", "INVOICED", "NEW") && AInfo["Paying in Person"] == "No") {
    addFee("CAN_FAL01", "CAN_NOF", "FINAL", "1", "Y");
}