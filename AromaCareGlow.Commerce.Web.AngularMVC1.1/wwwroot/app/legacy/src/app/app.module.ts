import { BrowserModule } from '@angular/platform-browser';
import { DoBootstrap, NgModule, Injector, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QuickScheduleTopbarComponent } from './quick-schedule-topbar/quick-schedule-topbar.component'
import { environment } from 'src/environments/environment';
import { AppInitializer } from './app.initializer';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppConfig, APP_CONFIG } from './app.config';
import { LoggerModule } from 'ngx-logger';
import { AppErrorHandler } from './app.error-handler';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.production ? './Areas/QuickSchedule/dist/QuickSchedule/assets/i18n/' : './assets/i18n/', '.json');
}

export function InitializationServiceFactory(initializationService: AppInitializer): Function {
  /* tslint:disable:no-console */
  return () =>
    initializationService.load().catch(ex => {
      console.log(ex);
    });
  /* tslint:enable:no-console */
}


@NgModule({
  declarations: [
    AppComponent,
    QuickScheduleTopbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      }
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: environment.logger.logUrl,
      level: environment.logger.logLevel,
      serverLogLevel: environment.logger.serverLogLevel
    }),
    MatSnackBarModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500, horizontalPosition: 'center', verticalPosition: 'top' } },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    AppInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: InitializationServiceFactory,
      deps: [AppInitializer],
      multi: true
    }],
  entryComponents: [AppComponent],
})

export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) { }
  ngDoBootstrap() {
    const el = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('wfm-quick-schedule', el);
  }
}
