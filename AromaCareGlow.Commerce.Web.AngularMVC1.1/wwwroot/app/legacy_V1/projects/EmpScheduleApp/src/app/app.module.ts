
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoggerModule } from 'ngx-logger';
import { AppComponent } from './app.component';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { AuthModule } from 'src/app/auth/auth.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppConfig, APP_CONFIG } from 'src/app/app.config';
import { AppErrorHandler } from 'src/app/app.error-handler';
import { AppInitializerService } from 'src/app/app-initializer.service';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';
import { SelfScheduleModule } from './self-schedule/self-schedule.module';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { Routes, RouterModule } from '@angular/router';
import { SelfScheduleState } from './store/self-schedule/states/self-schedule.state';
import { EmployeeOrganizationSdkModule } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.module';
import { OrganizationSdkModule } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.module';
import { SelfScheduleAdd } from './store/self-schedule/states/self-schedule-add.state';
import { SignalrModule } from 'src/app/time-management-sdk/signalr/signalr.module';

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
    EmployeeOrganizationSdkModule,
    OrganizationSdkModule,
    SignalrModule,
    NgxsModule.forRoot([
      AuthState,
      SelfScheduleState,
      SelfScheduleAdd
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
    SelfScheduleModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
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
    AnalyticsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
