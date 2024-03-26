function addTableRow(tableName, tableRowArray)
{
    try
    {
        //tableRowArray["columnName"] = value

        //optional capId
        var itemCap = capId;
        if (arguments.length > 2) itemCap = arguments[2];

        //load table
        var table = loadASITable(tableName, itemCap) || new Array();

        //loop through tableRowArray and add to table
        var row = new Array();
        var push = false;
        for (var x in tableRowArray)
        {
            row[x] = new asiTableValObj(x, tableRowArray[x] + "", "N");
            push = true;
        }
        if (push)
        {
            table.push(row);
            removeASITable(tableName, itemCap);
            addASITable(tableName, table, itemCap);

            return true;
        }
        return false;

    }
    catch(e)
    {
        // statements
        logDebug("ERROR in addTableRow " + e.message);
    }
}