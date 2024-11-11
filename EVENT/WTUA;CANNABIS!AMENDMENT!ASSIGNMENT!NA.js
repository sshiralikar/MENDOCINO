if(wfStatus == "Approved")
{
    var parentCapId = getParent();
    if(parentCapId)
    {
        removeContacts(parentCapId);
        copyContacts(capId,parentCapId);
        /*var cons = aa.people.getCapContactByCapID(parentCapId).getOutput();
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "Applicant") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                p.setContactType("Previous Applicant");
                conToChange.setPeople(p);
                aa.people.editCapContact(conToChange);
                logDebug("Contact type successfully switched to License Holder");
            }
        }
        copyContactsByType(capId, parentCapId, "Applicant");*/

        var envParameters = aa.util.newHashMap();
        envParameters.put("RecordID", parentCapId.getCustomID()+"");
        envParameters.put("capId", capId.getCustomID()+"");
        aa.runAsyncScript("RUN_ASYNC_SEND_ISSUANCE_EMAIL", envParameters);
    }
}
function removeContacts(recordCapId)
{
    var cons = aa.people.getCapContactByCapID(recordCapId).getOutput();
    for (x in cons)
    {
        conSeqNum = cons[x].getPeople().getContactSeqNumber();
        if (conSeqNum)
        {
            aa.people.removeCapContact(recordCapId, conSeqNum);
        }
    }
}