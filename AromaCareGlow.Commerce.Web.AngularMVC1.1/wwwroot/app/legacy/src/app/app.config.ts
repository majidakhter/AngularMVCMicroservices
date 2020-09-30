import { InjectionToken } from '@angular/core';
import { environment } from './../environments/environment';

export const APP_CONFIG = new InjectionToken('app.config');

export const AppConfig = {
  was_url: '../../../Services/api/application/web-service-path',
  token_url: '../../../Services/api/user/token',
  get login_url() { return environment.baseApiPath + 'user/_login'; },
};
