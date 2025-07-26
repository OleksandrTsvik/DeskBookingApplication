import { Component, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IconDirective } from '@/shared/directives/icon.directive';
import { OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';

import { CheckboxGroupComponent } from './checkbox-group.component';

@Component({
  selector: 'app-checkbox',
  imports: [IconDirective],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CheckboxComponent,
    },
  ],
})
export class CheckboxComponent<ValueType> implements ControlValueAccessor {
  private checkboxGroup = inject(CheckboxGroupComponent<ValueType>, { optional: true });

  name = input<string>();
  value = input<ValueType>(null as ValueType);

  isChecked = signal(false);
  isTouched = signal(false);
  isDisabled = signal(false);

  private onChangeControl: OnChangeControlFn<boolean> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  onChange(event: Event): void {
    if (this.isDisabled()) {
      return;
    }

    const element = event.target as HTMLInputElement;

    this.isChecked.set(element.checked);
    this.checkboxGroup?.onChange(this.value());
    this.onChangeControl(element.checked);
  }

  onBlur(): void {
    this.markAsTouched();
  }

  writeValue(checked: boolean): void {
    this.isChecked.set(checked);
  }

  registerOnChange(fn: OnChangeControlFn<boolean>): void {
    this.onChangeControl = fn;
  }

  registerOnTouched(fn: OnTouchedControlFn): void {
    this.onTouchedControl = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouchedControl();
    }
  }
}
