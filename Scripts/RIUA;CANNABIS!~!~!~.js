var newExpDate = String(expDate).split("-")[1] +"/"+String(expDate).split("-")[2]+"/"+String(expDate).split("-")[0];
editAppSpecific("New Expiration Date", newExpDate.replace(/\b0/g, ''));
var cChildren = getChildren("Cannabis/*/Application/NA", capId);
if (cChildren != null) {
    for (var c in cChildren) {
        editAppSpecific("New Expiration Date", newExpDate.replace(/\b0/g, ''), cChildren[c]);
    }
}
updateAppStatus(expStatus,"");