import * as moment from 'moment';
import { ISchedule, Schedule } from './schedule';
import { IActivity } from './activity';
import { IJobClass } from './job-class';
import { IDepartment, IFacility } from './org-unit';
import { IEmployee } from './employee';
import { IPosition } from './position';
import { IProfile } from './profile';

describe('Schedule', () => {
  let schedule: ISchedule = new Schedule();

  describe('isActivity property', () => {
    describe('is false', () => {
      it('when activity object is null', () => {
        schedule.activity = null;
        expect(schedule.isActivity).toBeFalsy();
      });
      it('when activity object is undefined', () => {
        schedule.activity = undefined;
        expect(schedule.isActivity).toBeFalsy();
      });
    });

    describe('is true', () => {
      it('when activity object is not null', () => {
        schedule.activity = {} as IActivity;
        expect(schedule.isActivity).toBeTruthy();
      });
    });
  });

  describe('endDate property', () => {
    describe('is null', () => {
      it('when startDate object is null', () => {
        schedule.startDate = null;
        expect(schedule.endDate).toBeFalsy();
      });

      it('when startDate object is undefined', () => {
        schedule.startDate = undefined;
        expect(schedule.endDate).toBeFalsy();
      });
    });

    describe('calculates correctly', () => {
      beforeEach(() => {
        schedule.startDate = moment('2018-01-01T00:00:00.000Z');
        schedule.hours = null;
        schedule.lunchHours = null;
      });

      describe('when hours', () => {
        it('is a numeric value', () => {
          schedule.hours = 8;
          expect(schedule.endDate.toISOString()).toEqual('2018-01-01T08:00:00.000Z');
        });

        it('is a string value', () => {
          schedule.hours = '4' as any;
          expect(schedule.endDate.toISOString()).toEqual('2018-01-01T04:00:00.000Z');
        });
      });

      describe('when lunchHours', () => {
        it('is a numeric value', () => {
          schedule.lunchHours = 1;
          expect(schedule.endDate.toISOString()).toEqual('2018-01-01T01:00:00.000Z');
        });
        it('is a string value', () => {
          schedule.hours = '2' as any;
          expect(schedule.endDate.toISOString()).toEqual('2018-01-01T02:00:00.000Z');
        });
      });

      describe('when hours and lunchHours"', () => {
        it('are both specified', () => {
          schedule.hours = 8;
          schedule.lunchHours = 1;
          expect(schedule.endDate.toISOString()).toEqual('2018-01-01T09:00:00.000Z');
        });
      });
    });
  });

  describe('#fromJson', () => {
    describe('when location is defined', () => {
      it('properly initializes a new Schedule object from specified JSON, mapping person to employee', () => {
        const jsonString = '{"isScheduledHours":null,"startDate":"2018-05-10T00:00:00.000-05:00","hasStartTime":true,"status":"Unknown","hours":8.00,"amount":null,' +
          '"jobClass":{"id":114,"code":"AS JC 1","name":"AS JC 1","number":15100},"payCode":{"id":236,"code":"OVT","name":"Overtime","number":null},"lunchHours":1.00,"activity":null,' +
          '"profile":null,"position":{"id":325,"code":"Blue01","name":"Blue01","number":15111},"isExtraShift":false,"guid":"6c435f2a-05a1-4ebb-a38e-740577398b0b",' +
          '"person":{"id":4952,"code":"TestUser","firstName":"Glenn","lastName":"Davis","middleName":null,"jobClass":null},' +
          '"location":{"facility":{"id":85,"code":"AS Scheduling","name":"AS Scheduling","number":15000},"department":{"id":149,"code":"BlueJay","name":"BlueJay","number":15110},' +
          '"unit":null,"timeZoneId":"America/Chicago"},"readOnly":false}';
        schedule = Schedule.fromJson(JSON.parse(jsonString));
        expect(schedule.isScheduledHours).toBeFalsy();
        expect(schedule.startDate.toISOString()).toEqual('2018-05-10T05:00:00.000Z');
        expect(schedule.hasStartTime).toBeTruthy();
        expect(schedule.status).toEqual('Unknown');
        expect(schedule.hours).toEqual(8);
        expect(schedule.amount).toBeFalsy();
        expect(schedule.jobClass).toBeDefined();
        expect(schedule.jobClass.id).toEqual(114 as any);
        expect(schedule.payCode).toBeDefined();
        expect(schedule.payCode.id).toEqual(236 as any);
        expect(schedule.lunchHours).toEqual(1);
        expect(schedule.activity).toBeFalsy();
        expect(schedule.profile).toBeFalsy();
        expect(schedule.position).toBeDefined();
        expect(schedule.position.id).toEqual(325 as any);
        expect(schedule.isExtraShift).toBeFalsy();
        expect(schedule.guid).toEqual('6c435f2a-05a1-4ebb-a38e-740577398b0b');
        expect(schedule.employee).toBeDefined();
        expect(schedule.employee.id).toEqual(4952);
        expect(schedule.employee.code).toEqual('TestUser');
        expect(schedule.facility).toBeDefined();
        expect(schedule.facility.id).toEqual(85 as any);
        expect(schedule.department).toBeDefined();
        expect(schedule.department.id).toEqual(149 as any);
        expect(schedule.unit).toBeFalsy();
        expect(schedule.timeZone).toEqual('America/Chicago');
      });
    });

    describe('when location is undefined', () => {
      let scheduleFromJson;
      beforeAll(() => {
        const jsonString = '{"isScheduledHours":null,"startDate":"2018-05-10T00:00:00.000-05:00","hasStartTime":true,"status":"Unknown","hours":8.00,"amount":null,' +
          '"jobClass":{"id":114,"code":"AS JC 1","name":"AS JC 1","number":15100},"payCode":{"id":236,"code":"OVT","name":"Overtime","number":null},"lunchHours":1.00,"activity":null,' +
          '"profile":null,"position":{"id":325,"code":"Blue01","name":"Blue01","number":15111},"isExtraShift":false,"guid":"6c435f2a-05a1-4ebb-a38e-740577398b0b",' +
          '"person":{"id":4952,"code":"TestUser","firstName":"Glenn","lastName":"Davis","middleName":null,"jobClass":null},"location":null,"readOnly":false}';
        scheduleFromJson = Schedule.fromJson(JSON.parse(jsonString));
      });

      it('properly initializes a new Schedule object from specified JSON', () => {
        expect(scheduleFromJson.isScheduledHours).toBeFalsy();
        expect(scheduleFromJson.startDate.toISOString()).toEqual('2018-05-10T05:00:00.000Z');
        expect(scheduleFromJson.hasStartTime).toBeTruthy();
        expect(scheduleFromJson.status).toEqual('Unknown');
        expect(scheduleFromJson.hours).toEqual(8);
        expect(scheduleFromJson.amount).toBeFalsy();
        expect(scheduleFromJson.jobClass).toBeDefined();
        expect(scheduleFromJson.jobClass.id).toEqual(114 as any);
        expect(scheduleFromJson.payCode).toBeDefined();
        expect(scheduleFromJson.payCode.id).toEqual(236 as any);
        expect(scheduleFromJson.lunchHours).toEqual(1);
        expect(scheduleFromJson.activity).toBeFalsy();
        expect(scheduleFromJson.profile).toBeFalsy();
        expect(scheduleFromJson.position).toBeDefined();
        expect(scheduleFromJson.position.id).toEqual(325 as any);
        expect(scheduleFromJson.isExtraShift).toBeFalsy();
        expect(scheduleFromJson.guid).toEqual('6c435f2a-05a1-4ebb-a38e-740577398b0b');
        expect(scheduleFromJson.employee).toBeDefined();
        expect(scheduleFromJson.employee.id).toEqual(4952);
        expect(scheduleFromJson.employee.code).toEqual('TestUser');
        expect(scheduleFromJson.facility).toEqual(null);
        expect(scheduleFromJson.department).toEqual(null);
        expect(scheduleFromJson.unit).toEqual(null);
        expect(scheduleFromJson.timeZone).toEqual(null);
      });
    });

    describe('when employee.employment is defined', () => {
      let scheduleFromJson;
      beforeAll(() => {
        const jsonString = '{"isScheduledHours":null,"startDate":"2018-05-10T00:00:00.000-05:00","hasStartTime":true,"status":"Unknown","hours":8.00,"amount":null,' +
          '"jobClass":{"id":114,"code":"AS JC 1","name":"AS JC 1","number":15100},"payCode":{"id":236,"code":"OVT","name":"Overtime","number":null},"lunchHours":1.00,"activity":null,' +
          '"profile":null,"position":{"id":325,"code":"Blue01","name":"Blue01","number":15111},"isExtraShift":false,"guid":"6c435f2a-05a1-4ebb-a38e-740577398b0b",' +
          '"person":{"id":4952,"code":"TestUser","firstName":"Glenn","lastName":"Davis","middleName":null,"jobClass":null}, "location":null,"readOnly":false,' +
          '"employee": { "id": 1234, "code": "TestUserEmployee", "employment": { "profession": { }, "location": { } } } }';
        scheduleFromJson = Schedule.fromJson(JSON.parse(jsonString));
      });

      it('properly initializes a new Schedule object from specified JSON, mapping employee to employee', () => {
        expect(scheduleFromJson.isScheduledHours).toBeFalsy();
        expect(scheduleFromJson.startDate.toISOString()).toEqual('2018-05-10T05:00:00.000Z');
        expect(scheduleFromJson.hasStartTime).toBeTruthy();
        expect(scheduleFromJson.status).toEqual('Unknown');
        expect(scheduleFromJson.hours).toEqual(8);
        expect(scheduleFromJson.amount).toBeFalsy();
        expect(scheduleFromJson.jobClass).toBeDefined();
        expect(scheduleFromJson.jobClass.id).toEqual(114 as any);
        expect(scheduleFromJson.payCode).toBeDefined();
        expect(scheduleFromJson.payCode.id).toEqual(236 as any);
        expect(scheduleFromJson.lunchHours).toEqual(1);
        expect(scheduleFromJson.activity).toBeFalsy();
        expect(scheduleFromJson.profile).toBeFalsy();
        expect(scheduleFromJson.position).toBeDefined();
        expect(scheduleFromJson.position.id).toEqual(325 as any);
        expect(scheduleFromJson.isExtraShift).toBeFalsy();
        expect(scheduleFromJson.guid).toEqual('6c435f2a-05a1-4ebb-a38e-740577398b0b');
        expect(scheduleFromJson.employee).toBeDefined();
        expect(scheduleFromJson.employee.id).toEqual(1234);
        expect(scheduleFromJson.employee.code).toEqual('TestUserEmployee');
        expect(scheduleFromJson.facility).toEqual(null);
        expect(scheduleFromJson.department).toEqual(null);
        expect(scheduleFromJson.unit).toEqual(null);
        expect(scheduleFromJson.timeZone).toEqual(null);
      });
    });

    describe('when activity is defined', () => {
      let scheduleFromJson;
      beforeAll(() => {
        const jsonString = '{"isScheduledHours":null,"startDate":"2018-05-10T00:00:00.000-05:00","hasStartTime":true,"status":"Unknown","hours":8.00,"amount":null,' +
          '"jobClass":{"id":114,"code":"AS JC 1","name":"AS JC 1","number":15100},"payCode":{"id":236,"code":"OVT","name":"Overtime","number":null},"lunchHours":1.00,' +
          '"activity":{ "code": "2300-8", "startTime": "23:00:00" },' +
          '"profile":null,"position":{"id":325,"code":"Blue01","name":"Blue01","number":15111},"isExtraShift":false,"guid":"6c435f2a-05a1-4ebb-a38e-740577398b0b",' +
          '"person":{"id":4952,"code":"TestUser","firstName":"Glenn","lastName":"Davis","middleName":null,"jobClass":null},"location":null,"readOnly":false}';
        scheduleFromJson = Schedule.fromJson(JSON.parse(jsonString));
      });

      it('properly initializes a new Schedule object from specified JSON', () => {
        expect(scheduleFromJson.activity).not.toBeNull();
        expect(scheduleFromJson.activity.code).toBe('2300-8');
        expect(scheduleFromJson.activity.start.hours()).toBe(23);
        expect(scheduleFromJson.activity.start.minutes()).toBe(0);
      });
    });
  });

  describe('#isOverlapping', () => {
    let schedule1: Schedule, schedule2: Schedule;
    beforeAll(() => {
      schedule1 = new Schedule();
      schedule1.activity = { id: '8', code: '2300-8', name: '2300-8', number: null } as IActivity;
      schedule1.amount = null;
      schedule1.guid = '20efdcd6-81b5-4167-8682-6c354b03babd';
      schedule1.hasStartTime = true;
      schedule1.hours = 4;
      schedule1.isExtraShift = false;
      schedule1.isScheduledHours = true;
      schedule1.jobClass = { id: '115', code: '9002', name: 'Registered Nurse', number: '15200' } as IJobClass;
      schedule1.department = { id: '149', code: 'PedsN', name: 'PedsN', number: '15110' } as IDepartment;
      schedule1.facility = { id: '85', code: 'AS Scheduling', name: 'AS Scheduling', number: '15000' } as IFacility;
      schedule1.timeZone = 'America/Chicago';
      schedule1.unit = null;
      schedule1.lunchHours = 0;
      schedule1.payCode = null;
      schedule1.employee = { id: 1334, code: '90005', firstName: 'Marlo', lastName: 'Stanfield', middleName: null, jobClass: null } as IEmployee;
      schedule1.position = {
        jobClasses: [{ id: '115', code: '9002', name: 'Registered Nurse', number: '15200' } as IJobClass],
        id: '326',
        code: 'RN-N',
        name: 'Registered Nurse',
        number: '15112'
      } as IPosition;
      schedule1.profile = { id: '118', code: 'RN', name: 'Registered Nurse', number: null } as IProfile;
      schedule1.requestedDate = null;
      schedule1.startDate = null;
      schedule1.status = 'Uncalculated';
      schedule1.etag = '636694148967670000';

      schedule2 = new Schedule();
      schedule2.activity = { id: '8', code: '2300-8', name: '2300-8', number: null } as IActivity;
      schedule2.amount = null;
      schedule2.guid = '20efdcd6-81b5-4167-8682-6c354b03babd';
      schedule2.hasStartTime = true;
      schedule2.hours = 4;
      schedule2.isExtraShift = false;
      schedule2.isScheduledHours = true;
      schedule2.jobClass = { id: '115', code: '9002', name: 'Registered Nurse', number: '15200' } as IJobClass;
      schedule2.department = { id: '149', code: 'PedsN', name: 'PedsN', number: '15110' } as IDepartment;
      schedule2.facility = { id: '85', code: 'AS Scheduling', name: 'AS Scheduling', number: '15000' } as IFacility;
      schedule2.timeZone = 'America/Chicago';
      schedule2.unit = null;
      schedule2.lunchHours = 0;
      schedule2.payCode = null;
      schedule2.employee = { id: 1334, code: '90005', firstName: 'Marlo', lastName: 'Stanfield', middleName: null, jobClass: null } as IEmployee;
      schedule2.position = {
        jobClasses: [{ id: '115', code: '9002', name: 'Registered Nurse', number: '15200' } as IJobClass],
        id: '326',
        code: 'RN-N',
        name: 'Registered Nurse',
        number: '15112'
      } as IPosition;
      schedule2.profile = { id: '118', code: 'RN', name: 'Registered Nurse', number: null } as IProfile;
      schedule2.requestedDate = null;
      schedule2.startDate = null;
      schedule2.status = 'Uncalculated';
      schedule2.etag = '636694148967670000';
    });

    afterEach(() => {
      schedule1.startDate = null;
      schedule2.startDate = null;
    });

    describe('when schedule 1 does not have a start time', () => {
      let result: boolean;
      beforeAll(() => {
        schedule1.hasStartTime = false;
        schedule2.startDate = moment('2018-08-08 03:00:00', 'YYYY-MM-DD HH:mm:ss');
        result = Schedule.isOverlapping(schedule1, schedule2);
      });
      afterAll(() => {
        schedule1.hasStartTime = true;
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });

    describe('when schedule 2 does not have a start time', () => {
      let result: boolean;
      beforeAll(() => {
        schedule1.startDate = moment('2018-08-08 03:00:00', 'YYYY-MM-DD HH:mm:ss');
        schedule2.hasStartTime = false;
        result = Schedule.isOverlapping(schedule1, schedule2);
      });
      afterAll(() => {
        schedule2.hasStartTime = true;
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });

    describe('when schedule 2 is completely after schedule 1', () => {
      let result: boolean;
      beforeAll(() => {
        schedule1.startDate = moment('2018-08-08 01:00:00', 'YYYY-MM-DD HH:mm:ss');
        schedule2.startDate = moment('2018-08-08 15:00:00', 'YYYY-MM-DD HH:mm:ss');
        result = Schedule.isOverlapping(schedule1, schedule2);
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });

    describe('when schedule 2 is completely before schedule 1', () => {
      let result: boolean;
      beforeAll(() => {
        schedule1.startDate = moment('2018-08-08 15:00:00', 'YYYY-MM-DD HH:mm:ss');
        schedule2.startDate = moment('2018-08-08 01:00:00', 'YYYY-MM-DD HH:mm:ss');
        result = Schedule.isOverlapping(schedule1, schedule2);
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });

    describe('when schedules overlap by at least 1 minute', () => {
      let result: boolean;
      beforeAll(() => {
        schedule2.startDate = moment('2018-08-08 02:00:00', 'YYYY-MM-DD HH:mm:ss');
        schedule1.startDate = moment('2018-08-08 03:00:00', 'YYYY-MM-DD HH:mm:ss');
        result = Schedule.isOverlapping(schedule1, schedule2);
      });

      it('should return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe('when schedule 2 starts at the same time schedule 1 ends', () => {
      let result: boolean;
      beforeAll(() => {
        schedule1.startDate = moment('2018-08-08 07:00:00', 'YYYY-MM-DD HH:mm:ss');
        schedule2.startDate = schedule1.endDate;
        result = Schedule.isOverlapping(schedule1, schedule2);
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });

    describe('when schedule 2 ends when schedule 1 starts', () => {
      let result: boolean;
      beforeAll(() => {
        schedule2.startDate = moment('2018-08-08 07:00:00', 'YYYY-MM-DD HH:mm:ss');
        schedule1.startDate = schedule2.endDate;
        result = Schedule.isOverlapping(schedule1, schedule2);
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });
  });
});
