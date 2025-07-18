import { Component, ElementRef, HostListener, Input, computed, inject, input, model, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CompareFn, OnChangeControlFn, OnTouchedControlFn } from '@/shared/models/form.models';

import { SvgIconComponent } from '../svg-icon/svg-icon.component';

export type DropdownOption<ValueType> = {
  label: string | number;
  value: ValueType;
};

@Component({
  selector: 'app-dropdown',
  imports: [SvgIconComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DropdownComponent,
    },
  ],
})
export class DropdownComponent<ValueType> implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  name = input<string>();
  options = input<DropdownOption<ValueType>[]>();
  label = input<string>();
  placeholder = input<string>();
  disabled = input(false);

  @Input()
  compareWith: CompareFn<ValueType | undefined> = (o1, o2) => o1 === o2;

  change = output<ValueType>();
  touch = output();

  value = model<ValueType>();
  option = computed(() => this.options()?.find((option) => this.compareWith(option.value, this.value())));
  isOpen = false;
  isTouched = false;
  isDisabled = this.disabled();

  private onChangeControl: OnChangeControlFn<ValueType | undefined> = () => {};
  private onTouchedControl: OnTouchedControlFn = () => {};

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  onButtonClick(): void {
    this.isOpen = !this.isOpen;
    this.markAsTouched();
  }

  onOptionClick(option: DropdownOption<ValueType>): void {
    if (this.isDisabled) {
      return;
    }

    this.isOpen = false;

    if (this.value() !== option.value) {
      this.value.set(option.value);

      this.change.emit(option.value);
      this.onChangeControl(option.value);
    }
  }

  writeValue(value: ValueType | undefined): void {
    this.value.set(value);
  }

  registerOnChange(fn: OnChangeControlFn<ValueType | undefined>): void {
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
      this.touch.emit();
      this.onTouchedControl();
    }
  }
}
