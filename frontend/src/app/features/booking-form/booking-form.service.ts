import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AvailableWorkspaceResponse } from './booking-form.models';

@Injectable({
  providedIn: 'root',
})
export class BookingFormService {
  private httpClient = inject(HttpClient);

  loadAvailableWorkspaces() {
    return this.httpClient.get<AvailableWorkspaceResponse[]>('@api/workspaces/available');
  }
}
