import { DropdownOption } from '../dropdown/dropdown.component';

import { TimeDropdownValue } from './time-dropdown.component';

export const TIME_OPTIONS: DropdownOption<TimeDropdownValue>[] = Array.from({ length: 48 }, (_, index) => {
  const hours24Format = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;

  const displayHours = hours24Format % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  const meridiem = hours24Format >= 12 ? 'PM' : 'AM';

  return {
    label: `${displayHours}:${displayMinutes} ${meridiem}`,
    value: { hours: hours24Format, minutes },
  };
});
