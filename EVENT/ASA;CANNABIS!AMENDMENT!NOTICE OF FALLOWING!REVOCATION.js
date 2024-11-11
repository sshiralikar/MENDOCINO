//CAMEND-612
if(!publicUser)
{
    var licCapId = getParent();
    updateAppStatus("Pending Fallowing Revocation","",licCapId);
    updateTask("Permit Status","Pending Fallowing Revocation","","",licCapId);
}