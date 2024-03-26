function isDateInRangeToOct(date) {
  var startDate = new Date(2017, 0, 1);
      startDate = jsDateToMMDDYYYY(startDate);
      startDate = leadZero(startDate);
  var endDate = new Date(2019, 9, 4);
      endDate = jsDateToMMDDYYYY(endDate);
  return date >= startDate && date <= endDate;

}