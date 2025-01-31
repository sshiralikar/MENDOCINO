var isMobile = false;
var capDocResult = aa.document.getDocumentListByEntity(capId+"-"+inspId,null);
if(capDocResult.getSuccess()) {
    if(capDocResult.getOutput().size() > 0) {
        /*for(docInx = 0; docInx < capDocResult.getOutput().size(); docInx++)
        {
            var documentObject = capDocResult.getOutput().get(docInx);
            currDocCat = "" + documentObject.getDocCategory();
            var fileName = documentObject.getFileName();
            aa.print("orgfileName: "+ fileName+" - "+ documentObject.getEntityType());
        }*/
        isMobile = true;
    }
}
var hm = new Array();
var reportUser = "ADMIN";
var rFiles = [];
var VRFiles = null;
if(!isMobile)
{
    var rParams = aa.util.newHashMap();
    rParams.put("inspectionid", inspId+"");
    rParams.put("MobileInd", "0");
    var report = aa.reportManager.getReportInfoModelByName("Cannabis Inspection Report");
    report = report.getOutput();
    report.setModule("Cannabis");
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.setReportParameters(rParams);
    report.getEDMSEntityIdModel().setAltId(capId.getCustomID());
    var permit = aa.reportManager.hasPermission("Cannabis Inspection Report",reportUser);

    if (permit.getOutput().booleanValue()) {
        var reportResult = aa.reportManager.getReportResult(report);
        if(reportResult) {
            reportOutput = reportResult.getOutput();
            var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
            reportFile=reportFile.getOutput();
            rFiles.push(reportFile);
        }
    }
}
else
{
    var rParams = aa.util.newHashMap();
    rParams.put("inspectionid", inspId+"");
    rParams.put("MobileInd", "1");
    var report = aa.reportManager.getReportInfoModelByName("Cannabis Inspection Mobile Report");
    report = report.getOutput();
    report.setModule("Cannabis");
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.setReportParameters(rParams);
    report.getEDMSEntityIdModel().setAltId(capId.getCustomID());
    var permit = aa.reportManager.hasPermission("Cannabis Inspection Mobile Report",reportUser);

    if (permit.getOutput().booleanValue()) {
        var reportResult = aa.reportManager.getReportResult(report);
        if(reportResult) {
            reportOutput = reportResult.getOutput();
            var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
            reportFile=reportFile.getOutput();
            rFiles.push(reportFile);
        }
    }
}
VRFiles = rFiles;
var contactResult = aa.people.getCapContactByCapID(capId);
if (contactResult.getSuccess()) {
    var capContacts = contactResult.getOutput();
    for (var i in capContacts) {
        if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
            var conName = getContactName(capContacts[i]);
            var applicantEmail = capContacts[i].getPeople().getEmail()+"";
            var inspectorName = getInspectorName(inspId);
            if(!inspectorName)
                inspectorName = "Inspector";
            var params = aa.util.newHashtable();
            addParameter(params, "$$InspectorOfRecord1$$", inspectorName);
            addParameter(params, "$$InspectorOfRecord2$$", inspectorName);
            addParameter(params, "$$InspectorPhoneNumber$$", getInspectorPhone(inspId));
            addParameter(params, "$$InspectorEmail$$", getInspectorEmail(inspId));
            addParameter(params, "$$altId$$", capId.getCustomID()+"");
            addParameter(params, "$$InspectionStatus$$", inspResult);
            addParameter(params, "$$contactName$$", conName);
            addParameter(params, "$$InspectionType$$", inspType);
            addParameter(params, "$$InspectionResultComment$$", inspComment);
            var startDate = new Date();
            var todayDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
            addParameter(params, "$$date$$", todayDate);
            var parent = getParent();
            if(parent)
                addParameter(params, "$$parentAltId$$", parent.getCustomID()+"");
            else
                addParameter(params, "$$parentAltId$$", capId.getCustomID()+"");
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
            addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","phoneHours"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
            addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","officeHours"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
            addParameter(params, "$$deptEmail2$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail2"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
            var COAs = "";
            var condResult = aa.capCondition.getCapConditions(capId);
            if (condResult.getSuccess()) {
                var capConds = condResult.getOutput();
                for (var cc in capConds) {
                    var thisCondX = capConds[cc];
                    var cNbr = thisCondX.getConditionNumber();
                    var thisCond = aa.capCondition.getCapCondition(capId, cNbr).getOutput();
                    var cStatus = thisCond.getConditionStatus();
                    var isCOA = thisCond.getConditionOfApproval();
                    if (matches(cStatus, "Applied","Pending") && isCOA == "Y") {
                        COAs+= "  - "+thisCond.getConditionDescription();+", ";
                    }
                }
            }
            if(COAs!="")
                COAs = "The following documents are missing:\n" + COAs;
            addParameter(params, "$$COAs$$", COAs);
            if(hm[applicantEmail+""] != 1 )
            {
                sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "CAN_INSP_RESULT", params, VRFiles, capId);
                hm[applicantEmail+""] = 1;
            }
        }
    }
}

// CAMEND-780
if (appMatch("Cannabis/*/Application/NA")) {
    if (inspType == "Cultivation - Site Inspection" || inspType == "Cultivation - Special Inspection" ||
        inspType == "Nursery - Site Inspection" || inspType == "Nursery - Special Inspection") {
        if (inspResult == "Pass" || inspResult == "Fail") {
            addStdConditionX("Cannabis Required Document", "CCBL Affidavit");
            // updateAppStatus("Closed","Closed automatically via Script", capId);
            updateTask("Site Inspection", "Pass", "", "");
            aa.workflow.adjustTask(capId, "Site Inspection", "N", "Y", null, null);
            aa.workflow.adjustTask(capId, "Draft Decision", "Y", "N", null, null);
        }
    }
}