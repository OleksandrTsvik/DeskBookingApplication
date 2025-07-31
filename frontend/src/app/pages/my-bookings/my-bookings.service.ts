import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CACHE_TAGS } from '@/shared/constants/cache.constants';
import { buildHttpContextWithCache } from '@/shared/interceptors/cache.interceptor';

import { BookedWorkspaceResponse } from './my-bookings.models';

@Injectable({
  providedIn: 'root',
})
export class MyBookingsService {
  private httpClient = inject(HttpClient);

  loadBookedWorkspaces(): Observable<BookedWorkspaceResponse[]> {
    return this.httpClient.get<BookedWorkspaceResponse[]>('@api/bookings', {
      context: buildHttpContextWithCache({ providesTags: [CACHE_TAGS.BOOKINGS] }),
    });
  }

  cancelBookedWorkspace(id: string): Observable<Object> {
    return this.httpClient.delete('@api/bookings/' + id, {
      context: buildHttpContextWithCache({ invalidatesTags: [CACHE_TAGS.WORKSPACES, CACHE_TAGS.BOOKINGS] }),
    });
  }
}
