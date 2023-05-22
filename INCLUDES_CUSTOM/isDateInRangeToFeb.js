function isDateInRangeToFeb(date) {
  var startDate = new Date(2019, 9, 5);
  startDate = jsDateToMMDDYYYY(startDate);
  startDate = leadZero(startDate);
  var endDate = new Date(2022, 2, 28);
  endDate = jsDateToMMDDYYYY(endDate);
  return date >= startDate && date <= endDate;
}