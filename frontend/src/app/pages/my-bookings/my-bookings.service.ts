import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BookedWorkspaceResponse } from './my-bookings.models';

@Injectable({
  providedIn: 'root',
})
export class MyBookingsService {
  private httpClient = inject(HttpClient);

  loadBookedWorkspaces(): Observable<BookedWorkspaceResponse[]> {
    return this.httpClient
      .get<BookedWorkspaceResponse[]>('http://localhost:5000/api/bookings')
      .pipe(map(this.projectBookedWorkspaces));
  }

  cancelWorkspaceBooking(id: string): Observable<Object> {
    return this.httpClient.delete('http://localhost:5000/api/bookings/' + id);
  }

  private projectBookedWorkspaces(bookedWorkspaces: BookedWorkspaceResponse[]): BookedWorkspaceResponse[] {
    return bookedWorkspaces.map((bookedWorkspace) => ({
      ...bookedWorkspace,
      startTime: new Date(bookedWorkspace.startTime),
      endTime: new Date(bookedWorkspace.endTime),
    }));
  }
}
