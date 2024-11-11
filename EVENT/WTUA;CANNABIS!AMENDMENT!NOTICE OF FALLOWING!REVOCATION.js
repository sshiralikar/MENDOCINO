if(wfStatus == "Approved")
{
    var pCapId = getParent();
    updateAppStatus("Active","",pCapId);
    updateTask("Permit Status","Active","","",pCapId);

    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(pCapId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", pCapId.getCustomID() + "");
            addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
            addParameter(params, "$$date$$", sysDateMMDDYYYY);
            addParameter(params, "$$parentAltId$$", pCapId.getCustomID()+"");
            addParameter(params, "$$contactname$$", conName);
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
            addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
            addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptAddress"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
            addParameter(params, "$$FullNameBusName$$", conName);
            addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
            addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$Location$$", getAddressInALine());
            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ROF_APPROVED", params, null, capId);
        }
    }
}
if(wfStatus == "Denied")
{
    var pCapId = getParent();
    updateAppStatus("Active","",pCapId);
    updateTask("Permit Status","Active","","",pCapId);

    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(pCapId);
    if (contactResult.getSuccess()) {
        var capContacts = contactResult.getOutput();
        for (var i in capContacts) {
            conName = getContactName(capContacts[i]);
            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", capId.getCustomID() + "");
            addParameter(params, "$$year$$", String(aa.date.getCurrentDate().getYear()));
            addParameter(params, "$$date$$", sysDateMMDDYYYY);
            addParameter(params, "$$parentAltId$$", pCapId.getCustomID() + "");
            addParameter(params, "$$contactname$$", conName);
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
            addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "phoneHours"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
            addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "officeHours"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
            addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
            addParameter(params, "$$FullNameBusName$$", conName);
            addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
            addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
            addParameter(params, "$$Location$$", getAddressInALine());
            if (wfComment != "" && wfComment != null)
                addParameter(params, "$$wfComment$$", "Comments: " + wfComment);
            else
                addParameter(params, "$$wfComment$$", "");
            sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_ROF_DENIED", params, null, capId);
        }
    }
}
function getAddressInALine() {

    var capAddrResult = aa.address.getAddressByCapId(capId);
    var addressToUse = null;
    var strAddress = "";

    if (capAddrResult.getSuccess()) {
        var addresses = capAddrResult.getOutput();
        if (addresses) {
            for (zz in addresses) {
                capAddress = addresses[zz];
                if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y"))
                    addressToUse = capAddress;
            }
            if (addressToUse == null)
                addressToUse = addresses[0];

            if (addressToUse) {
                strAddress = addressToUse.getHouseNumberStart();
                var addPart = addressToUse.getStreetDirection();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getStreetName();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getStreetSuffix();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getCity();
                if (addPart && addPart != "")
                    strAddress += " " + addPart + ",";
                var addPart = addressToUse.getState();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                var addPart = addressToUse.getZip();
                if (addPart && addPart != "")
                    strAddress += " " + addPart;
                return strAddress
            }
        }
    }
    return null;
}