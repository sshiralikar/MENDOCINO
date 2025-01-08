if (wfStatus == "Approved") {
    // CAMEND-695
    var pCapId = getParent();
    editAppSpecific("Appeal Decision Date", sysDateMMDDYYYY, pCapId);
    //CAMEND-663
    var newExpDate = getAppSpecific("New Expiration Date",pCapId);
    if(newExpDate == null || newExpDate == "")
    {
        updateAppStatus("Active", "",pCapId);
        moveWFTask("Permit Status","Active", " ", "", pCapId, null, sysDateMMDDYYYY);
    }
    else
    {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date().setHours(0,0,0,0);
        var secondDate = new Date(getAppSpecific("New Expiration Date",pCapId)).setHours(0,0,0,0);
        var diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        logDebug("diffDays: "+diffDays);
        if(diffDays < 90 )
        {
            var template = "GLOBAL_ABOUT TO EXPIRE";
            updateAppStatus("Pending Non Renewal","",pCapId);
            setLicExpirationDate(pCapId,"",newExpDate,"About to Expire");
            var pCap = aa.cap.getCap(pCapId).getOutput();
            var contactResult = aa.people.getCapContactByCapID(pCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent"))
                    {
                        var conName = getContactName(capContacts[i]);
                        var applicantEmail = capContacts[i].getPeople().getEmail()+"";
                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", pCapId.getCustomID()+"");
                        addParameter(params, "$$FullNameBusName$$", conName);
                        addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$expirDate$$", newExpDate);
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                        addParameter(params, "$$capName$$", pCap.getSpecialText()+"");
                        var acaUrl = String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0];
                        addParameter(params, "$$acaRecordUrl$$", acaUrl);
                        if(hm[applicantEmail+""] != 1) {
                            sendEmail("no-reply@mendocinocounty.org", applicantEmail, "", template, params, null, pCapId);
                            hm[applicantEmail+""] = 1;
                        }
                    }
                }
            }
        }
        else
        {
            updateAppStatus("Active", "",pCapId);
            moveWFTask("Permit Status","Active", " ", "", pCapId, null, sysDateMMDDYYYY);
        }
    }
}

if (wfStatus == "Denied") {
    // CAMEND-695
    var pCapId = getParent();
    editAppSpecific("Appeal Decision Date", sysDateMMDDYYYY, pCapId);
}

if (wfStatus == "Pending Decision") {
    // CAMEND-661
    var c = new Date();
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();
    editTaskDueDate("Appeal", dateAdd(newDate, 10));
}