//CAMEND-305
if(wfStatus == "Void" || wfStatus == "Withdrawn")
{
    taskCloseAllExcept(wfStatus,"Closing via script");
    updateAppStatus(wfStatus,"Updating via Script");
}
//CAMEND-305

//CAMEND-194, 223
if(wfTask == "Supervisor Review" && wfStatus == "Issued")
{
    var hm = new Array();
    var licCapId = createRecord("Cannabis",appTypeArray[1],"Permit",appTypeArray[3],capName);
    aa.cap.createAppHierarchy(licCapId, capId);
    copyASIFields(capId,licCapId);
    copyASITables(capId, licCapId);
    copyLicensedProf(capId, licCapId);
    copyConditions(capId, licCapId);
    //copyDocuments(capId, licCapId);

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

    var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if(balanceDue <= 0)
        {
            var envParameters = aa.util.newHashMap();
            envParameters.put("RecordID", licCapId.getCustomID()+"");
            envParameters.put("IssueDT", sysDateMMDDYYYY);
            envParameters.put("ExpireDT", newDate);
            aa.runAsyncScript("RUN_ASYNC_PERMIT_REPORT", envParameters);

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
                            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ISSUANCE", params, null, capId);
                            hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                        }
                    }
                }
            }
        }
    }
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

if(wfTask == "Issuance" && wfStatus == "Issued")
{
    var licCapId = getParent();
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
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_PERMIT_ISSUANCE", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
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


