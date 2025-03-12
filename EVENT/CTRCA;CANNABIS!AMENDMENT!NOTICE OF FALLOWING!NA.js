//CAMEND-620
var licCapId = getParent();
if (parentCapId != null && parentCapId != "")
    licCapId = parentCapId;
logDebug("sysDateMMDDYYYY: " + sysDateMMDDYYYY);
editAppSpecific("NOF Submitted Date", sysDateMMDDYYYY, licCapId);

// CAMEND-633
var totalSFinUse = 0;
if (AInfo["Partial SF/Partial Nursery SF"] != null) {
    totalSFinUse = AInfo["Total SF/Total Nursery SF"] - AInfo["Partial SF/Partial Nursery SF"];
}
logDebug("Total SF In Use: " + totalSFinUse);
editAppSpecific("Total SF In Use", totalSFinUse, licCapId);

// CAMEND-852
if (!feeExists("CAN_FAL01") && AInfo["Paying in Person"] == "Yes") {
    addFee("CAN_FAL01", "CAN_NOF", "FINAL", "1", "Y");
    addStdConditionX("General", "Pay in Person");
}