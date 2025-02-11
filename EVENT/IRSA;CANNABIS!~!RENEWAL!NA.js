// CAMEND-780
if (inspType == "Cultivation - Site Inspection" || inspType == "Cultivation - Special Inspection" ||
    inspType == "Nursery - Site Inspection" || inspType == "Nursery - Special Inspection") {
    if (inspResult == "Pass") {
        addStdConditionX("Cannabis Required Document", "CCBL Affidavit");
        // updateAppStatus("Closed","Closed automatically via Script", capId);
        updateTask("Inspection", "Pass", "", "");
        aa.workflow.adjustTask(capId, "Inspection", "N", "Y", null, null);
        aa.workflow.adjustTask(capId, "Issuance", "Y", "N", null, null);
    } else if (inspResult == "Fail") {
        addStdConditionX("Cannabis Required Document", "CCBL Affidavit");
        // updateAppStatus("Closed","Closed automatically via Script", capId);
        updateTask("Inspection", "Fail", "", "");
        aa.workflow.adjustTask(capId, "Inspection", "N", "Y", null, null);
        aa.workflow.adjustTask(capId, "Issuance", "Y", "N", null, null);
    }
}