

import { Injectable } from '@angular/core';

/**
 * Configuration interface for interacting with the Organization controller.
 */
export interface ISignalrConfig {
  /**
   * Service endpoint for getting the timezone information for the specified organization.
   */
    ENDPOINT: string;
    HUB: string;
    SELF_SCHEDULE_DATA_CHANGED_EVENT: string;
    REGISTER_ORG_AND_DATE: string;
    DEREGISTER_LISTENER: string;
}

@Injectable()
export class SignalrConfig implements ISignalrConfig {
    ENDPOINT = 'signalr';
    HUB = 'schedulingHub';
    SELF_SCHEDULE_DATA_CHANGED_EVENT = 'scheduleDataChanged';
    REGISTER_ORG_AND_DATE = 'registerOrganizationsAndDateRange';
    DEREGISTER_LISTENER = 'deregisterListener';
}
