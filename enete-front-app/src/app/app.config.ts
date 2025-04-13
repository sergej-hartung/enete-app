import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
//import { provideNgxCookieConsent } from 'ngx-cookieconsent';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(),
    // provideNgxCookieConsent({
    //   cookie: { domain: 'localhost' },
    //   palette: { popup: { background: '#7d1120' }, button: { background: '#fff' } },
    //   content: {
    //     message: 'Wir verwenden Cookies, um die Nutzung dieser Website zu verbessern.',
    //     dismiss: 'OK',
    //     link: 'Datenschutz',
    //     href: '/datenschutz',
    //   },
    // }),
  ]
};


