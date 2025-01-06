//CAMEND-725
if(wfStatus == "Accepted" || wfStatus == "Approved")
{
    var documentsToSend = new Array();
    var capDocResult = aa.document.getDocumentListByEntity(capId, "CAP");
    if (capDocResult.getSuccess())
    {
        if (capDocResult.getOutput().size() > 0)
        {
            for (docInx = 0; docInx < capDocResult.getOutput().size(); docInx++)
            {
                var documentObject = capDocResult.getOutput().get(docInx);
                var docCat = "" + documentObject.getDocCategory();
                if(docCat == "Cannabis Program Participants - Tax Imposed")
                {
                    var docDownload = aa.document.downloadFile2Disk(documentObject, "Cannabis", "", "", false).getOutput();
                    documentsToSend.push(docDownload);
                }
                if(docCat == "Commercial Cannabis Cultivation Business Tax Registration Form")
                {
                    var docDownload = aa.document.downloadFile2Disk(documentObject, "Cannabis", "", "", false).getOutput();
                    documentsToSend.push(docDownload);
                }
            }
        }
    }
    if(documentsToSend && documentsToSend.length >0)
    {
        var params = aa.util.newHashtable();
        addParameter(params, "$$altID$$", capId.getCustomID()+"");
        sendEmail("no-reply@mendocinocounty.org",  String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email")), "", "CAN_TTC", params, documentsToSend, capId);
    }
}
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
        envParameters.put("IssueDT", sysDateMMDDYYYY);
        envParameters.put("ExpireDT", getAppSpecific("New Expiration Date",parentCapId));
        aa.runAsyncScript("RUN_ASYNC_PERMIT_REPORT", envParameters);

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