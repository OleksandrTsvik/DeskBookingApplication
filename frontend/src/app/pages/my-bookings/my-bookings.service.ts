import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BookedWorkspaceResponse } from './my-bookings.models';

@Injectable({
  providedIn: 'root',
})
export class MyBookingsService {
  private httpClient = inject(HttpClient);

  loadBookedWorkspaces(): Observable<BookedWorkspaceResponse[]> {
    return this.httpClient.get<BookedWorkspaceResponse[]>('http://localhost:5000/api/bookings');
  }

  cancelWorkspaceBooking(id: string): Observable<Object> {
    return this.httpClient.delete('http://localhost:5000/api/bookings/' + id);
  }
}
