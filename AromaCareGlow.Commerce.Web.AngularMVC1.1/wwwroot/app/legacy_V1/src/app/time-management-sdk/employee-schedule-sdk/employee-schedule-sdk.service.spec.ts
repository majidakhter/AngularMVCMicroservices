
import { EmployeeScheduleSdkService, EmployeeScheduleQueryType } from './employee-schedule-sdk.service';
import { IEmployeeScheduleResult } from './schedule-result';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { ISchedule } from '../../time-management-domain/schedule';
import { IJobClass } from '../../time-management-domain/job-class';
import { IActivity, IActivityWithConfig } from '../../time-management-domain/activity';
import { IProfile } from '../../time-management-domain/profile';
import { IPosition } from '../../time-management-domain/position';
import { IDepartment, IFacility, IUnit } from '../../time-management-domain/org-unit';
import { IPayCode } from '../../time-management-domain/pay-code';
import { MockEnvService } from '../../shared/test-fakes/mock-env';
import { IOpenShiftResponse, OpenShift, IOpenShift } from './open-shift-response';
import { HttpClient } from '@angular/common/http';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { DateFormats } from 'src/app/shared/date-formats/date-formats';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';
import { EmployeeScheduleSdkConfig } from './employee-schedule-sdk.config';
import { IScheduleResult } from '../schedule-sdk/schedule-result';
import { SelfSchedulePeriodDetailsResponse } from './self-schedule-period-details-response';

describe('EmployeeScheduleSdkService', () => {
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let employeeScheduleService: EmployeeScheduleSdkService;
  let schedule: ISchedule;
  let employeeCode;
  let startDate: string;
  let endDate: string;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    employeeScheduleService = new EmployeeScheduleSdkService(mockHttpClient, MockEnvService, new DateFormatter(new DateFormats()), new EmployeeScheduleSdkConfig());
    employeeCode = '2311';
    startDate = '2018-01-15';
    endDate = '2018-01-19';
    schedule = {
      startDate: moment(startDate),
      requestedDate: moment(endDate),
      requestForDates: [],
      hasStartTime: true,
      status: 'Valid',
      hours: 19,
      amount: 14,
      lunchHours: 1.5,
      guid: 'abcd',
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

  describe('#getSchedules', () => {
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
            requestForDates: [],
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
          }, {
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
          }]
        }
      };
      mockHttpClient.get.and.returnValue(Observable.of(httpResponse));
    });

    describe('when schedules are gotten without extra query params', () => {
      let response;
      beforeEach((done) => {

        employeeScheduleService.getSchedules(employeeCode, startDate, endDate, null, 'MonthlyView').subscribe((schedResponse: IEmployeeScheduleResult) => {
          response = schedResponse;
          done();
        });
      });

      it('should return the positions', () => {
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
      });
    });

    describe('when calling the schedules with SelfScheduling as constraint', () => {
      let response;
      beforeEach((done) => {

        employeeScheduleService.getSchedules(employeeCode, startDate, endDate, null, 'SelfScheduling').subscribe((schedResponse: IScheduleResult) => {
          response = schedResponse;
          done();
        });
      });

      it('Schedule response should have the data', () => {
        expect(response.events.length).toBe(2);
      });
    });

    describe('when schedules are gotten with extra query params', () => {
      beforeEach((done) => {
        employeeScheduleService.getSchedules(employeeCode, startDate, endDate, EmployeeScheduleQueryType.IncludePayPeriodSummariesAndRequests, 'MonthlyView')
          .subscribe((schedResponse: IEmployeeScheduleResult) => {
            done();
          });
      });

      it('should add query parameter to request uri', () => {
        expect(mockHttpClient.get).toHaveBeenCalledWith(
          './Base/employee/2311/schedule?constraint=MonthlyView&startDate=2018-01-15&endDate=2018-01-19&_query=IncludePayPeriodSummariesAndRequests',
          { observe: 'response' });
      });
    });
  });

  describe('#getSchedulePeriods', () => {
    const result = {
      schedulePeriods: [
        { dateRange: { begin: '2017-08-02', end: '2017-08-02' }, status: 'SelfScheduling', selfSchedulePeriod: { begin: '2019-07-10', end: '2019-08-17' } },
        { dateRange: { begin: '2017-08-03', end: '2017-08-03' }, status: 'Balancing', selfSchedulePeriod: { begin: '2019-07-10', end: '2019-08-17' } }
      ]
    };
    const organizationUnitId = '2';
    const start = moment('2017-08-02');
    const end = moment('2017-08-02');
    let getSchedulePeriods: Observable<Array<SchedulePeriod>>;

    describe('When getting the SchedulePeriods as response', () => {
      beforeEach(() => {
        mockHttpClient.get.and.returnValue(Observable.of(result));
        getSchedulePeriods = employeeScheduleService.getSchedulePeriods(organizationUnitId, start, end);
      });
      it('should call getSchedulePeriods with organization id and dates', () => {
        employeeScheduleService.getSchedulePeriods(organizationUnitId, start, end).subscribe((response) => {
          expect(response[0].start).toEqual(moment(result.schedulePeriods[0].dateRange.begin));
          expect(response[0].end).toEqual(moment(result.schedulePeriods[0].dateRange.end));
          expect(response[0].status).toEqual(result.schedulePeriods[0].status);
        });
      });
    });
    describe('when no schedulePeriods are found for the given organization unit', () => {
      const schedulePeriodResult = { schedulePeriods: [] };
      beforeEach(() => {
        spyOn(employeeScheduleService, 'mapSchedulePeriods');
        mockHttpClient.get.and.returnValue(Observable.of(schedulePeriodResult));
        getSchedulePeriods = employeeScheduleService.getSchedulePeriods(organizationUnitId, start, end);
      });

      it('getSchedulePeriods response length should be zero', (done) => {
        employeeScheduleService.getSchedulePeriods(organizationUnitId, start, end).subscribe(() => { }, () => done());
        done();
        expect(employeeScheduleService.mapSchedulePeriods).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('#getSelfSchedulePeriodDetails', () => {
    const result = {
      accessPeriodStartDate: moment(),
      accessPeriodEndDate: moment(),
      canSelfSchedule: true
    };
    const organizationUnitId = '362';
    const start = moment('2019-10-27');

    let getSelfSchedulePeriodDetails: Observable<SelfSchedulePeriodDetailsResponse>;

    describe('when calling the getSelfSchedulePeriodDetails', () => {
      beforeEach(() => {
        mockHttpClient.get.and.returnValue(Observable.of(result));
        getSelfSchedulePeriodDetails = employeeScheduleService.getSelfSchedulePeriodDetails(employeeCode, organizationUnitId, start);
      });
      it('should call getSelfSchedulePeriodDetails endpoint', () => {
        expect(mockHttpClient.get).toHaveBeenCalledWith('./Base/employee/2311/organization/362/self-schedule-period?startDate=2019-10-27');
      });
      it('should return a valid object', () => {
        getSelfSchedulePeriodDetails.subscribe((periodGroupDetails) => {
          expect(periodGroupDetails.canSelfSchedule).toBe(true);
        });
      });
    });
  });

  describe('#mapSchedulePeriods', () => {
    describe('when calling the mapSchedulePeriods', () => {
      const result = {
        schedulePeriods: [
          { dateRange: { begin: '2017-08-02', end: '2017-08-02' }, status: 'SelfScheduling', selfSchedulePeriod: { begin: '2019-07-10', end: '2019-08-17' } },
          { dateRange: { begin: '2017-08-03', end: '2017-08-03' }, status: 'Balancing', selfSchedulePeriod: { begin: '2019-07-10', end: '2019-08-17' } }
        ]
      };
      it('SelfScheduling should be changed as Self Scheduling', () => {
        employeeScheduleService.mapSchedulePeriods(result.schedulePeriods);
        expect(result.schedulePeriods[0].status).toEqual('Self Scheduling');
      });
    });
  });

  describe('#getShifts', () => {
    describe('when there are no time zone differences', () => {
      const openShifts = {
        shifts: [
          {
            start: '2019-05-02T23:00:00.000-05:00',
            end: '2019-05-03T07:30:00.000-05:00',
            activity: {
              id: 8,
              code: '2300-8',
              name: '2300-8',
              startTime: '23:00:00',
              hours: 8,
              lunchHours: 0.5,
              payCode: null
            },
            profile: {
              id: 117,
              code: 'RN-3N',
              name: null,
              number: null
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
              unit: null,
              timeZoneId: 'America/Chicago'
            }
          },
          {
            start: '2019-05-03T07:00:00.000-05:00',
            end: '2019-05-03T15:30:00.000-05:00',
            activity: {
              id: 6,
              code: '0700-8',
              name: '0700-8',
              startTime: '07:00:00',
              hours: 8,
              lunchHours: 0.5,
              payCode: null
            },
            profile: {
              id: 117,
              code: 'RN-3N',
              name: null,
              number: null
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
              unit: null,
              timeZoneId: 'America/Chicago'
            }
          }
        ]
      };

      let getShifts: Observable<IOpenShiftResponse>;
      beforeEach(() => {
        mockHttpClient.get.and.returnValue(Observable.of(openShifts));
        getShifts = employeeScheduleService.getShifts('emp', '12-12-2019', '12-13-2019');
      });

      it('should call employee shift endpoint', () => {
        expect(mockHttpClient.get).toHaveBeenCalledWith('./Base/employee/emp/shift?constraint=open&start=12-12-2019&end=12-13-2019');
      });

      it('should return an array of OpenShifts', () => {
        getShifts.subscribe((shifts) => {
          expect(shifts.shifts.length).toEqual(2);
          shifts.shifts.forEach(shift => {
            expect(shift instanceof OpenShift).toBeTruthy();
          });
        });
      });
    });

    describe('when facility time zone is different than browser time zone', () => {
      const openShifts = {
        shifts: [
          {
            start: '2019-05-02T23:00:00.000+11:00',
            end: '2019-05-03T07:30:00.000+11:00',
            activity: {
              id: 8,
              code: '2300-8',
              name: '2300-8',
              startTime: '23:00:00',
              hours: 8,
              lunchHours: 0.5,
              payCode: null
            },
            profile: {
              id: 117,
              code: 'RN-3N',
              name: null,
              number: null
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
              unit: null,
              timeZoneId: 'Pacific/Auckland'
            }
          },
          {
            start: '2019-05-03T07:00:00.000+11:00',
            end: '2019-05-03T15:30:00.000+11:00',
            activity: {
              id: 6,
              code: '0700-8',
              name: '0700-8',
              startTime: '07:00:00',
              hours: 8,
              lunchHours: 0.5,
              payCode: null
            },
            profile: {
              id: 117,
              code: 'RN-3N',
              name: null,
              number: null
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
              unit: null,
              timeZoneId: 'Pacific/Auckland'
            }
          }
        ]
      };

      beforeAll(() => {
        moment.tz.setDefault('America/New_York');
      });

      let getShifts: Observable<IOpenShiftResponse>;
      beforeEach(() => {
        mockHttpClient.get.and.returnValue(Observable.of(openShifts));
        getShifts = employeeScheduleService.getShifts('emp', '12-12-2019', '12-13-2019');
      });

      it('should return open shift data that matches the facility time zone', () => {
        getShifts.subscribe((response) => {
          expect(response.shifts.length).toEqual(2);
          response.shifts.forEach(shift => {
            expect(shift instanceof OpenShift).toBeTruthy();
          });
          const firstShiftStart = response.shifts[0].start;
          expect(firstShiftStart.year()).toEqual(2019);
          expect(firstShiftStart.month() + 1).toEqual(5);
          expect(firstShiftStart.date()).toEqual(2);
          expect(firstShiftStart.hour()).toEqual(23);
          expect(firstShiftStart.minute()).toEqual(0);
          const firstShiftEnd = response.shifts[0].end;
          expect(firstShiftEnd.year()).toEqual(2019);
          expect(firstShiftEnd.month() + 1).toEqual(5);
          expect(firstShiftEnd.date()).toEqual(3);
          expect(firstShiftEnd.hour()).toEqual(7);
          expect(firstShiftEnd.minute()).toEqual(30);
        });
      });

      afterAll(() => {
        moment.tz.setDefault();
      });

    });
  });

  describe('#requestShift', () => {
    const activity = {
      id: '6',
      code: '0700-8',
      name: '0700-8',
      startTime: '07:00:00',
      hours: 8,
      lunchHours: 0.5,
      payCode: null
    } as IActivityWithConfig;

    const profile = {
      id: '117',
      code: 'RN-3N',
      name: null,
      number: null
    } as IProfile;

    const location = {
      facility: {
        id: '85',
        code: 'AS Scheduling',
        name: 'AS Scheduling',
        number: '15000',
        timeZoneId: '3',
        status: null
      },
      department: null,
      unit: null,
      timeZoneId: 'America/Chicago',
      configuration: null
    } as ILocationWithConfig;

    beforeEach(() => {
      mockHttpClient.post.and.returnValue({});
    });

    describe('when override value is omitted', () => {
      beforeEach(() => {
        const requestedShift: IOpenShift = {
          start: moment('2019-12-12'),
          end: moment('2019-12-12'),
          activity: activity,
          profile: profile,
          location: location
        };
        employeeScheduleService.requestShift('emp', requestedShift, 'test');
      });

      it('should call request shift endpoint', () => {
        let date = moment('2019-12-12');
        let startDate = date.format().replace(/\+/gi, '%2B');
        let endDate = date.format().replace(/\+/gi, '%2B');
        expect(mockHttpClient.post).toHaveBeenCalledWith('./Base/employee/emp/shift/_request?overrideValidation=false', {
          start: startDate,
          end: endDate,
          activityId: '6',
          profileId: '117',
          organizationUnitId: '85',
          comment: 'test'
        });
      });
    });

    describe('when override is true', () => {
      beforeEach(() => {
        const requestedShift: IOpenShift = {
          start: moment('2019-12-12'),
          end: moment('2019-12-12'),
          activity: activity,
          profile: profile,
          location: location
        };
        employeeScheduleService.requestShift('emp', requestedShift, 'test', true);
      });

      it('should call request shift endpoint', () => {
        let date = moment('2019-12-12');
        let startDate = date.format().replace(/\+/gi, '%2B');
        let endDate = date.format().replace(/\+/gi, '%2B');
        expect(mockHttpClient.post).toHaveBeenCalledWith('./Base/employee/emp/shift/_request?overrideValidation=true', {
          start: startDate,
          end: endDate,
          activityId: '6',
          profileId: '117',
          organizationUnitId: '85',
          comment: 'test'
        });
      });
    });
  });
});
