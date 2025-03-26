updateAppStatus("Modification Under Review","Updated through script",parentCapId);

// CAMEND-852
if (AInfo["Paying in Person"] == "Yes") {
    if(!feeExists("CANMOD01","INVOICED","NEW") && AInfo["Exempt"] != "Yes") {
        addFee("CANMOD01", "CAN_MOD", "FINAL", "1", "Y");
        addStdConditionX("General", "Pay in Person");
    }
}