import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CACHE_TAGS } from '@/shared/constants/cache.constants';
import { buildHttpContextWithCache } from '@/shared/interceptors/cache.interceptor';

import { WorkspaceResponse } from './home-page.models';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private httpClient = inject(HttpClient);

  loadWorkspaces(): Observable<WorkspaceResponse[]> {
    return this.httpClient.get<WorkspaceResponse[]>('@api/workspaces', {
      context: buildHttpContextWithCache({ providesTags: [CACHE_TAGS.WORKSPACES] }),
    });
  }
}
