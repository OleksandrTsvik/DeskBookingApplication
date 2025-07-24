import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  contentChild,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

import { Icon, IconDirective } from '@/shared/directives/icon.directive';

@Component({
  selector: 'app-modal',
  imports: [NgTemplateOutlet, IconDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  host: {
    '[class.hidden]': '!visible()',
  },
})
export class ModalComponent {
  private content = viewChild<ElementRef<HTMLDivElement>>('modalContent');

  icon = input<Icon>('check');
  status = input<'success' | 'danger'>('success');
  heading = input<string>();
  visible = model(false);
  close = output();

  header = contentChild<TemplateRef<any>>('modalHeader');
  body = contentChild<TemplateRef<any>>('modalBody');
  footer = contentChild<TemplateRef<any>>('modalFooter');

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.visible() && event.target instanceof Node && !this.content()?.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  show(): void {
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
