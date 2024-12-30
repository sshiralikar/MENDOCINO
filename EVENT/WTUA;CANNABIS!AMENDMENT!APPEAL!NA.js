if (wfStatus == "Approved") {
    // CAMEND-695
    var pCapId = getParent();
    editAppSpecific("Appeal Decision Date", sysDateMMDDYYYY, pCapId);
}

if (wfStatus == "Denied") {
    // CAMEND-695
    var pCapId = getParent();
    editAppSpecific("Appeal Decision Date", sysDateMMDDYYYY, pCapId);
}

if (wfStatus == "Pending Decision") {
    // CAMEND-661
    var c = new Date();
    var newDate = c.getMonth()+1+"/"+c.getDate()+"/"+c.getFullYear();
    editTaskDueDate("Appeal", dateAdd(newDate, 10));
}