type TimeUnit = 'day' | 'hour' | 'millisecond';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;

export function diffDates(start: Date, end: Date, unit: TimeUnit = 'millisecond'): number {
  const timeDiff = Math.abs(end.getTime() - start.getTime());

  let result: number;

  switch (unit) {
    case 'day':
      result = timeDiff / MS_PER_DAY;
      break;
    case 'hour':
      result = timeDiff / MS_PER_HOUR;
      break;
    default:
      result = timeDiff;
      break;
  }

  return Math.round(result);
}

export function getLastDayOfMonth(date: Date): number;
export function getLastDayOfMonth(year: number, month: number): number;
export function getLastDayOfMonth(dateOrYear: Date | number, month?: number): number {
  let year: number;
  let monthIndex: number;

  if (dateOrYear instanceof Date) {
    year = dateOrYear.getFullYear();
    monthIndex = dateOrYear.getMonth();
  } else {
    year = dateOrYear;
    monthIndex = month ?? 0;
  }

  return new Date(year, monthIndex + 1, 0).getDate();
}
