//CAMEND-305
if (wfStatus == "Void" || wfStatus == "Withdrawn") {
    taskCloseAllExcept(wfStatus, "Closing via script");
    updateAppStatus(wfStatus, "Updating via Script");
    var licCapId = getParent();
    updateAppStatus("Withdrawn", "Updating via Script", licCapId);
}
//CAMEND-305, CAMEND-507
if (wfStatus == "Issued") {
    var hm = new Array();
    var licCapId = getParent();
    logDebug("licCapId: " + licCapId);
    var expDate = getAppSpecific("New Expiration Date", licCapId);
    var today = new Date();
    var expDateObj = new Date(expDate);
    copyAppSpecificInfo(capId, licCapId);
    copyASITablesWithRemove(capId, licCapId);
    // CAMEND-843
    aa.cap.copyCapWorkDesInfo(capId, licCapId);
    if (today > expDateObj) {
        today.setFullYear(today.getFullYear() + 5);
        var newDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
        editAppSpecific("New Expiration Date", newDate);
        editAppSpecific("New Expiration Date", newDate, licCapId);
        setLicExpirationDate(licCapId, "", newDate);
    }
    else {
        expDateObj.setFullYear(today.getFullYear() + 5);
        var newDate = expDateObj.getMonth() + 1 + "/" + expDateObj.getDate() + "/" + expDateObj.getFullYear();
        editAppSpecific("New Expiration Date", newDate);
        editAppSpecific("New Expiration Date", newDate, licCapId);
        setLicExpirationDate(licCapId, "", newDate);
    }
    editAppSpecific("Issued Date", sysDateMMDDYYYY);
    editAppSpecific("Issued Date", sysDateMMDDYYYY, licCapId);
    updateAppStatus("Active", "Updating via Script", licCapId);

    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID() + "");
                addParameter(params, "$$parentAltId$$", licCapId.getCustomID() + "");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias() + "");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ISSUANCE", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
    //var licCapId = getParent();
    /* var hm = new Array();
     renewalCapProject = getRenewalCapByParentCapIDForIncomplete(parentCapId);
     if (renewalCapProject != null) {
         renewalCapProject.setStatus("Complete");
         renewalCapProject.setRelationShip("R"); // move to related records
         aa.cap.updateProject(renewalCapProject);
     }*/
    var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if (balanceDue <= 0) {
            var today = new Date();
            today.setFullYear(today.getFullYear() + 5);
            var newDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
            var envParameters = aa.util.newHashMap();
            envParameters.put("RecordID", licCapId.getCustomID() + "");
            envParameters.put("IssueDT", sysDateMMDDYYYY);
            envParameters.put("ExpireDT", AInfo["New Expiration Date"]);
            aa.runAsyncScript("RUN_ASYNC_PERMIT_REPORT", envParameters);

            var conName = "";
            var contactResult = aa.people.getCapContactByCapID(licCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                        conName = getContactName(capContacts[i]);
                        var rParams = aa.util.newHashMap();
                        var rFiles = [];
                        rParams.put("RecordID", licCapId.getCustomID() + "");

                        var report = aa.reportManager.getReportInfoModelByName("Cannabis Permit Report");
                        report = report.getOutput();
                        report.setModule("Cannabis");
                        report.setCapId(licCapId.getID1() + "-" + licCapId.getID2() + "-" + licCapId.getID3());
                        report.setReportParameters(rParams);
                        report.getEDMSEntityIdModel().setAltId(licCapId.getCustomID());

                        var permit = aa.reportManager.hasPermission("Cannabis Permit Report", currentUserID);

                        if (permit.getOutput().booleanValue()) {
                            var reportResult = aa.reportManager.getReportResult(report);
                            if (reportResult) {
                                reportOutput = reportResult.getOutput();
                                var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
                                reportFile = reportFile.getOutput();
                                rFiles.push(reportFile);
                            }
                        }

                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", capId.getCustomID() + "");
                        addParameter(params, "$$parentAltId$$", licCapId.getCustomID() + "");
                        addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias() + "");
                        addParameter(params, "$$capTypeAliasApplication$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                        addParameter(params, "$$capName$$", capName);
                        addParameter(params, "$$contactName$$", conName);
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                        addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                        addParameter(params, "$$deptEmail2$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail2"));
                        addParameter(params, "$$financeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "financeHours"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                        addParameter(params, "$$date$$", sysDateMMDDYYYY);
                        addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                        addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                        addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                        if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_PERMIT_ISSUANCE", params, rFiles, capId);
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
if (wfStatus == "Modification Required") {
    var hm = new Array();
    var conName = "";
    var licCapId = getParent();
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID() + "");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias() + "");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if (wfComment != "" && wfComment != null)
                    addParameter(params, "$$wfComment$$", "Comments: " + wfComment);
                else
                    addParameter(params, "$$wfComment$$", "");
                if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_MODIFICATION REQUIRED", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
    // taskCloseAllExcept(wfStatus,"Closing via script"); // CAMEND-657
    updateAppStatus(wfStatus, "Updating via Script");
    updateAppStatus(wfStatus, "Updating via Script", licCapId);
}
if (wfTask == "Issuance" && wfStatus == "Denied") {
    // updateTask("Draft Decision", "Issuance Denied", "", "");
    // aa.workflow.adjustTask(capId, "Draft Decision", "N", "Y", null, null);

    // CAMEND-661
    // If "Issuance" = "Denied" the parent will update the workflow status and application status and due date to 35 days
    var licCapId = getParent();
    var c = new Date();
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();
    updateAppStatus("Denial Pending", "Updating via Script", licCapId);
    moveWFTask("Permit Status", "Denial Pending", " ", "", licCapId, null, sysDateMMDDYYYY);
    updateTaskDueDate("Permit Status", dateAdd(newDate, 35), licCapId);
    // updateAppStatus("Pending Non Renewal","Denial Pending",licCapId);

    // CAMEND-810
    var cChildren = getChildren("Cannabis/*/*/*", licCapId);
    if (cChildren != null) {
        for (var c in cChildren) {
            var vCapId = cChildren[c];
            var vCap = aa.cap.getCap(vCapId).getOutput();
            if (vCap.isCompleteCap() && vCapId + "" != capId + "") {
                updateAppStatus("Denied", "Updated via script", vCapId);
                var temp = capId;
                capId = vCapId;
                taskCloseAllExcept("Denied", "Closing via script");
                capId = temp;
                var capDetailObjResult = aa.cap.getCapDetail(vCapId); // Detail
                if (capDetailObjResult.getSuccess()) {
                    capDetail = capDetailObjResult.getOutput();
                    var balanceDue = capDetail.getBalance();
                    if (balanceDue > 0) {
                        inspCancelAll();
                        var temp = capId;
                        capId = vCapId;
                        addLicenseCondition("Balance", "Applied", "Out of Program Balance Due", "Out of Program Balance Due", "Notice");
                        capId = temp;
                    }
                }
            }
        }
    }

    if (licCapId) {
        var VRFiles = new Array();
        var rParams = aa.util.newHashMap();
        rParams.put("RecordID", capId.getCustomID() + "");
        logDebug("Report parameter RecordID set to: " + capId.getCustomID() + "");
        var report = aa.reportManager.getReportInfoModelByName("Cannabis Denial Decision Letter");
        report = report.getOutput();
        report.setModule("Cannabis");
        report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
        report.setReportParameters(rParams);
        report.getEDMSEntityIdModel().setAltId(capId.getCustomID());


        var permit = aa.reportManager.hasPermission("Cannabis Denial Decision Letter", currentUserID);

        if (permit.getOutput().booleanValue()) {
            logDebug("User has Permission to run the report....");
            var reportResult = aa.reportManager.getReportResult(report);
            if (reportResult) {
                reportOutput = reportResult.getOutput();
                var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
                logDebug("Report Run Successfull:" + reportFile.getSuccess());
                reportFile = reportFile.getOutput();
                VRFiles.push(reportFile);
            }
        }

        // updateAppStatus("Termination Pending","Updating via Script",licCapId);
        //updateTask("Permit Status","Termination Pending","","",licCapId);
        // moveWFTask("Permit Status","Termination Pending", " ", "", licCapId, null, sysDateMMDDYYYY);

        var hm = new Array();
        var conName = "";
        var contactResult = aa.people.getCapContactByCapID(capId);
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (var i in capContacts) {
                if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                    conName = getContactName(capContacts[i]);
                    var params = aa.util.newHashtable();
                    addParameter(params, "$$altID$$", capId.getCustomID() + "");
                    addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                    addParameter(params, "$$capName$$", capName);
                    addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                    addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                    addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                    addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                    addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                    addParameter(params, "$$contactname$$", conName);
                    addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                    addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                    if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_DENIED", params, null, capId);
                        hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                    }
                }
            }
        }
    }

}
//CAMEND-304
//CAMEND-303, CAMEND-507
if (wfTask == "Draft Decision" && wfStatus == "Denied") {
    var VRFiles = new Array();
    var licCapId = getParent();
    var rParams = aa.util.newHashMap();
    rParams.put("RecordID", capId.getCustomID() + "");
    logDebug("Report parameter RecordID set to: " + capId.getCustomID() + "");
    var report = aa.reportManager.getReportInfoModelByName("Cannabis Denial Decision Letter");
    report = report.getOutput();
    report.setModule("Cannabis");
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.setReportParameters(rParams);
    report.getEDMSEntityIdModel().setAltId(capId.getCustomID());


    var permit = aa.reportManager.hasPermission("Cannabis Denial Decision Letter", currentUserID);

    if (permit.getOutput().booleanValue()) {
        logDebug("User has Permission to run the report....");
        var reportResult = aa.reportManager.getReportResult(report);
        if (reportResult) {
            reportOutput = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
            logDebug("Report Run Successfull:" + reportFile.getSuccess());
            reportFile = reportFile.getOutput();
            VRFiles.push(reportFile);
        }
    }
    updateAppStatus("Termination Pending", "Updating via Script", licCapId);
    var hm = new Array();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID() + "");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias() + "");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_DENIED", params, VRFiles, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
}

// CAMEND-507 led to this to be commented out due to deleting workflow task supervisor review.
// if(wfStatus == "Appeal Denied")
// {
//     var hm = new Array();
//     var licCapId = getParent();
//     updateAppStatus("Revoked","Updating via Script",licCapId);
//     updateTask("Issuance","Denied","","");
//     aa.workflow.adjustTask(capId, "Issuance", "N", "Y", null, null);

//     updateTask("Permit Status","Revoked","","","",licCapId);
//     aa.workflow.adjustTask(licCapId, "Permit Status", "N", "Y", null, null);
//     updateAppStatus("Denied","Updated via script",licCapId);

//     var conName = "";
//     var contactResult = aa.people.getCapContactByCapID(capId);
//     if (contactResult.getSuccess()) {
//         var capContacts = contactResult.getOutput();
//         for (var i in capContacts) {
//             if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
//                 conName = getContactName(capContacts[i]);
//                 var params = aa.util.newHashtable();
//                 addParameter(params, "$$altID$$", capId.getCustomID()+"");
//                 addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias()+"");
//                 addParameter(params, "$$capName$$", capName);
//                 addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
//                 addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
//                 addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
//                 addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
//                 addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
//                 addParameter(params, "$$contactname$$", conName);
//                 addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
//                 addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
//                 if(hm[capContacts[i].getPeople().getEmail() + ""] != 1)
//                 {
//                     sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail()+"", "", "GLOBAL_DENIED", params, null, capId);
//                     hm[capContacts[i].getPeople().getEmail() + ""] = 1;
//                 }
//             }
//         }
//     }
// }

if (wfStatus == "Deficiency") {
    editPriority("Low");
    //if(wfTask == "Supervisor Review"){
    var c = new Date();
    var newDate = c.getMonth() + 1 + "/" + c.getDate() + "/" + c.getFullYear();
    editTaskDueDate(wfTask, dateAdd(newDate, 15));
    // }

}


// CAMEND-392, CAMEND-507
if ((wfTask == "Inspection" || wfTask == 'Draft Decision') && wfStatus == 'Deficiency') {
    //var date = getCapFileDate(capId);
    //if(isDateInRangeToOct(date) || isDateInRangeToFeb(date) || isDateInRangeCurr(date)) {
    var rFiles1 = new Array();
    logDebug("Deficiency: " + rFiles1);
    var hm = new Array();
    var conName = "";
    var rParams = aa.util.newHashMap();
    rParams.put("RecordID", capId.getCustomID() + "");
    logDebug("Report parameter RecordID set to: " + capId.getCustomID() + "");
    var report = aa.reportManager.getReportInfoModelByName("Cannabis Deficiency Denial Pending Letter");
    report = report.getOutput();
    report.setModule("Cannabis");
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.setReportParameters(rParams);
    report.getEDMSEntityIdModel().setAltId(capId.getCustomID());
    logDebug("Deficiency: " + rFiles1);

    var permit = aa.reportManager.hasPermission("Cannabis Deficiency Denial Pending Letter", currentUserID);
    if (permit.getOutput().booleanValue()) {
        logDebug("User has Permission to run the report....");
        var reportResult = aa.reportManager.getReportResult(report);
        if (reportResult) {
            reportOutput = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
            logDebug("Report Run Successfull:" + reportFile.getSuccess());
            reportFile = reportFile.getOutput();
            rFiles1.push(reportFile);
        }
    }
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent", "Property Owner")) {
                conName = getContactName(capContacts[i]);
                var params = aa.util.newHashtable();
                addParameter(params, "$$altID$$", capId.getCustomID() + "");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                addParameter(params, "$$contactname$$", conName);
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
                addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {

                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_DEFICIENCY", params, rFiles1, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
        //}
    }
}







//CAMEND-383
if (wfTask == "Draft Decision" && wfStatus == "Modification Required") {
    var licCapId = getParent();
    if (licCapId)
        updateAppStatus("Modification Required", "", licCapId);
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(tmpID);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            if (capContacts[i].getPeople().getEmail() != null) {
                sendEmailwAttchmnt('no-reply@mendocinocounty.org', capContacts[i].getPeople().getEmail(), '', 'Cannabis Renewal Corrections Letter', conName + "" + 'The attachment contains information about corrections for your renewal.', 'Cannabis Renewal Corrections Letter', 'RecordID', 'RecordID');
            }
        }
    }
}
function copyAppSpecificInfo(srcCapId, targetCapId) {
    //1. Get Application Specific Information with source CAPID.
    var appSpecificInfo = getAppSpecificInfo(srcCapId);
    if (appSpecificInfo == null || appSpecificInfo.length == 0) {
        return;
    }
    //2. Set target CAPID to source Specific Information.
    for (loopk in appSpecificInfo) {
        var sourceAppSpecificInfoModel = appSpecificInfo[loopk];
        sourceAppSpecificInfoModel.setPermitID1(targetCapId.getID1());
        sourceAppSpecificInfoModel.setPermitID2(targetCapId.getID2());
        sourceAppSpecificInfoModel.setPermitID3(targetCapId.getID3());
        //3. Edit ASI on target CAP (Copy info from source to target)
        aa.appSpecificInfo.editAppSpecInfoValue(sourceAppSpecificInfoModel);
    }
}

function getAppSpecificInfo(capId) {
    capAppSpecificInfo = null;
    var s_result = aa.appSpecificInfo.getByCapID(capId);
    if (s_result.getSuccess()) {
        capAppSpecificInfo = s_result.getOutput();
        if (capAppSpecificInfo == null || capAppSpecificInfo.length == 0) {
            aa.print("WARNING: no appSpecificInfo on this CAP:" + capId);
            capAppSpecificInfo = null;
        }
    } else {
        aa.print("ERROR: Failed to appSpecificInfo: " + s_result.getErrorMessage());
        capAppSpecificInfo = null;
    }
    // Return AppSpecificInfoModel[]
    return capAppSpecificInfo;
}
function copyASITablesWithRemove(pFromCapId, pToCapId) {
    // Function dependencies on addASITable()
    // par3 is optional 0 based string array of table to ignore
    var itemCap = pFromCapId;

    var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
    var ta = gm.getTablesArray()
    var tai = ta.iterator();
    var tableArr = new Array();
    var ignoreArr = new Array();
    var limitCopy = false;
    if (arguments.length > 2) {
        ignoreArr = arguments[2];
        limitCopy = true;
    }
    while (tai.hasNext()) {
        var tsm = tai.next();

        var tempObject = new Array();
        var tempArray = new Array();
        var tn = tsm.getTableName() + "";
        var numrows = 0;

        //Check list
        if (limitCopy) {
            var ignore = false;
            for (var i = 0; i < ignoreArr.length; i++)
                if (ignoreArr[i] == tn) {
                    ignore = true;
                    break;
                }
            if (ignore)
                continue;
        }
        if (!tsm.rowIndex.isEmpty()) {
            var tsmfldi = tsm.getTableField().iterator();
            var tsmcoli = tsm.getColumns().iterator();
            var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
            var numrows = 1;
            while (tsmfldi.hasNext()) // cycle through fields
            {
                if (!tsmcoli.hasNext()) // cycle through columns
                {
                    var tsmcoli = tsm.getColumns().iterator();
                    tempArray.push(tempObject); // end of record
                    var tempObject = new Array(); // clear the temp obj
                    numrows++;
                }
                var tcol = tsmcoli.next();
                var tval = tsmfldi.next();

                var readOnly = 'N';
                if (readOnlyi.hasNext()) {
                    readOnly = readOnlyi.next();
                }

                var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
                tempObject[tcol.getColumnName()] = fieldInfo;
                //tempObject[tcol.getColumnName()] = tval;
            }

            tempArray.push(tempObject); // end of record
        }
        removeASITable(tn, pToCapId);
        addASITable(tn, tempArray, pToCapId);
        logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
    }
}
function moveWFTask(ipTask, ipStatus, ipComment, ipNote) // Optional CapID, Process, StatusDate
{
    var vCapId = capId;
    if (arguments.length > 4 && arguments[4] != null) {
        var vCapId = arguments[4];
    }

    if (ipTask == "")
        ipTask = getCurrentTask(vCapId).getTaskDescription();

    var vUseProcess = false;
    var vProcessName = "";
    if (arguments.length > 5 && arguments[5] != null && arguments[5] != "") {
        vProcessName = arguments[5]; // subprocess
        vUseProcess = true;
    }

    var vUseStatusDate = false;
    var vStatusDate = null;
    var vToday = new Date();
    if (arguments.length > 6 && arguments[6] != null && arguments[6] != "") {
        vStatusDate = new Date(arguments[6]);
        vUseStatusDate = true;
    }

    var vWFResult = aa.workflow.getTaskItems(vCapId, ipTask, vProcessName, null, null, null);
    if (vWFResult.getSuccess())
        var vWFObj = vWFResult.getOutput();
    else {
        logMessage("**ERROR: Failed to get workflow object: " + vWFResult.getErrorMessage());
        return false;
    }

    if (!ipStatus)
        ipStatus = "NA";

    if (vWFObj.length == 0)
        return false;

    var vMoved = false;
    for (var vCounter in vWFObj) {
        var vTaskObj = vWFObj[vCounter];
        if (vTaskObj.getTaskDescription().toUpperCase().equals(ipTask.toUpperCase()) && (!vUseProcess || vTaskObj.getProcessCode().equals(vProcessName))) {
            var vTaskStatusObj = aa.workflow.getTaskStatus(vTaskObj, ipStatus).getOutput();
            if (!vTaskStatusObj)
                continue;
            if (vUseStatusDate) {
                var vTaskModel = vTaskObj.getTaskItem();
                vTaskModel.setStatusDate(vStatusDate);
                vTaskModel.setDisposition(ipStatus);
                vTaskModel.setDispositionNote(ipNote);
                vTaskModel.setDispositionComment(ipComment);
                vTaskModel.setDispositionDate(vToday);
                aa.workflow.handleDisposition(vTaskModel, vCapId);
                vMoved = true;
                logMessage("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
                logDebug("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
            }
            else {
                var vResultAction = vTaskStatusObj.resultAction;
                var vStepNumber = vTaskObj.getStepNumber();
                var vProcessID = vTaskObj.getProcessID();
                var vDispositionDate = aa.date.getCurrentDate();

                if (vUseProcess)
                    aa.workflow.handleDisposition(vCapId, vStepNumber, vProcessID, ipStatus, vDispositionDate, ipNote, ipComment, systemUserObj, vResultAction);
                else
                    aa.workflow.handleDisposition(vCapId, vStepNumber, ipStatus, vDispositionDate, ipNote, ipComment, systemUserObj, vResultAction);

                vMoved = true;
                logMessage("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
                logDebug("Moved Workflow Task: " + ipTask + " with status " + ipStatus);
            }
        }
    }
    return vMoved;
}

function updateTaskDueDate(taskName, dueDate, vCapId) {
    var workflowResult = aa.workflow.getTasks(vCapId);
    if (workflowResult.getSuccess()) {
        var wfObj = workflowResult.getOutput();
        for (i in wfObj) {
            if (wfObj[i].getTaskDescription() == taskName) {
                wfObj[i].setDueDate(aa.date.parseDate(dueDate));
                var tResult = aa.workflow.adjustTaskWithNoAudit(wfObj[i].getTaskItem());
                if (tResult.getSuccess()) {
                    logDebug("Set Workflow task: " + taskName + " due date to " + dueDate);
                }
                else {
                    logDebug("**ERROR: Failed to update comment on workflow task: " + tResult.getErrorMessage());
                    return false;
                }
            }
        }
    }
}