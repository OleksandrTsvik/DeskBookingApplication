import { Routes } from '@angular/router';

import { LayoutComponent } from '@/layout/layout.component';
import { BookingPageComponent } from '@/pages/booking-page/booking-page.component';
import { HomePageComponent } from '@/pages/home-page/home-page.component';
import { NotFoundPageComponent } from '@/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/workspaces', pathMatch: 'full' },
      { path: 'workspaces', component: HomePageComponent },
      { path: 'workspaces/book', component: BookingPageComponent },
      { path: '**', component: NotFoundPageComponent },
    ],
  },
];
