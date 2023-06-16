//CAMEND-422
var vGSObj;
var x = 0;
var vRequiredItem = "";
var wasThereANo = false;
var pleaseEnterComment = "";
if(inspResult == "Pass")
{
    var r = aa.inspection.getInspections(capId);
    if (r.getSuccess()) {
        var inspArray = r.getOutput();
        for (i in inspArray) {
            if (inspArray[i].getIdNumber() == inspId) {
                var inspModel = inspArray[i].getInspection();
                var gs = inspModel.getGuideSheets()
                if (gs) {
                    gsArray = gs.toArray();
                    for (var loopk in gsArray) {
                        var vGSItems = gsArray[loopk].getItems().toArray();
                        for (x in vGSItems) {
                            vGSObj = new guideSheetObject(gsArray[loopk], vGSItems[x]);
                            // Check for generally required fields
                            vGSObj.loadInfo();
                            logDebug("vGSObj.text: " + vGSObj.text + " vGSObj.status " + vGSObj.status + "vGSObj.comment: " + vGSObj.comment);
                            if (matches(vGSObj.status, "No"))
                            {
                                wasThereANo = true;
                                pleaseEnterComment = "The below checklist items marked as 'No', hence you cannot select 'Pass' <br>";
                                vRequiredItem += "-> " + vGSObj.text;
                                vRequiredItem += "<br>";
                            }
                        }
                    }
                }
            }
        }
    }
    if (wasThereANo)
    {
        cancel = true;
        showMessage = true;
        comment( pleaseEnterComment + vRequiredItem);
    }
}
else
{
    var vGSObj;
    var x = 0;
    var vRequiredItem = "";
    var wasThereANo = false;
    var pleaseEnterComment = "";
    var r = aa.inspection.getInspections(capId);
    if (r.getSuccess()) {
        var inspArray = r.getOutput();
        for (i in inspArray) {
            if (inspArray[i].getIdNumber() == inspId) {
                var inspModel = inspArray[i].getInspection();
                var gs = inspModel.getGuideSheets()
                if (gs) {
                    gsArray = gs.toArray();
                    for (var loopk in gsArray) {
                        var vGSItems = gsArray[loopk].getItems().toArray();
                        for (x in vGSItems) {
                            vGSObj = new guideSheetObject(gsArray[loopk], vGSItems[x]);
                            // Check for generally required fields
                            vGSObj.loadInfo();
                            logDebug("vGSObj.text: " + vGSObj.text + " vGSObj.status " + vGSObj.status + "vGSObj.comment: " + vGSObj.comment);
                            if (matches(vGSObj.status, "No") && matches(vGSObj.comment, null, '', undefined, " "))
                            {
                                wasThereANo = true;
                                pleaseEnterComment = "Please enter a comment for the below checklist items marked as 'No'. <br>";
                                vRequiredItem += "-> " + vGSObj.text;
                                vRequiredItem += "<br>";
                            }
                        }
                    }
                }
            }
        }
    }
    if (wasThereANo)
    {
        cancel = true;
        showMessage = true;
        comment( pleaseEnterComment + vRequiredItem);
    }
}
//CAMEND-422