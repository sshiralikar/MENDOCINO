function isDateInRangeToFeb(date) {
    var startDate = new Date(2019, 9, 5);
    var endDate = new Date(2022, 2, 28);

    return date >= startDate && date <= endDate;
}