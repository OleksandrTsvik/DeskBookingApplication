import { DropdownOption } from '../dropdown/dropdown.component';

export const MONTH_OPTIONS: DropdownOption<number>[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((month, index) => ({ label: month, value: index }));

export const YEAR_OFFSET = 4;
