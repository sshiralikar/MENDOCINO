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
}