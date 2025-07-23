import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective } from '@/shared/components/button/button.directive';
import { ModalComponent } from '@/shared/components/modal/modal.component';
import { Nullable } from '@/shared/models/common.models';

@Component({
  selector: 'app-submit-success-modal',
  imports: [DatePipe, RouterLink, ButtonDirective, ModalComponent],
  templateUrl: './submit-success-modal.component.html',
  providers: [I18nPluralPipe],
})
export class SubmitSuccessModalComponent {
  private i18nPluralPipe = inject(I18nPluralPipe);

  email = input.required<Nullable<string>>();
  deskCount = input.required<Nullable<number>>();
  roomCapacity = input.required<Nullable<number>>();
  startDate = input.required<Nullable<Date>>();
  endDate = input.required<Nullable<Date>>();

  visible = model(false);

  roomOptions = computed(() =>
    [this.getDeskCountOptionText(), this.getRoomCapacityOptionText()].filter(Boolean).join(', '),
  );

  private getDeskCountOptionText(): string | null {
    const deskCount = this.deskCount();

    if (!deskCount || deskCount < 0) {
      return null;
    }

    return this.i18nPluralPipe.transform(deskCount, {
      '=1': '1 desk',
      other: '# desks',
    });
  }

  private getRoomCapacityOptionText(): string | null {
    const roomCapacity = this.roomCapacity();

    if (!roomCapacity || roomCapacity < 0) {
      return null;
    }

    return this.i18nPluralPipe.transform(roomCapacity, {
      '=1': 'room for 1 person',
      other: 'room for # people',
    });
  }
}
