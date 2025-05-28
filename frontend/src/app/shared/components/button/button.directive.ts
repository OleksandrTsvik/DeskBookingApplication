import { Directive, HostBinding, Input } from '@angular/core';
import { clsx } from 'clsx';

import { tw } from '@/app/shared/utils/tailwind.utils';

type ButtonVariant = 'solid' | 'outlined';
type ButtonColor = 'primary' | 'danger';

type ButtonTheme = `${ButtonVariant}-${ButtonColor}`;

const base = tw`inline-flex cursor-pointer items-center text-center align-middle font-semibold select-none`;
const size = tw`gap-x-2 rounded-lg px-6 py-3 focus-visible:outline-2 focus-visible:outline-offset-2`;

const themeClasses: Record<ButtonTheme, string> = {
  'solid-primary': tw`bg-(--primary-color) text-white hover:bg-indigo-600`,
  'solid-danger': tw`bg-(--danger-color) text-white hover:bg-red-500`,
  'outlined-primary': tw`border-(--primary-color) text-(--primary-color) hover:border-indigo-600 hover:text-indigo-600`,
  'outlined-danger': tw`border-(--danger-color) text-(--danger-color) hover:border-red-500 hover:text-red-500`,
};

const focusClasses: Record<ButtonColor, string> = {
  primary: tw`focus-visible:outline-(--primary-color)`,
  danger: tw`focus-visible:outline-(--danger-color)`,
};

function buildTwClasses(variant: ButtonVariant, color: ButtonColor): string {
  return clsx(
    base,
    size,
    variant === 'outlined' && 'border-2',
    themeClasses[`${variant}-${color}`],
    focusClasses[color],
  );
}

@Directive({
  selector: '[app-button]',
})
export class ButtonDirective {
  @HostBinding('class')
  private _twClasses = buildTwClasses('solid', 'primary');

  private _variant: ButtonVariant = 'solid';
  private _color: ButtonColor = 'primary';

  @Input()
  set variant(value: ButtonVariant) {
    this._variant = value;
    this._twClasses = buildTwClasses(this._variant, this._color);
  }

  @Input()
  set color(value: ButtonColor) {
    this._color = value;
    this._twClasses = buildTwClasses(this._variant, this._color);
  }
}
