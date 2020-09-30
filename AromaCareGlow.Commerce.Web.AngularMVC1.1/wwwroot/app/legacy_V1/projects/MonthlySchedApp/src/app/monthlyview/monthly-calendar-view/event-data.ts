import { EventTypes } from 'src/app/time-management-domain/event-types';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';

export interface IEventData {
  eventType: EventTypes;
  schedule: IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;
  isTradeable: boolean;
}
