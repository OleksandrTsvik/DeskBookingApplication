import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { BookingFormComponent } from '@/features/booking-form/booking-form.component';
import { BookingFormValues } from '@/features/booking-form/booking-form.models';
import { PageTitleComponent } from '@/features/page-title/page-title.component';
import { ButtonComponent } from '@/shared/components/button/button.component';

import { BookWorkspaceRequest } from './booking-page.models';
import { BookingPageService } from './booking-page.service';
import { SubmitErrorModalComponent } from './submit-error-modal/submit-error-modal.component';
import { SubmitSuccessModalComponent } from './submit-success-modal/submit-success-modal.component';

@Component({
  selector: 'app-booking-page',
  imports: [
    BookingFormComponent,
    PageTitleComponent,
    ButtonComponent,
    SubmitErrorModalComponent,
    SubmitSuccessModalComponent,
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css',
})
export class BookingPageComponent {
  private destroyRef = inject(DestroyRef);
  private bookingPageService = inject(BookingPageService);

  workspaceType = input<string>();

  isBookWorkspaceLoading = signal(false);
  submittedFormData = signal<BookWorkspaceRequest | null>(null);
  showSubmitSuccessModal = signal(false);
  showSubmitErrorModal = signal(false);

  onSubmit(values: BookingFormValues): void {
    this.isBookWorkspaceLoading.set(true);

    const subscription = this.bookingPageService
      .bookWorkspace(values)
      .pipe(finalize(() => this.isBookWorkspaceLoading.set(false)))
      .subscribe({
        complete: () => {
          this.submittedFormData.set(values);
          this.showSubmitSuccessModal.set(true);
        },
        error: () => this.showSubmitErrorModal.set(true),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
