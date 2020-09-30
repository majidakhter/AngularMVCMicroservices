import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  isStandalone: false,
  loginUser: null,
  baseApiPath: null,
  logger: {
    logUrl: '/api/prod/logs',
    logLevel: NgxLoggerLevel.ERROR,
    serverLogLevel: NgxLoggerLevel.ERROR
  },
  auth: null
};
