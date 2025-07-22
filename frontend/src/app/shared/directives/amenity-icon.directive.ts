import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { Icon } from './icon.directive';

const amenityIconMap: Record<string, Icon> = {
  'Air conditioning': 'air-conditioning',
  'Wi-Fi': 'wifi',
  Coffee: 'coffee',
  Gamepad: 'device-gamepad',
  Headphones: 'headphones',
  Microphone: 'microphone',
};

@Directive({
  selector: '[appAmenityIcon]',
})
export class AmenityIconDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  amenity = input.required<string>({ alias: 'appAmenityIcon' });

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
