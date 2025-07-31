import { Component, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  name = input<string>();
  label = input<string>();

  value = '';
  isTouched = false;
  isDisabled = false;

  private onChangeControl: OnChangeControlFn<string> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  onInput(event: Event): void {
    if (this.isDisabled) {
      return;
    }

    const element = event.target as HTMLInputElement;

    this.value = element.value;
    this.onChangeControl(element.value);
  }

  onBlur(): void {
    this.markAsTouched();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: OnChangeControlFn<string>): void {
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
}
