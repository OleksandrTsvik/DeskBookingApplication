import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';

import { BookingFormComponent } from '@/features/booking-form/booking-form.component';
import { BookingFormValues } from '@/features/booking-form/booking-form.models';
import { PageTitleComponent } from '@/features/page-title/page-title.component';
import { ButtonComponent } from '@/shared/components/button/button.component';

import { BookedWorkspaceResponse, UpdateBookedWorkspaceRequest } from './booking-edit-page.models';
import { BookingEditPageService } from './booking-edit-page.service';
import { SubmitErrorModalComponent } from './submit-error-modal/submit-error-modal.component';
import { SubmitSuccessModalComponent } from './submit-success-modal/submit-success-modal.component';

@Component({
  selector: 'app-booking-edit-page',
  imports: [
    AsyncPipe,
    RouterLink,
    BookingFormComponent,
    PageTitleComponent,
    ButtonComponent,
    SubmitErrorModalComponent,
    SubmitSuccessModalComponent,
  ],
  templateUrl: './booking-edit-page.component.html',
  styleUrl: './booking-edit-page.component.css',
})
export class BookingEditPageComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private bookingEditPageService = inject(BookingEditPageService);

  bookingId = input.required<string>();

  bookedWorkspace$?: Observable<BookedWorkspaceResponse>;

  isUpdateBookedWorkspaceLoading = signal(false);
  showSubmitSuccessModal = signal(false);
  showSubmitErrorModal = signal(false);

  ngOnInit(): void {
    this.bookedWorkspace$ = this.bookingEditPageService.loadBookedWorkspace(this.bookingId());
  }

  onSubmit(values: BookingFormValues): void {
    this.isUpdateBookedWorkspaceLoading.set(true);

    const request: UpdateBookedWorkspaceRequest = {
      ...values,
      id: this.bookingId(),
    };

    const subscription = this.bookingEditPageService
      .updateBookedWorkspace(request)
      .pipe(finalize(() => this.isUpdateBookedWorkspaceLoading.set(false)))
      .subscribe({
        complete: () => this.showSubmitSuccessModal.set(true),
        error: () => this.showSubmitErrorModal.set(true),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
