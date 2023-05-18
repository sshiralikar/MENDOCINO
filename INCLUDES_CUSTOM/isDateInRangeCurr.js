function isDateInRangeCurr(date) {
    var startDate = new Date("2022-03-01");
    var endDate = new Date();

    return date >= startDate && date <= endDate;
}