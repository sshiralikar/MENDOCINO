updateAppStatus("Pending", "Updated through script");
if (parentCapId)
    updateAppStatus("Renewal Under Review", "Updated through script", parentCapId);
if (AInfo["Structure Change"] == "Yes") {
    taskCloseAllExcept("Modification Required", "Closing via script");
    updateAppStatus("Modification Required", "Updating via Script");
    updateAppStatus("Modification Required", "Updating via Script", parentCapId);
}