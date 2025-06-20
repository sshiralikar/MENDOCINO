updateAppStatus("Submitted", "Updated through script");
if (parentCapId)
    updateAppStatus("Renewal Under Review", "Updated through script", parentCapId);
// CAMEND-805
if (AInfo["Structure Change"] == "Yes" ||
    AInfo["Permit Type Change"] == "Yes" ||
    AInfo["Trees Removed"] == "Yes" ||
    AInfo["Convert License Type"] == "Yes") {
    taskCloseAllExcept("Modification Required", "Closing via script");
    updateAppStatus("Modification Required", "Updating via Script");
    updateAppStatus("Modification Required", "Updating via Script", parentCapId);
}
if(parentCapId)
{
    // CAMEND-805
    var powerSourceParent = getAppSpecific("Power source",parentCapId);
    if (powerSourceParent == "Yes" && AInfo["Power source"] == "No") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    } else if (powerSourceParent == "No" && AInfo["Power source"] == "Yes") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    }

    // CAMEND-805
    var waterSourceParent = getAppSpecific("Water source",parentCapId);
    if (waterSourceParent == "Yes" && AInfo["Water source"] == "No") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    } else if (waterSourceParent == "No" && AInfo["Water source"] == "Yes") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    }

    var gradingParent = getAppSpecific("Grading occurred",parentCapId);
    if (gradingParent == "No" && AInfo["Grading occurred"] == "Yes") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    }

    var structureParent = getAppSpecific("Structure Change",parentCapId);
    if (structureParent == "No" && AInfo["Structure Change"] == "Yes") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    }
    
    var parentList = loadASITable("STRUCTURE/SITE PLAN ID LIST", parentCapId);
    var parentListLength = parentList.length;
    var childList = loadASITable("STRUCTURE/SITE PLAN ID LIST");
    var childListLength = childList.length;
    if (parentListLength != childListLength) {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    }
}


// CAMEND-852
if (AInfo["Paying in Person"] == "Yes") {
    if (!feeExists("CANREN01", "INVOICED", "NEW") && AInfo["Exempt"] != "Yes") {
        addFee("CANREN01", "CAN_REN", "FINAL", "1", "Y");
        addStdConditionX("General", "Pay in Person");
    }
}