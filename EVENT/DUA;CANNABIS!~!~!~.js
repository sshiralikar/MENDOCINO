var workfHistory = aa.workflow.getWorkflowHistory(capId, null);
var vTask = "";
var vStatus = "";
var flag = false;
if (workfHistory.getSuccess()) {
    var wfhistoryresult = workfHistory.getOutput();
}
if(wfhistoryresult && wfhistoryresult.length> 0 && wfhistoryresult[0].getDisposition() == "Deficiency")
{
    vTask = wfhistoryresult[0].getTaskDescription();
    vStatus = wfhistoryresult[0].getDisposition();
    flag = true;
}
if(flag)
{
    updateTask(vTask,"Deficiency Received","","");
    aa.workflow.adjustTask(capId, vTask, "Y", "N", null, null);
    updateAppStatus("Deficiency Received","Updated through script");

    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
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
                addParameter(params, "$$acaRecordUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail()+"", "", "GLOBAL_DEFICIENCY RECEIVED", params, null, capId);
            }
        }
    }
}