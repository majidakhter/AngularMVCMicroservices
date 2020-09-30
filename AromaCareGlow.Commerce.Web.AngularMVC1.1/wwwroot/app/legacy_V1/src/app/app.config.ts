

import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<IAppConfig>('app.config');

export interface IAppConfig {
  was_url: string;
  token_url: string;
  web_service_url: string;
  user_url: string;
  login_url: string;
}

export const AppConfig: IAppConfig = {
  was_url: '../../../../Services/api/application/web-service-path',
  token_url: '../../../../Services/api/user/token',

  web_service_url: '../../../../Services/api/application/web-service-path',
  user_url: 'user/me',
  login_url: 'user/_login'
};
