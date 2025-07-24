import { Component, HostBinding, Input, booleanAttribute } from '@angular/core';
import { clsx } from 'clsx';

import { Icon, IconDirective } from '@/shared/directives/icon.directive';
import { tw } from '@/shared/utils/tailwind.utils';

type ButtonSize = 'base' | 'icon';
type ButtonVariant = 'solid' | 'outlined';
type ButtonColor = 'primary' | 'danger';

type ButtonTheme = `${ButtonVariant}-${ButtonColor}`;

const base = tw`inline-flex cursor-pointer items-center justify-center text-center font-semibold select-none disabled:cursor-not-allowed disabled:opacity-20`;

const sizeClasses: Record<ButtonSize, string> = {
  base: tw`gap-x-2 rounded-lg px-6 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2`,
  icon: tw`gap-x-2 rounded-lg p-3 focus-visible:outline-1 focus-visible:outline-offset-1`,
};

const borderClasses: Record<ButtonSize, string> = {
  base: tw`border-2`,
  icon: tw`border-1`,
};

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

function buildTwClasses(variant: ButtonVariant, color: ButtonColor, icon: Icon | null): string {
  const sizeType: ButtonSize = icon ? 'icon' : 'base';

  return clsx(
    base,
    sizeClasses[sizeType],
    variant === 'outlined' && borderClasses[sizeType],
    themeClasses[`${variant}-${color}`],
    focusClasses[color],
  );
}

@Component({
  selector: '[appButton]',
  imports: [IconDirective],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @HostBinding('class')
  private _twClasses = buildTwClasses('solid', 'primary', null);

  private _variant: ButtonVariant = 'solid';
  private _color: ButtonColor = 'primary';
  private _icon: Icon | null = null;

  @Input()
  set icon(value: Icon | null) {
    this._icon = value;
    this.updateTwClasses();
  }

  @Input()
  set variant(value: ButtonVariant) {
    this._variant = value;
    this.updateTwClasses();
  }

  @Input()
  set color(value: ButtonColor) {
    this._color = value;
    this.updateTwClasses();
  }

  get icon() {
    return this._icon;
  }

  private updateTwClasses(): void {
    this._twClasses = buildTwClasses(this._variant, this._color, this._icon);
  }
}
