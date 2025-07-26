import { DatePipe, I18nPluralPipe, NgPlural, NgPluralCase } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@/shared/components/button/button.component';
import { IconDirective } from '@/shared/directives/icon.directive';
import { dateOnlyToDate, diffDates, timeOnlyToDate } from '@/shared/utils/date.utils';

import { BookedWorkspaceResponse } from '../my-bookings.models';

@Component({
  selector: 'app-booking-card',
  imports: [DatePipe, NgPlural, NgPluralCase, RouterLink, ButtonComponent, IconDirective],
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

  isSameDate = computed(() => {
    const { startDate, endDate } = this.bookedWorkspace();
    return startDate === endDate;
  });

  startTime = computed(() => timeOnlyToDate(this.bookedWorkspace().startTime));
  endTime = computed(() => timeOnlyToDate(this.bookedWorkspace().endTime));

  durationInDays = computed(() => {
    const { startDate, endDate } = this.bookedWorkspace();
    return diffDates(dateOnlyToDate(startDate), dateOnlyToDate(endDate), 'day') + 1;
  });

  durationInHours = computed(() => diffDates(this.startTime(), this.endTime(), 'hour'));

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
