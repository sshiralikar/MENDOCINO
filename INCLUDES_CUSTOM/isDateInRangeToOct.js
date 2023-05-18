function isDateInRangeToOct(date) {
    var startDate = new Date(2017, 0, 1);
    var endDate = new Date(2019, 9, 4);

    return date >= startDate && date <= endDate;
}