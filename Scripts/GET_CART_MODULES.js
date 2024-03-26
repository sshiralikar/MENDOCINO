/*------------------------------------------------------------------------------------------------------/
| BEGIN Load Variable and Dependencies
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;
var debug = "";
var br = "";
var currentUserID = "ADMIN"

var transNbr = aa.env.getValue("TRANSACTIONID");

// Execute the update
runSQL(transNbr);

/*------------------------------------------------------------------------------------------------------/
| Loads other scripts
/------------------------------------------------------------------------------------------------------*/
function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

/*------------------------------------------------------------------------------------------------------/
| Executes SQL
/------------------------------------------------------------------------------------------------------*/
function runSQL(transnbr) {
    var vError = '';
    var conn = null;
    var sStmt1 = null;
    var rret = null;
    var val = null;
    var servProvCode = aa.getServiceProviderCode();
    var count = 0;

    try {
        var conn = aa.db.getConnection();

        var usql = " Select distinct(MODULE_NAME) as MODULE from ETRANSACTION_DETAIL where BATCH_TRANSACTION_NBR = '" + transnbr + "' AND SERV_PROV_CODE = '" + servProvCode + "'";

        sStmt1 = conn.prepareStatement(usql);
        rret = sStmt1.executeQuery();
        while (rret.next()) {
            count++;
            val = rret.getString("MODULE");
        }

        aa.env.setValue("success", true);
        aa.env.setValue("message", count);
        aa.env.setValue("result", val);

        aa.print("Found the Accela Modules for transactionID " + transnbr + ".");

    } catch (vError) {
        aa.env.setValue("success", false);
        aa.env.setValue("message", "EMSE ERR: Exception - " + vError.message);
        aa.env.setValue("result", "");
        aa.print("Runtime error occurred looking up the Accela Modules for transactionID " + transnbr + ". The error was: " + vError);
    }
    closeDBQueryObject(rret, sStmt1, conn);
}

function closeDBQueryObject(rSet, sStmt, conn) {
    try {
        if (rSet) {
            rSet.close();
            rSet = null;
        }
    } catch (vError) {
        aa.print("Failed to close the database result set object." + vError);
    }
    try {
        if (sStmt) {
            sStmt.close();
            sStmt = null;
        }
    } catch (vError) {
        aa.print("Failed to close the database prepare statement object." + vError);
    }
    try {
        if (conn) {
            conn.close();
            conn = null;
        }
    } catch (vError) {
        aa.print("Failed to close the database connection." + vError);
    }
}