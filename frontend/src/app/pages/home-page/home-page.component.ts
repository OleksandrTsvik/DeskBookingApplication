import { Component } from '@angular/core';

import { WorkspaceCardComponent } from '@/app/pages/home-page/workspace-card/workspace-card.component';

@Component({
  selector: 'app-home-page',
  imports: [WorkspaceCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
