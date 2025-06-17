import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth/auth.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => inject(AuthService).load()),
    provideEnvironmentNgxMask()
  ]
};
