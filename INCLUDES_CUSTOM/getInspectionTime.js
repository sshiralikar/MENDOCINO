function getInspectionTime(pCapId, pInspId) {
    var inspResultObj = aa.inspection.getInspection(pCapId, pInspId);
    if (!inspResultObj.getSuccess()) {
        logDebug("**ERROR: Failed to get inspection: " + inspResultObj.getErrorMessage());
        return false;
    }

    var inspObj = inspResultObj.getOutput();
    var vInspTime;
    var vInspAMPM;
    var vInspHour;
    var vInspMinute;

    if (inspObj.getScheduledDate() != null && inspObj.getScheduledDate() != "") {
        vInspHour = parseInt(inspObj.getScheduledDate().getHourOfDay()) + 2;
        if (vInspHour > 12) {
            vInspHour = vInspHour - 12;
        }
        vInspMinute = inspObj.getScheduledDate().getMinute();
        if (vInspMinute < 10) {
            vInspMinute = "0" + vInspMinute;
        }
        vInspAMPM = inspObj.getScheduledTime();
        vInspTime = vInspHour + ":" + vInspMinute + " " + vInspAMPM;
        return vInspTime
    }
    return false;
}