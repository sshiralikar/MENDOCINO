if (wfTask == "Supervisor Review" && wfStatus == "Denied") {
    var workfHistory = aa.workflow.getWorkflowHistory(capId, null);
    if (workfHistory.getSuccess()) {
        var wfhistoryresult = workfHistory.getOutput();
    }
    for (var i in wfhistoryresult) {
        var pTask = wfhistoryresult[i];
        if (pTask.getTaskDescription() == "Supervisor Review" &&
            pTask.getDisposition() == "Denied") {
            cancel = true;
            showMessage = true;
            comment("An appeal was filed previously, unable able to select this status, please select Appeal Denied.");
        }
    }
}
//CAMEND-383
/*if (wfTask == "Draft Decision" && wfStatus == "Modification Required") {
var chrisG = true;
    var workflowResult = aa.workflow.getTasks(capId);
    if (workflowResult.getSuccess())
        wfObj = workflowResult.getOutput();
    for (x in wfObj) {
        thisTask = wfObj[x];
        if (thisTask.getTaskDescription() == "Draft Decision" && thisTask.getDisposition() == "Modification Required") {
            var comm = thisTask.getResDispositionComment();
            if (comm == "" || comm == null || chrisG) {
                cancel = true;
                showMessage = true;
                comment("Please list all required modifications to include in the letter");

            }

        }
    }
}*/
if(wfStatus == "Issued")
{
    var balanceDue = 0;
    var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
    if (capDetailObjResult.getSuccess()) {
        capDetail = capDetailObjResult.getOutput();
        balanceDue = capDetail.getBalance();
    }
    if(balanceDue > 0)
    {
        cancel = true;
        showMessage = true;
        comment("There is an outstanding balance of $"+ balanceDue);
    }
    var unmetCondStr = "";
    var unmetConditions = false;
    var condResult = aa.capCondition.getCapConditions(capId);
    if (condResult.getSuccess()) {
        var capConds = condResult.getOutput();
        for (cc in capConds) {
            if (capConds[cc].getConditionStatus() != "Met") {
                var cDesc = capConds[cc].getConditionDescription();
                var cType = capConds[cc].getConditionType();
                unmetCondStr +=cType+ ": cType"+ cDesc+"<br>";
                unmetConditions = true;
            }
        }
    }
    if(unmetConditions)
    {
        cancel = true;
        showMessage = true;
        comment("There are unmet conditions on this record, please mark the below as met:<BR><BR>"+ unmetCondStr);
    }
}