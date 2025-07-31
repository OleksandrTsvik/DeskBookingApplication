import { Component, booleanAttribute, input, output } from '@angular/core';

import { ButtonComponent } from '@/shared/components/button/button.component';
import { ModalComponent } from '@/shared/components/modal/modal.component';

@Component({
  selector: 'app-cancel-confirm-modal',
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './cancel-confirm-modal.component.html',
})
export class CancelConfirmModalComponent {
  visible = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  cancel = output();
  close = output();

  onCancel(): void {
    this.cancel.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
