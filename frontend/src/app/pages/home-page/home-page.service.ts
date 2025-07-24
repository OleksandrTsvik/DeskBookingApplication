import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { WorkspaceResponse } from './home-page.models';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private httpClient = inject(HttpClient);

  loadWorkspaces(): Observable<WorkspaceResponse[]> {
    return this.httpClient
      .get<WorkspaceResponse[]>('http://localhost:5000/api/workspaces')
      .pipe(map(this.projectWorkspaces));
  }

  private projectWorkspaces(workspaces: WorkspaceResponse[]) {
    return workspaces.map((workspace) =>
      workspace.userBooking
        ? {
            ...workspace,
            userBooking: {
              ...workspace.userBooking,
              startTime: new Date(workspace.userBooking.startTime),
              endTime: new Date(workspace.userBooking.endTime),
            },
          }
        : workspace,
    );
  }
}
