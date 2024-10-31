// CAMEND-631
var parentTotalSF = getAppSpecific("Total SF", parentCapId);
if (!matches(parentTotalSF, "", null, undefined)) {
    editAppSpecific("Total SF/Total Nursery SF", parentTotalSF, capId);
}