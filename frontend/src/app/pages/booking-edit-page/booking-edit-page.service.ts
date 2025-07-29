import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BookedWorkspaceResponse, UpdateBookedWorkspaceRequest } from './booking-edit-page.models';

@Injectable({
  providedIn: 'root',
})
export class BookingEditPageService {
  private httpClient = inject(HttpClient);

  loadBookedWorkspace(id: string): Observable<BookedWorkspaceResponse> {
    return this.httpClient.get<BookedWorkspaceResponse>('@api/bookings/' + id);
  }

  updateBookedWorkspace(request: UpdateBookedWorkspaceRequest) {
    return this.httpClient.put('@api/bookings', request);
  }
}
