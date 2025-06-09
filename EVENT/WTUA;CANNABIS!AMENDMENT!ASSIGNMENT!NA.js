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
        // CAMEND-898
        var conName = "";
        var contactResult = aa.people.getCapContactByCapID(capId);
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (c in capContacts) {
                if (capContacts[c].getCapContactModel().getPrimaryFlag() == "Y") {
                    logDebug("Primary Contact: " + getContactName(capContacts[c]));
                    conName = getContactName(capContacts[c]);
                }
                if (matches(capContacts[i].getPeople().getContactType(), "Applicant")) {
                    applicantName = getContactName(capContacts[i]);
                    logDebug("Applicant: " + applicantName);
                }
                if (matches(capContacts[i].getPeople().getContactType(), "Previous Applicant")) {
                    prevApplicantName = getContactName(capContacts[i]);
                    logDebug("Previous Applicant: " + prevApplicantName);
                }
            }
        }
        var hm = new Array();
        var parent = getParent();
        var parentCap = aa.cap.getCap(parentCapId).getOutput();
        parentAppTypeResult = parentCap.getCapType();
        parentAppTypeString = parentAppTypeResult.toString();
        parentAppTypeArray = parentAppTypeString.split("/");
        var totalSF = 0;
        if (parentAppTypeArray[1] == "Cultivation") {
            totalSF = getAppSpecific("Total SF", parent);
        } else if (parentAppTypeArray[1] == "Nursery") {
            totalSF = getAppSpecific("Total Nursery SF", parent);
        }
        var permitType = AInfo["Permit Type"];
        var capStatus = aa.cap.getCap(capId).getOutput();
        var thisCapStatus = capStatus.getCapStatus();
        var params = aa.util.newHashtable();
        addParameter(params, "$$altID$$", capId.getCustomID()+"");
        addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
        addParameter(params, "$$date$$", sysDateMMDDYYYY);
        addParameter(params, "$$capStatus$$", thisCapStatus);
        addParameter(params, "$$totalSF$$", totalSF);
        addParameter(params, "$$licenseType$$", permitType);
        addParameter(params, "$$TTCAccountNumber$$", ttcNumber);
        addParameter(params, "$$contactName$$", conName);
        addParameter(params, "$$applicantName$$", applicantName);
        addParameter(params, "$$prevApplicantName$$", prevApplicantName);
        addParameter(params, "$$parentAltId$$", parent.getCustomID() + "");
        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
        addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
        addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
        addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
        addParameter(params, "$$FullNameBusName$$", conName);
        addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
        addParameter(params, "$$parentCapId$$", parent.getCustomID());
        addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
        addParameter(params, "$$Location$$", getAddressInALine());
        sendEmail("no-reply@mendocinocounty.org",  String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email")), "", "CAN_TTC_ASSIGNMENT", params, documentsToSend, capId);
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