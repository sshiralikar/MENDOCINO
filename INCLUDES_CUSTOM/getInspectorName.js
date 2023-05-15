function getInspectorName(pInspId) {
    var inspResultObj = aa.inspection.getInspection(capId, pInspId);
    if (inspResultObj.getSuccess()) {
        iObj = inspResultObj.getOutput();
        inspUserObj = aa.person.getUser(currentUserID).getOutput();
        return inspUserObj.getFirstName()  +" " + inspUserObj.getLastName();
    }
    return false;
}