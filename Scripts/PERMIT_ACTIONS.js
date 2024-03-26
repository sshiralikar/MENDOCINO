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
    
    var tableData = "https://www.dropbox.com/s/g74b0bb9w4f7pou/Trackit%20Cannabis%20Cultivation%20Table%20Permit_Actions.js?dl=0";
    var json = getJSON(tableData);

    logDebug("Processing: " + json.length);    

    var coll = [];
    
    var conversionMap = getJSON("https://www.dropbox.com/s/bq78bqy6l7eqtx7/conversion_map.js?dl=0");
    
    //Research
    
    //DO NOT CONVERT Commercial Fee Waiver

    var workflowConversion = {
        "Application Intake and Acceptance Letter": true,
        "Cannabis Application Receipt": true,
        "Cannabis Initial Permit Issued": true,
        "Cannabis Permit Transfer": true,
        "Cannabis Renewal Acceptance": true,
        "Cannabis Renewal Intake": true,
        "Cannabis Renewal Issued": true,
        "Cannabis Transfer App Acceptance": true,
        "Cannabis Transfer App Completion": true,
        "Cannabis Transfer App Intake": true,
        "Information": true,
        "Information Required": true,
        "DA Verification": true,
        "NAS-Notice of Application Stay" : true,
        "NO CULT" : true,
    }

    var failures = [];

    for(var i in json) {
        try {

            var row = json[i];
            //scrubData(row);
            var actionType = row["ACTION_TYPE"];
            var recordId = row["PERMIT_NO"];
            var mapObj = conversionMap[recordId];
            if(!mapObj) {
                logDebug("Missing: " + recordId);
                continue;
            }
            if(workflowConversion[actionType] && mapObj.application_id) {
                var id = aa.cap.getCapID(mapObj.application_id).getOutput();
                createHistory(id, row);
                continue;
            }
            
            var recordsToProcess = [
                mapObj.application_id,
                mapObj.permit_id,
            ]
            for(var recIndex in recordsToProcess) {
                var id = recordsToProcess[recIndex];
                if(id) {
                    var recId = aa.cap.getCapID(id).getOutput();
                    createActivityEntry(recId, row);
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
    var dateFields = [
        "ACTION_DATE",
        "COMPLETED_DATE"
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

function createActivityEntry(itemCap, jsonRow){	

    /*
        {
            "PERMIT_NO": "AG_2017-0013",
            "ACTION_DATE": "2023-01-09 00:00:00",
            "ACTION_TYPE": "eMail",
            "ACTION_BY": "Diana De Los Santos",
            "ACTION_DESCRIPTION": "\r\n(1/9/2023 10:14 AM DDS) \r\nAgent emailed the Cannabis Program to get an update for the SSHQ and AQMD and overall status of the application.  A planner is not yet assigned to the application. I responded via email that a planner is not yet assigned and we will need more time to review.  Please see email below:\r\n\r\nHello Lindsey, \r\n\r\n Thank you for checking in on the status of applications,AG_2017-0013 & AG_2017-0014. The application needs to be assigned to a planner and once assign they will begin to review the application. Once a planner is assigned, they will most likely reach out to you and the applicant to begin the review. The Cannabis Department is working diligently to review applications.  Please feel free to  send us an email at mcdpod@mendocinocounty.org with the AG numbers in the subject line for updates regarding the applications. \r\n\r\nThank you again for your patience. \r\n\r\nSincerely, \r\n\r\nDiana De Los Santos\r\nPlanner I\r\nCannabis Department\r\nMendocino County",
            "LOCKID": "",
            "RECORDID": "DDS:2301091014522313",
            "COMPLETED_DATE": "2023-01-09 00:00:00",
            "exID": ""
        }
    */
    //actType, actStatus, actName, actDesc, actDueDate, 
    var auditData = extractAuditData(jsonRow["RECORDID"]);
    var auditUser = auditData.user;
    var usingDate = jsonRow["ACTION_DATE"];
    if(!usingDate) {
        usingDate = auditData.date;
    }
    var activityDate = new Date(usingDate);
	
	var act = aa.activity.getNewActivityModel().getOutput();
	var dt = aa.util.now();
	act.setServiceProviderCode(aa.getServiceProviderCode());
	act.setCapID(itemCap);
	act.setActivityType(jsonRow["ACTION_TYPE"]);
	act.setDueDate(activityDate);
	act.setStatusDate(activityDate);
	act.setActDate(activityDate);
	act.setAuditDate(activityDate);
	act.setAuditID(auditUser);
	act.setAuditStatus("A");
	act.setInternalOnly("Y");
	act.setActStatus("Completed");
	act.setActivityName(jsonRow["ACTION_TYPE"]);
	act.setActivityDescription(jsonRow["ACTION_DESCRIPTION"]);
	var actObj = aa.activity.createActivity(act);
	
	if (actObj.getSuccess()){
		logDebug("Successfully created activity " + itemCap.getCustomID());
		return true;
	}else{
		logDebug("Error creating activity");
		return false;
	}	
}

function createHistory(itemCap, jsonRow) {
    var auditData = extractAuditData(jsonRow["RECORDID"]);
    var usingDate = jsonRow["COMPLETED_DATE"];
    if(!usingDate) {
        usingDate = jsonRow["ACTION_DATE"];
    }
    if(!usingDate) {
        usingDate = auditData.date;
    }
    createWorkflowHistoryTask(itemCap, jsonRow["ACTION_TYPE"], "Complete", auditData.user, jsonRow["ACTION_DESCRIPTION"], usingDate);
}

function createWorkflowHistoryTask(itemCap, taskName, taskResult, userId, taskComment, statusDate) {
    var model = aa.workflow.getTaskItemScriptModel().getOutput();//com.accela.aa.emse.dom.TaskItemScriptModel
    var taskItemModel = model.taskItem;
    //explore(taskItemModel);

    //MINIMUM Requirements
    taskItemModel.setCapID(itemCap);
    taskItemModel.setTaskDescription(taskName);
    taskItemModel.setDisposition(taskResult);
    taskItemModel.setAuditID(userId);
    
    //Additional useful fields
    taskItemModel.setDispositionComment(taskComment);    
    taskItemModel.setDispositionDate(new Date(statusDate));
    taskItemModel.setAuditDate(new Date(statusDate));
    taskItemModel.setStatusDate(new Date(statusDate));
    taskItemModel.setProcessCode("CONV");
    var workflowBiz = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
    var result = workflowBiz.createTaskAudit(taskItemModel);    
    logDebug("Created workflow " + itemCap.getCustomID());
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