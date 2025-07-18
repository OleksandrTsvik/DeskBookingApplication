import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BookableWorkspaceResponse } from './booking-page.models';

@Injectable({
  providedIn: 'root',
})
export class BookingPageService {
  private httpClient = inject(HttpClient);

  loadBookableWorkspaces() {
    return this.httpClient.get<BookableWorkspaceResponse[]>('http://localhost:5000/api/workspaces/book');
  }
}
