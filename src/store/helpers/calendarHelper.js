import moment from 'moment';

moment.locale('pl');

function getWeekNums(momentObj) {
  const clonedMoment = moment(...momentObj);
  let first = clonedMoment.startOf('month').isoWeek();
  let last = clonedMoment.endOf('month').isoWeek();
  let lastWeekOfYear;

  // If last week is in the next year - add one more week to the year
  if (last === 1) {
    last = 53;
  }
  // If first week is in the previous year first must be equal 0,
  // because then in getMonth function we add one more week in front of January to display.
  // Save number of last week of year for future to format dates by week of year number.
  if (first >= 52) {
    lastWeekOfYear = first;
    first = 0;
  }

  return [first, last, lastWeekOfYear];
}

function createDayObj(dayIndex, week, todayFormatted) {
  const weekDay = week.weekday(dayIndex);
  return {
    day: weekDay.format('DD'),
    // Check if current day is equal today, return boolean
    today: weekDay.format('YY-MM-DD') === todayFormatted,
    weekDay: dayIndex,
    // Format month to be easier for get values from months names array
    month: weekDay.format('MM').replace(/^0/, '') - 1,
    year: weekDay.format('YYYY'),
  };
}

export default function getMonth(year, month, today) {
  const currMonth = {};
  const selectedYear = moment().year(year);
  const todayFormatted = typeof today === 'object' ? today.format('YY-MM-DD') : moment().format('YY-MM-DD');
  const [firstWeek, lastWeek, lastWeekOfYear] = getWeekNums([`${year}/${month + 1}/1`, 'YYYY/MM/DD']);

  for (let i = firstWeek; i <= lastWeek; i += 1) {
    // If firstWeek is equal 0, then current week is from last week of previous year
    const week = i === 0
      // ? moment().year(year - 1).week(52)
      ? moment().year(year - 1).week(lastWeekOfYear)
      : selectedYear.week(i);

    // Create empty array with lenght of 7 (days number in week), then fill it with days objects
    const weekArr = [...Array(7)].map((value, index) => createDayObj(index, week, todayFormatted));
    currMonth[i] = weekArr;
  }

  return currMonth;
}
