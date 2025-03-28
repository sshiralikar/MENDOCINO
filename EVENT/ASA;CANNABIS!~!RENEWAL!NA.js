//Start Core Renewal Functionality
if (parentCapId == "undefined" || parentCapId == null) {
    parentCapId = aa.env.getValue("ParentCapID");
}

var vGoodToRenew;
//Setup/Check renewal
vGoodToRenew = prepareRenewal();
if (parentCapId != null && vGoodToRenew) {

    //Copy Parcels from license to renewal
    copyParcels(parentCapId, capId);

    //Copy addresses from license to renewal
    copyAddresses(parentCapId, capId);

    //Copy addresses from license to renewal
    copyOwner(parentCapId, capId);

    //copy ASI Info from license to renewal
    //copyASIFields(parentCapId,capId);
    copyMatchingCustomFields(parentCapId, capId, true)

    //Copy ASIT from license to renewal
    copyASITables(parentCapId, capId);

    //Copy Contacts from license to renewal
    copyContacts(parentCapId, capId);

    copyLicensedProf(parentCapId, capId);

    copyConditions(parentCapId, capId);

    //Copy Work Description from license to renewal
    aa.cap.copyCapWorkDesInfo(parentCapId, capId);

    //Copy application name from license to renewal
    editAppName(getAppName(parentCapId), capId);
}
//End Core Renewal Functionality*/
if (!publicUser) {
    updateAppStatus("Submitted", "Updated through script");
    if (parentCapId)
        updateAppStatus("Renewal Under Review", "Updated through script", parentCapId);
    if (AInfo["Structure Change"] == "Yes") {
        taskCloseAllExcept("Modification Required", "Closing via script");
        updateAppStatus("Modification Required", "Updating via Script");
        updateAppStatus("Modification Required", "Updating via Script", parentCapId);
    }
    if (!feeExists("CANREN01", "INVOICED", "NEW") && AInfo["Exempt"] != "Yes") {
        addFee("CANREN01", "CAN_REN", "FINAL", "1", "Y");
    }
}
// CAMEND-852
removeFee("CANREN01", "FINAL");
if (AInfo["Paying in Person"] == "No") {
    if (!feeExists("CANREN01", "INVOICED", "NEW") && AInfo["Exempt"] != "Yes") {
        addFee("CANREN01", "CAN_REN", "FINAL", "1", "Y");
    }
}