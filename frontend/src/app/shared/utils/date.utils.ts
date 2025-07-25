type TimeUnit = 'day' | 'hour' | 'millisecond';

type TimeOnly = {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

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

export function toDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function toTimeOnlyString(date: Date | Partial<TimeOnly>): string {
  let time: TimeOnly;

  if (date instanceof Date) {
    time = {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
    };
  } else {
    time = {
      hours: date.hours ?? 0,
      minutes: date.minutes ?? 0,
      seconds: date.seconds ?? 0,
      milliseconds: date.milliseconds ?? 0,
    };
  }

  const hours = time.hours.toString().padStart(2, '0');
  const minutes = time.minutes.toString().padStart(2, '0');
  const seconds = time.seconds.toString().padStart(2, '0');
  const milliseconds = time.milliseconds.toString().padStart(3, '0');

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function timeOnlyToDate(time: string): Date {
  const today = toDateOnlyString(new Date());
  const date = `${today}T${time}`;

  return new Date(date);
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
