var myCapId = "";
var myUserId = "ADMIN";
var eventName = "";

var useProductInclude = true; //  set to true to use the "productized" include file (events->custom script), false to use scripts from (events->scripts)
var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.
/* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1());  aa.env.setValue("PermitId2",tmpID.getID2());    aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {     useSA = true;       SA = bzr.getOutput().getDescription();  bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT");     if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }  }if (SA) {  eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));   eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript)); /* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript)); }else { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));   }   eval(getScriptText("INCLUDES_CUSTOM",null,useProductInclude));if (documentOnly) {   doStandardChoiceActions2(controlString,false,0);    aa.env.setValue("ScriptReturnCode", "0");   aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");  aa.abortScript();   }var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {   var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");    doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";   var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");    doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";  }   function getScriptText(vScriptName, servProvCode, useProductScripts) {  if (!servProvCode)  servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase();    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();  try {       if (useProductScripts) {            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);     } else {            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");      }       return emseScript.getScriptText() + ""; } catch (err) {     return "";  }}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z);

// aa.env.setValue("Param1", "Value");//test params

// var param = String(aa.env.getValue("Param1"))//always come back as an object so use conversion

try {
    showDebug = true;
    
    //aa.sendMail("tnabc@no-reply.com", "sal@grayquarter.com","","title","content");

    var count = 0;
    var start = new Date();
    
    //Code
    mainProccess();

    var end = new Date();
    var seconds = (end.getTime() - start.getTime())/1000;
    logDebug("Script time = " + seconds + " seconds");
    
    
} catch (err) {
    logDebug("A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
    aa.print("A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
}
// end user code
if(showDebug) {
    aa.env.setValue("ScriptReturnCode", "0");   
    aa.env.setValue("ScriptReturnMessage", debug);
}

function mainProccess() {    

    var tableData = "https://www.dropbox.com/s/oltgj2lnltca7es/Permit_People.js?dl=0";
    var json = getJSON(tableData);

    logDebug("Processing: " + json.length);    

    var coll = [];
    var conversionMap = getJSON("https://www.dropbox.com/s/bq78bqy6l7eqtx7/conversion_map.js?dl=0");

    var referenceMap = {};

    var failures = [];

    for(var i in json) {
        try {
            var row = json[i];
            scrubData(row);
            var refId = null;
            var email = row["EMAIL"];
            var agId = row["PERMIT_NO"];
            if(email && referenceMap[email]) {
                refId = referenceMap[email];
            }
            var convRecords = conversionMap[agId];
            if(!convRecords) {
                logDebug("Missing: " + agId);
                continue;
            }
            for(var recKey in convRecords) {
                var id = convRecords[recKey];
                if(!id) {
                    continue;
                }
                var capId = aa.cap.getCapID(id).getOutput();
                if(!capId) {
                    //logDebug("Could not find converted Accela record");
                    continue;
                }
                if(refId) {
                    //associated refId
                    logDebug("Found ref " + refId);
                    var refPeople = aa.people.getPeople(refId).getOutput();
                    refPeople.setContactType(row["NAMETYPE"]);
                    refPeople.setFlag("N");
                    var conAdd = aa.proxyInvoker.newInstance("com.accela.orm.model.address.ContactAddressModel").getOutput();
                    conAdd.setEntityID(parseInt(refId));
                    conAdd.setEntityType("CONTACT");
                    var addList = aa.address.getContactAddressList(conAdd).getOutput();
                    logDebug("Address list: " + addList + " " + (addList ? addList.length : 0));
                    if(addList && addList[0]) { 
                        logDebug("Found contact address for " + refId + " on " + capId.getCustomID());
                        var arrayList = aa.util.newArrayList()
                        arrayList.add(addList[0].getContactAddressModel());
                        refPeople.setContactAddressList(arrayList);
                    }
                    var result = aa.people.createCapContactWithRefPeopleModel(capId, refPeople);
                    if (result.getSuccess()) {
                        logDebug("Successfully added " + refId + " contact to record " + capId.getCustomID());
                    } else {
                        logDebug("Error creating the contact " + result.getErrorMessage());
                    }                                                
                    continue;
                }
                logDebug("Email: " + email); 
                if(email) {
                    //logDebug("Create ref");
                    refId = createReferenceContact(capId, row);
                    if(refId) {
                        referenceMap[email] = parseInt(String(refId), 10);
                    }
                } else {
                    //logDebug("Create trans");
                    createTransactionalContact(capId, row);
                }            
            }        
        } catch (err) {
            logDebug(err + " " + err.lineNumber);
            failures.push({
                index: String(i),
                ag_id: row["PERMIT_NO"],
                error: String(err + " " + err.lineNumber),
            });
        }        
    }
    aa.print("Failures: " + failures.length);
    aa.print(JSON.stringify(failures));
    aa.print("Reference map:");
    aa.print(JSON.stringify(referenceMap));
}

function correctURL(original) {
    var base = "https://www.dl.dropboxusercontent.com/s/"
    var uniqueId = original.split("/s/")[1];
    var meat = uniqueId.slice(0, uniqueId.length - 5);
    var goodUrl = base + meat;
    logDebug(goodUrl);
    return goodUrl;    
}

function getJSON(endpoint) {
    try {
        var goodUrl = correctURL(endpoint);
        var result = aa.httpClient.get(goodUrl);
        if(result.getSuccess()) {
            var data = result.getOutput();
            return JSON.parse(data);
        }
    } catch (err) {
        logDebug(err + " " + err.lineNumber);
    }
    return [];
}

function scrubData(jsonRow) {
    var lowerCaseFields = {
        "EMAIL" : true,    
    }
    for(var prop in jsonRow){
        var value = jsonRow[prop];
        if(prop == "NAMETYPE") {
            continue;
        }
        if(value) {
            if(lowerCaseFields[prop]) {
                value = String(value).toLowerCase();
                if(value.length > 0 && value.indexOf("@") > 0) {
                    var testEmail = value.split("@");
                    value = testEmail[0] + "@_" + testEmail[1];
                    //logDebug("New email: " + value);
                }
                jsonRow[prop] = String(value).toLowerCase();
            } else {
                jsonRow[prop] = String(value).toUpperCase();
            }
        }
    }
}

function createTransactionalContact(itemCap, jsonRow) {
    var c = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactModel").getOutput();
    var p = aa.people.getPeopleModel();
    p.setServiceProviderCode(aa.getServiceProviderCode());

    if(jsonRow["FirstName"] && jsonRow["LastName"]) {
        p.setFirstName(jsonRow["FirstName"]);
        p.setLastName(jsonRow["LastName"]);
    } else {
        p.setFirstName(jsonRow["NAME"]);
    }

    p.setFlag("N");    
    p.setFullName(jsonRow["NAME"]);
    p.setContactType("individual");
    if(jsonRow["PHONE"]) {
        p.setPhone1(jsonRow["PHONE"])
    }
    if(jsonRow["FAX"]) {
        p.setFax("FAX");
    }
    if(jsonRow["CELL"]) {
        p.setPhone2(jsonRow["CELL"]);
    }
    p.setComment("Other Name: " + jsonRow["OTHER_NAME"] + "\n Phone_Ext: " + jsonRow["PHONE_EXT"]);
    //explore(p);
    
    var address = aa.proxyInvoker.newInstance("com.accela.orm.model.address.ContactAddressModel").getOutput();

    c.setPeople(p);
    c.setContactType(jsonRow["NAMETYPE"]);
    c.setCapID(itemCap);    

    var peopleResult = aa.people.createCapContactWithAttribute(c);// set attributes
    if(peopleResult.getSuccess()) {
        logDebug("Successfuly made contact " + itemCap.getCustomID());
        //logDebug(c.getContactSeqNumber());
        address.setEntityID(parseInt(c.getContactSeqNumber(), 10));
        address.setEntityType("CAP_CONTACT");
        address.setAddressType("Mailing");
        if(jsonRow["ADDRESS1"]) {
            address.setAddressLine1(jsonRow["ADDRESS1"]);
        }
        if(jsonRow["ADDRESS2"]) {
            address.setAddressLine1(jsonRow["ADDRESS2"]);
        }
        if(jsonRow["CITY"]) {
            address.setCity(jsonRow["CITY"]);
        }
        if(jsonRow["STATE"]) {
            address.setState(jsonRow["STATE"]);
        }
        if(jsonRow["ZIP"]) {
            address.setZip(jsonRow["ZIP"]);
        }
        address.setPrimary("Y");

        address = aa.address.createCapContactAddress(itemCap, address);
        if(address.getSuccess()) {
            logDebug("Successfully created cap address " + c.getContactSeqNumber());
        }
        
        return true;
    } else {
        logDebug(peopleResult.getErrorMessage() + " " + peopleResult.getErrorType())
        return false;
    }
}

function createReferenceContact(itemCap, jsonRow) {
    // modified from COS_GEN_034_createRefContact
    //explore(arguments)
    var peopleModel = aa.people.getPeopleModel();
    peopleModel.setServiceProviderCode(aa.getServiceProviderCode());

    if(jsonRow["FirstName"] && jsonRow["LastName"]) {
        peopleModel.setFirstName(jsonRow["FirstName"]);
        peopleModel.setLastName(jsonRow["LastName"]);
    } else {
        peopleModel.setFirstName(jsonRow["NAME"]);
    }

    //peopleModel.setFlag("Y");    
    peopleModel.setFullName(jsonRow["NAME"]);
    peopleModel.setContactType("Individual");
    peopleModel.setContactTypeFlag("individual");
    if(jsonRow["PHONE"]) {
        peopleModel.setPhone1(jsonRow["PHONE"])
    }
    if(jsonRow["FAX"]) {
        peopleModel.setFax("FAX");
    }
    if(jsonRow["CELL"]) {
        peopleModel.setPhone2(jsonRow["CELL"]);
    }
    peopleModel.setComment("Other Name: " + jsonRow["OTHER_NAME"] + "\n Phone_Ext: " + jsonRow["PHONE_EXT"]);
    peopleModel.setEmail(jsonRow["EMAIL"]);        
    peopleModel.setCountryCode('US');    
    peopleModel.setAuditID("CONV");
    peopleModel.setAuditStatus("A");

    var result = aa.people.createPeople(peopleModel);
    if (result.getSuccess() != true) {
        logDebug("Failed to create ref contact. " + result.errorType + ': ' + result.errorMessage);
        return null;
    } else {
        logDebug("Successfully created ref contact");
    }
    //props(peopleModel)
    var refId = peopleModel.contactSeqNumber;

    var address = aa.proxyInvoker.newInstance("com.accela.orm.model.address.ContactAddressModel").getOutput();
    address.setEntityID(parseInt(refId, 10));
    address.setEntityType("CONTACT");
    address.setAddressType("Mailing");
    if(jsonRow["ADDRESS1"]) {
        address.setAddressLine1(jsonRow["ADDRESS1"]);
    }
    if(jsonRow["ADDRESS2"]) {
        address.setAddressLine1(jsonRow["ADDRESS2"]);
    }
    if(jsonRow["CITY"]) {
        address.setCity(jsonRow["CITY"]);
    }
    if(jsonRow["STATE"]) {
        address.setState(jsonRow["STATE"]);
    }
    if(jsonRow["ZIP"]) {
        address.setZip(jsonRow["ZIP"]);
    }
    address.setPrimary("Y");
    var result = aa.address.createContactAddress(address)    
    if (result.getSuccess() != true) {
        logDebug("Failed to add address to ref contact " + refId + ". "
            + result.errorType + ': ' + result.errorMessage);        
    } else {
        logDebug("Added address to people model");
    }
    
    var refPeople = aa.people.getPeople(refId).getOutput();    
    refPeople.setContactType(jsonRow["NAMETYPE"]);
    refPeople.setFlag("N");
    var conAdd = aa.proxyInvoker.newInstance("com.accela.orm.model.address.ContactAddressModel").getOutput();
    conAdd.setEntityID(parseInt(refId));
    conAdd.setEntityType("CONTACT");
    var addList = aa.address.getContactAddressList(conAdd).getOutput();
    logDebug("Address list: " + addList + " " + (addList ? addList.length : 0));
    if(addList && addList[0]) { 
        logDebug("Found contact address for " + refId + " on " + itemCap.getCustomID());
        var arrayList = aa.util.newArrayList()
        arrayList.add(addList[0].getContactAddressModel());
        refPeople.setContactAddressList(arrayList);
    }
    var result = aa.people.createCapContactWithRefPeopleModel(itemCap, refPeople);
    if (result.getSuccess()) {
        logDebug("Successfully added " + refId + " contact to record " + itemCap.getCustomID());
    } else {
        logDebug("Error creating the contact " + result.getErrorMessage());
    }
    
    /*refPeople.setContactType(jsonRow["NAMETYPE"]);
    refPeople.setFlag("N");
    var result = aa.people.createCapContactWithRefPeopleModel(itemCap, refPeople);
    if (result.getSuccess()) {
        logDebug("Successfully added " + refId + " contact to record " + itemCap.getCustomID());
    } else {
        logDebug("Error creating the contact " + result.getErrorMessage());
    }

    address.setEntityID(parseInt(refPeople.contactSeqNumber, 10));
    address.setEntityType("CAP_CONTACT");

    var result = aa.address.createCapContactAddress(itemCap, address);
    if(result.getSuccess()) {
        logDebug("Successfully created cap address to " + refPeople.contactSeqNumber);
    } else {
        logDebug(result.getErrorType() + " " + result.getErrorMessage());
    }*/

    return refId;    
}

function explore(objExplore) {
    logDebug("Methods:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) == "function") {
            logDebug("<font color=blue><u><b>" + x + "</b></u></font> ");
            logDebug("   " + objExplore[x] + "<br>");
        }
    }
    logDebug("");
    logDebug("Properties:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) != "function") logDebug("  <b> " + x + ": </b> " + objExplore[x]);
    }
}

function props(objExplore) {
    logDebug("Properties:")
    aa.print("Properties:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) != "function") {
            logDebug("  <b> " + x + ": </b> " + objExplore[x]);
            aa.print( x + " : " + objExplore[x]);
        }	
    }
}

function aaExplore(objExplore) {
    aa.print("Methods:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) == "function") {
            aa.print(x);
            aa.print(objExplore[x]);
        }
    }
    aa.print("");
    aa.print("Properties:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) != "function") {
            aa.print(x + " : " + objExplore[x]);
        } 
    }
}