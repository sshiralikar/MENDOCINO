// CAMEND-661
var licCapId = getParent();
if (parentCapId != null && parentCapId != "")
    licCapId = parentCapId;
logDebug("sysDateMMDDYYYY: " + sysDateMMDDYYYY);
editAppSpecific("Appeal Submitted Date", sysDateMMDDYYYY, licCapId);

// CAMEND-852
if (!feeExists("CANAPPL1") && AInfo["Paying in Person"] == "Yes") {
    addFee("CANAPPL1", "CAN_APPEAL", "FINAL", "1", "Y");
    addStdConditionX("General", "Pay in Person");
}