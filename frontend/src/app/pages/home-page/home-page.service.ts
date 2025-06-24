import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { WorkspaceResponse } from './home-page.models';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private httpClient = inject(HttpClient);

  loadWorkspaces() {
    return this.httpClient.get<WorkspaceResponse[]>('http://localhost:5000/api/workspaces');
  }
}
