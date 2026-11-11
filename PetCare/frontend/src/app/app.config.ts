import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { authInterceptor } from './core/auth.interceptor';
import { errorInterceptor } from './core/error.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Orden: errorInterceptor envuelve a authInterceptor, así auth ve el 401 original
    // antes de que errorInterceptor lo convierta en un Error con mensaje legible.
    provideHttpClient(withXhr(), withInterceptors([errorInterceptor, authInterceptor])),
  ],
};
