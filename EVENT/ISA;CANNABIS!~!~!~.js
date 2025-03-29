//CAMEND-134
var conName = "";
var vInspDate = "";
if(inspObj.getScheduledDate())
    vInspDate = inspObj.getScheduledDate().getMonth() + "/" + inspObj.getScheduledDate().getDayOfMonth() + "/" + inspObj.getScheduledDate().getYear();
var vAddress = "";
var capAddressResult1 = aa.address.getAddressByCapId(capId);
if (capAddressResult1.getSuccess())
{
    var Address = capAddressResult1.getOutput();
    for (yy in Address)
    {
        vAddress = Address[yy].getHouseNumberStart();
        if (Address[yy].getStreetDirection())
            vAddress += " " + Address[yy].getStreetDirection();
        vAddress += " " + Address[yy].getStreetName();
        if (Address[yy].getStreetSuffix())
            vAddress += " " + Address[yy].getStreetSuffix();
        if (Address[yy].getUnitStart())
            vAddress += " " + Address[yy].getUnitStart();
        if (Address[yy].getCity())
            vAddress += ", " + Address[yy].getCity();
        if (Address[yy].getState())
            vAddress += ", " + Address[yy].getState();
        if (Address[yy].getZip())
            vAddress += " " + Address[yy].getZip();
    }
}
var hm = new Array();
var contactResult = aa.people.getCapContactByCapID(capId);
if (contactResult.getSuccess()) {
    var capContacts = contactResult.getOutput();
    for (var i in capContacts) {
        if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", capId.getCustomID()+"");
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
            addParameter(params, "$$inspSchedTime$$", getInspectionTime(capId, Number(inspId)));
            addParameter(params, "$$inspSchedDate$$", vInspDate);
            addParameter(params, "$$Location$$", vAddress);
            addParameter(params, "$$contactname$$", conName);
            if(hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "GLOBAL_INSPECTION_SCHEDULED", params, null, capId);
                hm[capContacts[i].getPeople().getEmail() + ""] = 1;
            }
        }
    }
}
//CAMEND-134