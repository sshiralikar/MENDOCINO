var recordTypeFilePath = "C:/temp/Accela/recordTypes.csv";

var today = new Date();
today = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate()+""+today.getSeconds();
var filePath = "/Report/configReport_"+today+"/";

aa.print("Reading from file "+recordTypeFilePath)
var records = readExcel(recordTypeFilePath);
for(var i=0;i< records.length;i++) {
	generateReport(records[i].split(",")[0], records[i].split(",")[1], records[i].split(",")[2], records[i].split(",")[3]);
}

function generateReport(p1Value, p2Value, p3Value, p4Value) {

	var reportName = "Config Report_CLI";
	reportResult = aa.reportManager.getReportInfoModelByName(reportName);

	if (!reportResult.getSuccess()) {
		aa.print("**WARNING** couldn't load report " + reportName + " "
				+ reportResult.getErrorMessage())
	}

	var report = reportResult.getOutput();
	var repParams = aa.util.newHashMap();
	repParams.put("p1Value", p1Value);
	repParams.put("p2Value", p2Value);
	repParams.put("p3Value", p3Value);
	repParams.put("p4Value", p4Value);
			
   	var user = "ADMIN";   // Setting the User Name
	var report = aa.reportManager.getReportInfoModelByName(reportName);
      report = report.getOutput();
      report.setModule("Building");
      report.setReportParameters(repParams);

      var permit = aa.reportManager.hasPermission(reportName,user);
  
      if (permit.getOutput().booleanValue()) {
        var reportResult = aa.reportManager.getReportResult(report);
        if(reportResult) {
            reportOutput = reportResult.getOutput();
            if(reportOutput){
            	var fileName = saveReportToDisk(reportOutput, filePath)
                  aa.print("File path: "+fileName)
            }else{
                  aa.print("System failed get report: " + reportResult.getErrorType() + ":" +reportResult.getErrorMessage());
                  return false;
            }
        }  else {
            aa.print("System failed get report: " + reportResult.getErrorType() + ":" +reportResult.getErrorMessage());
            return false;
        }
      } else {
        aa.print("You have no permission.");
        return false;
      }

}

function readExcel(pFileName) {

	var records = new Array();
	pFileName = pFileName.toLowerCase();
	var file = aa.proxyInvoker
			.newInstance("java.io.File", new Array(pFileName)).getOutput();
	var scanner = aa.proxyInvoker.newInstance("java.util.Scanner",
			new Array(file)).getOutput();
	while (scanner.hasNext()) {
		var line = scanner.nextLine();
		aa.print("Record type: "+line)
		records.push(line);
	}
	return records;
}

function saveReportToDisk(reportResult, reportPath) {
    var fileName = "";
    var fos = null;
    try {
        var reportFile = null;
        var reportDir = new java.io.File(reportPath);
        reportDir.mkdirs();
        //report name
        var reportName = reportResult.getName();
        reportName = reportName.replaceAll(" ", "_").replaceAll("\"", "").replaceAll("\\\\", "").replaceAll("/", "");
        var reportFileName = reportPath + reportName;
        reportFile = new java.io.File(reportFileName);
        if (reportFile.exists()) {
            reportFile.delete();
        }
        reportFile.createNewFile();
        //save report to file
        fos = new java.io.FileOutputStream(reportFile);
        fos.write(reportResult.getContent());
        fos.flush();
        fos.close();
        fos = null;
        fileName = reportFile.getAbsolutePath();
    } catch (e) {
       aa.print(e)
       aa.debug("saveReportToDisk", e)
    } finally {
        if (fos != null) {
            try {
                fos.close();
                fos = null;
            } catch (e) {
            	aa.debug("saveReportToDisk, file output stream ", e)
            }
        }
    }
    return fileName;
}
