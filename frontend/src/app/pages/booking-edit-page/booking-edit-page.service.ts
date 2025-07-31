import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CACHE_TAGS } from '@/shared/constants/cache.constants';
import { buildHttpContextWithCache } from '@/shared/interceptors/cache.interceptor';

import { BookedWorkspaceResponse, UpdateBookedWorkspaceRequest } from './booking-edit-page.models';

@Injectable({
  providedIn: 'root',
})
export class BookingEditPageService {
  private httpClient = inject(HttpClient);

  loadBookedWorkspace(id: string): Observable<BookedWorkspaceResponse> {
    return this.httpClient.get<BookedWorkspaceResponse>('@api/bookings/' + id, {
      context: buildHttpContextWithCache({ providesTags: [CACHE_TAGS.BOOKINGS] }),
    });
  }

  updateBookedWorkspace(request: UpdateBookedWorkspaceRequest) {
    return this.httpClient.put('@api/bookings', request, {
      context: buildHttpContextWithCache({ invalidatesTags: [CACHE_TAGS.WORKSPACES, CACHE_TAGS.BOOKINGS] }),
    });
  }
}
