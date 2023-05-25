capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();

conditionType = "Cannabis Required Document";
if(!publicUser)
{
    var emplTable = loadASITable("EMPLOYEE LIST");
    if(emplTable && emplTable.length > 0)
    {
        for(var i in emplTable)
        {
            var docType = "Government Issued ID - ["+emplTable[i]["Employee Name"]+"]"
            aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");

            /*var docType = "Mendocino County Live Scan - ["+emplTable[i]["Employee Name"]+"]"
            aa.capCondition.addCapCondition(capId,conditionType,docType,docType,sysDate,null,sysDate,null,null,"Notice",systemUserObj,systemUserObj,"Applied","ADMIN","A","Y");*/
        }
    }

}