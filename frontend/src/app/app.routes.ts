import { Routes } from '@angular/router';

import { LayoutComponent } from '@/app/layout/layout.component';
import { HomePageComponent } from '@/app/pages/home-page/home-page.component';
import { NotFoundPageComponent } from '@/app/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/workspaces', pathMatch: 'full' },
      { path: 'workspaces', component: HomePageComponent },
      { path: '**', component: NotFoundPageComponent },
    ],
  },
];
