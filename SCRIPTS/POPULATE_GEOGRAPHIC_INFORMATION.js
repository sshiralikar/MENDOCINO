//POPULATE_GEOGRAPHIC_INFORMATION
//INITIALIZE START
//capId = aa.cap.getCapID("CAN-CA-2017-0051").getOutput();
//INITIALIZE END
try
{
    currentUserID = "ADMIN";
    var newTable = new Array();
    var today = new Date();
    var newDate = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();
    var parcResult = aa.parcel.getParcelDailyByCapID(capId, null);
    if (parcResult.getSuccess()) {
        parcelArr = parcResult.getOutput();
    }
    for (var p in parcelArr) {
        var parcelNum = String(parcelArr[p].getParcelNumber());
        var bizDomScriptResult = aa.bizDomain.getBizDomain("GEOGRAPHIC INFORMATION");
        if (bizDomScriptResult.getSuccess()) {
            bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
            for (var i in bizDomScriptArray) {
                var outFields = String(bizDomScriptArray[i].getDescription()).split("||")[1] + "";
                var url = String(bizDomScriptArray[i].getDescription()).split("||")[0] + "";
                var  layer = bizDomScriptArray[i].getBizdomainValue() + "";
                //https://arcgis-int.mendocinocounty.org/arcgis/rest/services/Cannabis/MapServer/33/query?where=OBJECTID=481777&outFields=*&f=pjson
                /*if(layer == "Parcels")
                {*/
                var finalUrl = url+"query?where=APNFULL="+ parcelNum+"&outFields="+outFields+"&f=pjson";
                aa.print("finalUrl: "+ finalUrl);
                var JSONObj = getServiceData(finalUrl);
                if(typeof (JSONObj.features)!== 'undefined')
                {
                    var attributes = JSONObj.features[0].attributes;
                    for(var i in attributes)
                    {
                        if( attributes[i] &&  attributes[i]!="" &&  attributes[i]!= " " &&  attributes[i]!=0)
                        {
                            var vRow = new Array();
                            vRow["APN Number"] = new asiTableValObj("APN Number", parcelNum+"", "N");
                            vRow["Attribute Name"] = new asiTableValObj("Attribute Name", i+"", "N");
                            vRow["Attribute Value"] = new asiTableValObj("Attribute Value", attributes[i]+"", "N");
                            vRow["Last Refreshed On"] = new asiTableValObj("Last Refreshed On", newDate, "N");
                            vRow["Source"] = new asiTableValObj("Source", layer, "N");
                            newTable.push(vRow);
                        }
                    }
                }
                //}
            }
        }
    }
    if(newTable && newTable.length > 0)
    {
        removeASITable("GEOGRAPHIC INFORMATION",capId);
        addASITable("GEOGRAPHIC INFORMATION", newTable, capId)
    }
}
catch(err)
{
    aa.print("Error: "+ err);
}
function getServiceData(url) {
    try {
        var resObj = null;
        var result = aa.httpClient.get(url);
        if (result.getSuccess()) {
            var response = result.getOutput();
            //logDebug("  getServiceData returned data");
            //aa.print("getServiceData:returned data: " + response);
            var resObj = JSON.parse(response);
        } else {
            aa.print("getServiceData:no data returned");
        }
        return resObj;
    } catch (err) {
        aa.print("Exception getting attribute values " + err)
    }
}
function addASITable(tableName, tableValueArray) // optional capId
{
    //  tableName is the name of the ASI table
    //  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
    var itemCap = capId
    if (arguments.length > 2)
        itemCap = arguments[2]; // use cap ID specified in args

    var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName)

    if (!tssmResult.getSuccess()) {
        aa.print("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
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
                aa.print("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
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
        aa.print("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
        return false
    } else
        aa.print("Successfully added record to ASI Table: " + tableName);

}
function asiTableValObj(columnName, fieldValue, readOnly) {
    this.columnName = columnName;
    this.fieldValue = fieldValue;
    this.readOnly = readOnly;
    asiTableValObj.prototype.toString = function() {
        return this.fieldValue
    }
};
function removeASITable(tableName) // optional capId
{
    //  tableName is the name of the ASI table
    //  tableValues is an associative array of values.  All elements MUST be strings.
    var itemCap = capId
    if (arguments.length > 1)
        itemCap = arguments[1]; // use cap ID specified in args

    var tssmResult = aa.appSpecificTableScript.removeAppSpecificTableInfos(tableName,itemCap,currentUserID)

    if (!tssmResult.getSuccess())
    { aa.print("**WARNING: error removing ASI table " + tableName + " " + tssmResult.getErrorMessage()) ; return false }
    else
        aa.print("Successfully removed all rows from ASI Table: " + tableName);

}