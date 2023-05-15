if(wfStatus == "Approved")
{
    var pCapId = getParent();
    var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        var balanceDue = capDetail.getBalance();
        if(balanceDue <= 0)
        {
            //taskCloseAllExcept("Approved","Closing via script");
            var temp = capId;
            capId = pCapId;
            taskCloseAllExcept("Withdrawn","Closing via script");
            capId = temp;
            updateAppStatus("Withdrawn","Updated via script",pCapId);
            updateAppStatus("Approved","Updated via script",capId);
            var vAddress = "";
            var capAddressResult1 = aa.address.getAddressByCapId(pCapId);
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
            var conName = "";
            var contactResult = aa.people.getCapContactByCapID(pCapId);
            if (contactResult.getSuccess()) {
                var capContacts = contactResult.getOutput();
                for (var i in capContacts) {
                    if(matches(capContacts[i].getPeople().getContactType(),"Applicant","Authorized Agent")) {
                        conName = getContactName(capContacts[i]);
                        var params = aa.util.newHashtable();
                        addParameter(params, "$$altID$$", capId.getCustomID()+"");
                        addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
                        addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","phoneHours"));
                        addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
                        addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","officeHours"));
                        addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
                        addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
                        addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
                        addParameter(params, "$$FullNameBusName$$", conName);
                        addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
                        addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
                        addParameter(params, "$$Location$$", vAddress);
                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail()+"", "", "CAN_WITHDRAWAL APPROVED", params, null, capId);
                    }
                }
            }

            var params = aa.util.newHashtable();
            addParameter(params, "$$altID$$", capId.getCustomID()+"");
            addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptName"));
            addParameter(params, "$$phoneHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","phoneHours"));
            addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptPhone"));
            addParameter(params, "$$officeHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","officeHours"));
            addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptHours"));
            addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptEmail"));
            addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS","deptFormalName"));
            addParameter(params, "$$FullNameBusName$$", conName);
            addParameter(params, "$$capAlias$$", aa.cap.getCap(pCapId).getOutput().getCapType().getAlias()+"");
            addParameter(params, "$$parentCapId$$", pCapId.getCustomID());
            addParameter(params, "$$Amendment$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias()+"");
            addParameter(params, "$$Location$$", vAddress);
            sendEmail("no-reply@mendocinocounty.org", lookup("NOTIFICATION_TEMPLATE_INFO_EXTERNAL_AGENCIES","EXTERNAL_AGENCIES")+"", "", "GLOBAL_APPLICATION_CLOSED", params, null, capId);
        }
    }
}