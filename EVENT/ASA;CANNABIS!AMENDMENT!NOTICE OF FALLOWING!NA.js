//CAMEND-620
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
}