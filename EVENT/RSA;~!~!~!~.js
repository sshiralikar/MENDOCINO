try {
    var publicUserModel = aa.env.getValue("PublicUserModel");
    //var publicUserModel = aa.publicUser.getPublicUserByEmail("shash1@gmail.com").getOutput();
    var pUserSeqNumber = publicUserModel.getUserSeqNum();
    var refCon = getRefConByPublicUserSeq(pUserSeqNumber);

    if (refCon) {
        var peopleSequenceNumber = refCon.getContactSeqNumber()
        var peopleModel = getOutput(aa.people.getPeople(peopleSequenceNumber), "");

        var psm = aa.people.createPeopleModel().getOutput();
        psm.setEmail(peopleModel.getEmail());
        var cResult = aa.people.getCapIDsByRefContact(psm).getOutput();

        if(cResult && cResult.length > 0)
        {
            for(var i in cResult)
            {
                var capId = aa.cap.getCapID(cResult[i].getID1(),cResult[i].getID2(),cResult[i].getID3()).getOutput();
                editCreatedBy("PUBLICUSER"+pUserSeqNumber, capId);
                aa.licenseScript.associateContactWithPublicUser(pUserSeqNumber, peopleSequenceNumber);
            }
        }
    }
} catch (err) {
    aa.debug("ContactRelatedToPublicUser Error", err)
}

function getRefConByPublicUserSeq(pSeqNum) {

    var publicUserSeq = pSeqNum; //Public user sequence number
    var userSeqList = aa.util.newArrayList();
    userSeqList.add(aa.util.parseLong(publicUserSeq));
    var contactPeopleBiz = aa.proxyInvoker.newInstance("com.accela.pa.people.ContractorPeopleBusiness").getOutput();
    var contactors = contactPeopleBiz.getContractorPeopleListByUserSeqNBR("MENDOCINO", userSeqList);
    if (contactors) {
        if (contactors.size() > 0) {
            if (contactors.get(0)) {
                return contactors.get(0);
            }
        }
    }
    return false;
}
function getOutput(result, object) {
    if (result.getSuccess()) {
        return result.getOutput();
    }
    else {
        return null;
    }
}
function editCreatedBy(nCreatedBy) {
    // 4/30/08 - DQ - Corrected Error where option parameter was ignored
    var itemCap = capId;
    if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

    var capResult = aa.cap.getCap(itemCap)

    if (!capResult.getSuccess())
    {aa.print("**WARNING: error getting cap : " + capResult.getErrorMessage()) ; return false }

    var capE = capResult.getOutput();
    var capEModel = capE.getCapModel()

    capEModel.setCreatedBy(nCreatedBy)

    setCreatedByResult = aa.cap.editCapByPK(capEModel);

    if (!setCreatedByResult.getSuccess())
    { aa.print("**WARNING: error setting cap created by : " + setCreatedByResult.getErrorMessage()) ; return false }

    return true;
}