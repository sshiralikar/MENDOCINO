function leadZero(mypart)
{
    datePart = mypart.toString();
    if (datePart.length > 1)
    {
        longer = "0" + datePart;
        return longer;
    }
    else
    {
        return datePart;
    }
}