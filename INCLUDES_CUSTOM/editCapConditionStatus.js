function editCapConditionStatus(pType,pDesc,pStatus,pStatusType) {
    // updates a condition with the pType and pDesc
    // to pStatus and pStatusType, returns true if updates, false if not
    // will not update if status is already pStatus && pStatusType
    // all parameters are required except for pType

    itemCap = capId;
    if (arguments.length > 4) {
        itemCap = arguments[4];
    }

    if (pType==null)
        var condResult = aa.capCondition.getCapConditions(itemCap);
    else
        var condResult = aa.capCondition.getCapConditions(itemCap,pType);

    if (condResult.getSuccess())
        var capConds = condResult.getOutput();
    else
    {
        logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
        return false;
    }

    for (cc in capConds) {
        var thisCond = capConds[cc];
        var cStatus = thisCond.getConditionStatus();
        var cStatusType = thisCond.getConditionStatusType();
        var cDesc = thisCond.getConditionDescription();
        var cImpact = thisCond.getImpactCode();
        logDebug(cStatus + ": " + cStatusType);

        if (cDesc.toUpperCase() == pDesc.toUpperCase()) {
            if (!pStatus.toUpperCase().equals(cStatus.toUpperCase())) {
                thisCond.setConditionStatus(pStatus);
                thisCond.setConditionStatusType(pStatusType);
                thisCond.setImpactCode("");
                aa.capCondition.editCapCondition(thisCond);
                return true; // condition has been found and updated
            } else {
                logDebug("ERROR: condition found but already in the status of pStatus and pStatusType");
                return false; // condition found but already in the status of pStatus and pStatusType
            }
        }
    }

    logDebug("ERROR: no matching condition found");
    return false; //no matching condition found

}