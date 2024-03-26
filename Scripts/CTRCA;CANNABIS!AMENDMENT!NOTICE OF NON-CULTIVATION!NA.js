try {

    updateAppStatus("Amendment Review","Approved");
    updateTask("Amendment Review","Approved","","");
    aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);

    if(parentCapId)
    {
        editAppSpecific("NONC Submitted Date", sysDateMMDDYYYY, parentCapId);
        var today = new Date();
        today.setFullYear(today.getFullYear() + 1);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("NONC Expiration Date", newDate, parentCapId);
        setLicExpirationDate(parentCapId,"",newDate);
        editAppSpecific("New Expiration Date", newDate, parentCapId);

        var today = new Date();
        today.setFullYear(today.getFullYear() + 5);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("NONC Requested Expiration Date", newDate, parentCapId);
        updateAppStatus("Notice of Non Cultivation","updated via script", parentCapId);



    }

} catch (err) {
    logDebug("A Javascript error has occurred within the following file: ASA:Cannabis/Amendment/Notice of Non-Cultivation/NA" + err.message);
}