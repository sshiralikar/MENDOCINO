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
    var licCapId = getParent();
    var expDate = AInfo["New Expiration Date"];
    var today = new Date();
    var expDateObj = new Date(expDate);

    if(today > expDateObj)
    {
        today.setFullYear(today.getFullYear() + 1);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("New Expiration Date", newDate);
        editAppSpecific("New Expiration Date", licCapId);
        setLicExpirationDate(licCapId,"",newDate);
    }
    else
    {
        expDateObj.setFullYear(today.getFullYear() + 1);
        var newDate = expDateObj.getMonth()+1+"/"+expDateObj.getDate()+"/"+expDateObj.getFullYear();
        editAppSpecific("New Expiration Date", newDate);
        editAppSpecific("New Expiration Date", licCapId);
        editAppSpecific("Issued Date", sysDateMMDDYYYY);
        editAppSpecific("Issued Date", sysDateMMDDYYYY,licCapId);
        setLicExpirationDate(licCapId,"",newDate);
    }

    updateAppStatus("Active","Updating via Script",licCapId);

    /*renewalCapProject = getRenewalCapByParentCapIDForIncomplete(parentCapId);
    if (renewalCapProject != null) {
        renewalCapProject.setStatus("Complete");
        renewalCapProject.setRelationShip("R"); // move to related records
        aa.cap.updateProject(renewalCapProject);
    }*/
    var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if(balanceDue <= 0)
        {
            var today = new Date();
            today.setFullYear(today.getFullYear() + 1);
            var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
            var envParameters = aa.util.newHashMap();
            envParameters.put("RecordID", licCapId.getCustomID()+"");
            envParameters.put("IssueDT", sysDateMMDDYYYY);
            envParameters.put("ExpireDT", newDate);
            aa.runAsyncScript("RUN_ASYNC_PERMIT_REPORT", envParameters);
            var conName = "";
            var contactResult = aa.people.getCapContactByCapID(licCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent"))
                    {
                        conName = getContactName(capContacts[i]);


                       /* var rParams = aa.util.newHashMap();
                        rParams.put("RecordID", licCapId.getCustomID()+"");

                        var report = aa.reportManager.getReportInfoModelByName("Cannabis Permit Report");
                        report = report.getOutput();
                        report.setModule("Cannabis");
                        report.setCapId(licCapId.getID1() + "-" + licCapId.getID2() + "-" + licCapId.getID3());
                        report.setReportParameters(rParams);
                        report.getEDMSEntityIdModel().setAltId(licCapId.getCustomID());

                        var permit = aa.reportManager.hasPermission("Cannabis Permit Report",currentUserID);

                        if (permit.getOutput().booleanValue()) {
                            var reportResult = aa.reportManager.getReportResult(report);
                            if(reportResult) {
                                reportOutput = reportResult.getOutput();
                                var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
                                reportFile=reportFile.getOutput();
                            }
                        }*/

                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", capId.getCustomID()+"");
                        addParameter(params, "$$parentAltId$$", licCapId.getCustomID()+"");
                        addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$capTypeAliasApplication$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$capName$$", capName);
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                        addParameter(params, "$$contactName$$", conName);
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
    }
}
//CAMEND-194,223

//CAMEND-304
if(wfStatus == "Modification Required") {
    var hm = new Array();
    var conName = "";
    var licCapId = getParent();
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
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
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if(wfComment!="" && wfComment!= null)
                    addParameter(params, "$$wfComment$$", "Comments: "+ wfComment);
                else
                    addParameter(params, "$$wfComment$$", "");
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_MODIFICATION REQUIRED", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
    taskCloseAllExcept(wfStatus,"Closing via script");
    updateAppStatus(wfStatus,"Updating via Script");
    updateAppStatus(wfStatus,"Updating via Script",licCapId);
}
//CAMEND-304
//CAMEND-303
if(wfTask == "Supervisor Review" && wfStatus == "Denied")
{
    var licCapId = getParent();
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
    updateAppStatus("Revocation Pending","Updating via Script",licCapId);
    var hm = new Array();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
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
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1){
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail()+"", "", "GLOBAL_DENIED", params, VRFiles, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
}

if(wfStatus == "Appeal Denied")
{
    var hm = new Array();
    var licCapId = getParent();
    updateAppStatus("Revoked","Updating via Script",licCapId);
    updateTask("Issuance","Denied","","");
    aa.workflow.adjustTask(capId, "Issuance", "N", "Y", null, null);

    updateTask("Permit Status","Revoked","","","",licCapId);
    aa.workflow.adjustTask(licCapId, "Permit Status", "N", "Y", null, null);
    updateAppStatus("Denied","Updated via script",licCapId);

    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
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
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1)
                {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail()+"", "", "GLOBAL_DENIED", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
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
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent"))
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
if(wfStatus == "Deficiency")
{
    editPriority("Low");
    //if(wfTask == "Supervisor Review"){
    var c = new Date();
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();
    editTaskDueDate(wfTask, dateAdd(newDate, 15));
    //}

}

//CAMEND-392
if(wfTask == "Supervisor Review" && wfStatus == "Deficiency")

    //var date = getCapFileDate(capId);
    //if(isDateInRangeToOct(date) || isDateInRangeToFeb(date) || isDateInRangeCurr(date)) {
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
    //}
}


