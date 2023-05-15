function setFileDate() {
    var itemCap = capId
    if (arguments.length > 1)
        itemCap = arguments[1]; // use cap ID specified in args

    var itemCapModel = aa.cap.getCap(itemCap).getOutput();

    var f = aa.date.getCurrentDate();
    itemCapModel.setFileDate(f);
    cdWrite = aa.cap.editCapByPK(itemCapModel.getCapModel());

    if (cdWrite.getSuccess()) {
        logDebug("Set CAP FILE DATE to: " + dateAdd(f, 0));
        fileDate = f;
    } else {
        logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage());
        return false;
    }
}