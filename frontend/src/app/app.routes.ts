import { Routes } from '@angular/router';

import { LayoutComponent } from '@/layout/layout.component';
import { BookingEditPageComponent } from '@/pages/booking-edit-page/booking-edit-page.component';
import { BookingPageComponent } from '@/pages/booking-page/booking-page.component';
import { HomePageComponent } from '@/pages/home-page/home-page.component';
import { MyBookingsComponent } from '@/pages/my-bookings/my-bookings.component';
import { NotFoundPageComponent } from '@/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    title: 'Desk Booking',
    children: [
      {
        path: '',
        redirectTo: '/workspaces',
        pathMatch: 'full',
      },
      {
        path: 'workspaces',
        component: HomePageComponent,
        title: 'Coworking Details',
      },
      {
        path: 'bookings',
        component: MyBookingsComponent,
        title: 'My Bookings',
      },
      {
        path: 'workspaces/book',
        component: BookingPageComponent,
        title: 'Booking Form',
      },
      {
        path: 'bookings/edit/:bookingId',
        component: BookingEditPageComponent,
        title: 'Booking Form',
      },
      {
        path: '**',
        component: NotFoundPageComponent,
        title: 'Page not found',
      },
    ],
  },
];
