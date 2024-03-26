showDebug = false;
var cChildren = getChildren("Cannabis/Amendment/Notice of Non-Cultivation/NA", parentCapId);
var count = 0;
if (cChildren != null) {
    for (var c in cChildren) {
        var vCap = aa.cap.getCap(cChildren[c]).getOutput();
        if(vCap.isCompleteCap())
            count ++;
    }
}
if(count > 0)
{
    var reqDate = new Date(getAppSpecific("NONC Requested Expiration Date",parentCapId));
    var today = new Date(sysDateMMDDYYYY);
    if(reqDate >= today)
    {
        cancel = true;
        showMessage = true;
        comment("Only one Notice of Non-Cultivation can be submitted every five years");
    }
}
