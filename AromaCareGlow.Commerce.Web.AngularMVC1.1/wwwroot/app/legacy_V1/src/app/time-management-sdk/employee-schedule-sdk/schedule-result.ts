

import { IScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';

export interface IEmployeeScheduleResult {
  etag: string;
  events: IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>[];
}
