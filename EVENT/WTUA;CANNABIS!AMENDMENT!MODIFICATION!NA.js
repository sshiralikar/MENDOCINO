//CAMEND-305
if(wfStatus == "Void" || wfStatus == "Withdrawn")
{
    taskCloseAllExcept(wfStatus,"Closing via script");
    updateAppStatus(wfStatus,"Updating via Script");
}
//CAMEND-305

//CAMEND-194, 223, CAMEND-512
if(wfTask == "Draft Decision" && wfStatus == "Approved")
{
    var hm = new Array();
    var licCapId = getParent();
    var expDate = getAppSpecific("New Expiration Date", licCapId);
    var today = new Date();
    var expDateObj = new Date(expDate);
    var ttcNumber = getAppSpecific("TTC Account Number", licCapId);
    logDebug("expDate: "+ expDate);
    logDebug("expDateObj: "+ expDateObj);
    copyAppSpecificInfo(capId,licCapId);
    copyASITablesWithRemove(capId, licCapId);
    copyLicensedProf(capId, licCapId);
    // CAMEND-843
    aa.cap.copyCapWorkDesInfo(capId, licCapId);
    //copyParcels(capId, licCapId);
    //copyAddresses(capId, licCapId);
    //copyOwner(capId, licCapId);
    editAppSpecific("TTC Account Number", ttcNumber, licCapId);
    var newDate1 = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
    editAppSpecific("Submitted Modification Date", newDate1, licCapId);
    editAppSpecific("Submitted Modification Date", newDate1, capId);
    if(today > expDateObj)
    {
        today.setFullYear(today.getFullYear() + 5);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("New Expiration Date", newDate);
        editAppSpecific("New Expiration Date", newDate, licCapId);
        setLicExpirationDate(licCapId,"",newDate);
    }
    else
    {
        expDateObj.setFullYear(today.getFullYear() + 5);
        var newDate = expDateObj.getMonth()+1+"/"+expDateObj.getDate()+"/"+expDateObj.getFullYear();
        editAppSpecific("New Expiration Date", newDate);
        editAppSpecific("New Expiration Date", newDate, licCapId);
        editAppSpecific("Issued Date", sysDateMMDDYYYY);
        editAppSpecific("Issued Date", sysDateMMDDYYYY,licCapId);
        setLicExpirationDate(licCapId,"",newDate);
    }


    var cChildren = getChildren("Cannabis/*/Renewal/NA", licCapId);
    var count = 0;
    var invalidCount = 0;
    var validCount = 0;
    if (cChildren != null) {
        for (var c in cChildren) {
            count ++;
        }
    }
    if(count > 0)
    {
        updateAppStatus("Renewal Under Review","Updating via Script",licCapId);
    }
    else
        updateAppStatus("Active","Updating via Script",licCapId);

    //CAMEND=794
    if(AInfo["Convert License Type"] == "Yes")
    {
        updateAppStatus("Approved for Conversion","Updating via Script",licCapId);
    }

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
                        addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
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

// CAMEND-784
if (wfTask == "Draft Decision" && wfStatus == "Approved" && AInfo["Modification Conversion"] == "Yes") {
    var parent = getParent();
    var parentCap = aa.cap.getCap(parentCapId).getOutput();
    parentAppTypeResult = parentCap.getCapType();
    parentAppTypeString = parentAppTypeResult.toString();
    parentAppTypeArray = parentAppTypeString.split("/");
    if (parentAppTypeArray[2] == "Permit") {
        updateAppStatus("Approved for Conversion","Updating via Script", parent);
    }
}

// CAMEND-770
if (wfTask == "Draft Decision" && wfStatus == "Approved" && AInfo["Permit Type Change"] == "Yes") {
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (c in capContacts) {
            if (capContacts[c].getCapContactModel().getPrimaryFlag() == "Y") {
                logDebug("Primary Contact: " + getContactName(capContacts[c]));
                conName = getContactName(capContacts[c]);
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
    // CAMEND-880
    // var ttcAccountNumber = getAppSpecific("TTC Account Number", parent);
    var capStatus = aa.cap.getCap(capId).getOutput();
    var thisCapStatus = capStatus.getCapStatus();
    var params = aa.util.newHashtable();
    addParameter(params, "$$altID$$", parent.getCustomID() + "");
    addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
    addParameter(params, "$$date$$", sysDateMMDDYYYY);
    addParameter(params, "$$capStatus$$", thisCapStatus);
    addParameter(params, "$$totalSF$$", totalSF);
    addParameter(params, "$$licenseType$$", permitType);
    addParameter(params, "$$TTCAccountNumber$$", ttcNumber);
    addParameter(params, "$$contactName$$", conName);
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
    sendEmail("no-reply@mendocinocounty.org", String(lookup("CAN_TREASURER_TAX_COLLECTOR", "TTC_Email")), "", "CAN_TTC_MODIFICATION", params, null, capId);
}

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
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$parentAltId$$", licCapId.getCustomID() + "");
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                addParameter(params, "$$contactName$$", conName);
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
//CAMEND-303, CAMEND-512
if(wfTask == "Draft Decision" && wfStatus == "Denied")
{
    var licCapId = getParent();
    VRFiles = [];
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
                // CAMEND-654
                var parent = getParent();
                if (parent) {
                    addParameter(params, "$$parentAltId$$", parent.getCustomID() + "");
                }
                else {
                    addParameter(params, "$$parentAltId$$", capId.getCustomID() + "");
                }
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$altID$$", capId.getCustomID()+"");
                addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(licCapId).getOutput().getCapType().getAlias()+"");
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                addParameter(params, "$$contactName$$", conName);
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

// CAMEND-512 led to this to be commented out due to deleting workflow task supervisor review.
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

// CAMEND-512 led to this to be commented out due to deleting workflow task supervisor review.
// if(wfTask == "Issuance" && wfStatus == "Issued")
// {
//     var licCapId = getParent();
//     var hm = new Array();
//     var conName = "";
//     var contactResult = aa.people.getCapContactByCapID(capId);
//     if (contactResult.getSuccess()) {
//         var capContacts = contactResult.getOutput();
//         for (var i in capContacts) {
//             if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent"))
//             {
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
//                 addParameter(params, "$$date$$", sysDateMMDDYYYY);
//                 addParameter(params, "$$contactEmail$$", capContacts[i].getPeople().getEmail() + "");
//                 addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
//                 addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
//                 if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
//                     sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_PERMIT_ISSUANCE", params, null, capId);
//                     hm[capContacts[i].getPeople().getEmail() + ""] = 1;
//                 }
//             }
//         }
//     }
// }


if(wfStatus == "Deficiency")
{
    editPriority("Low");
    //if(wfTask == "Supervisor Review"){
    var c = new Date();
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();
    editTaskDueDate(wfTask, dateAdd(newDate, 15));
    //}

}


//CAMEND-392, CAMEND-512
if ((wfTask == "Plans Coordination" || wfTask == 'Draft Decision') && wfStatus == 'Deficiency')
{
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
    var licCapId = getParent();
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
                addParameter(params, "$$date$$", sysDateMMDDYYYY);
                addParameter(params, "$$capName$$", capName);
                addParameter(params, "$$parentAltId$$", licCapId.getCustomID() + "");
                addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
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



