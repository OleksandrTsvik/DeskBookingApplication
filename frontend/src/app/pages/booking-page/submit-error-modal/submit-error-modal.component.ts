import { Component, model } from '@angular/core';

import { ButtonDirective } from '@/shared/components/button/button.directive';
import { ModalComponent } from '@/shared/components/modal/modal.component';

@Component({
  selector: 'app-submit-error-modal',
  imports: [ButtonDirective, ModalComponent],
  templateUrl: './submit-error-modal.component.html',
})
export class SubmitErrorModalComponent {
  visible = model(false);
}
