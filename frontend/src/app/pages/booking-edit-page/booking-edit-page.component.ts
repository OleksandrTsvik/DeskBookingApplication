import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { BookingFormComponent } from '@/features/booking-form/booking-form.component';
import { BookingFormValues } from '@/features/booking-form/booking-form.models';
import { PageTitleComponent } from '@/features/page-title/page-title.component';
import { ButtonComponent } from '@/shared/components/button/button.component';

import { BookedWorkspaceResponse } from './booking-edit-page.models';
import { BookingEditPageService } from './booking-edit-page.service';

@Component({
  selector: 'app-booking-edit-page',
  imports: [AsyncPipe, RouterLink, BookingFormComponent, PageTitleComponent, ButtonComponent],
  templateUrl: './booking-edit-page.component.html',
  styleUrl: './booking-edit-page.component.css',
})
export class BookingEditPageComponent implements OnInit {
  private bookingEditPageService = inject(BookingEditPageService);

  bookingId = input.required<string>();

  bookedWorkspace$?: Observable<BookedWorkspaceResponse>;

  ngOnInit(): void {
    this.bookedWorkspace$ = this.bookingEditPageService.loadBookedWorkspace(this.bookingId());
  }

  onSubmit(values: BookingFormValues): void {
    console.log(values);
  }
}
