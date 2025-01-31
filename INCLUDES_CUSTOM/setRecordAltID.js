function setRecordAltID(vCapID) {
    var vCapType = aa.cap.getCap(vCapID).getOutput().getCapType().toString();
    var level2 = vCapType.split("/")[1];
    var level3 = vCapType.split("/")[2];
    var currAltId = vCapID.getCustomID() + "";
    var newAltId = "";
    if (level3 == "Permit") {
        newAltId = currAltId.split("-APP")[0];
    }
    else if (level2 == "Amendment" || level3 == "Renewal") {
        var parentCapId = aa.env.getValue("ParentCapID");
        if (parentCapId == null || parentCapId == false || parentCapId == "") {
            parentCapId = getParent(vCapID);
        }
        if (parentCapId == null || parentCapId == false || parentCapId == "") {
            parentCapId = getParentCapID4Renewal();
        }
        parentCapId = aa.cap.getCapID(parentCapId.getID1(), parentCapId.getID2(), parentCapId.getID3()).getOutput();
        //aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "parentCapId", parentCapId);
        var vPCapType = aa.cap.getCap(parentCapId).getOutput().getCapType().toString();
        if (vPCapType == "Cannabis/Nursery/Application/NA" || vPCapType == "Cannabis/Cultivation/Application/NA")
            newAltId = String(parentCapId.getCustomID()).split("-APP")[0];
        else if (vPCapType == "Cannabis/Nursery/Renewal/NA" || vPCapType == "Cannabis/Cultivation/Renewal/NA")
            newAltId = String(parentCapId.getCustomID()).split("-REN")[0];
        else
            newAltId = parentCapId.getCustomID() + "";
        //aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "newAltId", newAltId);
        var cIds = getChildren(vCapType, parentCapId);
        var recCnt = 0;
        for (var x in cIds) {
            var recId = "" + cIds[x];
            if (recId.substring(2, 5) != "EST") {
                recCnt++;
            }
        }
        //aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "FINALnewAltId", newAltId);
    }
    var lastAltId = newAltId;
    if (newAltId != "") {
        //var count = 0;
        while (1) {
            var amendNbr = "";
            if (matches(cIds, null, "", undefined))
                amendNbr = "00" + 1;
            else {
                if (recCnt <= 9)
                    amendNbr = "00" + (recCnt + 1);
                else if (recCnt > 9 && recCnt <= 99)
                    amendNbr = "0" + (recCnt + 1);
                else
                    amendNbr = (recCnt + 1);
            }
            if (vCapType == "Cannabis/Amendment/Employee List/NA")
                newAltId = lastAltId + "-EMP-" + amendNbr;
            else if (vCapType == "Cannabis/Amendment/Modification/NA")
                newAltId = lastAltId + "-MOD-" + amendNbr;
            else if (vCapType == "Cannabis/Amendment/Notice of Application Stay/NA")
                newAltId = lastAltId + "-NOS-" + amendNbr;
            else if (vCapType == "Cannabis/Amendment/Notice of Non-Cultivation/NA")
                newAltId = lastAltId + "-NNC-" + amendNbr;
            else if (vCapType == "Cannabis/Amendment/Withdrawal/NA")
                newAltId = lastAltId + "-WIT-" + amendNbr;
            else if (vCapType == "Cannabis/Cultivation/Renewal/NA")
                newAltId = lastAltId + "-REN-" + amendNbr;
            else if (vCapType == "Cannabis/Nursery/Renewal/NA")
                newAltId = lastAltId + "-REN-" + amendNbr;
            // CAMEND-582
            else if (vCapType == "Cannabis/Amendment/Notice of Fallowing/Revocation")
                newAltId = lastAltId + "-ROF-" + amendNbr;
            // CAMEND-568
            else if (vCapType == "Cannabis/Amendment/Notice of Fallowing/Affidavit")
                newAltId = lastAltId + "-FA-" + amendNbr;
            // CAMEND-503
            else if (vCapType == "Cannabis/Amendment/Notice of Fallowing/NA")
                newAltId = lastAltId + "-NOF-" + amendNbr;
            // CAMEND-524
            else if (vCapType == "Cannabis/Amendment/Assignment/NA")
                newAltId = lastAltId + "-ASGN-" + amendNbr;
            // CAMEND-546
            else if (vCapType == "Cannabis/Amendment/Tax Appeal/NA")
                newAltId = lastAltId + "-TAX-" + amendNbr;
            // CAMEND-541
            else if (vCapType == "Cannabis/Amendment/Appeal/NA")
                newAltId = lastAltId + "-APPL-" + amendNbr;
            // CAMEND-468
            else if (vCapType == "Cannabis/Amendment/Contact Change/NA")
                newAltId = lastAltId + "-CONT-" + amendNbr;

            var updateResult = aa.cap.updateCapAltID(vCapID, newAltId);
            if (!updateResult.getSuccess()) {
                recCnt++;
                //count ++;
                //aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "UNSUCCESSFULL", updateResult.getErrorMessage());
                aa.print("Error updating Alt Id: " + newAltId + ":: " + updateResult.getErrorMessage());
            } else {
                break;
                //aa.sendMail("no-reply@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "SUCCESS", "SUCCESS");
                aa.print("Compliance Method record ID updated to : " + newAltId);
            }
            /*            if(count == 10)
                            break;*/
        }
    }
    return newAltId;
}