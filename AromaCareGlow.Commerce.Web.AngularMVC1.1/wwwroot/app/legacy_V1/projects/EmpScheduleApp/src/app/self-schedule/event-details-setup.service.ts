

import { MapEventFn, IEventDetailsEvent } from '@api-wfm/ng-sympl-ux';
import { Injectable } from '@angular/core';
import { IScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EventDetailsSetup {
  public mapEvent: MapEventFn<IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>> =
    (event: IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>) => {
      const mappedEvent: IEventDetailsEvent = {
        activity: null,
        paycode: null,
        location: null,
        start: event.startDate,
        hours: event.hours ? event.hours : 0,
        status: event.status,
        isTradeRequested: event.isTradeRequested,
        scheduleTradeParticipant: event.scheduleTradeParticipant,
        scheduleTradeStatus: event.scheduleTradeStatus,
        source: event.source,
        lunchHours: event.lunchHours
      };

      if (event.activity) {
        const activity = event.activity;
        mappedEvent.activity = {
          code: activity.code,
          profile: {
            code: event.profile.code
          },
          configuration: null
        };

        if (activity.configuration) {
          mappedEvent.activity.configuration = {
            isDisplayedOnMonthlyView: activity.configuration.isDisplayedOnMonthlyView,
            isOnCall: activity.configuration.isOnCall,
            isTimeOff: activity.configuration.isTimeOff
          };
        }

        if (event.location.configuration) {
          mappedEvent.location = {
            configuration: {
              isExtraShift: event.location.configuration.isExtraShift && event.isExtraShift
            }
          };
        }

      } else {
        const paycode = event.payCode;
        mappedEvent.paycode = {
          code: paycode.code,
          configuration: null
        };

        if (paycode.configuration) {
          mappedEvent.paycode.configuration = {
            isDisplayedOnMonthlyView: paycode.configuration.isDisplayedOnMonthlyView,
            isOnCall: paycode.configuration.isOnCall,
            isTimeOff: paycode.configuration.isTimeOff
          };
        }
      }

      return mappedEvent;
    }
}
