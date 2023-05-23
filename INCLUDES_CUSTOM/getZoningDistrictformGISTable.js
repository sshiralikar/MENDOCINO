function getZoningDistrictFromGISTable()
{
    var baseZone = "";
    currentUserID = "ADMIN";
    if(cap == null)
        cap = aa.cap.getCap(capId).getOutput().getCapModel();
    var capParcelObj = null;
    if(cap.getClass()+"" == "class com.accela.aa.emse.dom.CapScriptModel")
        capParcelObj = cap.getCapModel().getParcelModel();
    else
        capParcelObj = cap.getParcelModel();
    if(capParcelObj && capParcelObj.getParcelNumber())
    {
        var parcelNum = capParcelObj.getParcelNumber();
        var bizDomScriptResult = aa.bizDomain.getBizDomain("GEOGRAPHIC INFORMATION");
        if (bizDomScriptResult.getSuccess()) {
            bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
            for (var i in bizDomScriptArray) {
                var outFields = String(bizDomScriptArray[i].getDescription()).split("||")[1] + "";
                var url = String(bizDomScriptArray[i].getDescription()).split("||")[0] + "";
                var layer = bizDomScriptArray[i].getBizdomainValue() + "";
                if(layer == "Parcels")
                {
                    var finalUrl = url+"query?where=APNFULL="+ parcelNum+"&outFields="+outFields+"&f=pjson";
                    aa.print("finalUrl: "+ finalUrl);
                    var JSONObj = getServiceData(finalUrl);
                    if(typeof (JSONObj.features)!== 'undefined') {
                        var attributes = JSONObj.features[0].attributes;
                        for (var i in attributes) {
                            if (attributes[i] && attributes[i] != "" && attributes[i] != " " && attributes[i] != 0) {
                                if(i == "BASEZONE")
                                    baseZone = attributes[i];
                            }
                        }
                    }
                }
            }
        }
    }
    else
    {
        var parcResult = aa.parcel.getParcelDailyByCapID(capId, null);
        if (parcResult.getSuccess()) {
            parcelArr = parcResult.getOutput();
        }
        for (var p in parcelArr) {
            var parcelNum = String(parcelArr[p].getParcelNumber());
            var bizDomScriptResult = aa.bizDomain.getBizDomain("GEOGRAPHIC INFORMATION");
            if (bizDomScriptResult.getSuccess()) {
                bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
                for (var i in bizDomScriptArray) {
                    var outFields = String(bizDomScriptArray[i].getDescription()).split("||")[1] + "";
                    var url = String(bizDomScriptArray[i].getDescription()).split("||")[0] + "";
                    var layer = bizDomScriptArray[i].getBizdomainValue() + "";
                    if(layer == "Parcels")
                    {
                        var finalUrl = url+"query?where=APNFULL="+ parcelNum+"&outFields="+outFields+"&f=pjson";
                        aa.print("finalUrl: "+ finalUrl);
                        var JSONObj = getServiceData(finalUrl);
                        if(typeof (JSONObj.features)!== 'undefined') {
                            var attributes = JSONObj.features[0].attributes;
                            for (var i in attributes) {
                                if (attributes[i] && attributes[i] != "" && attributes[i] != " " && attributes[i] != 0) {
                                    if(i == "BASEZONE")
                                        baseZone = attributes[i];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if(baseZone!="")
    {
        return baseZone;
    }
    return null;
}