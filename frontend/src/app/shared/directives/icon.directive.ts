import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';

export type Icon =
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

@Directive({
  selector: '[appIcon]',
})
export class IconDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  icon = input.required<Icon>({ alias: 'appIcon' });

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, `icon-${this.icon()}`);
  }
}
