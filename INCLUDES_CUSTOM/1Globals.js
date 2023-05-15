var ENVIRON = "SUPP";
var EMAILREPLIES = "no-reply@mendocinocounty.org";
var SENDEMAILS = true;
var ACAURL = "https://aca-nonprod.accela.com/MENDOCINO-NONPROD1/";
showMessage = false;
//set Debug
var vDebugUsers = ['ADMIN'];
if (exists(currentUserID,vDebugUsers)) {
    showDebug = 3;
    showMessage = true;
}