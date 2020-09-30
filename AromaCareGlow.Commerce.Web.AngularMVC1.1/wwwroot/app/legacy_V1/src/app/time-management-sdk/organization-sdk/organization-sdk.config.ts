
import { Injectable } from '@angular/core';

/**
 * Configuration interface for interacting with the Organization controller.
 */
export interface IOrganizationSdkConfig {
  /**
   * Service endpoint for getting the timezone information for the specified organization.
   */
  GET_ORG_LEVEL: string;
  GET_ACTIVITY_STAFFING_COVERAGE_URL: string;
}

@Injectable()
export class OrganizationSdkConfig implements IOrganizationSdkConfig {

  GET_ORG_LEVEL = 'organization/level';
  GET_ACTIVITY_STAFFING_COVERAGE_URL = 'organization/{entityId}/activity/staffing-plan/coverage?start={startDate}&end={endDate}';
}
