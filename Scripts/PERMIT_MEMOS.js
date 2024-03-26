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

    var tableData = "https://www.dropbox.com/s/59pj8qygu52vfkc/Trackit%20Cannabis%20Cultivation%20Table%20PERMIT_MEMOS.js?dl=0";
    var json = getJSON(tableData);

    logDebug("Processing: " + json.length);    

    var coll = [];
    var conversionMap = getJSON("https://www.dropbox.com/s/bq78bqy6l7eqtx7/conversion_map.js?dl=0");

    var commentStore = [];
    var lastRecordID = null;

    var failures = [];

    for(var i in json) {
        try {
            var row = json[i];
            var currentRecord = row["PERMIT_NO"];
            if(!lastRecordID) {
                lastRecordID = row["PERMIT_NO"];
            }
            if(currentRecord != lastRecordID) {
                var mapObj = conversionMap[lastRecordID];
                if(!mapObj) {
                    logDebug("Missing: " + lastRecordID);
                    commentStore = [];
                    lastRecordID = currentRecord;
                    commentStore.push(row);
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
                        processComment(commentStore, recId)
                    }
                }
                commentStore = [];
                lastRecordID = currentRecord;
            }
            commentStore.push(row);
        } catch (err) {
            logDebug(err + " " + err.lineNumber);
            failures.push({
                index: String(i),
                ag_id: row["PERMIT_NO"],
                error: String(err + " " + err.lineNumber),
            });
        }
    }
    if(commentStore.length) {
        logDebug("Last row!");
        var mapObj = conversionMap[lastRecordID];
        if(!mapObj) {
            logDebug("Missing: " + lastRecordID);
            return;
        }
        var recordsToProcess = [
            mapObj.application_id,
            mapObj.permit_id,
        ]
        for(var recIndex in recordsToProcess) {
            var id = recordsToProcess[recIndex];
            if(id) {
                var recId = aa.cap.getCapID(id).getOutput();
                processComment(commentStore, recId);
            }
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

function processComment(commentStore, itemCap) {
    commentStore.sort(function (a, b) {
        return a.SEQ_NUM < b.SEQ_NUM;
    });
    var collectComment = "";
    var auditData = extractAuditData(commentStore[0].RECORDID);
    commentStore.map(function(item) {
        collectComment += item.NOTES;
    })
    createCapCommentLocal(collectComment, itemCap, auditData.user, auditData.date);  
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

function createCapCommentLocal(vComment, vCapId, userId, commentDate) //optional CapId, optional vDispOnInsp
{
	//var vCapId = capId;
	var vDispOnInsp = "N";
	var comDate = aa.date.parseDate(commentDate);
	var capCommentScriptModel = aa.cap.createCapCommentScriptModel();
	capCommentScriptModel.setCapIDModel(vCapId);
	capCommentScriptModel.setCommentType("CONVERSION");
	capCommentScriptModel.setSynopsis("");
	capCommentScriptModel.setText(vComment);
	capCommentScriptModel.setAuditUser(userId);
	capCommentScriptModel.setAuditStatus("A");
	capCommentScriptModel.setAuditDate(comDate);
	var capCommentModel = capCommentScriptModel.getCapCommentModel();
	capCommentModel.setDisplayOnInsp(vDispOnInsp);
	var result = aa.cap.createCapComment(capCommentModel);
    if(result.getSuccess()) {
        logDebug("Comment added " + vCapId.getCustomID());
    } else {
        logDebug("Failed to add comment: " +result.getErrorType() + " " + result.getErrorMessage());
    }
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