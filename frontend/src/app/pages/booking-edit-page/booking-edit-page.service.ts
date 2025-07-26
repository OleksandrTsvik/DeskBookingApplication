import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BookedWorkspaceResponse, UpdateWorkspaceBookingRequest } from './booking-edit-page.models';

@Injectable({
  providedIn: 'root',
})
export class BookingEditPageService {
  private httpClient = inject(HttpClient);

  loadBookedWorkspace(id: string): Observable<BookedWorkspaceResponse> {
    return this.httpClient.get<BookedWorkspaceResponse>('http://localhost:5000/api/bookings/' + id);
  }

  updateWorkspaceBooking(request: UpdateWorkspaceBookingRequest) {
    return this.httpClient.put('http://localhost:5000/api/bookings', request);
  }
}
