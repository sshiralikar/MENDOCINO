capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();

conditionType = "Cannabis Required Document";
addConditions = true;

// get documents already uploaded
submittedDocList = aa.document.getDocumentListByEntity(capIdString,"CAP").getOutput().toArray();
var uploadedDocs = new Array();
for (var i in submittedDocList ) uploadedDocs[submittedDocList[i].getDocCategory()] = true;


// remove all conditions without a doc

var capCondResult = aa.capCondition.getCapConditions(capId,conditionType);

if (capCondResult.getSuccess()) {
    var ccs = capCondResult.getOutput();
    for (var pc1 in ccs) {
        if(uploadedDocs["" + ccs[pc1].getConditionDescription()] == undefined) {
            var rmCapCondResult = aa.capCondition.deleteCapCondition(capId,ccs[pc1].getConditionNumber());
        }
        else
            editCapConditionStatus(conditionType,ccs[pc1].getConditionDescription(),"Document Received","Not Applied");
    }
}

var emplTable = loadASITable("EMPLOYEE LIST");
if(emplTable && emplTable.length > 0)
{
    for(var i in emplTable)
    {
        /*var docType = "Government Issued ID - ["+emplTable[i]["Employee Name"]+"]"
        aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/

       /* var docType = "Mendocino County Live Scan - ["+emplTable[i]["Employee Name"]+"]"
        aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/
    }
}