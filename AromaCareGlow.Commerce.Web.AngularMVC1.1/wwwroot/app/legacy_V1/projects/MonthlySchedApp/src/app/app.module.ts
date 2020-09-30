import { Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppInitializerService } from 'src/app/app-initializer.service';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { ScheduleState } from 'projects/MonthlyViewApp/src/app/store/schedule/states/schedule.state';
import { TradeState } from 'projects/MonthlyViewApp/src/app/store/trade/states/trade.state';
import { CalendarEventsState } from 'projects/MonthlyViewApp/src/app/store/calendar-events/state/calendar-events.state';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from 'src/app/auth/auth.module';
import { LoggerModule } from 'ngx-logger';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonthlyViewModule } from './monthlyview/monthly-view.module';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { AppConfig, APP_CONFIG } from 'src/app/app.config';
import { AppErrorHandler } from 'src/app/app.error-handler';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';
import { DocumentRef } from 'src/app/shared/document-ref/document-ref.service';
import { ScrollService } from 'src/app/shared/scroll/scroll.service';
import { WindowRef } from 'src/app/shared/window-ref/window-ref.service';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

const appRoutes: Routes = [];

export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export function InitializationServiceFactory(initializationService: AppInitializerService): Function {
  return () => initializationService.load();
}

const env = require('./../../../../environments/config.json');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forRoot([
      AuthState,
      ScheduleState,
      TradeState,
      CalendarEventsState
    ]),
    NgxsStoragePluginModule.forRoot({
      key: ['auth.token', 'auth.employeeCode'],
      storage: StorageOption.SessionStorage
    }),
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    AuthModule.forRoot(),
    LoggerModule.forRoot({
      serverLoggingUrl: env.logger.logUrl,
      level: env.logger.logLevel,
      serverLogLevel: env.logger.serverLogLevel
    }),
    SharedModule,
    MonthlyViewModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: APP_BASE_HREF, useValue: window.location.pathname },
    AppInitializerService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: InitializationServiceFactory,
      deps: [AppInitializerService],
      multi: true
    },
    EnvironmentService,
    AnalyticsService,
    DocumentRef,
    ScrollService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
