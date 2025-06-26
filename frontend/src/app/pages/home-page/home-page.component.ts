import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

import { PageTitleComponent } from '@/features/page-title/page-title.component';

import { WorkspaceResponse } from './home-page.models';
import { HomePageService } from './home-page.service';
import { WorkspaceCardComponent } from './workspace-card/workspace-card.component';

@Component({
  selector: 'app-home-page',
  imports: [PageTitleComponent, WorkspaceCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private homePageService = inject(HomePageService);

  workspaces = signal<WorkspaceResponse[]>([]);
  isFetching = signal<boolean>(false);

  ngOnInit(): void {
    this.isFetching.set(true);

    const loadWorkspacesSubscription = this.homePageService.loadWorkspaces().subscribe({
      next: (response) => this.workspaces.set(response),
      complete: () => this.isFetching.set(false),
      error: () => this.isFetching.set(false),
    });

    this.destroyRef.onDestroy(() => {
      loadWorkspacesSubscription.unsubscribe();
    });
  }
}
