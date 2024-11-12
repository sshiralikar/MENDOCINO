//CAMEND-620
var licCapId = getParent();
if(parentCapId!=null && parentCapId!="")
    licCapId = parentCapId;
logDebug("sysDateMMDDYYYY: "+ sysDateMMDDYYYY);
editAppSpecific("FA Submitted Date", sysDateMMDDYYYY, licCapId);