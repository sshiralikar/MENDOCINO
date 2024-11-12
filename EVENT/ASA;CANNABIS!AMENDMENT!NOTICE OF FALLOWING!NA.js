//CAMEND-620
if (!publicUser) {
    var licCapId = getParent();
    if (parentCapId != null && parentCapId != "")
        licCapId = parentCapId;
    editAppSpecific("NOF Submitted Date", sysDateMMDDYYYY, licCapId);
}