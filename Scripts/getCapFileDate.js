function getCapFileDate(){
    var itemCap = capId;
    if (arguments.length > 0) {
        itemCap = arguments[0]; // use cap ID specified in args
    }

    if(itemCap){
        var c = aa.cap.getCap(itemCap).getOutput();
        if(c){
            var d = c.getFileDate();
            return "" + d.getMonth() + "/" + d.getDayOfMonth() + "/" + d.getYear();
        }
    }
    return null;
}