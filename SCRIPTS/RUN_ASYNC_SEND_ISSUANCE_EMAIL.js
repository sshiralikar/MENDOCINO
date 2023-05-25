try
{
    var VRFiles = [];
    var hm = new Array();
    var rParams = aa.util.newHashMap();
    currentUserID = "ADMIN";
    var licCapId = aa.cap.getCapID(aa.env.getValue("RecordID")).getOutput();
    var capId = aa.cap.getCapID(aa.env.getValue("capId")).getOutput();
    rParams.put("RecordID", aa.env.getValue("RecordID"));


    var report = aa.reportManager.getReportInfoModelByName("Cannabis Approval Letter");
    report = report.getOutput();
    report.setModule("Cannabis");
    report.setCapId(licCapId.getID1() + "-" + licCapId.getID2() + "-" + licCapId.getID3());
    report.setReportParameters(rParams);
    report.getEDMSEntityIdModel().setAltId(licCapId.getCustomID());


    var permit = aa.reportManager.hasPermission("Cannabis Approval Letter",currentUserID);

    if (permit.getOutput().booleanValue()) {
        var reportResult = aa.reportManager.getReportResult(report);
        if(reportResult) {
            reportOutput = reportResult.getOutput();
            var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
            reportFile=reportFile.getOutput();
            VRFiles.push(reportFile);
        }
    }
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(capContacts[i].getPeople().getContactType() == "Applicant" || capContacts[i].getPeople().getContactType() == "Authorized Agent")
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
    }
    function addParameter(pamaremeters, key, value)
    {
        if(key != null)
        {
            if(value == null)
            {
                value = "";
            }

            pamaremeters.put(key, value);
        }
    }
    function sendEmail(fromEmail, toEmail, CC, template, eParams, files) { // optional: itemCap
        var itemCap = capId;
        if (arguments.length == 7)
            itemCap = arguments[6]; // use cap ID specified in args

        //var sent = aa.document.sendEmailByTemplateName(fromEmail, toEmail, CC, template, eParams, files);
        if(eParams)
        {
            var bizDomScriptResult = aa.bizDomain.getBizDomain("NOTIFICATION_TEMPLATE_INFO_CANNABIS");
            if (bizDomScriptResult.getSuccess()) {
                var bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
                for (var i in bizDomScriptArray) {
                    var desc = bizDomScriptArray[i].getDescription();
                    var value = bizDomScriptArray[i].getBizdomainValue() + "";
                    addParameter(eParams,value,desc);
                }
            }
        }
        toEmail = runEmailThroughSLEmailFilter(toEmail);
        var itempAltIDScriptModel = aa.cap.createCapIDScriptModel(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());
        var sent = aa.document.sendEmailAndSaveAsDocument(fromEmail, toEmail, CC, template, eParams, itempAltIDScriptModel, files);
    }
    function runEmailThroughSLEmailFilter(vEmail)
    {
        var filter = lookup("SL_EMAIL_CONTROL", "FILTER");
        if(filter == "ON")
        {
            var domains = String(lookup("SL_EMAIL_CONTROL", "DOMAIN_EXCEPTIONS"));
            var emails = String(lookup("SL_EMAIL_CONTROL", "EMAIL_EXCEPTIONS"));
            var vOriginalDomain = vEmail.substring(vEmail.indexOf("@") + 1, vEmail.length).toLowerCase();

            if(domains.toLowerCase().indexOf(String(vOriginalDomain).toLowerCase()) != -1)
                return vEmail;
            if(emails.toLowerCase().indexOf(String(vOriginalDomain).toLowerCase()) != -1)
                return vEmail;


            vEmail = vEmail.replace(vOriginalDomain, "DoNotSend.com");
        }
        return vEmail;
    }
    function lookup(stdChoice,stdValue)
    {
        var strControl;
        var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);

        if (bizDomScriptResult.getSuccess())
        {
            var bizDomScriptObj = bizDomScriptResult.getOutput();
            strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
        }
        return strControl;
    }
    function matches(eVal, argList) {
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] == eVal) {
                return true;
            }
        }
        return false;
    }
}
catch(err)
{
    aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "Error on Issuance Email ASYNC", err);
}
