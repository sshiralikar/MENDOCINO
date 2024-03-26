if(wfTask == "Amendment Review" && wfStatus == "Approved")
{
    var table = loadASITable("EMPLOYEE LIST");
    if(table && table.length > 0)
    {
        var parentCapId = getParent(capId);
        var newTable = new Array();
        for(var i in table)
        {
            if(table[i]["Action"] == "Keep" || table[i]["Action"] == "Add")
            {
                var vRow = new Array();
                vRow["Employee Name"] = new asiTableValObj("Employee Name",table[i]["Employee Name"].fieldValue, "N");
                vRow["Government ID"] = new asiTableValObj("Government ID",table[i]["Government ID"].fieldValue, "N");
                vRow["Date of Birth"] = new asiTableValObj("Date of Birth",table[i]["Date of Birth"].fieldValue, "N");
                vRow["Employee Start Date"] = new asiTableValObj("Employee Start Date",table[i]["Employee Start Date"].fieldValue, "N");
                vRow["Employee End Date"] = new asiTableValObj("Employee End Date",table[i]["Employee End Date"].fieldValue, "N");
                vRow["Employment"] = new asiTableValObj("Employment",table[i]["Employment"].fieldValue, "N");
                newTable.push(vRow);
            }
        }
        if(newTable.length > 0)
        {
            removeASITable("EMPLOYEE LIST",parentCapId);
            addASITable("EMPLOYEE LIST", newTable, parentCapId);
        }
    }
}