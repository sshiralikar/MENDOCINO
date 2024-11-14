// CAMEND-563
if (wfStatus == "Approved") {
    var pCapId = getParent();
    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if (balanceDue <= 0) {
            // var today = new Date();
            // var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
            // editAppSpecific("Withdrawal Date", newDate, pCapId);
            // //taskCloseAllExcept("Approved","Closing via script");
            // var temp = capId;
            // capId = pCapId;
            // taskCloseAllExcept("Withdrawn","Closing via script");
            // capId = temp;
            // updateAppStatus("Withdrawn","Updated via script",pCapId);
            // updateAppStatus("Approved","Updated via script",capId);

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
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_NOF_APPROVED", params, null, capId);
                }
            }
        }
    }

    // CAMEND-620
    var today = new Date();
    var newDate = "";
    var pCapId = getParent();
    var nofSubmittedDate = getAppSpecific("NOF Submitted Date", pCapId);
    var submittedDate = new Date(nofSubmittedDate + "");

    if ((submittedDate.getMonth() == 11) && (today.getFullYear() - 1 == submittedDate.getFullYear())) { //If NOF Submitted Date was between 12/01/2024 - 12/31/2024
        logDebug("Submitted Date is between 12/01/2024 - 12/31/2024");
        newDate = 12 + "/" + 31 + "/" + (parseInt(submittedDate.getFullYear()) + 1);
    } else if ((submittedDate.getMonth() == 0) && (today.getFullYear() == submittedDate.getFullYear())) { // If NOF Submitted Date was between 01/01/2025 - 01/31/2025
        logDebug("Submitted Date is between 01/01/2025 - 01/31/2025");
        newDate = 12 + "/" + 31 + "/" + submittedDate.getFullYear();
    }

    logDebug(newDate)
    editAppSpecific("NOF Expiration Date", newDate, pCapId);
    // CAMEND-620
}

// CAMEND-561
if (wfStatus == "Denied") {
    var pCapId = getParent();
    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if (balanceDue <= 0) {
            // var today = new Date();
            // var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
            // editAppSpecific("Withdrawal Date", newDate, pCapId);
            // //taskCloseAllExcept("Approved","Closing via script");
            // var temp = capId;
            // capId = pCapId;
            // taskCloseAllExcept("Withdrawn","Closing via script");
            // capId = temp;
            // updateAppStatus("Withdrawn","Updated via script",pCapId);
            // updateAppStatus("Approved","Updated via script",capId);

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
                    if(wfComment!="" && wfComment!= null)
                        addParameter(params, "$$wfComment$$", "Comments: "+ wfComment);
                    else
                        addParameter(params, "$$wfComment$$", "");
                    sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_NOF_DENIED", params, null, capId);
                }
            }
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