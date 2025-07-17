import { Component, OnInit, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';

import { DropdownComponent, DropdownOption } from '../dropdown/dropdown.component';

import { TIME_OPTIONS } from './time-dropdown.constants';

export type TimeDropdownValue = {
  hours: number;
  minutes: number;
};

@Component({
  selector: 'app-time-dropdown',
  imports: [DropdownComponent],
  templateUrl: './time-dropdown.component.html',
  styleUrl: './time-dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TimeDropdownComponent,
    },
  ],
})
export class TimeDropdownComponent implements ControlValueAccessor, OnInit {
  name = input<string>();
  label = input<string>();
  type = input<'past' | 'future' | 'all'>('all');
  placeholder = input<string>();
  disabled = input(false);

  options: DropdownOption<TimeDropdownValue>[] = [];

  value?: TimeDropdownValue;
  isTouched = false;
  isDisabled = this.disabled();

  private currentDate = new Date();
  private currentHours = this.currentDate.getHours();
  private currentMinutes = this.currentDate.getMinutes();

  private onChangeControl: OnChangeControlFn<TimeDropdownValue | undefined> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  private get selectedOrCurrentHours(): number {
    return this.value?.hours ?? this.currentHours;
  }

  private get selectedOrCurrentMinutes(): number {
    return this.value?.minutes ?? this.currentMinutes;
  }

  ngOnInit(): void {
    this.updateOptions();
  }

  onChange(value: TimeDropdownValue): void {
    if (this.isDisabled) {
      return;
    }

    this.value = value;
    this.onChangeControl(value);
  }

  onTouch(): void {
    this.markAsTouched();
  }

  writeValue(value: TimeDropdownValue | undefined): void {
    this.value = value;

    this.updateOptions();
  }

  registerOnChange(fn: OnChangeControlFn<TimeDropdownValue | undefined>): void {
    this.onChangeControl = fn;
  }

  registerOnTouched(fn: OnTouchedControlFn): void {
    this.onTouchedControl = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private markAsTouched(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouchedControl();
    }
  }

  private updateOptions(): void {
    this.options = this.generateOptions();
  }

  private generateOptions(): DropdownOption<TimeDropdownValue>[] {
    switch (this.type()) {
      case 'past': {
        const maxHours = Math.max(this.selectedOrCurrentHours, this.currentHours);
        const maxMinutes = Math.max(this.selectedOrCurrentMinutes, this.currentMinutes);

        return TIME_OPTIONS.filter(
          ({ value: { hours, minutes } }) => hours < maxHours || (hours == maxHours && minutes <= maxMinutes),
        );
      }
      case 'future': {
        const minHours = Math.min(this.selectedOrCurrentHours, this.currentHours);
        const minMinutes = Math.min(this.selectedOrCurrentMinutes, this.currentMinutes);

        return TIME_OPTIONS.filter(
          ({ value: { hours, minutes } }) => hours > minHours || (hours == minHours && minutes >= minMinutes),
        );
      }
      default:
        return TIME_OPTIONS;
    }
  }
}
