try
{
    var publicUserModel = aa.env.getValue("PublicUserModel");
    //var publicUserModel = aa.publicUser.getPublicUserByEmail("redapples@test.com").getOutput();
    var pUserSeqNumber = publicUserModel.getUserSeqNum();
    var pUserEmail = publicUserModel.getEmail()+"";
    assignCapIDsByEmail(pUserEmail,pUserSeqNumber);
}
catch(err)
{
    aa.sendMail("noreply-accela@mendocinocounty.gov", "sshiralikar@trustvip.com", "", "Error on RSA", err);
}

function assignCapIDsByEmail(email,pUserSeqNumber)
{
    var altIds = new Array();
    var sql = "SELECT B1_PER_ID1, B1_PER_ID2, B1_PER_ID3 FROM B3CONTACT WHERE SERV_PROV_CODE='MENDOCINO' AND B1_EMAIL = '"+email+"'";
    var res = doSQLSelect(sql);
    for(var i in res)
    {
        var id1 = res[i].B1_PER_ID1;
        var id2 = res[i].B1_PER_ID2;
        var id3 = res[i].B1_PER_ID3;
        var vCapId = aa.cap.getCapID(id1,id2,id3).getOutput();
        aa.print("Assigning - "+ vCapId.getCustomID()+ " to "+ "PUBLICUSER"+pUserSeqNumber);
        editCreatedByX("PUBLICUSER"+pUserSeqNumber, vCapId);
    }
}


function doSQLSelect(sql) {
    var dq = aa.db.select(sql, []);
    if (dq.getSuccess()) {
        var dso = dq.getOutput();
        if (dso) {
            var a = [];
            var ds = dso.toArray();
            for (var x in ds) {
                var r = {};
                var row = ds[x];
                var ks = ds[x].keySet().toArray();
                for (var c in ks) {
                    r[ks[c]] = String(row.get(ks[c]));
                    aa.print(ks[c] + ": " + (row.get(ks[c])));
                }
                a.push(r);
            }
        }
        //aa.print(JSON.stringify(a) + "<br>");
        return a;
    } else {
        aa.print("error " + dq.getErrorMessage());
    }
}
function editCreatedByX(nCreatedBy) {
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
    {
        aa.print("**WARNING: error setting cap created by : " + setCreatedByResult.getErrorMessage()) ; return false
    }
    else
    {
        aa.print("Edit Successful");
    }

    return true;
}