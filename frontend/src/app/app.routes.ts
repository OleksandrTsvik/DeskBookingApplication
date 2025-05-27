import { Routes } from '@angular/router';

import { LayoutComponent } from '@/app/layout/layout.component';
import { HomePageComponent } from '@/app/pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: LayoutComponent, children: [{ path: '', component: HomePageComponent }] },
];
