import { DatePipe, I18nPluralPipe, NgPlural, NgPluralCase } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';

import { ButtonComponent } from '@/shared/components/button/button.component';
import { IconDirective } from '@/shared/directives/icon.directive';
import { diffDates } from '@/shared/utils/date.utils';

import { BookedWorkspaceResponse } from '../my-bookings.models';

@Component({
  selector: 'app-booking-card',
  imports: [DatePipe, NgPlural, NgPluralCase, ButtonComponent, IconDirective],
  templateUrl: './booking-card.component.html',
  styleUrl: './booking-card.component.css',
  providers: [I18nPluralPipe],
})
export class BookingCardComponent {
  private i18nPluralPipe = inject(I18nPluralPipe);

  bookedWorkspace = input.required<BookedWorkspaceResponse>();
  cancel = output<string>();

  workspaceName = computed(() => this.bookedWorkspace().name.replace(/s$/g, ''));

  workspaceOptions = computed(() =>
    [this.getDeskCountOptionText(), this.getRoomCapacityOptionText()].filter(Boolean).join(', '),
  );

  durationInDays = computed(() => {
    const { startTime, endTime } = this.bookedWorkspace();
    return diffDates(startTime, endTime, 'day');
  });

  durationInHours = computed(() => {
    const { startTime, endTime } = this.bookedWorkspace();
    return diffDates(endTime, startTime, 'hour');
  });

  isSameDate = computed(() => {
    const { startTime, endTime } = this.bookedWorkspace();

    return (
      startTime.getFullYear() === endTime.getFullYear() &&
      startTime.getMonth() === endTime.getMonth() &&
      startTime.getDate() === endTime.getDate()
    );
  });

  onCancelButtonClick(id: string): void {
    this.cancel.emit(id);
  }

  private getDeskCountOptionText(): string | null {
    const deskCount = this.bookedWorkspace().deskCount;

    if (!deskCount || deskCount < 0) {
      return null;
    }

    return this.i18nPluralPipe.transform(deskCount, {
      '=1': 'with 1 desk',
      other: 'with # desks',
    });
  }

  private getRoomCapacityOptionText(): string | null {
    const roomCapacity = this.bookedWorkspace().roomCapacity;

    if (!roomCapacity || roomCapacity < 0) {
      return null;
    }

    return this.i18nPluralPipe.transform(roomCapacity, {
      '=1': 'for 1 person',
      other: 'for # people',
    });
  }
}
