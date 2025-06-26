import { Component, computed, input } from '@angular/core';

export type SvgIcon =
  | 'air-conditioning'
  | 'armchair'
  | 'calendar'
  | 'check'
  | 'chevron-left'
  | 'chevron'
  | 'clock-hour-3'
  | 'coffee'
  | 'device-gamepad-2'
  | 'edit'
  | 'headphones'
  | 'microphone'
  | 'trash'
  | 'user'
  | 'wifi'
  | 'x';

@Component({
  selector: 'svg[icon]',
  imports: [],
  templateUrl: './svg-icon.component.html',
})
export class SvgIconComponent {
  icon = input.required<SvgIcon>();
  title = input<string>();

  href = computed(() => `assets/icons/${this.icon()}.svg#${this.icon()}`);
}
