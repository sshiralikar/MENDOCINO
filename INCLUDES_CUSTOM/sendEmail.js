function sendEmail(fromEmail, toEmail, CC, template, eParams, files) { // optional: itemCap
    var itemCap = capId;
    if (arguments.length == 7)
        itemCap = arguments[6]; // use cap ID specified in args

    //var sent = aa.document.sendEmailByTemplateName(fromEmail, toEmail, CC, template, eParams, files);
    if(eParams)
    {
        var bizDomScriptResult = aa.bizDomain.getBizDomain("NOTIFICATION_TEMPLATE_INFO_CANNABIS");
        if (bizDomScriptResult.getSuccess()) {
            var bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
            for (var i in bizDomScriptArray) {
                var desc = bizDomScriptArray[i].getDescription();
                var value = bizDomScriptArray[i].getBizdomainValue() + "";
                addParameter(eParams,value,desc);
            }
        }
    }
    toEmail = runEmailThroughSLEmailFilter(toEmail);
    var itempAltIDScriptModel = aa.cap.createCapIDScriptModel(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());
    var sent = aa.document.sendEmailAndSaveAsDocument(fromEmail, toEmail, CC, template, eParams, itempAltIDScriptModel, files);
    if (!sent.getSuccess()) {
        logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
    }
}