showDebug = false;
var cChildren = getChildren("Cannabis/Amendment/Notice of Application Stay/NA", parentCapId);
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
    cancel = true;
    showMessage = true;
    comment("You only can submit one Notice of Application Stay once per application.");
}
