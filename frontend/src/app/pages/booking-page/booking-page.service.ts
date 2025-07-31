import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { CACHE_TAGS } from '@/shared/constants/cache.constants';
import { buildHttpContextWithCache } from '@/shared/interceptors/cache.interceptor';

import { BookWorkspaceRequest } from './booking-page.models';

@Injectable({
  providedIn: 'root',
})
export class BookingPageService {
  private httpClient = inject(HttpClient);

  bookWorkspace(request: BookWorkspaceRequest) {
    return this.httpClient.post('@api/bookings', request, {
      context: buildHttpContextWithCache({ invalidatesTags: [CACHE_TAGS.WORKSPACES, CACHE_TAGS.BOOKINGS] }),
    });
  }
}
