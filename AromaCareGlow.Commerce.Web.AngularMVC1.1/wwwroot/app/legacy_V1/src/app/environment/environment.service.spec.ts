import { EnvironmentService } from "./environment.service";

describe('EnvironmentService', () => {
  let testComponent: EnvironmentService;
  let testConfig = {
    "production": false,
    "isStandalone": true,
    "baseApiPath": "/remoteWAS/",
    "WASPath": "https:// vmtm-m10.api-wi.com/APIHC/TM/WAS/WebServices_DEV2TEAM5/",
    "loginUser": {
      "username": "apiadmin",
      "password": "api",
      "timeout": "1:00:00"
    },
    "logger": {
      "logUrl": "/api/d2t6/logs",
      "logLevel": "NgxLoggerLevel.WARN",
      "serverLogLevel": "NgxLoggerLevel.OFF"
    },
    "auth": {
      "clientId": "1ee3c715-c817-4c98-b023-c771dfd31e05",
      "clientSecret": "PIfevVI4uCpQM6CyR+91h4Bi58BVAeCJT8sKf7hLxLI=",
      "realm": "https:// apiazuredevge.onmicrosoft.com",
      "directory": "147a2b71-5ce9-4933-94c4-2054328de565"
    }
  };
  beforeEach(() => {
    testComponent = new EnvironmentService(testConfig);
  });

  it('reads the values from the appropriate .json environment file', () => {
    expect(testComponent.baseApiPath).toEqual('/remoteWAS/');
    expect(testComponent.isStandalone).toBeTruthy();
    expect(testComponent.isLocal).toBeTruthy();
    expect(testComponent.loginUser).toEqual({
      username: 'apiadmin',
      password: 'api',
      timeout: '1:00:00'
    });
  });
});
