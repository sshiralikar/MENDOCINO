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

    var tableData = "https://www.dropbox.com/s/fpu8v4y01dfiars/Trackit%20Cannabis%20Cultivation%20Table%20Permit_UDF.js?dl=0";
    var json = getJSON(tableData);

    logDebug("Processing: " + json.length);    

    var coll = [];

    var conversionMap = getJSON("https://www.dropbox.com/s/bq78bqy6l7eqtx7/conversion_map.js?dl=0");

    var directASIMap = {        
        "CANN_BANNO": "Business Account Number",
        "CANN_CDFW_LSAA": "LSAA",
        "CANN_4WHEEL": "4Wheel",
        "CANN_DOGS": "Dog(s)",
        "CANN_LOCKGATE": "Locked Gate",
        "CANN_MULTIPAR": "More than one parcel",
        "CANN_401_CWA": "SW 401",
        "CANN_WATER_RIGHT": "SIUR",
        "CANN_ST_LIC": "Have a State License",
    }

    var asitGISFields = {
        "fire_district": true,
        "super_district": true,
        "MS4_AREA": true,
        "SITE_APN": true,
        "FIRE_RA": true,
        "COASTAL_ZONE": true,
        "GENERAL_PLAN": true,
        "ZONE_CODE1": true,
        "FLOOD_ZONE": true,
        "FLOOD_WAY": true,
        "MIL_AIRSPACE": true,
        "CNDDB": true,
        "airportzone": true,
        "ALQUISTPRIOLO": true,
        "CDPEXCLUSIONZONES": true,
        "CGWRA": true,
        "FIREHAZARDZONE": true,
        "SANITATIONDISTRICT": true,
        "TPZ": true,
        "WATERDIST": true,
        "SUPERVISORIALDIST": true,
        "WILLIAMSONACT": true
    }

    var invalidWaterSources = {
        "CHECK": true,
        "N/A": true,
        "RECEIVED": true,
        "REQUIRED": true,
    }
    var invalidPowerSources = {
        "CHECK": true,
        "N/A": true,
        "Received": true,
        "Required": true,
    }

    var refreshDate = aa.util.formatDate(new Date(), "MM/dd/yyyy");

    var failures = [];

    for(var i in json) {
        try {
            var row = json[i];
            scrubData(row);
    
            var agId = row["Permit_no"];
            var mapObj = conversionMap[agId];
            if(!mapObj)  {
                logDebug("Missing: " + agId);
                continue;
            }
            var recordsToProcess = [
                mapObj.application_id,
                mapObj.permit_id,
            ]
            for(var recIndex in recordsToProcess) {
                var id = recordsToProcess[recIndex];
                if(id) {
                    logDebug(id);
                    var recId = aa.cap.getCapID(id).getOutput();
                    handleUDFGISData(recId, row, asitGISFields, refreshDate);
                    handleDirectASI(recId, row, directASIMap);
                    calculateSFArea(recId, row);
    
                    handleStructureASIT(recId, row);
                    hanldeWaterSourceASIT(recId, row, invalidWaterSources);
                    handlePowerSourceASIT(recId, row, invalidPowerSources);
                    hanldeNOVASIT(recId, row);
                    var commentData = row["CANN_ORG_ST_LOC"];
                    if(commentData) {
                        createCapCommentLocal(("Origin Site Location - " + commentData), recId, "ADMIN", dateAdd(null, 0));
                    }
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

function scrubData(jsonRow) {
    return;
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

function handlePowerSourceASIT(itemCap, jsonRow, badSources) {    
    var tableData = [];
    var key = "CANN_POWER";
    var powerSource = jsonRow[key];
    if(powerSource && !badSources[powerSource]) {
        var firstRow = {
            "Type of Power": powerSource,
            "Primary Power Type": "CHECKED",
        };
        tableData.push(firstRow);
    }
    for(var udfSize = 2; udfSize < 4; udfSize++) {
        var udfField = key + udfSize;
        var powerSource = jsonRow[udfField];
        if(powerSource) {
            var newRow = {
                "Type of Power": powerSource,
            }
            tableData.push(newRow);
        }
    }
    if(tableData.length > 0) {
        addASITableLocal("WATER SOURCE", tableData, itemCap);
    }
}

function hanldeWaterSourceASIT(itemCap, jsonRow, badSources) {
    var tableData = [];
    var key = "CANN_WATERSRC";
    var firstWaterSrc = jsonRow[key];
    if(firstWaterSrc && !badSources[firstWaterSrc]) {
        var firstRow = {
            "Water Source Type": firstWaterSrc,
        };
        var diversionType = jsonRow["CANN_DIVERSION"];
        //TODO: Double check that Permitted Pond and Unpermitted Pond, would fall under "Other Watercourse"
        if(diversionType && !badSources[diversionType]) {
            switch(diversionType) {
                case "Spring":
                    diversionType = "Underground stream";
                    break;
                default:
                    diversionType = "Other Watercourse";
                    break;
            }
            firstRow["Diversion Type"] = diversionType;
            firstRow["Diversion"] = "Yes";
        }
        tableData.push(firstRow);
    }
    for(var udfSize = 2; udfSize < 4; udfSize++) {
        var udfField = key + udfSize;
        var waterSource = jsonRow[udfField];
        if(waterSource) {
            var newRow = {
                "Water Source Type": waterSource,
            }
            tableData.push(newRow);
        }
    }
    if(tableData.length > 0) {
        addASITableLocal("WATER SOURCE", tableData, itemCap);
    }
}

function handleStructureASIT(itemCap, jsonRow) {
    var typeOfStructure = jsonRow["CANN_DWUN_REQ"];
    if(!typeOfStructure) {
        return;
    }
    if(String(typeOfStructure).indexOf("Y") >= 0) {
        var tableData = [];
        var structureRow = {
            "Type of Structure": "Dwelling Unit",
        }
        tableData.push(structureRow);
        addASITableLocal("STRUCTURE/SITE PLAN ID LIST", tableData, itemCap);
    }
}

function hanldeNOVASIT(itemCap, jsonRow) {
    var typeOfStructure = jsonRow["CANN_DWUN_REQ"];
    if(!typeOfStructure) {
        return;
    }
    if(String(typeOfStructure).indexOf("Y") >= 0) {
        var tableData = [];
        var structureRow = {
            "Issuing Agency": "State Water Resource Control Board",
        }
        tableData.push(structureRow);
        addASITableLocal("NOTICE OF VIOLATIONS", tableData, itemCap);
    }
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

function handleDomesticWasteASIT(itemCap, jsonRow) {
    var typeOfStructure = jsonRow["CANN_DOM_WST"];
    return;
    //TODO: Values do not match up
    //"CANN_DOM_WST": "",//DOMESTIC WASTE ASIT, ASI Waste Type:  Nutrients, Spent Growing Media, Un-used Containers, Other Associated Hardware, Supplies, Garbage
    // if(!typeOfStructure) {
    //     return;
    // }
    // if(String(typeOfStructure).indexOf("Y") >= 0) {
    //     var tableData = [];
    //     var structureRow = {
    //         "Type of Structure": "Dwelling Unit",
    //     }
    //     tableData.push(structureRow);
    //     addASITable("STRUCTURE/SITE PLAN ID LIST", tableData, itemCap);
    // }
}

function handleUDFGISData(itemCap, jsonRow, gisMap, batchDate) {
    var apn = jsonRow["SITE_APN"];
    if (!apn) {
        return false;
    }    
    //load UDF fields to ASIT
    var gisData = [];
    for(var udfField in gisMap) {
        var udfValue = jsonRow[udfField];
        if(!udfValue) {
            continue;
        }
        //logDebug(udfField + "  value: " + udfValue);
        var asitRow = {};
        asitRow["APN Number"] = apn;
        asitRow["Attribute Name"] = udfField;
        asitRow["Attribute Value"] = udfValue;
        asitRow["Last Refreshed On"] = batchDate;
        asitRow["Source"] = "Trackit UDF";
        gisData.push(asitRow);
    }
    if(gisData.length > 0) {
        addASITableLocal("GEOGRAPHIC INFORMATION", gisData, itemCap);
    }
    return true;    
}

function handleDirectASI(itemCap, jsonRow, asiMap) {
    for(var udfField in asiMap) {
        var asiField = asiMap[udfField];
        var value = jsonRow[udfField];
        if(!asiField || !value) {
            continue;
        }
        switch(udfField) {            
            case "CANN_DOGS":
            case "CANN_LOCKGATE":
            case "CANN_MULTIPAR":            
                // "",//ASI Dog(s) convert Y/N
                // "",//ASI Locked Gate convert Y/N
                // "",//ASI More than one parcel Y/N
                value = String(value).indexOf("Y") >= 0 ? "Yes" : "No";
                break;
            case "CANN_BANNO":
            case "CANN_4WHEEL":
            case "CANN_ST_LIC":
                //As is
                // "10024/7000028",//ASI Business Account Number
                // "",//ASI 4Wheel convert Y/N
                break;
            case "CANN_CDFW_LSAA":
                // "REQUIRED",//ASI LSAA = Y/N ANY LSAA OR Received or CHECK or FINAL mark Yes
                if(String(value).indexOf("LSAA") >= 0 || value == "RECEIVED" || value == "CHECK" || value == "FINAL") {
                    value = "Yes";
                } else {
                    value = "";
                }
                break;
            case "CANN_401_CWA":
                // "",//ASI SW 401 checkbox - CONVERT Approved, Received, Under Review to be CHECKED.
                if(value == "Approved" || value == "Received" || value == "Under Review") {
                    value = "CHECKED";
                } else {
                    value = "";
                }
                break;
            case "CANN_WATER_RIGHT":
                // "",//ASI SIUR Y/N - CONVERT ALL TO Y, IGNORE Incomplete, N/A, Not Received, Blanks.
                if(value == "Approved" || value == "CHECK" || value == "RECEIVED") {
                    value = "Yes";
                } else {
                    value = "";
                }
                break;
        }
        if(asiField && value) {
            editAppSpecific(asiField, value, itemCap);
        }
    }    
}

function calculateSFArea(itemCap, jsonRow) {
    var indoorSQFT = 0;
    var outdoorSQFT = 0;
    var mixedSQFT = 0;
    var lightTypeKey = "CANN_MC_LT";
    var typeSQFTKey = "CANN_SQFT";
    for(var udfIndex = 1; udfIndex < 4; udfIndex++) {
        var lightType = jsonRow[lightTypeKey + udfIndex];
        var typeSQFT = jsonRow[typeSQFTKey + udfIndex];
        if(!lightType || !typeSQFT) {
            continue;
        }
        switch(lightType) {
            case "Indoor":
                indoorSQFT += parseInt(typeSQFT, 10);
                break;
            case "Outdoor":
                outdoorSQFT += parseInt(typeSQFT, 10);
                break;
            case "Mixed Light":
                mixedSQFT += parseInt(typeSQFT, 10);
                break;
        }
    }
    var totalSQFT = indoorSQFT + outdoorSQFT + mixedSQFT;
    editAppSpecific("Indoor SF", indoorSQFT, itemCap);
    editAppSpecific("Outdoor SF", outdoorSQFT, itemCap);
    editAppSpecific("Mixed Light SF", mixedSQFT, itemCap);
    editAppSpecific("Total SF", totalSQFT, itemCap);        

}

function addASITableLocal(tableName, tableValueArray) // optional capId
{
	//  tableName is the name of the ASI table
	//  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
	var itemCap = capId
		if (arguments.length > 2)
			itemCap = arguments[2]; // use cap ID specified in args

		var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName)

		if (!tssmResult.getSuccess()) {
			logDebug("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
			return false
		}

	var tssm = tssmResult.getOutput();
	var tsm = tssm.getAppSpecificTableModel();
	var fld = tsm.getTableField();
	var fld_readonly = tsm.getReadonlyField(); // get Readonly field

	for (thisrow in tableValueArray) {

		var col = tsm.getColumns()
			var coli = col.iterator();
		while (coli.hasNext()) {
			var colname = coli.next();

			if (!tableValueArray[thisrow][colname.getColumnName()]) {
				//logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
				tableValueArray[thisrow][colname.getColumnName()] = "";
			}
			
			if (typeof(tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") // we are passed an asiTablVal Obj
			{
				fld.add(tableValueArray[thisrow][colname.getColumnName()].fieldValue);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);
				//fld_readonly.add(null);
			} else // we are passed a string
			{
				fld.add(tableValueArray[thisrow][colname.getColumnName()]);
				fld_readonly.add(null);
			}
		}

		tsm.setTableField(fld);

		tsm.setReadonlyField(fld_readonly);

	}

	var addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, currentUserID);

	if (!addResult.getSuccess()) {
		logDebug("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
		return false
	} else
		logDebug("Successfully added record to ASI Table: " + tableName);

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