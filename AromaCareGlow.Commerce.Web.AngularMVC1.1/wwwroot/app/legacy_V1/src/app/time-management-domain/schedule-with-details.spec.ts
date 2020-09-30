import { IActivity, IActivityWithConfig } from './activity';
import { ScheduleDetailed } from './schedule-with-details';
import { IPayCodeWithPermissionConfiguration, IPayCodeWithIndicatorConfiguration } from './pay-code';
import { ILocation, ILocationWithConfig } from './location';

describe('ScheduleWithDetails', () => {
  let jsonObj;
  beforeEach(() => {
    jsonObj = {
      isScheduledHours: false,
      startDate: '2018-05-10T00:00:00.000-05:00',
      hasStartTime: true,
      status: 'Unknown',
      hours: 8,
      amount: 3,
      jobClass: {
        id: 114,
        code: 'AS JC 1',
        name: 'AS JC 1',
        number: 15100
      },
      payCode: {
        id: 236,
        code: 'OVT',
        name: 'Overtime',
        number: null
      },
      lunchHours: 1,
      activity: {
        id: 11,
        code: '2305-8',
        name: 'act',
        number: 11,
        startTime: '23:05',
        hours: 4,
        lunchHours: 1
      },
      profile: null,
      position: {
        id: 325,
        code: 'Blue01',
        name: 'Blue01',
        number: 15111
      },
      isExtraShift: false,
      guid: '6c435f2a-05a1-4ebb-a38e-740577398b0b',
      person: {
        id: 4952,
        code: 'TestUser',
        firstName: 'Glenn',
        lastName: 'Davis',
        middleName: null,
        jobClass: null
      },
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 149,
          code: 'BlueJay',
          name: 'BlueJay',
          number: 15110
        },
        unit: undefined,
        timeZoneId: 'America/Chicago'
      },
      readOnly: false
    };
  });

  describe('#fromJsonWithPayCodePermissionConfig', () => {
    let schedule: ScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
    beforeEach(() => {
      jsonObj.payCode.configuration = {
        scheduleStartTimeRequired: false,
        scheduleValueValidation: 'AKD',
        canCreate: true,
        canCreateRequest: false
      };
      const jsonString = JSON.stringify(jsonObj);
      schedule = ScheduleDetailed.fromJsonWithPayCodePermissionConfig(JSON.parse(jsonString));
    });
    it('properly initializes a new Schedule object from specified JSON, mapping person to employee', () => {
      expect(schedule.isScheduledHours).toBe(false);
      expect(schedule.startDate.toISOString()).toEqual('2018-05-10T05:00:00.000Z');
      expect(schedule.hasStartTime).toBe(true);
      expect(schedule.status).toEqual('Unknown');
      expect(schedule.hours).toEqual(8);
      expect(schedule.amount).toBe(3);
      expect(schedule.jobClass).toBeDefined();
      expect(schedule.jobClass.id).toEqual(114 as any);
      expect(schedule.lunchHours).toEqual(1);
      expect(schedule.profile).toBeNull();
      expect(schedule.position).toBeDefined();
      expect(schedule.position.id).toEqual(325 as any);
      expect(schedule.isExtraShift).toBe(false);
      expect(schedule.guid).toEqual('6c435f2a-05a1-4ebb-a38e-740577398b0b');
      expect(schedule.employee).toBeDefined();
      expect(schedule.employee.id).toEqual(4952);
      expect(schedule.employee.code).toEqual('TestUser');
      expect(schedule.facility).toBeDefined();
      expect(schedule.facility.id).toEqual(85 as any);
      expect(schedule.department).toBeDefined();
      expect(schedule.department.id).toEqual(149 as any);
      expect(schedule.unit).toBeUndefined();
      expect(schedule.timeZone).toEqual('America/Chicago');
    });
    it('initializes the paycode object with the right configuration set', () => {
      expect(schedule.payCode).toBeDefined();
      expect(schedule.payCode.id).toEqual(236 as any);
      expect(schedule.payCode.configuration.scheduleStartTimeRequired).toBe(false);
      expect(schedule.payCode.configuration.scheduleValueValidation).toBe('AKD');
      expect(schedule.payCode.configuration.canCreate).toBe(true);
      expect(schedule.payCode.configuration.canCreateRequest).toBe(false);
    });

    it('sets the activity', () => {
      expect(schedule.activity).not.toBeNull();
      expect(schedule.activity.code).toBe('2305-8');
      expect(schedule.activity.start.hours()).toBe(23);
      expect(schedule.activity.start.minutes()).toBe(5);
    });
  });

  describe('#fromJsonWithIndicatorConfigruation', () => {
    let schedule: ScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>;
    beforeEach(() => {
      jsonObj.payCode.configuration = {
        isOnCall: false,
        isTimeOff: true
      };
      jsonObj.activity.configuration = {
        isOnCall: false,
        isTimeOff: true
      };
      jsonObj.location.configuration = {
        isExtraShift: true
      };
    });

    describe('when all values are set on the json object', () => {
      beforeEach(() => {
        const jsonString = JSON.stringify(jsonObj);
        schedule = ScheduleDetailed.fromJsonWithIndicatorConfigruation(JSON.parse(jsonString));
      });
      it('properly initializes a new Schedule object from specified JSON, mapping person to employee', () => {
        expect(schedule.isScheduledHours).toBe(false);
        expect(schedule.startDate.toISOString()).toEqual('2018-05-10T05:00:00.000Z');
        expect(schedule.hasStartTime).toBe(true);
        expect(schedule.status).toEqual('Unknown');
        expect(schedule.hours).toEqual(8);
        expect(schedule.amount).toBe(3);
        expect(schedule.jobClass).toBeDefined();
        expect(schedule.jobClass.id).toEqual(114 as any);
        expect(schedule.lunchHours).toEqual(1);
        expect(schedule.profile).toBeNull();
        expect(schedule.position).toBeDefined();
        expect(schedule.position.id).toEqual(325 as any);
        expect(schedule.isExtraShift).toBe(false);
        expect(schedule.guid).toEqual('6c435f2a-05a1-4ebb-a38e-740577398b0b');
        expect(schedule.employee).toBeDefined();
        expect(schedule.employee.id).toEqual(4952);
        expect(schedule.employee.code).toEqual('TestUser');
        expect(schedule.facility).toBeDefined();
        expect(schedule.facility.id).toEqual(85 as any);
        expect(schedule.department).toBeDefined();
        expect(schedule.department.id).toEqual(149 as any);
        expect(schedule.unit).toBeUndefined();
        expect(schedule.timeZone).toEqual('America/Chicago');
      });
      it('initializes the paycode object with the right configuration set', () => {
        expect(schedule.payCode).toBeDefined();
        expect(schedule.payCode.id).toEqual(236 as any);
        expect(schedule.payCode.configuration.isOnCall).toBe(false);
        expect(schedule.payCode.configuration.isTimeOff).toBe(true);
      });
      it('sets the activity with the right configuration set', () => {
        expect(schedule.activity).not.toBeNull();
        expect(schedule.activity.code).toBe('2305-8');
        expect(schedule.activity.start.hours()).toBe(23);
        expect(schedule.activity.start.minutes()).toBe(5);
        expect(schedule.activity.configuration.isOnCall).toBe(false);
        expect(schedule.activity.configuration.isTimeOff).toBe(true);
        expect(schedule.location.configuration.isExtraShift).toBe(true);
      });
    });

    describe('when activity is not set', () => {
      beforeEach(() => {
        jsonObj.activity = undefined;
        schedule = ScheduleDetailed.fromJsonWithIndicatorConfigruation(jsonObj);
      });

      it('shouldn\'t set the activity', () => {
        expect(schedule.activity).toBeUndefined();
      });
    });

    describe('when paycode is not set', () => {
      beforeEach(() => {
        delete jsonObj.payCode;
        schedule = ScheduleDetailed.fromJsonWithIndicatorConfigruation(jsonObj);
      });

      it('shouldn\'t set the paycode', () => {
        expect(schedule.payCode).toBeUndefined();
      });
    });
  });
});
