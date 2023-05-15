function getParam(pParamName) //gets parameter value and logs message showing param value
{
    var ret = "" + aa.env.getValue(pParamName);
    logDebug("Parameter : " + pParamName+" = "+ret);
    return ret;
}

function isNull(pTestValue,pNewValue)
{
    if (pTestValue==null || pTestValue=="")
        return pNewValue;
    else
        return pTestValue;
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function logMessage(dstr) {
    message += dstr + br;
}

function logDebug(dstr) {

    // custom for BCC.
    if (dstr.indexOf("**ERROR") >= 0) {
        dstr = dstr.replace("**ERROR","**WARNING");
        var err = {};
        err.message = dstr;
        err.lineNumber = "";
        err.stack = "";
        handleError(err,"");
    }
    vLevel = 1
    if (arguments.length > 1)
        vLevel = arguments[1];
    if ((showDebug & vLevel) == vLevel || vLevel == 1)
        debug += dstr + br;
    if ((showDebug & vLevel) == vLevel)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
}


function getACAUrl(){

    // returns the path to the record on ACA.  Needs to be appended to the site

    itemCap = capId;
    if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args
    var acaUrl = "";
    var id1 = capId.getID1();
    var id2 = capId.getID2();
    var id3 = capId.getID3();
    var cap = aa.cap.getCap(capId).getOutput().getCapModel();

    acaUrl += "/urlrouting.ashx?type=1000";
    acaUrl += "&Module=" + cap.getModuleName();
    acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
    return acaUrl;
}


function addParameter(pamaremeters, key, value)
{
    if(key != null)
    {
        if(value == null)
        {
            value = "";
        }

        pamaremeters.put(key, value);
    }
}

function getJobParam(pParamName) //gets parameter value and logs message showing param value
{
    var ret;
    if (aa.env.getValue("paramStdChoice") != "") {
        var b = aa.bizDomain.getBizDomainByValue(aa.env.getValue("paramStdChoice"),pParamName);
        if (b.getSuccess()) {
            ret = b.getOutput().getDescription();
        }

        ret = ret ? "" + ret : "";   // convert to String

        logDebug("Parameter (from std choice " + aa.env.getValue("paramStdChoice") + ") : " + pParamName + " = " + ret);
    }
    else {
        ret = "" + aa.env.getValue(pParamName);
        logDebug("Parameter (from batch job) : " + pParamName + " = " + ret);
    }
    return ret;
}