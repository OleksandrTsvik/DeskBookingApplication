import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PageTitleComponent } from '@/features/page-title/page-title.component';

import { BookingCardComponent } from './booking-card/booking-card.component';
import { CancelConfirmModalComponent } from './cancel-confirm-modal/cancel-confirm-modal.component';
import { EmptyBookingsComponent } from './empty-bookings/empty-bookings.component';
import { MyBookingsService } from './my-bookings.service';

@Component({
  selector: 'app-my-bookings',
  imports: [AsyncPipe, PageTitleComponent, BookingCardComponent, CancelConfirmModalComponent, EmptyBookingsComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent {
  private destroyRef = inject(DestroyRef);
  private myBookingsService = inject(MyBookingsService);

  bookedWorkspaces$ = this.myBookingsService.loadBookedWorkspaces();

  bookingIdToCancel = signal<string | null>(null);

  cancelModalOpen(id: string): void {
    this.bookingIdToCancel.set(id);
  }

  cancelModalClose(): void {
    this.bookingIdToCancel.set(null);
  }

  onCancel(): void {
    const id = this.bookingIdToCancel();

    if (!id) {
      return;
    }

    const subscription = this.myBookingsService.cancelWorkspaceBooking(id).subscribe({
      complete: () => {
        this.bookingIdToCancel.set(null);
        this.bookedWorkspaces$ = this.myBookingsService.loadBookedWorkspaces();
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
