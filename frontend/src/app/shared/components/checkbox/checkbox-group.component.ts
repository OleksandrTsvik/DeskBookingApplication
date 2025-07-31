import { Component, contentChildren, effect, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';
import { isArray, isNonNullable } from '@/shared/utils/type-guards';

import { CheckboxComponent } from './checkbox.component';

@Component({
  selector: 'app-checkbox-group',
  imports: [],
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CheckboxGroupComponent,
    },
  ],
})
export class CheckboxGroupComponent<ValueType> implements ControlValueAccessor {
  private checkboxes = contentChildren(CheckboxComponent);

  label = input<string>();
  single = input<boolean>(false);

  values = signal<ValueType[]>([]);
  isTouched = signal(false);

  private onChangeControl: OnChangeControlFn<ValueType[] | ValueType> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  constructor() {
    effect(() => this.updateCheckboxes());
  }

  onChange(value: ValueType): void {
    if (this.values().includes(value)) {
      this.values.update((prevValues) => prevValues.filter((item) => item !== value));
    } else {
      this.values.update((prevValues) => (this.single() ? [value] : [...prevValues, value]));
    }

    this.updateCheckboxes();
    this.markAsTouched();
    this.onChangeControl(this.single() ? this.values()[0] : this.values());
  }

  writeValue(values: ValueType[] | ValueType | undefined): void {
    this.values.set(isArray(values) ? values : isNonNullable(values) ? [values] : []);

    this.updateCheckboxes();
  }

  registerOnChange(fn: OnChangeControlFn<ValueType[] | ValueType>): void {
    this.onChangeControl = fn;
  }

  registerOnTouched(fn: OnTouchedControlFn): void {
    this.onTouchedControl = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.checkboxes().forEach((checkbox) => {
      checkbox.isDisabled.set(isDisabled);
    });
  }

  private updateCheckboxes(): void {
    this.checkboxes().forEach((checkbox) => {
      checkbox.isChecked.set(this.values().includes(checkbox.value()));
    });
  }

  private markAsTouched(): void {
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouchedControl();
    }
  }
}
