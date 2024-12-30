//CAMEND-661
if (!publicUser) {
    var licCapId = getParent();
    if (parentCapId != null && parentCapId != "")
        licCapId = parentCapId;
    editAppSpecific("Appeal Submitted Date", sysDateMMDDYYYY, licCapId);
}