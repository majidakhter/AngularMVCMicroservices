// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from 'ngx-logger';
/* tslint:disable */
export const environment = {
  production: false,
  isStandalone: true,
  baseApiPath: 'https://localhost:44308/',
  loginUser: {
    username: 'apiadmin',
    password: 'api',
    timeout: '1:00:00'
  },
  logger: {
    logUrl: '/api/local/logs',
    logLevel: NgxLoggerLevel.WARN,
    serverLogLevel: NgxLoggerLevel.OFF
  },
  auth: {
    clientId: 'cb83a4eb-8ba6-47b1-8dba-1505e02c170b',
    clientSecret: 'SUCSLwfurXd1BJx8LOXzLSygfaMOPDrwFgMWmSJ5bkg=',
    realm: 'https://localhost:44308',
    directory: '7e652abe-8af5-464f-a272-9c4c5d6a9170',
    accessToken: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
