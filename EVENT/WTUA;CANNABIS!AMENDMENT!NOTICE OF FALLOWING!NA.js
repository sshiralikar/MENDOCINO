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
    var calendarYear = "";
    var pCapId = getParent();
    var nofSubmittedDate = getAppSpecific("NOF Submitted Date", pCapId);
    var submittedDate = new Date(nofSubmittedDate + "");

    newDate = 12 + "/" + 31 + "/" + (parseInt(submittedDate.getFullYear()) + 1);
    logDebug(newDate)
    editAppSpecific("NOF Expiration Date", newDate, pCapId);

    // CAMEND-644
    if(submittedDate.getMonth() == 11) {
        calendarYear = parseInt(submittedDate.getFullYear()) + 1;
    } else if(submittedDate.getMonth() == 0){
        calendarYear = parseInt(submittedDate.getFullYear());
    }
    logDebug("NOF Calendar Year: " + calendarYear);
    editAppSpecific("NOF Calendar Year", calendarYear);
    editAppSpecific("NOF Calendar Year", calendarYear, pCapId);
    //CAMEND-535
    updateAppStatus("Notice of Fallowing","",pCapId);
    updateTask("Permit Status","Notice of Fallowing","","",pCapId);
    // CAMEND-633
    var newTableToAdd = [];
    newTableToAdd["Total SF/Total Nursery SF"] = parseInt(AInfo["Total SF/Total Nursery SF"]);
    newTableToAdd["Date of Approval"] = wfDateMMDDYYYY;
    newTableToAdd["Date of Expiration"] = newDate;

    addRowToASITable("NOTICE OF FALLOWING", newTableToAdd, pCapId);

    //CAMEND-693
    if(AInfo["NOF Intent Partial"] == "Yes")
    {
        var altId = capId.getCustomID()+"";
        if(altId.indexOf("NOFP") == -1)
        {
            var idArr = altId.split("-NOF-");
            var newId = idArr[0]+"-NOFP-"+idArr[1];
            aa.cap.updateCapAltID(capId, newId);
        }
    }
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

function addRowToASITable(tableName, tableValues) //optional capId
{
    //tableName is the name of the ASI table
    //tableValues is an associative array of values.  All elements must be either a string or asiTableVal object
    itemCap = capId
    if (arguments.length > 2) {
        itemCap = arguments[2]; //use capId specified in args
    }
    var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName);
    if (!tssmResult.getSuccess()) {
        logDebug("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
        return false;
    }
    var tssm = tssmResult.getOutput();
    var tsm = tssm.getAppSpecificTableModel();
    var fld = tsm.getTableField();
    var col = tsm.getColumns();
    var fld_readonly = tsm.getReadonlyField(); //get ReadOnly property
    var coli = col.iterator();
    while (coli.hasNext()) {
        colname = coli.next();
        if (!tableValues[colname.getColumnName()]) {
            logDebug("Value in " + colname.getColumnName() + " - " + tableValues[colname.getColumnName()]);
            logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
            tableValues[colname.getColumnName()] = "";
        }
        if (typeof (tableValues[colname.getColumnName()].fieldValue) != "undefined") {
            fld.add(tableValues[colname.getColumnName()].fieldValue);
            fld_readonly.add(tableValues[colname.getColumnName()].readOnly);
        }
        else // we are passed a string
        {
            fld.add(tableValues[colname.getColumnName()]);
            fld_readonly.add(null);
        }
    }
    tsm.setTableField(fld);
    tsm.setReadonlyField(fld_readonly); // set readonly field
    addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, currentUserID);
    if (!addResult.getSuccess()) {
        logDebug("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
        return false;
    }
    else {
        logDebug("Successfully added record to ASI Table: " + tableName);
    }
}