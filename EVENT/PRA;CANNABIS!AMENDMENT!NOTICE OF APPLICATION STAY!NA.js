// CAMEND-852
var bal = getBalanceDue(capId);
if(bal <= 0) {
    updateAppStatus("Amendment Review","Approved");
    updateTask("Amendment Review","Approved","","");
    aa.workflow.adjustTask(capId, "Amendment Review", "Y", "N", null, null);
    if(parentCapId)
    {
        editAppSpecific("NOAS Submitted Date",sysDateMMDDYYYY,parentCapId);
        var today = new Date();
        today.setFullYear(today.getFullYear() + 1);
        var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
        editAppSpecific("NOAS Expiration Date",newDate,parentCapId);
        updateAppStatus("Notice of Application Stay","updated via script", parentCapId);
    }
}

function getBalanceDue(targetCapId,total)
{
    var balance = total;
    var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput();
    if(invArray && invArray.length>0)
        balance = 0;
    for (var invCount in invArray)
    {
        var thisInvoice = invArray[invCount];
        var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
        balance+=parseInt(balDue);
    }
    return balance;
}