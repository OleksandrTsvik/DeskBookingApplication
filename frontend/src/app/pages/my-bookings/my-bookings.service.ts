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
    return this.httpClient.get<BookedWorkspaceResponse[]>('@api/bookings');
  }

  cancelBookedWorkspace(id: string): Observable<Object> {
    return this.httpClient.delete('@api/bookings/' + id);
  }
}
