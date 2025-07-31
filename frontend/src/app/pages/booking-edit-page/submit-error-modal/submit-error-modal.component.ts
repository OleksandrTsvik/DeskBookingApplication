import { Component, model } from '@angular/core';

import { ButtonComponent } from '@/shared/components/button/button.component';
import { ModalComponent } from '@/shared/components/modal/modal.component';

@Component({
  selector: 'app-submit-error-modal',
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './submit-error-modal.component.html',
  host: {
    role: 'dialog',
    'aria-label': 'Failed to update booking',
  },
})
export class SubmitErrorModalComponent {
  visible = model(false);
}
