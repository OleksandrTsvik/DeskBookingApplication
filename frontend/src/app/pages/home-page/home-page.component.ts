import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { PageTitleComponent } from '@/features/page-title/page-title.component';

import { HomePageService } from './home-page.service';
import { WorkspaceCardComponent } from './workspace-card/workspace-card.component';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, PageTitleComponent, WorkspaceCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private homePageService = inject(HomePageService);

  workspaces$ = this.homePageService.loadWorkspaces();
}
