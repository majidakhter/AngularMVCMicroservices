import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  "production": false,
  "isStandalone": true,
  "baseApiPath": "/remoteWAS/",
  "WASPath": "https://intt02.apihcdevcloud.com/tm/testing1/web-services/",
  "loginUser": {
    "username": "ARA01",
    "password": "api",
    "timeout": "1:00:00"
  },
  "logger": {
    "logUrl": "/api/intt02/logs",
    "logLevel": NgxLoggerLevel.WARN,
    "serverLogLevel": NgxLoggerLevel.OFF
  },
  "auth": {
    "clientId": "1d024eff-e9dc-4e43-9839-12eaaac59ada",
    "clientSecret": "SKIebNWrS7KcOWqKoUNKhaV2zQJuovbWfozkhgHuBKo=",
    "realm": "https://apiazuredevge.onmicrosoft.com",
    "directory": "147a2b71-5ce9-4933-94c4-2054328de565"
  }
};

