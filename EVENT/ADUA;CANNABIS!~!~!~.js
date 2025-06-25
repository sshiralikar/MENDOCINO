//Populate Geographic Information
include("POPULATE_GEOGRAPHIC_INFORMATION");
//Populate Geographic Information


var capDetailObjResult = aa.cap.getCapDetail(capId);

if (capDetailObjResult.getSuccess()) {
    capDetail = capDetailObjResult.getOutput();
    var assignedID = capDetail.getAsgnStaff();

    var vWFTasks = aa.workflow.getTasks(capId).getOutput();
    for (var vCounter in vWFTasks)
    {
        var vWFTask = vWFTasks[vCounter];
        if (vWFTask.completeFlag == "Y")
            continue;
        var vTaskDesc = vWFTask.taskDescription;

        assignTask(vTaskDesc,assignedID);
    }
}
