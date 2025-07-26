import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BookWorkspaceRequest } from './booking-page.models';

@Injectable({
  providedIn: 'root',
})
export class BookingPageService {
  private httpClient = inject(HttpClient);

  bookWorkspace(request: BookWorkspaceRequest) {
    return this.httpClient.post('http://localhost:5000/api/bookings', request);
  }
}
