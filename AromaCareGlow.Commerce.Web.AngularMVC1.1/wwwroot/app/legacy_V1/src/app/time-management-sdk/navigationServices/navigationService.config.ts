
import { Injectable } from '@angular/core';

/**
 * Configuration interface for interacting with the employee controller.
 */
export interface INavigationServiceConfig {
  GET_NAVIGATION_SECTIONS_URL: string;
}

@Injectable()
export class NavigationServiceConfig implements INavigationServiceConfig {
     GET_NAVIGATION_SECTIONS_URL = 'navigation/api/sections';
}
