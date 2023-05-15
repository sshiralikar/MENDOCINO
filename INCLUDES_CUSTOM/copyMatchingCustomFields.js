function copyMatchingCustomFields(fcapId, tcapId, useSubgroupName) {
    //optional ignoreASI
    var ignoreASI = new Array();
    var mapArray = null;
    if (arguments.length > 3) {
        ignoreASI = arguments[3];
    }

    //optional ignoreASISubGroup
    var ignoreASISubGroup = new Array();
    if (arguments.length > 4) {
        ignoreASISubGroup = arguments[4];
    }

    //optional map
    if (arguments.length > 5) mapArray = arguments[5];

    // get cap ASIs
    var from_AppSpecInfoResult = aa.appSpecificInfo.getByCapID(fcapId);
    if (from_AppSpecInfoResult.getSuccess()) {
        var from_AppspecObj = from_AppSpecInfoResult.getOutput();
    } else {
        logDebug("**ERROR: getting app specific info for Cap : " + from_AppSpecInfoResult.getErrorMessage());
        return null;
    }

    for (i in from_AppspecObj) {
        var itemName = from_AppspecObj[i].getCheckboxDesc();
        var subGroup = from_AppspecObj[i].getCheckboxType();

        if (exists(itemName, ignoreASI) || exists(subGroup, ignoreASISubGroup)) {
            continue;
        }

        var itemValue = from_AppspecObj[i].getChecklistComment();
        var itemGroup = useSubgroupName ? from_AppspecObj[i].getCheckboxType() : null;

        //loop through the map first
        if (mapArray)
        {
            for (var m in mapArray)
            {
                var thisMap = mapArray[m];
                if (thisMap.fromField == itemName)
                {
                    var to_AppSpecInfoResult = aa.appSpecificInfo.editSingleAppSpecific(tcapId, thisMap.toField, itemValue, itemGroup);
                    if (to_AppSpecInfoResult.getSuccess()) {
                        logDebug("INFO: " + (itemGroup ? itemGroup + "." : "") + thisMap.toField + " was updated.");
                    } else {
                        logDebug("WARNING: " + (itemGroup ? itemGroup + "." : "") + thisMap.toField + " was not updated: " + to_AppSpecInfoResult.getErrorMessage());
                    }
                }
            }
        }

        // Edit cap ASIs
        var to_AppSpecInfoResult = aa.appSpecificInfo.editSingleAppSpecific(tcapId, itemName, itemValue, itemGroup);
        if (to_AppSpecInfoResult.getSuccess()) {
            logDebug("INFO: " + (itemGroup ? itemGroup + "." : "") + itemName + " was updated.");
        } else {
            logDebug("WARNING: " + (itemGroup ? itemGroup + "." : "") + itemName + " was not updated: " + to_AppSpecInfoResult.getErrorMessage());
        }
    }

    return true;
}