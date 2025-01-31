// CAMEND-780
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