import { DatePipe, I18nPluralPipe } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@/shared/components/button/button.component';
import { ModalComponent } from '@/shared/components/modal/modal.component';
import { Nullable } from '@/shared/models/common.models';

@Component({
  selector: 'app-submit-success-modal',
  imports: [DatePipe, RouterLink, ButtonComponent, ModalComponent],
  templateUrl: './submit-success-modal.component.html',
  providers: [I18nPluralPipe],
  host: {
    role: 'dialog',
    'aria-label': 'Booking created successfully',
  },
})
export class SubmitSuccessModalComponent {
  private i18nPluralPipe = inject(I18nPluralPipe);

  email = input.required<Nullable<string>>();
  deskCount = input.required<Nullable<number>>();
  roomCapacity = input.required<Nullable<number>>();
  startDate = input.required<Nullable<string>>();
  endDate = input.required<Nullable<string>>();

  visible = model(false);

  workspaceOptions = computed(() =>
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
