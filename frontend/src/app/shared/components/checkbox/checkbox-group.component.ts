import { Component, contentChildren, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';

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

  values: ValueType[] = [];
  isTouched = false;

  private onChangeControl: OnChangeControlFn<ValueType[]> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  onChange(value: ValueType): void {
    if (this.values.includes(value)) {
      this.values = this.values.filter((item) => item !== value);
    } else {
      this.values = [...this.values, value];
    }

    this.updateCheckboxes();
    this.markAsTouched();
    this.onChangeControl(this.values);
  }

  writeValue(values: ValueType[]): void {
    this.values = values;

    this.checkboxes().forEach((checkbox) => {
      checkbox.isChecked = this.values.includes(checkbox.value());
    });
  }

  registerOnChange(fn: OnChangeControlFn<ValueType[]>): void {
    this.onChangeControl = fn;
  }

  registerOnTouched(fn: OnTouchedControlFn): void {
    this.onTouchedControl = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.checkboxes().forEach((checkbox) => {
      checkbox.isDisabled = isDisabled;
    });
  }

  private updateCheckboxes(): void {
    this.checkboxes().forEach((checkbox) => {
      checkbox.isChecked = this.values.includes(checkbox.value());
    });
  }

  private markAsTouched(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouchedControl();
    }
  }
}
