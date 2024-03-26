if(parentCapId)
{
    var vPcapStatus = aa.cap.getCap(parentCapId).getOutput().getCapStatus();
    if(matches(vPcapStatus,"Issued","Denied","Void","Withdrawn","Modification Under Review"))
    {
        cancel = true;
        showMessage = true;
        comment("There is currently a modification record under review.");
    }
}