if(wfStatus == "Approved")
{
    var pCapId = getParent();
    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if(balanceDue > 0)
        {

            cancel = true;
            showMessage = true;
            comment("Cannot close the task as there is an outstanding fee on the parent record.");
        }
    }
    //CAMEND-603
    var cChildren = getChildren("Cannabis/*/*/*", pCapId);
    if (cChildren != null) {
        for (var c in cChildren) {
            var vCapId = cChildren[c];
            var vCap = aa.cap.getCap(vCapId).getOutput();
            if(vCap.isCompleteCap() && vCapId+""!=capId+"")
            {
                var capDetailObjResult = aa.cap.getCapDetail(vCapId); // Detail
                if (capDetailObjResult.getSuccess()) {
                    capDetail = capDetailObjResult.getOutput();
                    var balanceDue = capDetail.getBalance();
                    if (balanceDue > 0) {
                        inspCancelAll();
                        var temp = capId;
                        capId = vCapId;
                        taskCloseAllExcept("Withdrawn","Closing via script");
                        addLicenseCondition("Balance","Applied","Out of Program Balance Due","Out of Program Balance Due","Notice");
                        capId = temp;
                        updateAppStatus("Withdrawn","Updated via script",vCapId);
                    }
                }
            }
        }
    }
}