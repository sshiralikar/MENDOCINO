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

    var tableData = "https://www.dropbox.com/s/iao2bfdvgvuq16g/Trackit%20Cannabis%20Cultivation%20Table%20Permit_Inspections.js?dl=0";
    var json = getJSON(tableData);

    logDebug("Processing: " + json.length);    

    var coll = [];
    var conversionMap = getJSON("https://www.dropbox.com/s/bq78bqy6l7eqtx7/conversion_map.js?dl=0");

    trackitUsers = getJSON("https://www.dropbox.com/s/bdcl8scvton5t1e/trackit_users.js?dl=0");

    // Admin - Convert as is in Inspection History
    // PUE - convert as is in Inspection History
    // WEIGHTS AND MEASURES - convert as in Inspection History

    // Annual Compliance - map to Annual
    // -Cultivation - Annual Inspection
    // -Nursery - Bi-annual Inspection

    // Annual Site - map to Annual
    // -Cultivation - Annual Inspection
    // -Nursery - Bi-annual Inspection

    // Cal Cannabis - map to Compliance
    // -Cultivation - Compliance Inspection
    // -Nursery - Compliance Inspection
    // NAS - map to Compliance

    // Follow Up - map to Follow-up
    // -Cultivation - Follow-up Inspection
    // -Nursery - Follow-up Inspection

    // Pre Site - map to Pre-site - no scheduled date do not convert
    // -Cultivation - Pre-site Inspection
    // -Nursery - Pre-site Inspection

    var inspectionMap = {
        "admin": {
            cultivation: "ADMIN",
            nursery: "ADMIN",
        },
        "pue": {
            cultivation: "PUE",
            nursery: "PUE",
        },
        "weights and measures": {
            cultivation: "WEIGHTS AND MEASURES",
            nursery: "WEIGHTS AND MEASURES",
        },
        "annual Compliance": {
            cultivation: "Cultivation - Annual Inspection",
            nursery: "Nursery - Bi-annual Inspection",
        },
        "annual Site": {
            cultivation: "Cultivation - Annual Inspection",
            nursery: "Nursery - Bi-annual Inspection",
        },
        "cal cannabis": {
            cultivation: "Cultivation - Compliance Inspection",
            nursery: "Nursery - Compliance Inspection",
        },
        "nas": {
            cultivation: "Cultivation - Compliance Inspection",
            nursery: "Nursery - Compliance Inspection",
        },
        "follow up": {
            cultivation: "Cultivation - Follow-up Inspection",
            nursery: "Nursery - Follow-up Inspection",
        },
        "pre site": {
            cultivation: "Cultivation - Pre-site Inspection",
            nursery: "Nursery - Pre-site Inspection",
        },
    }    

    var failures = [];

    for(var i in json) {
        try {
            var row = json[i];
            //scrubData(row);
            var rowInspType = row["InspectionType"];
            var scheduleDate = row["SCHEDULED_DATE"];
            if(rowInspType == "PRE SITE" && !scheduleDate) {
                continue;
            }
            var agId = row["PERMIT_NO"];
            var conversionObj = conversionMap[agId];
            if(!conversionObj) {
                logDebug("Missing: " + agId);
                continue;
            }
            var appId = conversionObj.application_id;
            var capId = aa.cap.getCapID(appId).getOutput();
            var cap = aa.cap.getCap(capId).getOutput();
            var capType = cap.getCapType();
            var capTypeArray = String(capType).split("/");
            var appType = capTypeArray[1].toLowerCase();
            var inspectionKey = inspectionMap[row["InspectionType"].toLowerCase()];
            if(!inspectionKey) {
                logDebug("Did not convert: " + row["InspectionType"]);
                continue;
            }
            var inspType = inspectionKey[appType];
            if(!scheduleDate) {
                createPendingInsp(capId, inspType, row);
            } else {
                var inspId = scheduleInsp(capId, inspType, row);
            }
            //updateRequestDate(capId, inspId, row);
            if(row["COMPLETED_DATE"]) {
                resultInspectionLocal(capId, inspId, row, trackitUsers);                
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

}

function scrubData(jsonRow) {
    var dateFields = [
        "SCHEDULED_DATE",
        "COMPLETED_DATE",
        "CREATED_DATE",
    ]
    for(var i in dateFields) {
        var field = dateFields[i];
        var value = jsonRow[field];
        jsonRow[field] = formatDate(value);
    }
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

function scheduleInsp(itemCap, inspType, jsonRow) {
    logDebug("Scheudling: " + inspType);
    var schedRes = aa.inspection.scheduleInspection(itemCap, null, aa.date.parseDate(jsonRow["SCHEDULED_DATE"]), null, inspType, "Inspector: " + jsonRow["INSPECTOR"] + "\nRemarks: " + jsonRow["REMARKS"] + "\n\nNotes: " + jsonRow["NOTES"]);
    if (schedRes.getSuccess()) {
        logDebug(itemCap.getCustomID() + " successfully scheduled inspection : " + jsonRow["SCHEDULED_DATE"]);
        return schedRes.getOutput();//insp id
    } else {
        logDebug( "Failed to schedule inspection" + schedRes.getErrorMessage());
    }
    return null;
}

function updateRequestDate(itemCap, inspId, jsonRow) {
    var inspScriptModel = aa.inspection.getInspection(itemCap, inspId).getOutput();
    inspScriptModel.setRequestDate(aa.date.parseDate(jsonRow["CREATED_DATE"]));
    var inspModel = inspScriptModel.inspection;
    var activityModel = inspModel.activity;
    activityModel.setAuditDate(new Date(jsonRow["CREATED_DATE"]));
    //explore(activityModel);
    var result = aa.inspection.editInspection(inspScriptModel);
    if(result.getSuccess()) {
        logDebug("Updated request date " + result.getErrorType() + " " + result.getErrorMessage());
        return true;
    }
    return false;
}

function createPendingInsp(itemCap, inspType, jsonRow) {
    logDebug("Pending: " + inspType);
    var inspScriptModel = aa.inspection.getInspectionScriptModel().getOutput();        
    var inspModel = inspScriptModel.getInspection();
    inspModel.setInspectionType(inspType);
    var activityModel = inspModel.getActivity();
    activityModel.setRecordDate(new Date(jsonRow["CREATED_DATE"]));//Request Date
    activityModel.setCapIDModel(itemCap);
    var inspectionGroup = String(inspType).indexOf("Cultivation") >= 0 ? "CAN_CULT" : "CAN_NURS";
    activityModel.setInspectionGroup(inspectionGroup);//Required to be readable in AV
    var pendingResult = aa.inspection.pendingInspection(inspModel);
    logDebug(itemCap.getCustomID() + " " + pendingResult.getSuccess() + " : " + pendingResult.getErrorType() + " " + pendingResult.getErrorMessage());
    var inspId = pendingResult.getOutput();
    if(inspId) {
        var commentModel = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CommentModel").getOutput();	
        commentModel.setCapID(itemCap);
        commentModel.setAuditStatus("A");
        commentModel.setAuditID("CONV");
        commentModel.setAuditDate(new Date());
        commentModel.setCommentType("Inspection Request Comment");
        commentModel.setActivityIDNumber(inspId);
        commentModel.setText("Inspector: " + jsonRow["INSPECTOR"] + "\nRemarks: " + jsonRow["REMARKS"] + "\n\nNotes: " + jsonRow["NOTES"]);
        inspModel.setRequestComment(commentModel);
        var result = aa.inspection.editInspection(inspScriptModel);
        logDebug(result.getSuccess() + " added insp comment");
    }    
}

function resultInspectionLocal(itemCap, inspId, jsonRow, usersMap) {
    var inspScriptModel = aa.inspection.getInspection(itemCap, inspId).getOutput();    
    inspScriptModel.setInspectionStatus(jsonRow["RESULT"]);    
    inspScriptModel.setInspectionStatusDate(aa.date.parseDate(jsonRow["COMPLETED_DATE"]));
    inspScriptModel.setInspectionComments("Inspector: " + jsonRow["INSPECTOR"] + "\nRemarks: " + jsonRow["REMARKS"] + "\n\nNotes: " + jsonRow["NOTES"]);
    var inspector = jsonRow["INSPECTOR"];
    logDebug("Inspector: " + inspector + " " + inspector.length);
    var accelaID = usersMap[String(inspector)];
    logDebug("Acceal ID: " + accelaID);    
    if(inspector && accelaID) {
        var userObj = aa.person.getUser(accelaID).getOutput();
        if(userObj) {
            logDebug("Setting user: " + userObj);
            inspScriptModel.setInspector(userObj);
        }
    }
    var inspModel = inspScriptModel.getInspection();
    var activity = inspModel.getActivity();
    activity.setCompletionDate(new Date(jsonRow["COMPLETED_DATE"]));
    activity.setDocumentDescription("Insp Completed");
    activity.setScheduled(false);
    var result = aa.inspection.editInspection(inspScriptModel);
    if(result.getSuccess()) {
        logDebug("Resulted Inspection");    
    }
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