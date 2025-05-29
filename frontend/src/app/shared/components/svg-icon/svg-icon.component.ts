import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'svg[icon]',
  imports: [],
  templateUrl: './svg-icon.component.html',
})
export class SvgIconComponent {
  icon = input.required<string>();

  href = computed(() => `assets/icons/${this.icon()}.svg#${this.icon()}`);
}
