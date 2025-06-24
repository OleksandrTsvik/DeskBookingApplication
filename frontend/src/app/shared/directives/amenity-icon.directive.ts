import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { SvgIcon } from '../components/svg-icon/svg-icon.component';

const amenityIconMap: Record<string, SvgIcon> = {
  'Air conditioning': 'air-conditioning',
  'Wi-Fi': 'wifi',
  Coffee: 'coffee',
  Gamepad: 'device-gamepad-2',
  Headphones: 'headphones',
  Microphone: 'microphone',
};

@Directive({
  selector: '[appAmenitySvgIcon]',
})
export class AmenitySvgIconDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  amenity = input.required<string>({ alias: 'appAmenitySvgIcon' });

  constructor() {
    effect(() => {
      const icon = amenityIconMap[this.amenity()];

      if (icon) {
        this.viewContainerRef.createEmbeddedView(this.templateRef, { icon });
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
