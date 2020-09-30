import { IEventData } from './monthly-calendar-view/event-data';
import { MapEventFn, IEventDetailsEvent } from '@api-wfm/ng-sympl-ux';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventDetailsSetup {
  public mapEvent: MapEventFn<IEventData> = (event: IEventData) => {
    const mappedEvent: IEventDetailsEvent = {
      activity: null,
      paycode: null,
      location: null,
      start: event.schedule.startDate,
      hours: event.schedule.hours ? event.schedule.hours : 0,
      status: event.schedule.status,
      isTradeRequested: event.schedule.isTradeRequested,
      scheduleTradeParticipant: event.schedule.scheduleTradeParticipant,
      scheduleTradeStatus: event.schedule.scheduleTradeStatus,
      lunchHours: event.schedule.lunchHours
    };

    if (event.schedule.activity) {
      const activity = event.schedule.activity;
      mappedEvent.activity = {
        code: activity.code,
        profile: {
          code: event.schedule.profile.code
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

      if (event.schedule.location.configuration) {
        mappedEvent.location = {
          configuration: {
            isExtraShift: event.schedule.location.configuration.isExtraShift && event.schedule.isExtraShift
          }
        };
      }

    } else {
      const paycode = event.schedule.payCode;
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
