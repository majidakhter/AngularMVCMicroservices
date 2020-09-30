import { Injectable, Optional, Inject } from '@angular/core';

@Injectable()
export class EnvironmentService {
  baseApiPath: string;
  isLocal: boolean;
  isStandalone: boolean;
  loginUser: ILoginUser;
  auth: {
    clientId: string,
    clientSecret: string,
    realm: string,
    directory: string,
    accessToken: string,
    tokenRequested: string
  };

  constructor(@Inject('nothing') @Optional() config) {
    //  This line only resolves to the real config.json when not testing the service
    /* istanbul ignore next */
    let env = config;
    
    /* istanbul ignore if  */
    if (!env) {
      try {
        env = require('./../../../environments/config.json'); // Webpack will magically switch this to the correct /config/environments/*.json file
      }
      catch {
        // This will only happen during executing a unit test where using require() above does not play nice.
      }
    }
    this.isStandalone = env.isStandalone;
    this.loginUser = env.loginUser;
    this.baseApiPath = env.baseApiPath;
    this.isLocal = window.location.hostname === 'localhost';
    this.auth = env.auth;
  }
}

export interface ILoginUser {
  username: string;
  password: string;
  timeout: string;
}
