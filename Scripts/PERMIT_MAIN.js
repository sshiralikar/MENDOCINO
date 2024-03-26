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
        
    var tableData = "https://www.dropbox.com/s/7jt2cukhycboyo8/Trackit%20Cannabis%20Cultivation%20Table%20Permit_Main.js?dl=0";
    var json = getJSON(tableData);    

    logDebug("Processing: " + json.length);
    
    todayJS = new Date(dateAdd(null, 0));

    var coll = [];
    var conversionMap = {};

    permitTypeMap = {
        "1 MEDIUM OUTDOOR" : "1 (outdoor)",
        "1A MEDIUM INDOOR" : "1-A (indoor)",
        "1B MEDIUM MIXED LIGHT": "1-B (mixed light)",
        "1 MEDIUM MULTI-TYPE": "1-Multi-Type",
        "2 LARGE OUTDOOR" : "2 (outdoor)",
        "2A LARGE INDOOR": "2-A (indoor)",
        "2B LARGE MIXED LIGHT": "2-B (mixed light)",
        "2 LARGE MULTI-TYPE": "2-Multi-Type",
        "C SMALL OUTDOOR": "C (outdoor)",
        "CA SMALL INDOOR": "C-A (indoor)",
        "CB SMALL MIXED LIGHT": "C-B (mixed light)",
        "C2 SMALL MIXED LIGHT": "C-B (mixed light)",
        "C COTTAGE MULTI-TYPE": "C-Multi-Type",
        "4 NURSERY / SEED": "4-S (seed nursery)"
    }

    var failures = [];

    for(var i in json) {
        try {
            var row = json[i];
            scrubData(row);                
            //logDebug(formatDate(appliedDate));        
            var approvedDate = row["APPROVED"];
            var issuedDate = row["ISSUED"];
            var finaledDate = row["FINALED"];
            var expiredDate = row["EXPIRED"];
    
            var permitSubType = row["PermitSubType"];
            var recordTypeToCreate = determineRecordType(permitSubType);
            logDebug("Creating: " + recordTypeToCreate);
    
            var recordStatus = row["STATUS"];
            logDebug("Status: " + recordStatus);
    
            var appId = createCanApplication(recordTypeToCreate, row);
    
            if(!appId) {
                logDebug(row["PERMIT_NO"] + " already created");
                continue;
            }        
    
            var permitId = null;        
            var applicationStayId = null;
            var nonCultId = null;
    
            switch(recordStatus) {
                case "SUNSET VOID":
                    //create application - Use a Applied Date for File Date, close out with Void/Void                
                    updateAppStatus("Sunset Void", "", appId);
                    closeWorkflow(appId, "Void", "");
                    break;
                case "VOID":
                    updateAppStatus("Void", "", appId);
                    closeWorkflow(appId, "Void", "");
                    //create application and close out with Void/Void, Default to 0101YYYY for File Date - use OTHER_DATE1
                    break;
                case "RENEWAL APPROVED":
                    //Application Submittal & Accepted
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    break;
                case "RENEWAL ISSUED":
                    //Issuance/Issued, Parent Active depending on Expiration Date.
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    break;
                case "RENEWAL HOLD":
                    //Parent Permit Expired/Expired - close out record
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    break;
                case "RENEWAL UNDER REVIEW":
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    //if expiration is <= today, expire Parent permit Expired/Expired, update Record Detail Expiration Date
                    break;
                case "RENEWAL INCOMPLETE":
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    //if expiration is <= today, expire Parent permit Expired/Expired, update Record Detail Expiration Date
                    break;
                case "TRANSFER ISSUED":
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    //if expiration is <= today, expire Parent permit Expired/Expired, update Record Detail Expiration Date
                    break;
                case "TRANSFER UNDER REVIEW":
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);
                    //if expiration is <= today, expire Parent permit Expired/Expired, update Record Detail Expiration Date
                    break;
                case "NAS":
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);                
                    //create a child record to Application, 
                    //NAS closed with Approved/Approved, 
                    //populate the Expiration date to the NOAS Expiration Date 
                    //and update application appStatus to Notice of Application Stay
                    if(expiredDate) {
                        var nasExpDate = dateAdd(expiredDate, -365);
                        applicationStayId = createNAS(appId, row, recordTypeToCreate, nasExpDate);
                    }
                    break;
                case "ISSUED":
                    closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                    permitId = createCanPermit(appId, row, recordTypeToCreate);                
                    //create application close all task with Issuance Issued/Issued with Issued Date, create the parent, if expiration is <= today, expire Parent permit Expired/Expired, update Record Detail Expiration Date.
                    break;
                case "HOLD":
                    //create an application, if Approved Date exists, then activate Issuance task.
                    //create an application Application Submittal
                    updateAppStatus("Hold", "", appId);
                    if(approvedDate) {
                        closeTaskLocal("Application Submittal", "Accepted", "", "", appId);
                        activateTaskLocal("Issuance", appId);
                    }
                    break;
                case "CANCELLED":
                    //create an application and close all tasks with Void/Void
                    closeWorkflow(appId, "Void", "");
                    updateAppStatus("Cancelled", "", appId);
                    break;
                case "DENIED":
                    //create an application and close all tasks with Denied/Denied, use OTHER_DATE1
                    closeWorkflow(appId, "Denied", "");
                    updateAppStatus("Denied", "", appId);
                    break;
                case "NON CULTIVATION":
                    //creating an application with Issued/Issued, 
                    //create permit and where expiration is <= today, 
                    if(issuedDate) {
                        permitId = createCanPermit(appId, row, recordTypeToCreate);
                        if(expiredDate) {
                            var expiredDateJS = new Date(expiredDate);                                        
                            if(expiredDateJS > todayJS) {
                                if(permitId) {
                                    var nonCultExpDate = dateAdd(expiredDate, -365);
                                    nonCultId = createNonCult(permitId, row, recordTypeToCreate, nonCultExpDate);
                                    updateAppStatus("Notice of Non Cultivation", "", permitId);
                                    updateTask("Permit Status", "Notice of Non Cultivation", "", "", "", permitId);
                                }
                            }
                        }
                    }
                    //expire Parent permit Expired/Expired, update Record Detail Expiration Date. 
                    // Is Expiration Date is > today, then create child Notice of Non Cultivation record,                           
                    // update Permit wfStatus/appStatus Notice of Non Cultivation,
                    // update the NONC Expiration Date with Expired Date, update NONC - Requested Expiration Date + 4 years from Expired Date.  
                    //NONC Submitted Date populate 1 YYYY less than Expiration Date.
                    break;
                case "WITHDRAWN":
                    closeWorkflow(appId, "Withdrawn", "");
                    updateAppStatus("Withdrawn", "", appId);
                    if(issuedDate) {
                        permitId = createCanPermit(appId, row, recordTypeToCreate);
                        closeWorkflow(permitId, "Withdrawn", "");
                        updateAppStatus("Withdrawn", "", permitId);
                    }
                    //If Issued Date, create application and permit and close out all with Withdrawn/Withdrawn, if no Issued Date create application only and close out Withdrawn/Withdrawn. Use OTHER_DATE1
                    break;
                case "PHASE 3 UNDER REVIEW":
                    //create an application, activate Application Submittal
                    //updateAppStatus("Phase 3 Under Review", "", appId);
                    break;
                case "UNDER REVIEW":                
                    updateAppStatus("Under Review", "", appId);
                    updateTask("Application Submittal", "Under Review", "", "", "", appId);
                    if(expiredDate) {
                        var nasExpDate = dateAdd(expiredDate, -365);
                        applicationStayId = createNAS(appId, row, recordTypeToCreate, nasExpDate);
                    }
                    //create an application, default Application Submittal to appStatus
                    //if Expiration Date exists, we are creating Notice of Application Stay as a child record, and populate the NOAS Expiration Date, NOAS Submitted Date 1 YYYY prior to Expiration Date.
                    break;
                case "EXPIRED":
                    if(issuedDate) {
                        permitId = createCanPermit(appId, row, recordTypeToCreate);
                    } else {
                        updateAppStatus("Expired", "", appId);
                    }
                    break;
                case "PRE APPLICATION":
                    break;
                default:
                    logDebug(recordStatus + " not routed");
                    break;
            }
    
            var createdRecords = [appId, permitId, applicationStayId, nonCultId];
            conversionMap[row["PERMIT_NO"]] = {
                application_id : String(appId.getCustomID()),
                application_db_id : String(appId),
                permit_id : permitId ? String(permitId.getCustomID()) : "",
                permit_db_id : permitId ? String(permitId) : "",
                nas_id : applicationStayId ? String(applicationStayId.getCustomID()) : "",
                nas_db_id : applicationStayId ? String(applicationStayId) : "",
                noncult_id : nonCultId ? String(nonCultId.getCustomID()) : "",
                noncult_db_id : nonCultId ? String(nonCultId) : "",
            };
            var gisData = null;
            var auditObj = extractAuditData(row["RECORDID"]);
            var fileDateUsed = row["APPLIED"] || row["OTHER_DATE1"] || auditObj.date;
            var phaseOfRecord = determinePhaseType(fileDateUsed);
            for(var recListIndex in createdRecords) {
                var recId = createdRecords[recListIndex];
                if(!recId) {
                    continue;
                }
                //updateWorkDesc("Notes: " + row["NOTES"] + "\nDescription: " + row["DESCRIPTION"], recId)
                //Short Notes
                updateShortNotes(phaseOfRecord, recId);
                createParcel(row["SITE_APN"], recId);
                createAddress(recId, row);
                addGISObject(recId, row["SITE_APN"]);
                if(gisData && gisData.length > 0) {                
                    addASITable("GEOGRAPHIC INFORMATION", gisData, recId);                
                } else {
                    gisData = loadParcelData(row["SITE_APN"], recId);
                }
                var permitType = row["PermitSubType"];
                if(permitTypeMap[permitType]) {
                    if(recordTypeToCreate == "Cannabis/Nursery/Application/NA") {
                        editAppSpecific("Nursery Permit Type", permitTypeMap[permitType], recId);
                    } else {
                        editAppSpecific("Permit Type", permitTypeMap[permitType], recId);
                    }
                }
                if(issuedDate) {
                    editAppSpecific("Issued Date", issuedDate, recId);
                }
                if(expiredDate) {
                    editAppSpecific("Expiration Date", expiredDate, recId);
                }
            }        
            coll.push({
                "PERMIT_NO": row["PERMIT_NO"],
                "TRACKIT_STATUS": row["STATUS"],
                "TRACKIT_APPLIED": row["APPLIED"],
                "TRACKIT_ISSUED": row["ISSUED"],
                "TRACKIT_EXPIRED": row["EXPIRED"],
                "ACCELA_APP_ID": String(appId.getCustomID()),
                "ACCELA_PERMIT_ID": (permitId ? String(permitId.getCustomID()) : ""),
                "ACCELA_NAS_ID": (applicationStayId ? String(applicationStayId.getCustomID()) : ""),
                "ACCELA_NON_CULT_ID": (nonCultId ? String(nonCultId.getCustomID()) : ""),
            });
        } catch (err) {
            logDebug(err + " " + err.lineNumber);
            failures.push({
                index: String(i),
                ag_id: row["PERMIT_NO"],
                error: String(err + " " + err.lineNumber),
            });
        }
    }
    aa.print(JSON.stringify(conversionMap));
    aa.print("\n");
    aa.print(JSON.stringify(coll));
    aa.print("\n");
    aa.print("Failures: " + failures.length);
    aa.print(JSON.stringify(failures));
}

function generateSamples(jsonData) {
    var url = "https://www.dropbox.com/s/qhv21m5t9f6pq6q/find_unique_data.js?dl=0"
    var sampleMap = getJSON(url);
    var sampleArray = [];
    for(var statusProp in sampleMap) {
        var jsonIdArray = sampleMap[statusProp];
        logDebug(statusProp + " " + jsonIdArray.length);        
        for(var jsonIdIndex in jsonIdArray) {
            var uniqueId = jsonIdArray[jsonIdIndex];
            var jsonRow = jsonData[uniqueId];
            var permitSubType = jsonRow["PermitSubType"];
            var recordTypeToCreate = determineRecordType(permitSubType);
            var fourLevelArray = recordTypeToCreate.split("/");
            var yearMade = parseInt(jsonRow["YRMO"], 10)//"2017.0"
            var sequenceNumber = parseInt(jsonRow["SEQ_NO"], 10);//"13.0"
            var base = fourLevelArray[1] == "Nursery" ? "CAN-NA-" : "CAN-CA-";
            var generatedID = base + yearMade + "-" + zeroPad(sequenceNumber, 4);
            logDebug("Attempting to generate: " + generatedID);
            //Test ALT ID
            var testCap = aa.cap.getCapID(generatedID).getOutput();
            if(testCap) {
                logDebug("Record " + generatedID + " has already been generated");
                continue;
            }
            sampleArray.push(jsonRow);
            break;
        }
    }
    logDebug("Samples found: " + sampleArray.length);
    return sampleArray;
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

function createCanApplication(fourLevel, jsonRow) {

    //Generate ALT ID
    var fourLevelArray = fourLevel.split("/");
    var yearMade = jsonRow["YRMO"]//"2017.0"
    var sequenceNumber = jsonRow["SEQ_NO"];//"13.0"
    var auditObj = extractAuditData(jsonRow["RECORDID"]);
    var fileDateUsed = jsonRow["APPLIED"] || jsonRow["OTHER_DATE1"] || auditObj.date;
    var base = fourLevelArray[1] == "Nursery" ? ("CAN-N-") : ("CAN-C-");
    var generatedID = base + yearMade + "-" + zeroPad(sequenceNumber, 4) + "-APP";
    logDebug("Attempting to generate: " + generatedID);

    //Test ALT ID
    var testCap = aa.cap.getCapID(generatedID).getOutput();
    if(testCap) {
        logDebug("Record " + generatedID + " has already been generated");    
        return false;
    }    
    
    //Create App
    var capId = aa.cap.createApp(fourLevelArray[0], fourLevelArray[1], fourLevelArray[2], fourLevelArray[3], "").getOutput();

    //Update ALT ID
    updateAltIDLocal(generatedID, capId);
    capId = aa.cap.getCapID(generatedID).getOutput();

    //Update File Date
    if(fileDateUsed) {
        updateFileDate(fileDateUsed, capId);
    } else {
        logDebug("No applied/other_date1 found");
    }    

    //Assess Fees
    var feeQuantity = parseFloat(jsonRow["FEES_CHARGED"]);
    if(feeQuantity > 0) {
        addFee("CAN_CONV", "CAN_CONV", "FINAL", feeQuantity, "Y", capId);
    }

    var paymentAmount = parseFloat(jsonRow["FEES_PAID"]);
    if(paymentAmount > 0) {
        makePaymentForRecord(capId, paymentAmount);
    }

    return capId;
}

function createCanPermit(appId, jsonRow, fourLevel) {

    //Generate ALT ID
    var fourLevelArray = fourLevel.split("/");    
    var yearMade = jsonRow["YRMO"]//"2017.0"
    var sequenceNumber = jsonRow["SEQ_NO"];//"13.0"
    var base = fourLevelArray[1] == "Nursery" ? "CAN-N-" : "CAN-C-";
    var generatedID = base + yearMade + "-" + zeroPad(sequenceNumber, 4);
    logDebug("Attempting to generate: " + generatedID);    
    //Test ALT ID
    var testCap = aa.cap.getCapID(generatedID).getOutput();
    if(testCap) {
        logDebug("Record " + generatedID + " has already been generated");
        return false;
    }    

    //Create Permit
    var permitId = aa.cap.createApp(fourLevelArray[0], fourLevelArray[1], "Permit", fourLevelArray[3], "").getOutput();

    //Update ALT ID
    updateAltIDLocal(generatedID, permitId);
    permitId = aa.cap.getCapID(generatedID).getOutput();

    updateFileDate(jsonRow["ISSUED"], permitId);

    //Associated permit with app
    var relateResult = aa.cap.createAppHierarchy(permitId, appId);
    if(relateResult.getSuccess()) {
        logDebug("Added " + appId.getCustomID() + " to " + permitId.getCustomID());
        updateAppStatus("Issued", "", appId);
    }

    var expiredDate = jsonRow["EXPIRED"];
    var expiredDateJS = new Date(expiredDate);
    var renewalStatus = "";

    if(todayJS < expiredDateJS) {
        renewalStatus = "Active";
    } else {
        renewalStatus = "Expired";
    }

    try {
        var expRes = aa.expiration.getLicensesByCapID(permitId).getOutput();
        var scriptDate = aa.date.parseDate(expiredDate);
        if(expRes) {
            expRes.setExpStatus(renewalStatus);                
            expRes.setExpDate(scriptDate);
            updateAppStatus(renewalStatus, "", permitId);
            updateTask("Permit Status", renewalStatus, "", "", "", permitId);
            var editCapResult = aa.expiration.editB1Expiration(expRes.getB1Expiration());
            if(editCapResult.getSuccess()) {
                logDebug("Set renewal info to " + renewalStatus + " " + expiredDate);
            } else {
                logDebug("Did not successfully edit cap error: " + editCapResult.getErrorMessage())
            }        
        }
    } catch (err) {
        logDebug(err);
    }
    return permitId;
}

function createNonCult(appId, jsonRow, fourLevel, nonCultFileDate) {
    var fourLevel = "Cannabis/Amendment/Notice of Non-Cultivation/NA";
    var fourLevelArray = fourLevel.split("/");
    var nonCultId = aa.cap.createApp(fourLevelArray[0], fourLevelArray[1], fourLevelArray[2], fourLevelArray[3], "").getOutput();

    var yearMade = jsonRow["YRMO"]//"2017.0"
    var sequenceNumber = jsonRow["SEQ_NO"];//"13.0"        
    var base = fourLevelArray[1] == "Nursery" ? ("CAN-N-") : ("CAN-C-");
    var generatedID = base + yearMade + "-" + zeroPad(sequenceNumber, 4) + "-NNC-001";
    logDebug("Attempting to generate: " + generatedID);

    //Update ALT ID
    updateAltIDLocal(generatedID, nonCultId);
    nonCultId = aa.cap.getCapID(generatedID).getOutput();

    //one year from expiration date?
    updateFileDate(nonCultFileDate, nonCultId);

    var relateResult = aa.cap.createAppHierarchy(appId, nonCultId);
    if(relateResult.getSuccess()) {
        logDebug("Added " + nonCultId.getCustomID() + " to " + appId.getCustomID());        
    }
    return nonCultId;
}

function createNAS(appId, jsonRow, fourLevel, nasExpDate) {    
    var fourLevel = "Cannabis/Amendment/Notice of Application Stay/NA";
    var fourLevelArray = fourLevel.split("/");
    var nasId = aa.cap.createApp(fourLevelArray[0], fourLevelArray[1], fourLevelArray[2], fourLevelArray[3], "").getOutput();


    var yearMade = jsonRow["YRMO"]//"2017.0"
    var sequenceNumber = jsonRow["SEQ_NO"];//"13.0"        
    var base = fourLevelArray[1] == "Nursery" ? ("CAN-N-") : ("CAN-C-");
    var generatedID = base + yearMade + "-" + zeroPad(sequenceNumber, 4) + "-NOS-001";
    logDebug("Attempting to generate: " + generatedID);

    //Update ALT ID
    updateAltIDLocal(generatedID, nasId);
    nasId = aa.cap.getCapID(generatedID).getOutput();

    //one year from expiration date?
    updateFileDate(nasExpDate, nasId);

    var relateResult = aa.cap.createAppHierarchy(appId, nasId);
    if(relateResult.getSuccess()) {
        logDebug("Added " + nasId.getCustomID() + " to " + appId.getCustomID());        
    }
    return nasId;
}

function determineRecordType(PermitSubType) {
    if(PermitSubType.toLowerCase().indexOf("nursery") >= 0) {
        return "Cannabis/Nursery/Application/NA"
    }
    return "Cannabis/Cultivation/Application/NA";
}

function updateFileDate(date, itemCap) {
    var cap = aa.cap.getCap(itemCap).getOutput();
    if(!cap) {
        return false;
    }
    var capModel = cap.getCapModel();
    // var scriptDate = aa.date.parseDate(date);
    // explore(capModel);
    capModel.setFileDate(new Date(date));
    var result = aa.cap.editCapByPK(capModel);
    if(result.getSuccess()) {
        logDebug("Successfully updated file date " + date);
    } else {
        logDebug("Error updating file date " + result.getErrorMessage());
    }
}

function determinePhaseType(date) {
    var dateJS = new Date(date);
    var phase1Start = new Date("01/01/2017");
    var phase1End = new Date("10/04/2019");
    var phase2Start = new Date("10/05/2019");
    var phase2End = new Date("02/28/2022");
    logDebug("Audit date: " + dateJS);
    if(phase1Start <= dateJS && dateJS <= phase1End) {
        return "PH1";
    } else if (phase2Start <= dateJS && dateJS <= phase2End) {
        return "PH2";
    } else {
        return "PH3";
    }
}

function extractAuditData(trackitStamp) {    
    var trackitStampArray = trackitStamp.split(":");
    var dateString = String(trackitStampArray[1]).substring(2, 4) + "/" + String(trackitStampArray[1]).substring(4, 6) + "/" + (parseInt((trackitStampArray[1]).substring(0, 2), 10) + 2000);
    var userID = trackitStampArray[0];
    var extract = {
        user: userID,
        date: dateString,
    }
    return extract;
}


function scrubData(jsonRow) {
    var numFields = ["YRMO", "SEQ_NO"];
    for(var i in numFields) {
        var field = numFields[i];
        var value = jsonRow[field];
        jsonRow[field] = parseInt(String(value), 10);
    }
    // var dateFields = [
    //     "APPLIED",
    //     "APPROVED",
    //     "ISSUED",
    //     "EXPIRED",
    //     "OTHER_DATE1",
    // ]
    // for(var i in dateFields) {
    //     var field = dateFields[i];
    //     var value = jsonRow[field];
    //     jsonRow[field] = formatDate(value);
    // }    
}

function formatDate(dateData) {
    if(!dateData || dateData.length < 1) {
        logDebug("no date");
        return ""
    }
    logDebug("Old date: " + dateData);
    var dateString = String(dateData).split(" ")[0];
    dateString = dateString.split("/");
    dateString = zeroPad(dateString[0], 2) + "/" + zeroPad(dateString[1], 2) + "/" + dateString[2];
    logDebug("New date: " + dateString);
    return dateString;
}

function updateAltIDLocal(newAltId, itemCap) {
    updateResult = aa.cap.updateCapAltID(itemCap, newAltId);
    if (!updateResult.getSuccess()) {
      logDebug("WARNING: the altId was NOT updated to: " + newAltId + ", record ID still " + itemCap + ": " + updateResult.getErrorMessage());
      return true;
    } else {
      logDebug("Successfully changed the altId from: " + itemCap + " to: " + newAltId);
    }
    return false;
}

function makePaymentForRecord(itemCap, totalAmount) {
    p = aa.finance.createPaymentScriptModel();
    p.setAuditDate(aa.date.getCurrentDate());
    p.setAuditStatus("A");
    p.setCapID(itemCap);
    p.setCashierID("CAN_CONV");
    p.setPaymentSeqNbr(p.getPaymentSeqNbr());
    p.setPaymentAmount(totalAmount);
    p.setAmountNotAllocated(totalAmount);
    p.setPaymentChange(0);
    p.setPaymentComment("");
    p.setPaymentDate(aa.date.getCurrentDate());
    p.setPaymentMethod("CHECK");
    p.setPaymentStatus("Paid");
    p.setAcctID("");
    var presult = aa.finance.makePayment(p);
    applyPaymentsForRecord(itemCap);
}

function applyPaymentsForRecord(itemCap){
    var payResult = aa.finance.getPaymentByCapID(itemCap, null)
    if (!payResult.getSuccess()){
        logDebug("**ERROR: error retrieving payments " + payResult.getErrorMessage());
        return false
    }
    var payments = payResult.getOutput();
    for (var paynum in payments){
        var payment = payments[paynum];
        var payBalance = payment.getAmountNotAllocated();
        var payStatus = payment.getPaymentStatus();
        var feeResult = aa.finance.getFeeItemByCapID(itemCap);
        if (!feeResult.getSuccess()){
            logDebug("**ERROR: error retrieving fee items " + feeResult.getErrorMessage());
            return false
        }
        var feeArray = feeResult.getOutput();
        for (var feeNumber in feeArray){
            var feeItem = feeArray[feeNumber];
            var amtPaid = 0;
            var pfResult = aa.finance.getPaymentFeeItems(itemCap, null);
            if (feeItem.getFeeitemStatus() != "INVOICED")
                continue; // only apply to invoiced fees
            if (!pfResult.getSuccess())
            {
                logDebug("**ERROR: error retrieving fee payment items items " + pfResult.getErrorMessage());
                return false
            }
            var pfObj = pfResult.getOutput();
            for (ij in pfObj)
                if (feeItem.getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
                    amtPaid += pfObj[ij].getFeeAllocation()
            var feeBalance = feeItem.getFee() - amtPaid;
            if (feeBalance <= 0)
                continue; // this fee has no balance
            var fseqlist = new Array();
            var finvlist = new Array();
            var fpaylist = new Array();
            var invoiceResult = aa.finance.getFeeItemInvoiceByFeeNbr(itemCap, feeItem.getFeeSeqNbr(), null);
            if (!invoiceResult.getSuccess()){
                logDebug("**ERROR: error retrieving invoice items " + invoiceResult.getErrorMessage());
                return false
            }
            var invoiceItem = invoiceResult.getOutput();
            // Should return only one invoice number per fee item
            if (invoiceItem.length != 1){
                logDebug("**WARNING: fee item " + feeItem.getFeeSeqNbr() + " returned " + invoiceItem.length + " invoice matches")
            }
            else{
                fseqlist.push(feeItem.getFeeSeqNbr());
                finvlist.push(invoiceItem[0].getInvoiceNbr());
                if (feeBalance > payBalance)
                    fpaylist.push(payBalance);
                else
                    fpaylist.push(feeBalance);

                applyResult = aa.finance.applyPayment(itemCap, payment, fseqlist, finvlist, fpaylist, "NA", "NA", "0");
                if (applyResult.getSuccess()){
                    payBalance = payBalance - fpaylist[0];
                    logDebug("Applied $" + fpaylist[0] + " to fee code " + feeItem.getFeeCod() + ".  Payment Balance: $" + payBalance);
                }
                else{
                    logDebug("**ERROR: error applying payment " + applyResult.getErrorMessage());
                    return false
                }
            }
            // Generate Receipt
	        receiptResult = aa.finance.generateReceipt(itemCap, aa.date.getCurrentDate(), payment.getPaymentSeqNbr(), payment.getCashierID(), null);
            if (receiptResult.getSuccess()) {
                receipt = receiptResult.getOutput();
                logDebug("Receipt successfully created: ");// + receipt.getReceiptNbr());
            }else{
                logDebug("error generating receipt: " + receiptResult.getErrorMessage());
                return false;
            }

            if (payBalance <= 0){
                break;
            }
        }
    }
}

function closeWorkflow(itemCap, pStatus, pComment) {
    // Closes all tasks in CAP with specified status and comment
    var workflowResult = aa.workflow.getTasks(itemCap);
    if (workflowResult.getSuccess()) {
        var wfObj = workflowResult.getOutput();
    } else { 
        logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); 
        return false; 
    }
    var fTask;
    var stepnumber;
    var dispositionDate = aa.date.getCurrentDate();
    var wfnote = " ";
    var wftask;
    var systemUserObjResult = aa.person.getUser("ADMIN");
    var systemUserObj = null;
    if (systemUserObjResult.getSuccess()) {
        systemUserObj = systemUserObjResult.getOutput();
        logDebug("Fetched user obj.")
    } else {
        logDebug("Failed getting user obj.")
    }
    logDebug("wfObj length: " +wfObj.length)
    for (var i in wfObj) {
        fTask = wfObj[i];
        //explore(fTask)
        completeTask = fTask.getCompleteFlag();
        wftask = fTask.getTaskDescription();        
        holdId = capId;
        capId = itemCap;
        closeTask(String(wftask), pStatus, pComment, "");
        capId = holdId;        
        //logDebug(wftask + " active: " + activeTask);        
    }
}

function closeTaskLocal(wfstr,wfstat,wfcomment,wfnote, itemCap) {
	var useProcess = false;
	var processName = "";

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (var i in wfObj) {
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(itemCap,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			else
				aa.workflow.handleDisposition(itemCap,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			
			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
        }			
    }
}

function activateTaskLocal(wfstr, itemCap) {
    var useProcess = false;
    var processName = "";

    var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else {
        logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
        return false;
    }

    for (var i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();

            if (useProcess) {
                result = aa.workflow.adjustTask(itemCap, stepnumber, processID, "Y", "N", null, null)
            } else {
                result = aa.workflow.adjustTask(itemCap, stepnumber, "Y", "N", null, null)
            }
            if(result.getSuccess()) {
                logMessage("Activating Workflow Task: " + wfstr);
                logDebug("Activating Workflow Task: " + wfstr);
            } else {
                logDebug("Error activating wf task: " +result.getErrorMessage())
            }
            break;
        }
    }
}

function createParcel(parcelNum, itemCap) {
    if(!parcelNum || String(parcelNum).length == 0) {
        logDebug("APN not found: " + parcelNum);
        return null;
    }
    var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
    var emptyParcelModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelModel").getOutput();
    emptyParcelModel.setCapID(itemCap);
    emptyParcelModel.setPrimaryParcelFlag("Y");
    emptyParcelModel.setParcel(parcelNum);    
    newCapParcel.setParcelModel(emptyParcelModel);
    newCapParcel.setCapIDModel(itemCap);
    newCapParcel.setL1ParcelNo(parcelNum);
    newCapParcel.setParcelNo(parcelNum);    
    var result = aa.parcel.createCapParcelWithAPOAttribute(newCapParcel);
    if(result.getSuccess()) {
        logDebug("Created parcel: " + parcelNum + " on " + itemCap.getCustomID());
    } else {
        logDebug("Failed to create parcel " + result.getErrorType() + " " + result.getErrorMessage());
    }
}

function createAddress(itemCap, jsonRow) {
    try {
        var date = aa.util.parseDate(dateAdd(null, 0));
        var addressModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.AddressModel").getOutput();
    
        var streetNumber = jsonRow["SITE_NUMBER"];
        var unitNumber = jsonRow["SITE_UNIT_NO"];
        var streetName = jsonRow["SITE_STREETNAME"];
        var city = jsonRow["SITE_CITY"];
        var zip = jsonRow["SITE_ZIP"];
        var state = jsonRow["SITE_STATE"];
        var fullAddress = jsonRow["SITE_ADDR"];
    
        if(streetNumber) {
            streetNumber = parseInt(streetNumber, 10);
            if(streetNumber) {
                addressModel.setHouseNumberStart(streetNumber);
            }
        }
    
        if(unitNumber) {
            addressModel.setUnitStart(unitNumber);
        }
    
        if (streetName) {
            addressModel.setStreetName(streetName);
        }
    
        if(city){
            addressModel.setCity(city);
        }
    
        if(zip) {
            addressModel.setZip(zip);
        }
        
        if(state) {
            addressModel.setState(state);
        }
        
        addressModel.setFullAddress(fullAddress);    
    
        //WILL FAIL IF THIS STUFF ISN'T SET.
        addressModel.setCapID(itemCap);
        addressModel.setServiceProviderCode(aa.getServiceProviderCode());
        addressModel.setPrimaryFlag("Y")
        addressModel.setAuditID("ADMIN");
        addressModel.setAuditDate(date)
    
        var success = aa.address.createAddress(addressModel);
        if(success.getSuccess()) {
            logDebug("Successfully added " + fullAddress + " to record: " + itemCap.getCustomID())        
        } else {
            logDebug("Failed to add " + fullAddress + " to record: " + itemCap.getCustomID());        
        }
    } catch (err) {
        logDebug(err + " " + err.lineNumber);
    }
}

function addGISObject(itemCap, parcelNum) {	
	//var capRemoveResult = aa.gis.removeAllCapGISObjects(itemCap);
	//logDebug("Removed all existing GIS objects from " + itemCap.getCustomID() + ", success? " + capRemoveResult.getSuccess());
    if(!parcelNum || String(parcelNum).length == 0) {
        logDebug("APN not found: " + parcelNum + " did not create GIS object");
        return null;
    }

    var gisObjResult = aa.gis.getParcelGISObjects(parcelNum); // get gis objects on the parcel number
    if (gisObjResult.getSuccess()) 	{
        var fGisObj = gisObjResult.getOutput();
    } else { 
        logDebug("**WARNING: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; 
        return false 
    }

    for (a1 in fGisObj) {
        var gisTypeScriptModel = fGisObj[a1];
        var gisObjArray = gisTypeScriptModel.getGISObjects()
        for (b1 in gisObjArray) {
            var gisObjScriptModel = gisObjArray[b1];
            var gisObjModel = gisObjScriptModel.getGisObjectModel() ;
            var retval = aa.gis.addCapGISObject(itemCap, gisObjModel.getServiceID(), gisObjModel.getLayerId(), gisObjModel.getGisId());
            if (retval.getSuccess()) { 
                logDebug("Successfully added Cap GIS object: " + gisObjModel.getGisId())
            } else { 
                logDebug("**WARNING: Could not add Cap GIS Object.  Reason is: " + retval.getErrorType() + ":" + retval.getErrorMessage()); 
                return false;
            }	
        }
    }
}

function getGISBufferInfoLocal(svc,layer,numDistance, itemCap)
	{
	// returns an array of associative arrays
	// each additional parameter will return another value in the array
	//x = getGISBufferInfo("flagstaff","Parcels","50","PARCEL_ID1","MAP","BOOK","PARCEL","LOT_AREA");
	//
	//for (x1 in x)
	//   {
	//   aa.print("Object " + x1)
	//   for (x2 in x[x1])
	//      aa.print("  " + x2 + " = " + x[x1][x2])
	//   }

	var distanceType = "feet";
	var retArray = new Array();
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())		
		var buf = bufferTargetResult.getOutput();
	else
		{ aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(itemCap); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var n = proxObj[z1].getAttributeNames();
				var v = proxObj[z1].getAttributeValues();
				
				var valArray = new Array();
				
				//
				// 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
				// hardcoded this to GIS_ID
				//
				
				valArray["GIS_ID"] = proxObj[z1].getGisId()
				for (n1 in n)
					{
					valArray[n[n1]] = v[n1];
					}
				retArray.push(valArray);
				}
			
			}
		}
	return retArray
}

function loadParcelData(parcelNumber, itemCap) {

    if(!parcelNumber || String(parcelNumber).length == 0) {
        logDebug("APN not found: " + parcelNumber + " did load parcel data");
        return null;
    }
    logDebug("Parcel number provided: " + parcelNumber);
    var data = getGISBufferInfoLocal("MENDOCINO", "Parcels", 0, itemCap);
    var parcelMap = {};
    for(var i in data){        
        var gisData = data[i];
        var gisParcelNum = gisData.GIS_ID;        
        if(gisParcelNum && !parcelMap[gisParcelNum]) {
            parcelMap[gisParcelNum] = {};
            logDebug("Parcel number found on GIS Object: " + gisParcelNum);
            for(var prop in gisData) {
                var value = gisData[prop];
                var key = String(prop).replace(/_/g, "");
                parcelMap[gisParcelNum][key] = value;
            }
        }
    }
    
    var parcelData = parcelMap[parcelNumber];
    if(!parcelData) {
        logDebug("Unable to load parcel date");
        parcelData = queryGIS(parcelNumber);
    }
    logDebug("Parcel Number: " + parcelNumber);
    var rowsToLoad = [];
    var refreshDate = aa.util.formatDate(new Date(), "MM/dd/yyyy");    
    for(var prop in parcelData) {
        var row = {};
        var attrName = prop;
        var attrValue = parcelData[prop];
        //logDebug(attrName + " value: " + attrValue);
        if(String(attrValue).length > 0) {
            row["APN Number"] = parcelNumber;
            row["Attribute Name"] = attrName;
            row["Attribute Value"] = String(attrValue);
            row["Last Refreshed On"] = refreshDate;
            row["Source"] = "GIS";
            rowsToLoad.push(row);
        }
    }
    logDebug("Added rows: " + rowsToLoad.length);
    if(rowsToLoad.length > 0) {
        addASITable("GEOGRAPHIC INFORMATION", rowsToLoad, itemCap);
        return rowsToLoad;
    }
    return null;
}

function queryGIS(parcelNum) {
    var gisEndpoint = "https://gis.mendocinocounty.org/server/rest/services/Parcels_sde_pub/MapServer/6/query?where=APNFULL=" + parcelNum + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson"
    try {
        var result = aa.httpClient.get(gisEndpoint);
        if(result.getSuccess()) {
            var data = result.getOutput();
            data = JSON.parse(data);
            var features = data.features;
            if(features && features.length > 0) {
                var parcelData = features[0];
                if(parcelData && parcelData.attributes) {
                    //props(parcelData.attributes);
                    return parcelData.attributes;
                }                
            }            
        } else {
            logDebug(result.getErrorType() + " " + result.getErrorMessage());
        }
    } catch(err) {
        logDebug(err + " " + err.lineNumber);
    }
    return {};
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