import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './views/common/layout/layout.component';
import { MainNavbarComponent } from './components/nav/main-navbar/main-navbar.component';
import { SecondaryNavbarComponent } from './components/nav/secondary-navbar/secondary-navbar.component';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {LoggingInterceptor} from './interceptors/logging.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe, 'de');


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MainNavbarComponent,
    SecondaryNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de' },
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
