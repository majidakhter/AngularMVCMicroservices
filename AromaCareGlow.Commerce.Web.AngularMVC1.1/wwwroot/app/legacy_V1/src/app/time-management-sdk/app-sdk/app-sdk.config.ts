import { Injectable } from '@angular/core';

/**
 * Configuration interface for interacting with the application controller.
 */
export interface IAppSdkConfig {
  /**
   * Service endpoint for getting the features.
   */
  GET_FEATURES_URL: string;
}

@Injectable()
export class AppSdkConfig implements IAppSdkConfig {
  GET_FEATURES_URL = 'application/feature' ;
}
