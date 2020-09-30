import { Observable } from 'rxjs';
import { ScheduleSdkService } from './schedule-sdk.service';
import { ISchedule, Schedule } from '../../time-management-domain/schedule';
import { Identifier } from '../../identifier.model';
import * as moment from 'moment';
import { IJobClass } from '../../time-management-domain/job-class';
import { IActivity } from '../../time-management-domain/activity';
import { IProfile } from '../../time-management-domain/profile';
import { IPosition } from '../../time-management-domain/position';
import { IDepartment, IFacility, IUnit } from '../../time-management-domain/org-unit';
import { IPayCode } from '../../time-management-domain/pay-code';
import { IScheduleTradeRequest, ScheduleTradeRequest } from '../../time-management-domain/schedule-trade/schedule-trade-request';
import { MockEnvService } from '../../shared/test-fakes/mock-env';
import { ScheduleSdkConfig } from './schedule-sdk.config';
import { TransactionRequestSdkConfig } from '../transaction-request-sdk/transaction-request-sdk.config';
import { Moment } from 'moment';

describe('ScheduleSdkService', () => {
  const httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'expectOne', 'get', 'put', 'delete']);
  let component: ScheduleSdkService;
  let scheduleSdkConfig;
  let transactionRequestSdkConfig: TransactionRequestSdkConfig;
  let schedule: ISchedule;
  let startDate: string;
  let endDate: string;

  beforeEach(() => {
    scheduleSdkConfig = new ScheduleSdkConfig();
    transactionRequestSdkConfig = new TransactionRequestSdkConfig();
    startDate = '2019-03-13T13:00:00.000Z';
    endDate = '2019-03-29T13:00:00.000Z';
    schedule = {
      startDate: moment(startDate),
      requestedDate: moment(endDate),
      requestForDates: [],
      hasStartTime: true,
      status: 'Valid',
      hours: 19,
      amount: 14,
      lunchHours: 1.5,
      guid: 'e5f07be6-20e8-4c73-bc57-1d81c06cdc3c',
      timeZone: 'America/Chicago',
      jobClass: { id: 'job class' } as IJobClass,
      payCode: { id: 'pay code' } as IPayCode,
      activity: { id: 'activity' } as IActivity,
      profile: { id: 'profile' } as IProfile,
      position: { id: 'position' } as IPosition,
      facility: { id: 'facility', timeZoneId: 'America/Chicago' } as IFacility,
      department: { id: 'department' } as IDepartment,
      unit: { id: 'unit' } as IUnit,
      isScheduledHours: true,
      isExtraShift: true,
      etag: '123456789'
    } as ISchedule;
  });

  function CreateComponent() {
    return new ScheduleSdkService(httpClientMock, scheduleSdkConfig, MockEnvService, transactionRequestSdkConfig);
  }

  describe('saveSchedule', () => {
    let jsonResponse;
    let scheduleToSave: ISchedule;
    let employee;
    beforeEach(() => {
      employee = {
        code: 'smith'
      };
      jsonResponse = {
        startDate: '2017-01-01 23:00:00.000 -05:00',
        hasStartTime: true,
        status: 'TEST',
        hours: 14,
        amount: 73,
        lunchHours: 1.5,
        timeZone: 'American/Chicago',
        jobClass: new Identifier({ id: 11, name: 'job class' }),
        payCode: new Identifier({ id: 21, name: 'pay code' }),
        activity: new Identifier({ id: 31, name: 'activity' }),
        profile: new Identifier({ id: 41, name: 'profile' }),
        position: new Identifier({ id: 51, name: 'position' }),
        person: { code: 'jones' },
        location: {
          facility: new Identifier({ id: 61, name: 'facility' }),
          department: new Identifier({ id: 71, name: 'department' }),
          unit: new Identifier({ id: 81, name: 'unit' }),
          timeZoneId: 'American/Chicago'
        },
        isScheduledHours: true,
        isExtraShift: true
      };
      scheduleToSave = Schedule.fromJson({
        startDate: '2017-01-01 23:00:00.000 -05:00',
        hasStartTime: false,
        status: 'TEST',
        hours: 14,
        amount: 73,
        lunchHours: 1.5,
        timeZone: 'American/Chicago',
        jobClass: new Identifier({ id: 11, name: 'job class' }),
        payCode: new Identifier({ id: 21, name: 'pay code' }),
        activity: new Identifier({ id: 31, name: 'activity' }),
        profile: new Identifier({ id: 41, name: 'profile' }),
        position: new Identifier({ id: 51, name: 'position' }),
        person: { code: 'jones' },
        location: {
          facility: new Identifier({ id: 61, name: 'facility' }),
          department: new Identifier({ id: 71, name: 'department' }),
          unit: new Identifier({ id: 81, name: 'unit' }),
          timeZoneId: 'American/Chicago'
        },
        isScheduledHours: false,
        isExtraShift: false
      });
      component = CreateComponent();
      scheduleSdkConfig = new ScheduleSdkConfig();
      httpClientMock.post.and.returnValue(Observable.of(jsonResponse));
    });

    it('should save the schedule with overrideValidation true for give payload', () => {
      const overrideValidation = true;
      component.saveSchedule(employee, scheduleToSave, true).subscribe((response) => {
        expect(response.employee.code).toEqual(jsonResponse.person.code);
        expect(response.startDate.toString()).toEqual('Sun Jan 01 2017 23:00:00 GMT-0500');
        expect(response.hasStartTime).toEqual(jsonResponse.hasStartTime);
        expect(response.hours).toEqual(jsonResponse.hours);
        expect(response.amount).toEqual(jsonResponse.amount);
        expect(response.payCode.name).toEqual(jsonResponse.payCode.name);
        expect(response.jobClass.name).toEqual(jsonResponse.jobClass.name);
        expect(response.facility.name).toEqual(jsonResponse.location.facility.name);
        expect(response.department.name).toEqual(jsonResponse.location.department.name);
        expect(response.unit.name).toEqual(jsonResponse.location.unit.name);
        expect(response.lunchHours).toEqual(jsonResponse.lunchHours);
        expect(response.activity.name).toEqual(jsonResponse.activity.name);
        expect(response.profile.name).toEqual(jsonResponse.profile.name);
        expect(response.position.name).toEqual(jsonResponse.position.name);
        expect(response.isExtraShift).toEqual(jsonResponse.isExtraShift);
        const uri = MockEnvService.baseApiPath + scheduleSdkConfig.ADD_SCHEDULE_URL.replace('{overrideValidation}', overrideValidation.toString());
        httpClientMock.expectOne(uri);
      });
    });

    it('should update the schedule with overrideValidation true for given payload', () => {
      const overrideValidation = true;
      schedule.guid = 'e5f07be6-20e8-4c73-bc57-1d81c06cdc3c';
      schedule.requestedReason = 'Test Comments';
      schedule.isExtraShift = true;
      httpClientMock.put.and.returnValue(Observable.of(jsonResponse));
      component.saveSchedule(employee, schedule, true).subscribe((response) => {
        expect(response.employee.code).toEqual(jsonResponse.person.code);
        expect(response.startDate.toString()).toEqual('Sun Jan 01 2017 23:00:00 GMT-0500');
        expect(response.hasStartTime).toEqual(jsonResponse.hasStartTime);
        expect(response.hours).toEqual(jsonResponse.hours);
        expect(response.amount).toEqual(jsonResponse.amount);
        expect(response.payCode.name).toEqual(jsonResponse.payCode.name);
        expect(response.jobClass.name).toEqual(jsonResponse.jobClass.name);
        expect(response.facility.name).toEqual(jsonResponse.location.facility.name);
        expect(response.department.name).toEqual(jsonResponse.location.department.name);
        expect(response.unit.name).toEqual(jsonResponse.location.unit.name);
        expect(response.lunchHours).toEqual(jsonResponse.lunchHours);
        expect(response.activity.name).toEqual(jsonResponse.activity.name);
        expect(response.profile.name).toEqual(jsonResponse.profile.name);
        expect(response.position.name).toEqual(jsonResponse.position.name);
        expect(response.isExtraShift).toEqual(jsonResponse.isExtraShift);
        const uri = MockEnvService.baseApiPath + scheduleSdkConfig.UPDATE_SCHEDULE_URL.replace('{overrideValidation}', overrideValidation.toString());
        httpClientMock.expectOne(uri);
      });
    });
    it('should save the schedule with overrideValidation as default for give payload', () => {
      component.saveSchedule(employee, schedule).subscribe((response) => {
        expect(response.employee.code).toEqual(jsonResponse.person.code);
        expect(response.startDate.toString()).toEqual('Sun Jan 01 2017 23:00:00 GMT-0500');
        expect(response.hasStartTime).toEqual(jsonResponse.hasStartTime);
        expect(response.hours).toEqual(jsonResponse.hours);
        expect(response.amount).toEqual(jsonResponse.amount);
        expect(response.payCode.name).toEqual(jsonResponse.payCode.name);
        expect(response.jobClass.name).toEqual(jsonResponse.jobClass.name);
        expect(response.facility.name).toEqual(jsonResponse.location.facility.name);
        expect(response.department.name).toEqual(jsonResponse.location.department.name);
        expect(response.unit.name).toEqual(jsonResponse.location.unit.name);
        expect(response.lunchHours).toEqual(jsonResponse.lunchHours);
        expect(response.activity.name).toEqual(jsonResponse.activity.name);
        expect(response.profile.name).toEqual(jsonResponse.profile.name);
        expect(response.position.name).toEqual(jsonResponse.position.name);
        expect(response.isExtraShift).toEqual(jsonResponse.isExtraShift);
        const uri = MockEnvService.baseApiPath + scheduleSdkConfig.ADD_SCHEDULE_URL;
        httpClientMock.expectOne(uri);
      });
    });

    it('should save the schedule with overrideValidation as default for few nulls in payload', () => {
      schedule.guid = 'abcdefg';
      schedule.jobClass = null;
      schedule.payCode = null;
      schedule.activity = null;
      schedule.profile = null;
      schedule.position = null;
      schedule.facility = null;
      schedule.department = null;
      schedule.unit = null;
      component.saveSchedule(employee, schedule).subscribe((response) => {
        expect(response.employee.code).toEqual(jsonResponse.person.code);
        expect(response.startDate.toString()).toEqual('Sun Jan 01 2017 23:00:00 GMT-0500');
        expect(response.hasStartTime).toEqual(jsonResponse.hasStartTime);
        expect(response.hours).toEqual(jsonResponse.hours);
        expect(response.amount).toEqual(jsonResponse.amount);
        expect(response.payCode.name).toEqual(jsonResponse.payCode.name);
        expect(response.jobClass.name).toEqual(jsonResponse.jobClass.name);
        expect(response.facility.name).toEqual(jsonResponse.location.facility.name);
        expect(response.department.name).toEqual(jsonResponse.location.department.name);
        expect(response.unit.name).toEqual(jsonResponse.location.unit.name);
        expect(response.lunchHours).toEqual(jsonResponse.lunchHours);
        expect(response.activity.name).toEqual(jsonResponse.activity.name);
        expect(response.profile.name).toEqual(jsonResponse.profile.name);
        expect(response.position.name).toEqual(jsonResponse.position.name);
        expect(response.isExtraShift).toEqual(jsonResponse.isExtraShift);
        const uri = MockEnvService.baseApiPath + scheduleSdkConfig.ADD_SCHEDULE_URL;
        httpClientMock.expectOne(uri);
      });
    });
  });

  describe('getTradePeriod', () => {
    describe('when trade period is returned', () => {
      let tradePeriodResult;
      const scheduleId = '20dfb9e0-4ddd-4120-b3a9-24a19c743f8b';
      beforeEach(() => {
        tradePeriodResult = {
          whenStart: '2019-03-10',
          whenEnd: '2019-03-26'
        };
        component = CreateComponent();
        scheduleSdkConfig = new ScheduleSdkConfig();
        httpClientMock.get.and.returnValue(Observable.of(tradePeriodResult));
      });

      it('should get the trade period for the given schedule', () => {
        component.getTradePeriod('a123').subscribe((response) => {
          expect(response.whenStart).toEqual(tradePeriodResult.whenStart);
          expect(response.whenEnd).toEqual(tradePeriodResult.whenEnd);
          const uri = MockEnvService.baseApiPath + scheduleSdkConfig.GET_TRADE_PERIOD_URL
            .replace('{scheduleId}', scheduleId);
          httpClientMock.expectOne(uri);
        });
      });
    });
  });

  describe('getEligibleShiftDates', () => {
    const scheduleId = '7e8f6101-6603-4e4d-a3d2-6ece0e64a0e2';
    const tradeDate = '04/21/2019';
    const rangeBegin = '-3';
    const rangeEnd = '4';
    const scheduleStartTimeBegin = '07:00';
    const scheduleStartTimeEnd = '07:00';
    const locationIds = ['135'];
    describe('when the dates of shifts eligible for trade are returned', () => {
      let httpResponse;
      beforeEach(() => {
        httpResponse = {
          body: {
            schedules: [{
              startDate: startDate,
              requestedDate: endDate,
              hasStartTime: true,
              status: schedule.status,
              hours: schedule.hours,
              amount: schedule.amount,
              lunchHours: schedule.lunchHours,
              guid: schedule.guid,
              jobClass: schedule.jobClass,
              payCode: schedule.payCode,
              activity: schedule.activity,
              profile: schedule.profile,
              position: schedule.position,
              location: {
                timeZoneId: schedule.timeZone,
                facility: schedule.facility,
                department: schedule.department,
                unit: schedule.unit
              },
              person: schedule.employee,
              isScheduledHours: true,
              isExtraShift: true,
              etag: schedule.etag
            },
            {
              startDate : '2019-03-13T07:00:00.000Z',
              endDate : '2019-03-29T23:59:00.000Z',
              hasStartTime: true,
              status: schedule.status,
              hours: schedule.hours,
              amount: schedule.amount,
              lunchHours: schedule.lunchHours,
              guid: schedule.guid,
              jobClass: schedule.jobClass,
              payCode: schedule.payCode,
              activity: schedule.activity,
              profile: schedule.profile,
              position: schedule.position,
              location: {
                timeZoneId: schedule.timeZone,
                facility: schedule.facility,
                department: schedule.department,
                unit: schedule.unit
              },
              person: schedule.employee,
              isScheduledHours: true,
              isExtraShift: true,
              etag: schedule.etag
            }]
          }
        };
        component = CreateComponent();
        scheduleSdkConfig = new ScheduleSdkConfig();
        httpClientMock.get.and.returnValue(Observable.of(httpResponse));
      });

      it('should get the dates of shifts eligible for trade', () => {
        component.getEligibleShiftDates(scheduleId, tradeDate, rangeBegin, rangeEnd, scheduleStartTimeBegin, scheduleStartTimeEnd, locationIds).subscribe((response) => {
          expect(response.eligibleDates[0].date).toEqual('2019-03-13');
          const locationIdUri = '&locationId={locationId}';
          let uri = MockEnvService.baseApiPath + scheduleSdkConfig.GET_TRADABLE_SCHEDULES_URL
            .replace('{scheduleId}', scheduleId)
            .replace('{tradeDate}', tradeDate)
            .replace('{rangeBegin}', rangeBegin)
            .replace('{rangeEnd}', rangeEnd);
            for (const locationId of locationIds) {
              uri += locationIdUri.replace('{locationId}', locationId);
            }
          httpClientMock.expectOne(uri);
        });
      });
      it('should get the query parameter to request uri', () => {
        expect(httpClientMock.get).toHaveBeenCalledWith(
          './Base/schedule/?_query=Trade&scheduleId=7e8f6101-6603-4e4d-a3d2-6ece0e64a0e2&tradeDate=04/21/2019&startTimeRangeBegin=-3&startTimeRangeEnd=4&locationId=135',
          { observe: 'response' });
      });
    });

    describe('when the dates of shifts eligible for trade are empty', () => {
      beforeEach(() => {
        const schedules = {
          body: {
            schedules: []
          }
        };
        component = CreateComponent();
        httpClientMock.get.and.returnValue(Observable.of(schedules));
      });

      it('should set the dates of shifts eligible for trade to an empty array', () => {
        component.getEligibleShiftDates(scheduleId, tradeDate, rangeBegin, rangeEnd, scheduleStartTimeBegin, scheduleStartTimeEnd, locationIds).subscribe((response) => {
          expect(response.eligibleDates.length).toEqual(0);
          const locationIdUri = '&locationId={locationId}';
          let uri = MockEnvService.baseApiPath + scheduleSdkConfig.GET_TRADABLE_SCHEDULES_URL
            .replace('{scheduleId}', scheduleId)
            .replace('{tradeDate}', tradeDate)
            .replace('{rangeBegin}', rangeBegin)
            .replace('{rangeEnd}', rangeEnd);
            for (const locationId of locationIds) {
              uri += locationIdUri.replace('{locationId}', locationId);
            }
          httpClientMock.expectOne(uri);
        });
      });
      it('should get the query parameter to request uri', () => {
        expect(httpClientMock.get).toHaveBeenCalledWith(
          './Base/schedule/?_query=Trade&scheduleId=7e8f6101-6603-4e4d-a3d2-6ece0e64a0e2&tradeDate=04/21/2019&startTimeRangeBegin=-3&startTimeRangeEnd=4&locationId=135',
          { observe: 'response' });
      });
    });
  });

  describe('getEligibleShifts', () => {
    const scheduleId = '7e8f6101-6603-4e4d-a3d2-6ece0e64a0e2';
    const tradeDate = '04/21/2019';
    const rangeBegin = '-3';
    const rangeEnd = '4';
    const locationId = '135';
    describe('when the shifts eligible for trade are returned', () => {
      beforeEach(() => {
        const httpResponse = {
          headers: {
            get: () => {
              return '123456789';
            }
          },
          body: {
            schedules: [{
              startDate: startDate,
              requestedDate: endDate,
              hasStartTime: true,
              status: schedule.status,
              hours: schedule.hours,
              amount: schedule.amount,
              lunchHours: schedule.lunchHours,
              guid: schedule.guid,
              jobClass: schedule.jobClass,
              payCode: schedule.payCode,
              activity: schedule.activity,
              profile: schedule.profile,
              position: schedule.position,
              location: {
                timeZoneId: schedule.timeZone,
                facility: schedule.facility,
                department: schedule.department,
                unit: schedule.unit
              },
              person: schedule.employee,
              isScheduledHours: true,
              isExtraShift: true,
              etag: schedule.etag
            },
            {
              startDate: startDate,
              requestedDate: endDate,
              hasStartTime: true,
              status: schedule.status,
              hours: schedule.hours,
              amount: schedule.amount,
              lunchHours: schedule.lunchHours,
              guid: schedule.guid,
              jobClass: schedule.jobClass,
              payCode: schedule.payCode,
              activity: schedule.activity,
              profile: schedule.profile,
              position: schedule.position,
              location: null,
              person: schedule.employee,
              isScheduledHours: true,
              isExtraShift: true,
              etag: schedule.etag
            }],
            
          }
        };
        component = CreateComponent();
        scheduleSdkConfig = new ScheduleSdkConfig();
        httpClientMock.get.and.returnValue(Observable.of(httpResponse));
      });

      it('should get the shifts eligible for trade', () => {
        component.getEligibleShifts(scheduleId, tradeDate, rangeBegin, rangeEnd, locationId).subscribe((response) => {
          expect(response.events[0].startDate.toString().slice(0, 10)).toEqual(schedule.startDate.toString().slice(0, 10));
          expect(response.etag).toEqual(schedule.etag);
          expect(response.events.length).toBe(2);
          expect(response.events[0].facility).toEqual(schedule.facility);
          expect(response.events[0].department).toEqual(schedule.department);
          expect(response.events[0].unit).toEqual(schedule.unit);
          expect(response.events[0].timeZone).toEqual(schedule.timeZone);
          expect(response.events[1].facility).toEqual(null);
          expect(response.events[1].department).toEqual(null);
          expect(response.events[1].unit).toEqual(null);
          expect(response.events[1].timeZone).toBeFalsy();
          const uri = MockEnvService.baseApiPath + scheduleSdkConfig.GET_TRADABLE_SCHEDULES_URL
            .replace('{scheduleId}', scheduleId)
            .replace('{tradeDate}', tradeDate)
            .replace('{rangeBegin}', rangeBegin)
            .replace('{rangeEnd}', rangeEnd)
            .replace('{locationId}', locationId);
          httpClientMock.expectOne(uri);
        });
      });
    });

    describe('when the shifts eligible for trade are empty', () => {
      beforeEach(() => {
        const httpResponse = {
          headers: {
            get: () => {
              return null;
            }
          },
          body: {
            schedules: []
          }
        };
        component = CreateComponent();
        scheduleSdkConfig = new ScheduleSdkConfig();
        httpClientMock.get.and.returnValue(Observable.of(httpResponse));
      });

      it('should set the shifts eligible for trade to an empty array', () => {
        component.getEligibleShifts(scheduleId,
          tradeDate, rangeBegin, rangeEnd, locationId).subscribe((response) => {
            expect(response.events.length).toEqual(0);
            const uri = MockEnvService.baseApiPath + scheduleSdkConfig.GET_TRADABLE_SCHEDULES_URL
              .replace('{scheduleId}', scheduleId)
              .replace('{tradeDate}', tradeDate)
              .replace('{rangeBegin}', rangeBegin)
              .replace('{rangeEnd}', rangeEnd)
              .replace('{locationId}', locationId);
            httpClientMock.expectOne(uri);
          });
      });
    });
  });

  describe('saveScheduleTrade', () => {
    describe('when overrideValidation is false in give payload,  Validation errors are returned', () => {
      let scheduleTradeRequest: IScheduleTradeRequest;
      let expectedValidationErrors;
      beforeEach(() => {
        scheduleTradeRequest = new ScheduleTradeRequest();
        scheduleTradeRequest.requestingScheduleGuid = 'AA7AAD3E-1DC2-47AB-B46E-474435A78766';
        scheduleTradeRequest.acceptingScheduleGuid = '20DFB9E0-4DDD-4120-B3A9-24A19C743F8B';
        scheduleTradeRequest.overrideValidation = false;
        scheduleTradeRequest.comment = 'My comments';
        scheduleTradeRequest.etag = '636903862690160000';
        expectedValidationErrors = {
          validationMessages: [
            {
              scheduleId: '20dfb9e0-4ddd-4120-b3a9-24a19c743f8b',
              description: 'Employee daily hours exceed daily approved hours',
              severityLevel: 'Warning'
            },
            {
              scheduleId: '20dfb9e0-4ddd-4120-b3a9-24a19c743f8b',
              description: 'Employee Weekly hours exceed Weekly approved hours',
              severityLevel: 'Warning'
            },
            {
              scheduleId: '20dfb9e0-4ddd-4120-b3a9-24a19c743f8b',
              description: 'Employee does not have a preference to work this shift',
              severityLevel: 'Warning'
            },
            {
              scheduleId: 'aa7aad3e-1dc2-47ab-b46e-474435a78766',
              description: 'Employee daily hours exceed daily approved hours',
              severityLevel: 'Warning'
            },
            {
              scheduleId: 'aa7aad3e-1dc2-47ab-b46e-474435a78766',
              description: 'Employee Weekly hours exceed Weekly approved hours',
              severityLevel: 'Warning'
            },
            {
              scheduleId: 'aa7aad3e-1dc2-47ab-b46e-474435a78766',
              description: 'Employee does not have a preference to work this shift',
              severityLevel: 'Warning'
            }
          ],
          overridable: true
        };

        component = CreateComponent();
        scheduleSdkConfig = new ScheduleSdkConfig();
        httpClientMock.post.and.returnValue(Observable.of(expectedValidationErrors));

      });

      it('should receive validation warnings', () => {
        component.saveScheduleTrade(scheduleTradeRequest).subscribe((response) => {
          expect(response.validationMessages.length).toEqual(6);
          const uri = MockEnvService.baseApiPath + scheduleSdkConfig.ADD_SCHEDULE_TRADE_URL
            .replace('{requestingScheduleId}', scheduleTradeRequest.requestingScheduleGuid)
            .replace('{overrideValidation}', scheduleTradeRequest.overrideValidation.toString());
          httpClientMock.expectOne(uri);
        });
      });
    });

    describe('when overrideValidation is false in give payload,  no validation errors are returned', () => {
      let scheduleTradeRequest: IScheduleTradeRequest;
      let expectedValidationErrors;
      beforeEach(() => {
        scheduleTradeRequest = new ScheduleTradeRequest();
        scheduleTradeRequest.requestingScheduleGuid = 'AA7AAD3E-1DC2-47AB-B46E-474435A78766';
        scheduleTradeRequest.acceptingScheduleGuid = '20DFB9E0-4DDD-4120-B3A9-24A19C743F8B';
        scheduleTradeRequest.overrideValidation = false;
        scheduleTradeRequest.comment = 'My comments';
        scheduleTradeRequest.etag = '636903862690160000';
        expectedValidationErrors = { validationMessages: [], overridable: false };

        component = CreateComponent();
        scheduleSdkConfig = new ScheduleSdkConfig();
        httpClientMock.post.and.returnValue(Observable.of(expectedValidationErrors));

      });

      it('should receive no validation warnings', () => {
        component.saveScheduleTrade(scheduleTradeRequest).subscribe((response) => {
          expect(response.validationMessages.length).toEqual(0);
          const uri = MockEnvService.baseApiPath + scheduleSdkConfig.ADD_SCHEDULE_TRADE_URL
            .replace('{requestingScheduleId}', scheduleTradeRequest.requestingScheduleGuid)
            .replace('{overrideValidation}', scheduleTradeRequest.overrideValidation.toString());
          httpClientMock.expectOne(uri);
        });
      });
    });
  });

  describe('savePayCode', () => {
    let jsonResponse;
    let scheduleToSave;
    const employeeCode = 'smith';
    const startDates: Array<Moment> = [];

    beforeEach(() => {
      jsonResponse = {
        activity: null,
        amount: null,
        guid: '7d376e1b-d28d-44c4-b899-c628ee8bbd0c',
        hasStartTime: false,
        hours: null,
        isCoverage: null,
        isExtraShift: false,
        isScheduleTradable: null,
        isScheduledHours: false,
        isTradeRequested: false,
        jobClass: { id: 131, code: 'AR1', name: 'AR1', number: 11100 },
        location: [
          {
            department: {
              code: 'CPP Dep1',
              id: 265,
              name: 'CPP Dep1',
              number: 41110
            },
            facility: {
              code: 'PayPeriodClose',
              id: 209,
              name: 'PayPeriodClose',
              number: 41000
            },
            timeZoneId: 'America/Chicago',
            unit: null,
            lunchHours: 0
          }
        ],
        lunchHours: 0,
        payCode: { id: 44, code: 'REG', name: 'Regular', number: 10 },
        person: {
          code: 'test00755',
          firstName: 'Selvam',
          id: 4926,
          jobClass: null,
          lastName: 'Minor',
          middleName: null
        },
        position: {
          id: 294, code: 'ARA01', name: 'ARA01', number: 11111, jobClass: { id: 131, code: 'AR1', name: 'AR1', number: 11100 }
        },
        profile: null,
        readOnly: true,
        requestedDate: '2019-05-30T00:57:47.927-05:00',
        requestedReason: null,
        scheduleStatus: null,
        scheduleTradeReviewerName: null,
        scheduleTradeStatus: null,
        startDate: '2019-06-07T00:00:00.000-05:00',
        status: 'Requested'
      };
    });

    describe('When jobClassId, facilityId, departmentId, unitId, positionId are not null', () => {
      beforeEach(() => {
        schedule = {
          amount: 0,
          department: { id: '71', name: 'department' },
          employeeCode: 'ARA01',
          facility: { id: '61', name: 'facility' },
          hasStartTime: true,
          hours: 8,
          jobClass: { id: '131', code: 'AR1', name: 'AR1', number: 11100 },
          lunchHours: 1,
          payCode: { id: '44', code: 'REG', name: 'Regular', number: 10 },
          position: { id: '51', name: 'position' },
          unit: { id: '81', name: 'unit' },
          startDates: startDates,
          requestedReason: 'test reason'
        } as any;

        component = CreateComponent();
        httpClientMock.post.and.returnValue(Observable.of(jsonResponse));
      });

      it('should save the paycode for given payload', () => {
        component.savePayCode(employeeCode, schedule, startDates).subscribe((response) => {
          expect(response.payCode.name).toEqual(jsonResponse.payCode.name);
          expect(response.jobClass.name).toEqual(jsonResponse.jobClass.name);
          const uri = MockEnvService.baseApiPath + transactionRequestSdkConfig.CREATE_TRANSACTION_REQUEST_URL;
          httpClientMock.expectOne(uri);
        });
      });
    });

    describe('When jobClassId, facilityId, departmentId, unitId, positionId are null', () => {
      beforeEach(() => {
        scheduleToSave = {
          amount: 0,
          department: null,
          employeeCode: 'ARA01',
          facility: null,
          hasStartTime: true,
          hours: 8,
          jobClass: null,
          lunchHours: 1,
          payCode: { id: 44, code: 'REG', name: 'Regular', number: 10 },
          position: null,
          unit: null,
          startDates: startDates,
          requestedReason: 'test reason'
        };

        component = CreateComponent();
        httpClientMock.post.and.returnValue(Observable.of(jsonResponse));
      });

      it('should save the paycode for given payload', () => {
        component.savePayCode(employeeCode, scheduleToSave, startDates).subscribe((response) => {
          expect(response.payCode.name).toEqual(jsonResponse.payCode.name);
          const uri = MockEnvService.baseApiPath + transactionRequestSdkConfig.CREATE_TRANSACTION_REQUEST_URL;
          httpClientMock.expectOne(uri);
        });
      });
    });

    describe('#getRosterViewSummary', () => {
      let scheduleSdkService: ScheduleSdkService;
      beforeEach(() => {
        const profileGroupItems = [
          {
            'group': {
              'id': -1,
              'code': 'On Call',
              'name': 'On Call',
              'number': -32769
            },
            'employeeCount': 2,
            'isSourceScheduleGroup': true
          }
        ];
        const profileItems = [
          {
            'group': {
              'id': 89,
              'code': 'ARA01',
              'name': 'ARA01',
              'number': 32768
            },
            'employeeCount': 1,
            'isSourceScheduleGroup': false
          },
          {
            'group': {
              'id': 90,
              'code': 'ARA02',
              'name': 'ARA02',
              'number': 32768
            },
            'employeeCount': 1,
            'isSourceScheduleGroup': false
          }
        ];

        const rosterSummaryResponse = {
          profileGroupItems: profileGroupItems,
          profileItems: profileItems
        };
        scheduleSdkService = CreateComponent();
        httpClientMock.get.and.returnValue(Observable.of(
          { rosterSummaryResponse: rosterSummaryResponse }
        ));
      });

      it('should return roster summary contains profilegroupitems and profileitems', (done) => {
        scheduleSdkService.getRosterSummary('B8EA2ADD-B774-4574-A6F8-56CB4B8B4F14').subscribe((response) => {
          expect(response).toBeDefined();
          done();
        });

        const uri = (MockEnvService.baseApiPath + scheduleSdkConfig.get_roster_summary).
          replace('{scheduleGuid}', 'B8EA2ADD-B774-4574-A6F8-56CB4B8B4F14')
          .replace('{minimumOverlap}', '00:30:00');
        httpClientMock.expectOne(uri);
      });
    });

    describe('#getEmployeeRosterDetails', () => {
      let scheduleSdkService: ScheduleSdkService;
      let rosterProfileGroupDetailsData: any;
      let rosterEmployeeListResponse: any;

      beforeEach(() => {
        const profileRoster = [
          {
            'employee': {
              'id': 1331,
              'code': 'blue02',
              'firstName': 'blue02',
              'lastName': 'blue02',
              'middleName': null,
              'jobClass': null
            },
            'schedule': {
              'startDate': '2019-07-26T07:00:00.000-05:00',
              'endDate': '2019-07-26T15:00:00.000-05:00',
              'hourValue': 8,
              'lunchHourValue': 0,
              'profile': {
                'id': 91,
                'organizationUnitId': 135,
                'code': 'ARA03',
                'name': 'ARA03',
                'isActive': true
              }
            }
          }
        ];
        rosterEmployeeListResponse = {
          roster: profileRoster
        };
        rosterProfileGroupDetailsData = {
          groupType: 'ProfileGroup',
          groupId: 1,
          scheduleGuid: '39C93229-ABDE-477A-9E65-13A17E9390EA'
        };
        scheduleSdkService = CreateComponent();
        httpClientMock.get.and.returnValue(Observable.of(rosterEmployeeListResponse));
      });

      it('should return roster employee list if group type is ProfileGroup', (done) => {
        scheduleSdkService.getEmployeeRosterDetails(rosterProfileGroupDetailsData).subscribe((response) => {
          expect(response).toEqual(rosterEmployeeListResponse);
          done();
        });
        const uri = (MockEnvService.baseApiPath + scheduleSdkConfig.get_roster_emp_list)
          .replace('{scheduleGuid}', '39C93229-ABDE-477A-9E65-13A17E9390EA')
          .replace('{groupType}', 'ProfileGroup')
          .replace('{groupId}', '1')
          .replace('{minimumOverlap}', '00:30:00');
        httpClientMock.expectOne(uri);
      });
    });
  });
  describe('deleteSchedule', () => {
    let jsonResponse;
    let deleteSchedule: ISchedule;

    beforeEach(() => {
      deleteSchedule = Schedule.fromJson({
        startDate: '2017-01-01 23:00:00.000 -05:00',
        hasStartTime: false,
        status: 'TEST',
        hours: 14,
        amount: 73,
        lunchHours: 1.5,
        timeZone: 'American/Chicago',
        jobClass: new Identifier({ id: 11, name: 'job class' }),
        payCode: new Identifier({ id: 21, name: 'pay code' }),
        activity: new Identifier({ id: 31, name: 'activity' }),
        profile: new Identifier({ id: 41, name: 'profile' }),
        position: new Identifier({ id: 51, name: 'position' }),
        person: { code: 'jones' },
        location: {
          facility: new Identifier({ id: 61, name: 'facility' }),
          department: new Identifier({ id: 71, name: 'department' }),
          unit: new Identifier({ id: 81, name: 'unit' }),
          timeZoneId: 'American/Chicago'
        },
        isScheduledHours: false,
        isExtraShift: false
      });
      jsonResponse = '200';
      component = CreateComponent();
      scheduleSdkConfig = new ScheduleSdkConfig();
      httpClientMock.delete.and.returnValue(Observable.of(jsonResponse));
    });

    it('should delete the schedule for given guid', () => {
      deleteSchedule.guid = 'e5f07be6-20e8-4c73-bc57-1d81c06cdc3c';
      component.deleteSchedule(deleteSchedule).subscribe((response) => {
        const uri = MockEnvService.baseApiPath + scheduleSdkConfig.DELETE_SCHEDULE_URL.replace('{guid}', schedule.guid);
        httpClientMock.expectOne(uri);
        expect(response).toEqual(jsonResponse);
      });
    });
  });

});
