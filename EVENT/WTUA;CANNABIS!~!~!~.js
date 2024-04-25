if(wfStatus == "Denial Pending")
{
    editTaskDueDate("Appeal", dateAdd(newDate, 35));
}
if(wfTask == "Supervisor Review" && wfStatus == "Denied")
{
    editTaskDueDate("Appeal", dateAdd(newDate, 10));
}
if(wfTask!="Supervisor Review" && wfStatus == "Deficiency")
{
    var hm = new Array();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);
    if (contactResult.getSuccess()) {
        var COAs = "";
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
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
                if(wfComment!="" && wfComment!= null)
                    addParameter(params, "$$wfComment$$", "Comments: "+ wfComment+" \nand "+COAs);
                else
                    addParameter(params, "$$wfComment$$", ""+COAs);
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_ADDITIONAL INFO REQUIRED", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
}
if(wfStatus == "Ready for Inspection")
{
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
                if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_READY FOR INSPECTION", params, null, capId);
                    hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                }
            }
        }
    }
}