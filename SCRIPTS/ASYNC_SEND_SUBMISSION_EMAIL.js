//aa.env.setValue("capIdStr","CAN-C-2019-0217-APP");
capId = aa.cap.getCapID(aa.env.getValue("capIdStr")).getOutput();
cap = aa.cap.getCap(capId).getOutput();
appTypeResult = cap.getCapType();
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");

try {
    var isAppeal = appMatch("Cannabis/Amendment/Appeal/NA",capId);
    var isAssignment = appMatch("Cannabis/Amendment/Assignment/NA",capId);
    var isNOF = appMatch("Cannabis/Amendment/Notice of Fallowing/NA",capId);
    var isNOFAffidavit = appMatch("Cannabis/Amendment/Notice of Fallowing/Affidavit",capId);
    var isNOFRevocation = appMatch("Cannabis/Amendment/Notice of Fallowing/Revocation",capId);
    var isTaxAppeal = appMatch("Cannabis/Amendment/Tax Appeal/NA",capId);

    var hm = new Array();
    var conName = "";
    var contactResult = aa.people.getCapContactByCapID(capId);

    if (!isAppeal && isAssignment && isNOF && isNOFAffidavit && isNOFRevocation && isTaxAppeal) {
        if (contactResult.getSuccess()) {
            var capContacts = contactResult.getOutput();
            for (var i in capContacts) {
                if (matches(capContacts[i].getPeople().getContactType(), "Applicant", "Authorized Agent")) {
                    conName = getContactName(capContacts[i]);
                    var params = aa.util.newHashtable();
                    addParameter(params, "$$altID$$", capId.getCustomID() + "");
                    addParameter(params, "$$capTypeAlias$$", aa.cap.getCap(capId).getOutput().getCapType().getAlias() + "");
                    addParameter(params, "$$capName$$", cap.getSpecialText() + "");
                    addParameter(params, "$$deptName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptName"));
                    addParameter(params, "$$deptPhone$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptPhone"));
                    addParameter(params, "$$deptHours$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptHours"));
                    addParameter(params, "$$deptEmail$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptEmail"));
                    addParameter(params, "$$deptFormalName$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptFormalName"));
                    addParameter(params, "$$deptAddress$$", lookup("NOTIFICATION_TEMPLATE_INFO_CANNABIS", "deptAddress"));
                    addParameter(params, "$$FullNameBusName$$", conName);
                    addParameter(params, "$$ACAUrl$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                    addParameter(params, "$$ACAURL$$", String(lookup("ACA_CONFIGS", "ACA_SITE")).split("/Admin")[0]);
                    if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_APPLICATION_SUBMITTED", params, null, capId);
                        hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                    }
                }
            }
        }
    }
    // CAMEND-566
    if (isNOF) {
        var hm = new Array();
        var pCapId = getParent();
        var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
        if (capDetailObjResult.getSuccess()) {
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
                    addParameter(params, "$$date$$", (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear());
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
                    if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_NOF_SUBMITTED", params, null, capId);
                        hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                    }
                }
            }
        }
    }

    // CAMEND-783
    if (isNOFAffidavit) {
        var hm = new Array();
        var pCapId = getParent();
        var capDetailObjResult = aa.cap.getCapDetail(pCapId); // Detail
        if (capDetailObjResult.getSuccess()) {
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
                    addParameter(params, "$$date$$", (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear());
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
                    if (hm[capContacts[i].getPeople().getEmail() + ""] != 1) {
                        sendEmail("no-reply@mendocinocounty.org", capContacts[i].getPeople().getEmail() + "", "", "CAN_FA_SUBMITTED", params, null, capId);
                        hm[capContacts[i].getPeople().getEmail() + ""] = 1;
                    }
                }
            }
        }
    }
}
catch (err) {
    aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "Error on Issuance Email ASYNC", err);
}
function getParent()
{
    // returns the capId object of the parent.  Assumes only one parent!
    //
    getCapResult = aa.cap.getProjectParents(capId,1);
    if (getCapResult.getSuccess())
    {
        parentArray = getCapResult.getOutput();
        if (parentArray.length)
            return parentArray[0].getCapID();
        else
        {
            logDebug( "**WARNING: GetParent found no project parent for this application");
            return false;
        }
    }
    else
    {
        logDebug( "**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
        return false;
    }
}
function getContactName(vConObj) {
    if (vConObj.people.getContactTypeFlag() == "organization") {
        if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
            return vConObj.people.getBusinessName();

        return vConObj.people.getBusinessName2();
    }
    else {
        if (vConObj.people.getFullName() != null && vConObj.people.getFullName() != "") {
            return vConObj.people.getFullName();
        }
        if (vConObj.people.getFirstName() != null && vConObj.people.getLastName() != null) {
            return vConObj.people.getFirstName() + " " + vConObj.people.getLastName();
        }
        if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
            return vConObj.people.getBusinessName();

        return vConObj.people.getBusinessName2();
    }
}
function addParameter(pamaremeters, key, value) {
    if (key != null) {
        if (value == null) {
            value = "";
        }

        pamaremeters.put(key, value);
    }
}
function sendEmail(fromEmail, toEmail, CC, template, eParams, files) { // optional: itemCap
    var itemCap = capId;
    if (arguments.length == 7)
        itemCap = arguments[6]; // use cap ID specified in args

    //var sent = aa.document.sendEmailByTemplateName(fromEmail, toEmail, CC, template, eParams, files);
    if (eParams) {
        var bizDomScriptResult = aa.bizDomain.getBizDomain("NOTIFICATION_TEMPLATE_INFO_CANNABIS");
        if (bizDomScriptResult.getSuccess()) {
            var bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
            for (var i in bizDomScriptArray) {
                var desc = bizDomScriptArray[i].getDescription();
                var value = bizDomScriptArray[i].getBizdomainValue() + "";
                addParameter(eParams, value, desc);
            }
        }
    }
    toEmail = runEmailThroughSLEmailFilter(toEmail);
    var itempAltIDScriptModel = aa.cap.createCapIDScriptModel(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());
    var sent = aa.document.sendEmailAndSaveAsDocument(fromEmail, toEmail, CC, template, eParams, itempAltIDScriptModel, files);
}
function runEmailThroughSLEmailFilter(vEmail) {
    var filter = lookup("SL_EMAIL_CONTROL", "FILTER");
    if (filter == "ON") {
        var domains = String(lookup("SL_EMAIL_CONTROL", "DOMAIN_EXCEPTIONS"));
        var emails = String(lookup("SL_EMAIL_CONTROL", "EMAIL_EXCEPTIONS"));
        var vOriginalDomain = vEmail.substring(vEmail.indexOf("@") + 1, vEmail.length).toLowerCase();

        if (domains.toLowerCase().indexOf(String(vOriginalDomain).toLowerCase()) != -1)
            return vEmail;
        if (emails.toLowerCase().indexOf(String(vOriginalDomain).toLowerCase()) != -1)
            return vEmail;


        vEmail = vEmail.replace(vOriginalDomain, "DoNotSend.com");
    }
    return vEmail;
}
function lookup(stdChoice, stdValue) {
    var strControl;
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
    }
    return strControl;
}
function matches(eVal, argList) {
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i] == eVal) {
            return true;
        }
    }
    return false;
}
function dateFormatted(pMonth, pDay, pYear, pFormat) {
    var mth = "";
    var day = "";
    var ret = "";
    if (pMonth > 9)
        mth = pMonth.toString();
    else
        mth = "0" + pMonth.toString();

    if (pDay > 9)
        day = pDay.toString();
    else
        day = "0" + pDay.toString();

    if (pFormat == "YYYY-MM-DD")
        ret = pYear.toString() + "-" + mth + "-" + day;
    else
        ret = "" + mth + "/" + day + "/" + pYear.toString();

    return ret;
}

function appMatch(ats, matchCapId) // optional capId or CapID string
{
    if (!matchCapId) {
        return false;
    }

    matchCap = aa.cap.getCap(matchCapId).getOutput();
    matchArray = matchCap.getCapType().toString().split("/");

    var isMatch = true;
    var ata = ats.split("/");
    for (xx in ata)
        if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
            isMatch = false;

    return isMatch;
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