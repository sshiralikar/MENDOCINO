if(!publicUser)
{
    updateAppStatus("Modification Under Review","Updated through script",parentCapId);
    if(!feeExists("CANMOD01","INVOICED","NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes") {
        addFee("CANMOD01", "CAN_MOD", "FINAL", "1", "Y");
    }
}
// CAMEND-852
if (AInfo["Paying in Person"] == "No") {
    if(!feeExists("CANMOD01","INVOICED","NEW") && AInfo["Equity Eligibility"] != "Yes" && AInfo["Exempt"] != "Yes") {
        addFee("CANMOD01", "CAN_MOD", "FINAL", "1", "Y");
    }
}