function getContactObjX(itemCap,typeToLoad)
{
    // returning the first match on contact type
    var capContactArray = null;
    var cArray = new Array();

    if (itemCap.getClass() == "class com.accela.aa.aamain.cap.CapModel")   { // page flow script
        var capContactArray = cap.getContactsGroup().toArray() ;
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
        }
    }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (capContactArray[yy].getPeople().contactType.toUpperCase().equals(typeToLoad.toUpperCase())) {
                return new contactObj(capContactArray[yy]);
            }
        }
    }

    return false;

}
