//Populate Geographic Information
include("POPULATE_GEOGRAPHIC_INFORMATION");
//Populate Geographic Information

var vWFTasks = aa.workflow.getTasks(capId).getOutput();
for (var vCounter in vWFTasks)
{
    var vWFTask = vWFTasks[vCounter];
    if (vWFTask.completeFlag == "Y")
        continue;
    var vTaskDesc = vWFTask.taskDescription;
    var vAssignedStaff = vWFTask.getAssignedStaff();
    var vAssignedDept = vAssignedStaff.deptOfUser;
    var applicUserId = aa.person.getUser(vAssignedStaff.getFirstName(), vAssignedStaff.getMiddleName(), vAssignedStaff.getLastName()).getOutput();
    var finalUser = applicUserId.getUserID();
    assignTask(vTaskDesc,finalUser);
}