if(wfTask == "Issuance" && (wfStatus == "Issued" || wfStatus == "Denied" || wfStatus == "Withdrawn"))
{
    var permitCapId = getParent();
    var pCapStatus = aa.cap.getCap(permitCapId).getOutput().getCapStatus();
    if(pCapStatus == "Modification Required")
    {
        var cChildren = getChildren("Cannabis/Amendment/Modification/NA", permitCapId);
        var count = 0;
        var invalidCount = 0;
        var validCount = 0;
        if (cChildren != null) {
            for (var c in cChildren) {
                var vCap = aa.cap.getCap(cChildren[c]).getOutput();
                if(vCap.isCompleteCap())
                {
                    if(vCap.getCapStatus() == "Approved" || vCap.getCapStatus() == "Denied" || vCap.getCapStatus() == "Withdrawn")
                    {
                        validCount ++;
                    }
                    else
                        invalidCount ++;
                    count ++;
                }
            }
        }
        if(count == 0)
        {
            cancel = true;
            showMessage = true;
            comment("A modification needs to be submitted since the parent license is still in the status of Modification Required.");
        }
        if(validCount == 0)
        {
            cancel = true;
            showMessage = true;
            comment("Modification record is not closed, unable to close out the record.");
        }
    }
}