// CAMEND-815
var conObj = getContactObj(capId,"Applicant");
if (conObj) {
    conObj.primary = "Y";
    conObj.save();
}