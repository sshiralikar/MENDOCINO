function getInspectionCount() {

    var inspCount = 0;
    var inspList = aa.inspection.getInspections(capId);

    if (inspList.getSuccess())  {
        var inspOutput = inspList.getOutput();

        for (xx in inspOutput) {
            if (inspOutput[xx].getInspectionStatus() != "Cancelled" && inspOutput[xx].getInspectionStatus() != "Pending") {
                if (inspOutput[xx].getInspectionType().indexOf("(2 SLOT)") > -1) {
                    inspCount = inspCount + 2; }
                else if (inspOutput[xx].getInspectionType().indexOf("(3 SLOT)") > -1) {
                    inspCount = inspCount + 3; }
                else if (inspOutput[xx].getInspectionType().indexOf("(4 SLOT)") > -1) {
                    inspCount = inspCount + 4; }
                else {
                    inspCount = inspCount + 1; }
            }
        }
    }

    return inspCount;
}