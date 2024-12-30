// CAMEND-661
var licCapId = getParent();
if (parentCapId != null && parentCapId != "")
    licCapId = parentCapId;
logDebug("sysDateMMDDYYYY: " + sysDateMMDDYYYY);
editAppSpecific("Appeal Submitted Date", sysDateMMDDYYYY, licCapId);