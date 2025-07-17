import { Component, OnInit, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';
import { arrayRange } from '@/shared/utils/array.utils';
import { getLastDayOfMonth } from '@/shared/utils/date.utils';
import { isNonNullable, isNullable } from '@/shared/utils/type-guards';

import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';

import { MONTH_OPTIONS, YEAR_OFFSET } from './date-picker.constants';

@Component({
  selector: 'app-date-picker',
  imports: [DropdownComponent],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DatePickerComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: DatePickerComponent,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor, Validator, OnInit {
  name = input<string>();
  label = input<string>();
  type = input<'past' | 'future' | 'all'>('future');
  disabled = input(false);

  dayOptions: DropdownOption<number>[] = [];
  monthOptions: DropdownOption<number>[] = [];
  yearOptions: DropdownOption<number>[] = [];

  selectedDay?: number;
  selectedMonth?: number;
  selectedYear?: number;

  isTouched = false;
  isDisabled = this.disabled();

  private currentDate = new Date();
  private currentDay = this.currentDate.getDate();
  private currentMonth = this.currentDate.getMonth();
  private currentYear = this.currentDate.getFullYear();

  private onChangeControl: OnChangeControlFn<Date | undefined> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  private get selectedOrCurrentDay(): number {
    return this.selectedDay ?? this.currentDay;
  }

  private get selectedOrCurrentMonth(): number {
    return this.selectedMonth ?? this.currentMonth;
  }

  private get selectedOrCurrentYear(): number {
    return this.selectedYear ?? this.currentYear;
  }

  ngOnInit(): void {
    this.updateDayOptions();
    this.updateMonthOptions();
    this.updateYearOptions();
  }

  onChange(part: 'day' | 'month' | 'year', value: number): void {
    if (this.isDisabled) {
      return;
    }

    switch (part) {
      case 'day':
        this.selectedDay = value;
        break;
      case 'month':
        this.selectedMonth = value;
        this.adjustDate();
        this.updateDayOptions();
        break;
      case 'year':
        this.selectedYear = value;
        this.adjustDate();
        this.updateDayOptions();
        this.updateMonthOptions();
        break;
    }

    this.onChangeControl(this.getSelectedDate());
  }

  onTouch(): void {
    this.markAsTouched();
  }

  writeValue(value: Date | undefined): void {
    this.selectedYear = value?.getFullYear();
    this.selectedMonth = value?.getMonth();
    this.selectedDay = value?.getDate();

    this.updateDayOptions();
    this.updateMonthOptions();
    this.updateYearOptions();
  }

  registerOnChange(fn: OnChangeControlFn<Date | undefined>): void {
    this.onChangeControl = fn;
  }

  registerOnTouched(fn: OnTouchedControlFn): void {
    this.onTouchedControl = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    const dateParts = [this.selectedDay, this.selectedMonth, this.selectedYear];
    const nullableDatePartsCount = dateParts.filter((item) => isNullable(item)).length;

    const isDateIncomplete = nullableDatePartsCount > 0 && nullableDatePartsCount < dateParts.length;

    if (isDateIncomplete) {
      return { incompleteDate: true };
    }

    return null;
  }

  private markAsTouched(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouchedControl();
    }
  }

  private getSelectedDate(): Date {
    const date = new Date();

    this.selectedYear && date.setFullYear(this.selectedYear);
    this.selectedMonth && date.setMonth(this.selectedMonth);
    this.selectedDay && date.setDate(this.selectedDay);

    return date;
  }

  private updateDayOptions(): void {
    this.dayOptions = this.generateDayOptions();
  }

  private generateDayOptions(): DropdownOption<number>[] {
    return this.generateDaysArray().map((day) => ({ label: day, value: day }));
  }

  private generateDaysArray(): number[] {
    const lastDayOfMonth = getLastDayOfMonth(this.selectedOrCurrentYear, this.selectedOrCurrentMonth);

    if (this.selectedOrCurrentMonth !== this.currentMonth || this.selectedOrCurrentYear !== this.currentYear) {
      return arrayRange(1, lastDayOfMonth);
    }

    switch (this.type()) {
      case 'past':
        return arrayRange(1, Math.max(this.selectedOrCurrentDay, this.currentDay));
      case 'future':
        return arrayRange(Math.min(this.selectedOrCurrentDay, this.currentDay), lastDayOfMonth);
      default:
        return arrayRange(1, lastDayOfMonth);
    }
  }

  private updateMonthOptions(): void {
    this.monthOptions = this.generateMonthOptions();
  }

  private generateMonthOptions(): DropdownOption<number>[] {
    if (this.selectedOrCurrentYear !== this.currentYear) {
      return MONTH_OPTIONS;
    }

    switch (this.type()) {
      case 'past': {
        const maxMonth = Math.max(this.selectedOrCurrentMonth, this.currentMonth);
        return MONTH_OPTIONS.filter((option) => option.value <= maxMonth);
      }
      case 'future': {
        const minMonth = Math.min(this.selectedOrCurrentMonth, this.currentMonth);
        return MONTH_OPTIONS.filter((option) => option.value >= minMonth);
      }
      default:
        return MONTH_OPTIONS;
    }
  }

  private updateYearOptions(): void {
    this.yearOptions = this.generateYearOptions();
  }

  private generateYearOptions(): DropdownOption<number>[] {
    return this.generateYearsArray().map((year) => ({ label: year, value: year }));
  }

  private generateYearsArray(): number[] {
    const minYear = Math.min(this.selectedOrCurrentYear, this.currentYear);
    const maxYear = Math.max(this.selectedOrCurrentYear, this.currentYear);

    switch (this.type()) {
      case 'past':
        return arrayRange(minYear - YEAR_OFFSET, maxYear);
      case 'future':
        return arrayRange(minYear, maxYear + YEAR_OFFSET);
      default:
        return arrayRange(minYear - YEAR_OFFSET, maxYear + YEAR_OFFSET);
    }
  }

  private adjustDate(): void {
    if (this.selectedOrCurrentYear !== this.currentYear) {
      this.adjustDateDay();
      return;
    }

    switch (this.type()) {
      case 'past':
        if (this.selectedOrCurrentMonth >= this.currentMonth) {
          this.setSelectedMonthIfNonNullable(this.currentMonth);
          this.setSelectedDayIfNonNullable(Math.min(this.selectedOrCurrentDay, this.currentDay));
        }

        break;
      case 'future':
        if (this.selectedOrCurrentMonth <= this.currentMonth) {
          this.setSelectedMonthIfNonNullable(this.currentMonth);
          this.setSelectedDayIfNonNullable(Math.max(this.selectedOrCurrentDay, this.currentDay));
        }

        break;
    }

    this.adjustDateDay();
  }

  private adjustDateDay(): void {
    if (isNullable(this.selectedDay)) {
      return;
    }

    const lastDayOfMonth = getLastDayOfMonth(this.selectedOrCurrentYear, this.selectedOrCurrentMonth);

    if (this.selectedDay > lastDayOfMonth) {
      this.selectedDay = lastDayOfMonth;
    }
  }

  private setSelectedMonthIfNonNullable(value: number) {
    if (isNonNullable(this.selectedMonth)) {
      this.selectedMonth = value;
    }
  }

  private setSelectedDayIfNonNullable(value: number) {
    if (isNonNullable(this.selectedDay)) {
      this.selectedDay = value;
    }
  }
}
