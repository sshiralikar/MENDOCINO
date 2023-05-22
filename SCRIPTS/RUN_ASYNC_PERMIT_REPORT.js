var rParams = aa.util.newHashMap();
currentUserID = "ADMIN";
var licCapId = aa.cap.getCapID(aa.env.getValue("RecordID")+"").getOutput();
rParams.put("RecordID", aa.env.getValue("RecordID")+"");
rParams.put("IssueDT", aa.env.getValue("IssueDT")+"");
rParams.put("ExpireDT", aa.env.getValue("ExpireDT")+"");

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
}