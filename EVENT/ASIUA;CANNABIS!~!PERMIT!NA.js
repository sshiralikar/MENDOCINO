setLicExpirationDate(capId,"",AInfo["New Expiration Date"]);
var cChildren = getChildren("Cannabis/*/Application/NA", capId);
if (cChildren != null) {
    for (var c in cChildren) {
        editAppSpecific("New Expiration Date", AInfo["New Expiration Date"], cChildren[c]);
    }
}