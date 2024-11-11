//CAMEND-612
if(!publicUser)
{
    var licCapId = getParent();
    if(parentCapId!=null && parentCapId!="")
        licCapId = parentCapId;
    updateAppStatus("Pending Fallowing Revocation","",licCapId);
    updateTask("Permit Status","Pending Fallowing Revocation","","",licCapId);
}