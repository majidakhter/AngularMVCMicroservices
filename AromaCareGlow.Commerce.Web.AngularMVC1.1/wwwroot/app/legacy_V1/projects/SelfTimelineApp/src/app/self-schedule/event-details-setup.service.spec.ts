
import { EventDetailsSetup } from './event-details-setup.service';
import * as moment from 'moment';
import { IActivityWithConfig, IActivityConfig } from 'src/app/time-management-domain/activity';
import { IProfile } from 'src/app/time-management-domain/profile';
import { IScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { IEventDetailsEvent } from '@api-wfm/ng-sympl-ux';
import { ILocationWithConfig, ILocationConfig } from 'src/app/time-management-domain/location';

describe('EventDetailsSetupService', () => {
  let eventDetailsSetup: EventDetailsSetup;

  const activityEvent = {
    startDate: moment('12-12-2019'),
    endDate: moment('12-12-2019'),
    guid: '123',
    activity: {
      code: 'activity',
      configuration: {
        isDisplayedOnMonthlyView: true,
        isOnCall: false,
        isTimeOff: true
      } as IActivityConfig
    } as IActivityWithConfig,
    location: {
      configuration: {
        isExtraShift: true
      } as ILocationConfig
    },
    profile: { code: 'activityProfile' } as IProfile,
    hours: 8,
    status: null,
    isExtraShift: false,
    lunchHours: 0.5
  } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;

  const activityEventNoConfig = {
    startDate: moment('12-12-2019'),
    endDate: moment('12-12-2019'),
    guid: '123',
    activity: {
      code: 'activity',
      configuration: null
    } as IActivityWithConfig,
    location: {
      configuration: null as ILocationConfig
    },
    profile: { code: 'activityProfile' } as IProfile,
    hours: 8,
    status: null,
    lunchHours: 0.5
  } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;

  const paycodeEvent = {
    payCode: {
      id: '22',
      name: 'pay22',
      code: 'paycode',
      configuration: {
        isOnCall: true,
        isTimeOff: false
      }
    } as IPayCodeWithIndicatorConfiguration,
    startDate: moment('12-12-2019'),
    endDate: moment('12-12-2019'),
    hours: 8,
    guid: '123',
    status: null,
    lunchHours: 0.5
  } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;

  const paycodeEventNoConfig = {
    payCode: {
      id: '22',
      name: 'pay22',
      code: 'paycode',
      configuration: null
    } as IPayCodeWithIndicatorConfiguration,
    startDate: moment('12-12-2019'),
    endDate: moment('12-12-2019'),
    hours: null,
    guid: '123',
    status: null,
    lunchHours: 0.5
  } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;

  beforeEach(() => {
    eventDetailsSetup = new EventDetailsSetup();
  });

  describe('#mapEvent', () => {
    describe('when mapping an activity', () => {
      let mappedEvent: IEventDetailsEvent;
      beforeEach(() => {
        mappedEvent = eventDetailsSetup.mapEvent(activityEvent);
      });

      it('should map the activity code', () => {
        expect(mappedEvent.activity.code).toEqual('activity');
      });

      it('it should set true or false to display on monthly view', () => {
        expect(mappedEvent.activity.configuration.isDisplayedOnMonthlyView).toEqual(activityEvent.activity.configuration.isDisplayedOnMonthlyView);
      });

      it('it should set OnCall flag', () => {
        expect(mappedEvent.activity.configuration.isOnCall).toEqual(activityEvent.activity.configuration.isOnCall);
      });

      it('it should set TimeOff flag', () => {
        expect(mappedEvent.activity.configuration.isTimeOff).toEqual(activityEvent.activity.configuration.isTimeOff);
      });

      it('should set isExtraShift', () => {
        expect(mappedEvent.location.configuration.isExtraShift).toEqual(false);
      });

      describe('when configuration is null', () => {
        beforeEach(() => {
          mappedEvent = eventDetailsSetup.mapEvent(activityEventNoConfig);
        });

        it('should set configuration null', () => {
          expect(mappedEvent.activity.configuration).toBeNull();
        });
      });
    });

    describe('When mapping a paycode', () => {
      let mappedEvent: IEventDetailsEvent;
      beforeEach(() => {
        mappedEvent = eventDetailsSetup.mapEvent(paycodeEvent);
      });

      it('should map a paycode event to an IEventDetailsEvent', () => {
        expect(mappedEvent.paycode.code).toEqual('paycode');
      });

      it('it should set OnCall flag', () => {
        expect(mappedEvent.paycode.configuration.isOnCall).toEqual(paycodeEvent.payCode.configuration.isOnCall);
      });

      it('it should set TimeOff flag', () => {
        expect(mappedEvent.paycode.configuration.isTimeOff).toEqual(paycodeEvent.payCode.configuration.isTimeOff);
      });

      describe('when configuration is null', () => {
        beforeEach(() => {
          mappedEvent = eventDetailsSetup.mapEvent(paycodeEventNoConfig);
        });

        it('should set configuration null', () => {
          expect(mappedEvent.paycode.configuration).toBeNull();
        });
      });
    });
  });
});
