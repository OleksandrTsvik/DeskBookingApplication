import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { baseUrlInterceptor } from '@/shared/interceptors/base-url.interceptor';
import { cacheInterceptor } from '@/shared/interceptors/cache.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([cacheInterceptor, baseUrlInterceptor])),
  ],
};
