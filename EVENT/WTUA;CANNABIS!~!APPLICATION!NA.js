//CAMEND-305
if(wfStatus == "Void" || wfStatus == "Withdrawn")
{
    taskCloseAllExcept(wfStatus,"Closing via script");
    updateAppStatus(wfStatus,"Updating via Script");
}
//CAMEND-305
if(wfTask == "Issuance" && wfStatus == "Issued")
{
    var hm = new Array();
    var myId = "";
    var licCapId = createRecord("Cannabis",appTypeArray[1],"Permit",appTypeArray[3],capName);
    aa.cap.createAppHierarchy(licCapId, capId);
    copyASIFields(capId,licCapId);
    copyASITables(capId, licCapId);
    copyLicensedProf(capId, licCapId);
    copyConditions(capId, licCapId);
    //copyDocuments(capId, licCapId);
    try
    {
        var newAltId = String(capId.getCustomID()).split("-APP")[0];
        var updateResult = aa.cap.updateCapAltID(licCapId, newAltId);
        if(!updateResult.getSuccess()){
            aa.print("Error updating Alt Id: " + newAltId + ":: " +updateResult.getErrorMessage());
        }else{
            myId = newAltId;
            aa.print("Compliance Method record ID updated to : " + newAltId);
        }
        updateShortNotes("PH3",licCapId);
    }
    catch (err)
    {
        aa.print("Error on changing sequence ASA: "+ err);
        aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "Error on changing sequence CTRCA", err);
    }
    //CAMEND-635
    try {
        createRefLicProfFromLicProfX();
    }
    catch (err) {
        logDebug("LP Update not necessary: "+ err);
    }
    var c = new Date();
    c.setFullYear(c.getFullYear() + 1);
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();

    setLicExpirationDate(licCapId,"",newDate);

    editAppSpecific("Expiration Date", newDate);
    editAppSpecific("New Expiration Date", newDate);
    editAppSpecific("Issued Date", sysDateMMDDYYYY);
    editAppSpecific("Expiration Date", newDate, licCapId);
    editAppSpecific("New Expiration Date", newDate,licCapId);
    editAppSpecific("Issued Date", sysDateMMDDYYYY,licCapId);

    updateAppStatus("Active","Updating via Script",licCapId);
    updateAppStatus("Issued","Updating via Script",capId);

    var hm = new Array();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent","Property Owner"))
            {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID()+"");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias()+"");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$parentAltId$$", newAltId+"");
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                addParameter(params, "$$deptEmail2$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail2"));
                addParameter(params, "$$financeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","financeHours"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ISSUANCE", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
/*}
//CAMEND-194, 223
if(wfTask == "Issuance" && wfStatus == "Issued")
{*/
    //var licCapId = getParent();
    var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if(balanceDue <= 0)
        {
            //licCapId = aa.cap.getCapID(licCapId.ID1,licCapId.ID2,licCapId.ID3).getOutput();
            var envParameters = aa.util.newHashMap();
            envParameters.put("RecordID", licCapId.getCustomID()+"");
            envParameters.put("IssueDT", sysDateMMDDYYYY);
            envParameters.put("ExpireDT", AInfo["New Expiration Date"]);
            aa.runAsyncScript("RUN_ASYNC_PERMIT_REPORT", envParameters);

            var envParameters = aa.util.newHashMap();
            envParameters.put("RecordID", licCapId.getCustomID()+"");
            envParameters.put("capId", capId.getCustomID()+"");
            aa.runAsyncScript("RUN_ASYNC_SEND_ISSUANCE_EMAIL", envParameters);

            /*var VRFiles = [];
            var rParams = aa.util.newHashMap();

            rParams.put("RecordID",licCapId.getCustomID()+"");
            logDebug("Report parameter RecordID set to: "+ licCapId.getCustomID()+"");
            var report = aa.reportManager.getReportInfoModelByName("Cannabis Approval Letter");
            report = report.getOutput();
            report.setModule("Cannabis");
            report.setCapId(licCapId.getID1() + "-" + licCapId.getID2() + "-" + licCapId.getID3());
            report.setReportParameters(rParams);
            report.getEDMSEntityIdModel().setAltId(licCapId.getCustomID());


            var permit = aa.reportManager.hasPermission("Cannabis Approval Letter",currentUserID);

            if (permit.getOutput().booleanValue()) {
                logDebug("User has Permission to run the report....");
                var reportResult = aa.reportManager.getReportResult(report);
                if(reportResult) {
                    reportOutput = reportResult.getOutput();
                    var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                    logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                    reportFile=reportFile.getOutput();
                    VRFiles.push(reportFile);
                }
            }

            var conName = "";
            var contactResult = aa.people.getCapContactByCapID(capId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent","Property Owner"))
                    {
                        conName = getContactName(capContacts[i]);

                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", capId.getCustomID()+"");
                        addParameter(params, "$$parentAltId$$", licCapId.getCustomID()+"");
                        addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$capTypeAliasApplication$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$capName$$", capName);
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                        addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                        addParameter(params, "$$deptEmail2$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail2"));
                        addParameter(params, "$$financeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","financeHours"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                        addParameter(params, "$$contactName$$", conName);
                        addParameter(params, "$$date$$", sysDateMMDDYYYY);
                        addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                        addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                        addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                        if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ISSUANCE", params, VRFiles, capId);
                            hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                        }
                    }
                }
            }*/
        }
    }
    //CAMEND-719
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
    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", capId.getCustomID()+"");
    sendEmail("no-reply@mendocinocounty.org",  String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email")), "", "CAN_TTC", params, documentsToSend, capId);
}
//CAMEND-194,223

if(wfStatus == "Deficiency")
{
    editPriority("Low");
    //if(wfTask == "Supervisor Review"){
    var c = new Date();
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();
    editTaskDueDate(wfTask, dateAdd(newDate, 15));
    // }

}
//CAMEND-303
if(wfTask == "Supervisor Review" && wfStatus == "Denied")
{
    /*var date = getCapFileDate(capId);
    if(isDateInRangeToOct(date))
    {
        var VRFiles = null;
        var rParams = aa.util.newHashMap();
        rParams.put("RecordID", capId.getCustomID()+"");
        logDebug("Report parameter RecordID set to: "+ capId.getCustomID()+"");
        var report = aa.reportManager.getReportInfoModelByName("Cannabis Deficiency Denial Pending Letter");
        report = report.getOutput();
        report.setModule("Cannabis");
        report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
        report.setReportParameters(rParams);
        report.getEDMSEntityIdModel().setAltId(capId.getCustomID());


        var permit = aa.reportManager.hasPermission("Cannabis Deficiency Denial Pending Letter",currentUserID);

        if (permit.getOutput().booleanValue()) {
            logDebug("User has Permission to run the report....");
            var reportResult = aa.reportManager.getReportResult(report);
            if(reportResult) {
                reportOutput = reportResult.getOutput();
                var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                reportFile=reportFile.getOutput();
                VRFiles.push(reportFile);
            }
        }

        var hm = new Array();
        var conName = "";
        var contactResult = aa.people.getCapContactByCapID(capId);
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (var i in capContacts) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID()+"");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {

                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_DEFICIENCY", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
    else
    {*/
        var VRFiles = [];
        var rParams = aa.util.newHashMap();
        rParams.put("RecordID", capId.getCustomID()+"");
        logDebug("Report parameter RecordID set to: "+ capId.getCustomID()+"");
        var report = aa.reportManager.getReportInfoModelByName("Cannabis Denial Decision Letter");
        report = report.getOutput();
        report.setModule("Cannabis");
        report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
        report.setReportParameters(rParams);
        report.getEDMSEntityIdModel().setAltId(capId.getCustomID());


        var permit = aa.reportManager.hasPermission("Cannabis Denial Decision Letter",currentUserID);

        if (permit.getOutput().booleanValue()) {
            logDebug("User has Permission to run the report....");
            var reportResult = aa.reportManager.getReportResult(report);
            if(reportResult) {
                reportOutput = reportResult.getOutput();
                var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                reportFile=reportFile.getOutput();
                VRFiles.push(reportFile);
            }
        }

        var hm = new Array();
        var conName = "";
        var contactResult = aa.people.getCapContactByCapID(capId);
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (var i in capContacts) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID()+"");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_DENIED", params, VRFiles, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    //}
}

if(wfStatus == "Appeal Denied")
{
    var hm = new Array();
    updateTask("Issuance","Denied","","");
    aa.workflow.adjustTask(capId, "Issuance", "N", "Y", null, null);
    updateAppStatus("Denied","Updated via script");
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", capId.getCustomID()+"");
            addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
            addParameter(params, "$$capName$$", capName);
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
            addParameter(params, "$$contactname$$", conName);
            addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
            addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
            if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_DENIED", params, null, capId);
                hm[capContacts[i].getPeople().getEmail() + ""] = 1;
            }
        }
    }
}

//CAMEND-392
if(wfTask == "Supervisor Review" && wfStatus == "Deficiency")
{
    //var date = getCapFileDate(capId);
    //if(isDateInRangeToOct(date) || isDateInRangeToFeb(date) || isDateInRangeCurr(date))
    //{
        var rFiles = [];
        var hm = new Array();
        var conName = "";
        var rParams = aa.util.newHashMap();
        rParams.put("RecordID", capId.getCustomID()+"");
        logDebug("Report parameter RecordID set to: "+ capId.getCustomID()+"");
        var report = aa.reportManager.getReportInfoModelByName("Cannabis Deficiency Denial Pending Letter");
        report = report.getOutput();
        report.setModule("Cannabis");
        report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
        report.setReportParameters(rParams);
        report.getEDMSEntityIdModel().setAltId(capId.getCustomID());


        var permit = aa.reportManager.hasPermission("Cannabis Deficiency Denial Pending Letter",currentUserID);

        if (permit.getOutput().booleanValue()) {
            logDebug("User has Permission to run the report....");
            var reportResult = aa.reportManager.getReportResult(report);
            if(reportResult) {
                reportOutput = reportResult.getOutput();
                var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                logDebug("Report Run Successfull:"+ reportFile.getSuccess());
                reportFile=reportFile.getOutput();
                rFiles.push(reportFile);
            }
        }
        var contactResult = aa.people.getCapContactByCapID(capId);
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (var i in capContacts) {
                if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent","Property Owner"))
                {
                    conName = getContactName(capContacts[i]);
                    var params = aa.util.newHashtable();
                    addParameter(params, "$$altID$$", capId.getCustomID()+"");
                    addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                    addParameter(params, "$$capName$$", capName);
                    addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                    addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                    addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                    addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                    addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                    addParameter(params, "$$contactname$$", conName);
                    addParameter(params, "$$date$$", sysDateMMDDYYYY);
                    addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                    addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                    addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                    if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {

                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_DEFICIENCY", params, rFiles, capId);
                        hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                    }
                }
            }
        }
    //}
}

// CAMEND-692
// if (wfStatus == "Approved") {
//     var parent = getParent();
//     var parentCap = aa.cap.getCap(parentCapId).getOutput();
//     parentAppTypeResult = parentCap.getCapType();
//     parentAppTypeString = parentAppTypeResult.toString();
//     parentAppTypeArray = parentAppTypeString.split("/");
//     var totalSF = 0;
//     if (parentAppTypeArray[1] == "Cultivation") {
//         totalSF = getAppSpecific("Total SF", parent);
//     } else if (parentAppTypeArray[1] == "Nursery") {
//         totalSF = getAppSpecific("Total Nursery SF", parent);
//     }
//     var capStatus = aa.cap.getCap(capId).getOutput();
//     var thisCapStatus = capStatus.getCapStatus();
//     var conName = "";
//     var contactResult = aa.people.getCapContactByCapID(parent);
//     if (contactResult.getSuccess()) {
//         var capContacts = contactResult.getOutput();
//         for (var i in capContacts) {
//             conName = getContactName(capContacts[i]);
//             var params = aa.util.newHashtable();
//             addParameter(params, "$$altID$$", parent.getCustomID() + "");
//             addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
//             addParameter(params, "$$date$$", sysDateMMDDYYYY);
//             addParameter(params, "$$capStatus$$", thisCapStatus);
//             addParameter(params, "$$totalSF$$", totalSF);
//             addParameter(params, "$$contactname$$", conName);
//             addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
//             addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
//             addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
//             addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
//             addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
//             addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
//             addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
//             addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
//             addParameter(params, "$$FullNameBusName$$", conName);
//             addParameter(params, "$$capAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
//             addParameter(params, "$$parentCapId$$", parent.getCustomID());
//             addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
//             addParameter(params, "$$Location$$", getAddressInALine());
//             sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email"))+"", "CAN_TTC_APPLICATION_STATUS", params, null, capId);
//         }
//     }
// }
if (wfStatus == "Approved") {
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
    var capStatus = aa.cap.getCap(capId).getOutput();
    var thisCapStatus = capStatus.getCapStatus();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(parentCapId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", parent.getCustomID() + "");
            addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
            addParameter(params, "$$date$$", sysDateMMDDYYYY);
            addParameter(params, "$$capStatus$$", thisCapStatus);
            addParameter(params, "$$totalSF$$", totalSF);
            addParameter(params, "$$contactname$$", conName);
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
            if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email"))+"", "CAN_TTC_APPLICATION_STATUS", params, null, capId);
                hm[capContacts[i].getPeople().getEmail() + ""] = 1;
            }
        }
    }
}

function createRefLicProfFromLicProfX()
{
    //
    // Get the lic prof from the app
    //
    capLicenseResult = aa.licenseScript.getLicenseProf(capId);
    if (capLicenseResult.getSuccess())
    { capLicenseArr = capLicenseResult.getOutput();  }
    else
    { logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

    if (!capLicenseArr.length)
    { logDebug("WARNING: no license professional available on the application:"); return false; }

    licProfScriptModel = capLicenseArr[0];
    rlpId = licProfScriptModel.getLicenseNbr();
    //
    // Now see if a reference version exists
    //
    var updating = false;

    var newLic = getRefLicenseProf(rlpId)

    if (newLic)
    {
        updating = true;
        logDebug("Updating existing Ref Lic Prof : " + rlpId);
    }
    else
        var newLic = aa.licenseScript.createLicenseScriptModel();

    //
    // Now add / update the ref lic prof
    //
    newLic.setStateLicense(rlpId);
    newLic.setAddress1(licProfScriptModel.getAddress1());
    newLic.setAddress2(licProfScriptModel.getAddress2());
    newLic.setAddress3(licProfScriptModel.getAddress3());
    newLic.setAgencyCode(licProfScriptModel.getAgencyCode());
    newLic.setAuditDate(licProfScriptModel.getAuditDate());
    newLic.setAuditID(licProfScriptModel.getAuditID());
    newLic.setAuditStatus(licProfScriptModel.getAuditStatus());
    newLic.setBusinessLicense(licProfScriptModel.getBusinessLicense());
    newLic.setBusinessName(licProfScriptModel.getBusinessName());
    newLic.setCity(licProfScriptModel.getCity());
    newLic.setCityCode(licProfScriptModel.getCityCode());
    newLic.setContactFirstName(licProfScriptModel.getContactFirstName());
    newLic.setContactLastName(licProfScriptModel.getContactLastName());
    newLic.setContactMiddleName(licProfScriptModel.getContactMiddleName());
    newLic.setContryCode(licProfScriptModel.getCountryCode());
    newLic.setCountry(licProfScriptModel.getCountry());
    newLic.setEinSs(licProfScriptModel.getEinSs());
    newLic.setEMailAddress(licProfScriptModel.getEmail());
    newLic.setFax(licProfScriptModel.getFax());
    newLic.setLicenseType(licProfScriptModel.getLicenseType());
    newLic.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
    newLic.setPhone1(licProfScriptModel.getPhone1());
    newLic.setPhone2(licProfScriptModel.getPhone2());
    newLic.setSelfIns(licProfScriptModel.getSelfIns());
    newLic.setState(licProfScriptModel.getState());
    newLic.setLicState(licProfScriptModel.getState());
    newLic.setSuffixName(licProfScriptModel.getSuffixName());
    newLic.setWcExempt(licProfScriptModel.getWorkCompExempt());
    newLic.setZip(licProfScriptModel.getZip());
    //logDebug("licProfScriptModel.getLicenseExpirationDate(): "+ licProfScriptModel.getLicenseExpirationDate());
    //newLic.setLicenseExpirationDate(licProfScriptModel.getLicenseExpirDate());
    newLic.setLicenseExpirationDate(licProfScriptModel.getLastUpdateDate());
    //newLic.setLicenseProfessionalModel(licProfScriptModel.getLicenseProfessionalModel);
    for(var k in licProfScriptModel.licenseProfessionalModel )aa.print(k+" --> "+ licProfScriptModel.licenseProfessionalModel [k]);
    if (updating)
        myResult = aa.licenseScript.editRefLicenseProf(newLic);
    else
        myResult = aa.licenseScript.createRefLicenseProf(newLic);

    if (myResult.getSuccess())
    {
        logDebug("Successfully added/updated License ID : " + rlpId)
        return rlpId;
    }
    else
    { logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage()); }
}



