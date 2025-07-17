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
