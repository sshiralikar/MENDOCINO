function isDateInRangeCurr(date) {
  var startDate = new Date("2022-03-01");
    startDate = jsDateToMMDDYYYY(startDate);
  startDate = leadZero(startDate);
  var endDate = new Date();
  endDate = jsDateToMMDDYYYY(endDate);
  return date >= startDate && date <= endDate;
}