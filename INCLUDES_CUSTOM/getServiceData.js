function getServiceData(url) {
    try {
        var resObj = null;
        var result = aa.httpClient.get(url);
        if (result.getSuccess()) {
            var response = result.getOutput();
            //logDebug("  getServiceData returned data");
            //aa.print("getServiceData:returned data: " + response);
            var resObj = JSON.parse(response);
        } else {
            aa.print("getServiceData:no data returned");
        }
        return resObj;
    } catch (err) {
        aa.print("Exception getting attribute values " + err)
    }
}