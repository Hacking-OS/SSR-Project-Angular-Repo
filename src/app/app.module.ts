import { ErrorHandler, NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { httpInterceptorProviders } from './Shared-Module/Interceptors';
import { GlobalErrorHandlerService } from './Shared-Module/Shared-Services/Error-Handler-Services/errorHandler.HandleError';
import { DatePipe } from '@angular/common';
import { AuthUserGuard } from './Shared-Module/Guards/auth-user.Guard';
import { UserFoundGuard } from './Shared-Module/Guards/user-found.Guard';
import { UserNotFoundGuard } from './Shared-Module/Guards/user-not-found.Guard';
import { PageLoaderService } from './Shared-Module/Shared-Services/Loader-Services/page-loader-control.service';
import { CspNonceService } from './Shared-Module/Shared-Services/Security-Services/cspnounce.Service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { NgToastModule } from 'ng-angular-popup';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ToastrModule } from 'ngx-toastr';
import { ProgressBarModule } from 'primeng/progressbar';
import { environment } from '../environments/environment';
import { MainModule } from './Shared-Module/main.module';
import { AdminModule } from './Admin-Module/admin.module';
import { CartModule } from './cartSystem-Module/cart.module';
import { MediaModule } from './User-Entertainment-Module/user-Entertainment.module';
import { UserModule } from './User-Module/user.module';
// import { CountService } from './Admin-Module/services/count.Service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoggerModule.forRoot({
      serverLoggingUrl: `${environment.baseUrl}/api/logger/logs`,
      level: NgxLoggerLevel.DEBUG, // Set the logging level
      // serverLoggingUrl: '/api/logs', // (Optional) URL to send logs to the server
      serverLogLevel: NgxLoggerLevel.DEBUG, // Log level for the server-side logging
      withCredentials: true,
  }),
  ProgressBarModule,
  // ProgressSpinnerModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  // NgxDatatableModule,
  FormsModule,
  ReactiveFormsModule,
  NgToastModule,
  BsDatepickerModule.forRoot(),
  ToastrModule.forRoot({
      timeOut: 3000, // Display time in milliseconds
      positionClass: 'toast-top-right', // Position of toastr
      preventDuplicates: true, // Prevent duplicate toasts
  }),

  UserModule,
  CartModule,
  AdminModule,
  // MediaModule,
  MainModule
  ],
  providers: [
    PageLoaderService,
    // CountService,
    CspNonceService,
    AuthUserGuard,
    UserNotFoundGuard,
    UserFoundGuard,
    DatePipe,
    provideAnimations(),
    provideClientHydration(),
    // provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({eventCoalescing:true}),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(), // Automatically register interceptors from DI
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN', // CSRF token cookie name
        headerName: 'X-XSRF-TOKEN', // CSRF token header name
      })
    ),
    httpInterceptorProviders,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }, // Global error handler
    // provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


