import { ApplicationConfig, importProvidersFrom, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth/auth.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideAppInitializer(() => inject(AuthService).load()),
    provideEnvironmentNgxMask(),
    importProvidersFrom(QuillModule.forRoot()),
    { provide: LOCALE_ID, useValue: 'pt' }
  ]
};
