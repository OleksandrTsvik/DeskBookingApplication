import { Nullable } from '../models/common.models';

import { isDate, isString } from './type-guards';

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

export function toDateOnlyString(date: Nullable<Date>): string {
  const dateonly = dateOnlyToDate(date);

  const year = dateonly.getFullYear();
  const month = (dateonly.getMonth() + 1).toString().padStart(2, '0');
  const day = dateonly.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function dateOnlyToDate(dateonly: Nullable<string | Date>): Date {
  if (!dateonly) {
    return new Date();
  }

  if (isDate(dateonly)) {
    return dateonly;
  }

  return new Date(dateonly);
}

export function toTimeOnlyString(time: Nullable<Date | Partial<TimeOnly>>): string {
  const timeonly = toTimeOnly(time);

  const hours = timeonly.hours.toString().padStart(2, '0');
  const minutes = timeonly.minutes.toString().padStart(2, '0');
  const seconds = timeonly.seconds.toString().padStart(2, '0');
  const milliseconds = timeonly.milliseconds.toString().padStart(3, '0');

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export function toTimeOnly(time: Nullable<string | Date | Partial<TimeOnly>>): TimeOnly {
  const isStringTime = isString(time);

  if (isStringTime || isDate(time)) {
    const date = isStringTime ? timeOnlyToDate(time) : time;

    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
    };
  }

  return {
    hours: time?.hours ?? 0,
    minutes: time?.minutes ?? 0,
    seconds: time?.seconds ?? 0,
    milliseconds: time?.milliseconds ?? 0,
  };
}

export function timeOnlyToDate(timeonly: Nullable<string>): Date {
  if (!timeonly) {
    return new Date();
  }

  const today = toDateOnlyString(new Date());
  const date = `${today}T${timeonly}`;

  return new Date(date);
}

export function getLastDayOfMonth(date: Date): number;
export function getLastDayOfMonth(year: number, month: number): number;
export function getLastDayOfMonth(dateOrYear: Date | number, month?: number): number {
  let year: number;
  let monthIndex: number;

  if (isDate(dateOrYear)) {
    year = dateOrYear.getFullYear();
    monthIndex = dateOrYear.getMonth();
  } else {
    year = dateOrYear;
    monthIndex = month ?? 0;
  }

  return new Date(year, monthIndex + 1, 0).getDate();
}
