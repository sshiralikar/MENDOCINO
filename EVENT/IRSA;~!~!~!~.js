var hm = new Array();

var contactResult = aa.people.getCapContactByCapID(capId);
if (contactResult.getSuccess()) {
    var capContacts = contactResult.getOutput();
    for (var i in capContacts) {
        if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
            var reportUser = "ADMIN";
            var rFiles = [];
            var VRFiles = null;
            var conName = getContactName(capContacts[i]);
            var applicantEmail = capContacts[i].getPeople().getEmail()+"";
            var inspectorName = getInspectorName(inspId);
            if(!inspectorName)
                inspectorName = "Inspector";

            var rParams = aa.util.newHashMap();
            rParams.put("inspectionid", inspId);
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
            VRFiles = rFiles;
            var params = aa.util.newHashtable();
            addParameter(params, "$$InspectorOfRecord1$$", inspectorName);
            addParameter(params, "$$InspectorOfRecord2$$", inspectorName);
            addParameter(params, "$$InspectorPhoneNumber$$", getInspectorPhone(inspId));
            addParameter(params, "$$InspectorEmail$$", getInspectorEmail(inspId));
            addParameter(params, "$$altId$$", capId.getCustomID()+"");
            addParameter(params, "$$InspectionStatus$$", inspResult);
            addParameter(params, "$$FullNameBusName$$", conName);
            addParameter(params, "$$InspectionType$$", inspType);
            addParameter(params, "$$InspectionResultComment$$", inspComment);
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
            addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","phoneHours"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
            addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","officeHours"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
            if(hm[applicantEmail+""] != 1 )
            {
                sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", "CAN_INSP_RESULT", params, VRFiles, capId);
                hm[applicantEmail+""] = 1;
            }
        }
    }
}