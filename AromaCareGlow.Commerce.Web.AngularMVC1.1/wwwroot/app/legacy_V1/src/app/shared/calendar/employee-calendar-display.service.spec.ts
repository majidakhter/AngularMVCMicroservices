
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { EmployeeCalendarDisplayService } from './employee-calendar-display.service';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { SchedulePeriod } from './schedule-period';
import { IScheduleCalendarWeek } from '../schedule-calendar/models/IScheduleCalendarWeek';
import { CalendarWeek } from '../schedule-calendar/models/calendar-week.model';
import { IScheduleResult } from 'src/app/time-management-sdk/schedule-sdk/schedule-result';

describe('EmployeeCalendarDisplayService', () => {
  let httpClient;
  let mockEmployeeScheduleSdkService: jasmine.SpyObj<EmployeeScheduleSdkService>;

  let dateFormatter;
  let service: EmployeeCalendarDisplayService;

  let scheduleResult: IScheduleResult;
  let scheduleResult2: IScheduleResult;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get']);

    const events: ISchedule[] = [{
      'employment': {
        'classification': 'test01',
        'classifications': [],
        'code': 'abc03',
        'description': 'labourdescription',
        'employeeCategoryID': 143,
        'employeeClassID': 447,
        'employeeID': 22204,
        'gradeID': 55,
        'grantCodeID': 554,
        'id': 777,
        'jobClassID': 6598,
        'number': 111,
        'organizationUnitID': 578,
        'payGroupID': 986,
        'positionID': 4454,
        'projectCodeID': 86,
        'seniorityID': 99,
        'shiftID': 784,
        'skillID': 777,
        'statusCodeID': 75,
        'unionCodeID': 35,
        'whenEffective': '12-06-1994',
        'whenExpire': '12-09-2021'
      },
      'hours': 3,
      'isScheduledHours': true,
      'startDate': moment('2018-05-06'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': null,
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': null,
      'position': null,
      'employee': {
        'id': 123,
        'firstName': 'Max',
        'lastName': 'Zhao',
        'code': 'code123',
        'canEdit': true
      },
      'isExtraShift': false,
      'facility': null,
      'department': null,
      'unit': null,
      'isActivity': true,
      'endDate': moment('2018-05-19'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'Manual',
      'scheduleTradeParticipant': null,
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    },
    {
      'employment': {
        'classification': 'test01',
        'classifications': [],
        'code': 'abc03',
        'description': 'labourdescription',
        'employeeCategoryID': 143,
        'employeeClassID': 447,
        'employeeID': 22204,
        'gradeID': 55,
        'grantCodeID': 554,
        'id': 777,
        'jobClassID': 6598,
        'number': 111,
        'organizationUnitID': 578,
        'payGroupID': 986,
        'positionID': 4454,
        'projectCodeID': 86,
        'seniorityID': 99,
        'shiftID': 784,
        'skillID': 777,
        'statusCodeID': 75,
        'unionCodeID': 35,
        'whenEffective': '12-06-1994',
        'whenExpire': '12-09-2021'
      },
      'hours': 5,
      'isScheduledHours': true,
      'startDate': moment('2018-05-06'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': null,
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': null,
      'position': null,
      'employee': {
        'id': 123,
        'firstName': 'Max',
        'lastName': 'Zhao',
        'code': 'code123',
        'canEdit': true
      },
      'isExtraShift': false,
      'facility': null,
      'department': null,
      'unit': null,
      'isActivity': true,
      'endDate': moment('2018-05-19'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'Manual',
      'scheduleTradeParticipant': null,
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    },
    {
      'employment': {
        'classification': 'test01',
        'classifications': [],
        'code': 'abc03',
        'description': 'labourdescription',
        'employeeCategoryID': 143,
        'employeeClassID': 447,
        'employeeID': 22204,
        'gradeID': 55,
        'grantCodeID': 554,
        'id': 777,
        'jobClassID': 6598,
        'number': 111,
        'organizationUnitID': 578,
        'payGroupID': 986,
        'positionID': 4454,
        'projectCodeID': 86,
        'seniorityID': 99,
        'shiftID': 784,
        'skillID': 777,
        'statusCodeID': 75,
        'unionCodeID': 35,
        'whenEffective': '12-06-1994',
        'whenExpire': '12-09-2021'
      },
      'hours': 7,
      'isScheduledHours': false,
      'startDate': moment('2018-05-06'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': null,
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': null,
      'position': null,
      'employee': {
        'id': 123,
        'firstName': 'Max',
        'lastName': 'Zhao',
        'code': 'code123',
        'canEdit': true
      },
      'isExtraShift': false,
      'facility': null,
      'department': null,
      'unit': null,
      'isActivity': true,
      'endDate': moment('2018-05-19'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'Manual',
      'scheduleTradeParticipant': null,
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    }];

    scheduleResult = {
      'events': events,
      'etag': 'aaaaa'
    };

    mockEmployeeScheduleSdkService = jasmine.createSpyObj('EmployeeScheduleSdkService', ['getSchedules']);
    mockEmployeeScheduleSdkService.getSchedules.and.returnValue(Observable.of(scheduleResult));

    dateFormatter = jasmine.createSpyObj('DateFormatter', ['toUrlDate', 'toShortDate']);
  });

  describe('#initWeeks', () => {
    let schedulePeriod: SchedulePeriod;
    let result: Array<IScheduleCalendarWeek>;

    describe('when the day that starts the week matches the day that starts the schedule period', () => {
      beforeEach(() => {

        const startOfSchedulePeriod = moment('2014-01-07').startOf('week');
        const endOfSchedulePeriod = startOfSchedulePeriod.clone().add(3, 'weeks').subtract(1, 'days');

        schedulePeriod = new SchedulePeriod(
          startOfSchedulePeriod,
          endOfSchedulePeriod,
          'status',
          startOfSchedulePeriod.clone().add(4, 'weeks'),
          startOfSchedulePeriod.clone().add(6, 'weeks')
        );

        service = new EmployeeCalendarDisplayService(dateFormatter, mockEmployeeScheduleSdkService);

        result = service.initWeeks(schedulePeriod);
      });

      it('should build the same number of weeks as the schedule period', () => {
        expect(result).not.toBeNull();
        expect(result.length).toEqual(3);
      });
    });

    describe('when the day that starts the week differs from the day that starts the schedule period', () => {
      beforeEach(() => {

        const startOfSchedulePeriod = moment('2014-01-07').startOf('week');
        const endOfSchedulePeriod = startOfSchedulePeriod.clone().add(3, 'weeks').subtract(1, 'days');

        schedulePeriod = new SchedulePeriod(
          startOfSchedulePeriod,
          endOfSchedulePeriod,
          'status',
          startOfSchedulePeriod.clone().add(4, 'weeks'),
          startOfSchedulePeriod.clone().add(6, 'weeks')
        );

        result = service.initWeeks(schedulePeriod);
      });

      it('should build one additional week as the schedule period', () => {
        expect(result).not.toBeNull();
        expect(result.length).toEqual(3);
      });

      it('should build the weeks with the starting day of the local start of week', () => {
        const localStartOfWeek = moment().startOf('week').day();
        expect(result[0].days[0].date).not.toBeNull();
        expect(result[0].days[0].date.day()).toEqual(localStartOfWeek);
      });
    });

    describe('when the Schedule Period Starts from Monday', () => {
      beforeEach(() => {

        const startOfSchedulePeriod = moment('2018-08-06').startOf('week');
        const endOfSchedulePeriod = startOfSchedulePeriod.clone().add(3, 'weeks');

        schedulePeriod = new SchedulePeriod(
          startOfSchedulePeriod,
          endOfSchedulePeriod,
          'status',
          startOfSchedulePeriod.clone().add(4, 'weeks'),
          startOfSchedulePeriod.clone().add(6, 'weeks')
        );
        service = new EmployeeCalendarDisplayService(dateFormatter, mockEmployeeScheduleSdkService);
        result = service.initWeeks(schedulePeriod);

      });

      it('should build the weeks with the starting day of Monday', () => {
        const localStartOfWeek = moment().startOf('week').day();
        expect(result[0].days[0].date).not.toBeNull();
        expect(result[0].days[0].date.day()).toEqual(localStartOfWeek);
      });
    });

    describe('when the Schedule Period Starts from Sunday', () => {
      beforeEach(() => {

        const startOfSchedulePeriod = moment('2018-08-05').startOf('week');
        const endOfSchedulePeriod = startOfSchedulePeriod.clone().add(3, 'weeks');

        schedulePeriod = new SchedulePeriod(
          startOfSchedulePeriod,
          endOfSchedulePeriod,
          'status',
          startOfSchedulePeriod.clone().add(4, 'weeks'),
          startOfSchedulePeriod.clone().add(6, 'weeks')
        );
        service = new EmployeeCalendarDisplayService(dateFormatter, mockEmployeeScheduleSdkService);
        result = service.initWeeks(schedulePeriod);
      });

      it('should build the weeks with the starting day of Sunday', () => {
        const localStartOfWeek = moment().startOf('week').day();
        expect(result[0].days[0].date).not.toBeNull();
        expect(result[0].days[0].date.day()).toEqual(localStartOfWeek);
      });
    });

    describe('when the Schedule Period Starts from Thursday', () => {
      beforeEach(() => {

        const startOfSchedulePeriod = moment('2018-08-09').startOf('week');
        const endOfSchedulePeriod = startOfSchedulePeriod.clone().add(3, 'weeks');

        schedulePeriod = new SchedulePeriod(
          startOfSchedulePeriod,
          endOfSchedulePeriod,
          'status',
          startOfSchedulePeriod.clone().add(4, 'weeks'),
          startOfSchedulePeriod.clone().add(6, 'weeks')
        );
        service = new EmployeeCalendarDisplayService(dateFormatter, mockEmployeeScheduleSdkService);
        result = service.initWeeks(schedulePeriod);
      });

      it('should build the weeks with the starting day of Thursday', () => {
        const localStartOfWeek = moment().startOf('week').day();
        expect(result[0].days[0].date).not.toBeNull();
        expect(result[0].days[0].date.day()).toEqual(localStartOfWeek);
      });
    });
  });

  describe('#getSchedulesByCode', () => {
    let scheduleWeeks: Array<IScheduleCalendarWeek>;

    beforeEach(() => {
      service = new EmployeeCalendarDisplayService(dateFormatter, mockEmployeeScheduleSdkService);

      scheduleWeeks = [
        new CalendarWeek(moment('2018-05-06'), moment('2018-05-06'), moment('2018-05-19')),
        new CalendarWeek(moment('2018-05-13'), moment('2018-05-06'), moment('2018-05-19'))
      ];
    });

    describe('When querying for schedules', () => {
      describe('and no schedules are found', () => {
        let svcResult: Array<IScheduleCalendarWeek>;

        beforeEach(() => {
          dateFormatter.toUrlDate.and.callFake((date) => date.format('YYYY-MM-DD'));
          dateFormatter.toShortDate.and.callFake((date) => date.format('YYYY-MM-DD'));

          service.getSchedulesByCode('code123', scheduleWeeks, 'SelfScheduling').subscribe((result) => {
            svcResult = result;
          });
        });

        it('should query for the code and the first and a last days of the range', () => {
          expect(svcResult).toBeDefined();
        });

      });

      describe('and no schedules on that day', () => {
        let svcResult: Array<IScheduleCalendarWeek>;

        beforeEach(() => {
          scheduleResult2 = {
            'events': [],
            'etag': 'bbbbb'
          };

          mockEmployeeScheduleSdkService = jasmine.createSpyObj('EmployeeScheduleSdkService', ['getSchedules']);
          mockEmployeeScheduleSdkService.getSchedules.and.returnValue(Observable.of(scheduleResult2));

          service = new EmployeeCalendarDisplayService(dateFormatter, mockEmployeeScheduleSdkService);

          dateFormatter.toUrlDate.and.callFake((date) => date.format('YYYY-MM-DD'));
          dateFormatter.toShortDate.and.callFake((date) => date.format('YYYY-MM-DD'));

          service.getSchedulesByCode('code123', scheduleWeeks, 'SelfScheduling').subscribe((result) => {
            svcResult = result;
          });
        });

        it('should query for the code and the first and a last days of the range', () => {
          expect(svcResult).toBeDefined();
        });

      });

      describe('When the JSON results are returned', () => {
        let svcResult: Array<IScheduleCalendarWeek>;

        beforeEach(() => {
          const scheduleCodeResult = {
            'schedules': [
              {
                'employment': {
                  'classification': 'test01',
                  'classifications': [],
                  'code': 'abc03',
                  'description': 'labourdescription',
                  'employeeCategoryID': 143,
                  'employeeClassID': 447,
                  'employeeID': 22204,
                  'gradeID': 55,
                  'grantCodeID': 554,
                  'id': 777,
                  'jobClassID': 6598,
                  'number': 111,
                  'organizationUnitID': 578,
                  'payGroupID': 986,
                  'positionID': 4454,
                  'projectCodeID': 86,
                  'seniorityID': 99,
                  'shiftID': 784,
                  'skillID': 777,
                  'statusCodeID': 75,
                  'unionCodeID': 35,
                  'whenEffective': '12-06-1994',
                  'whenExpire': '12-09-2021'
                },
                'hours': 3,
                'isScheduledHours': true,
                'startDate': '2018-05-06',
                'person': {
                  'code': 'abc',
                  'expanded': true,
                  'firstName': 'Bob',
                  'lastName': 'Ross'
                },
                'location': {
                  'facility': {
                    'id': '123',
                    'code': 'fac123',
                    'name': 'fac 123',
                    'number': '1230'
                  },
                  'department': {
                    'id': '123',
                    'code': 'dep123',
                    'name': 'dep 123',
                    'number': '1230'
                  },
                  'unit': {
                    'id': '123',
                    'code': 'unit123',
                    'name': 'unit 123',
                    'number': '1230'
                  },
                  'timeZoneId': 'America/Chicago'
                }
              },
              {
                'employment': {
                  'classification': 'test01',
                  'classifications': [],
                  'code': 'abc03',
                  'description': 'labourdescription',
                  'employeeCategoryID': 143,
                  'employeeClassID': 447,
                  'employeeID': 22204,
                  'gradeID': 55,
                  'grantCodeID': 554,
                  'id': 777,
                  'jobClassID': 6598,
                  'number': 111,
                  'organizationUnitID': 578,
                  'payGroupID': 986,
                  'positionID': 4454,
                  'projectCodeID': 86,
                  'seniorityID': 99,
                  'shiftID': 784,
                  'skillID': 777,
                  'statusCodeID': 75,
                  'unionCodeID': 35,
                  'whenEffective': '12-06-1994',
                  'whenExpire': '12-09-2021'
                },
                'hours': 5,
                'isScheduledHours': true,
                'startDate': '2018-05-06',
                'person': {
                  'code': 'abc',
                  'expanded': true,
                  'firstName': 'Bob',
                  'lastName': 'Ross'
                },
                'location': {
                  'facility': {
                    'id': '123',
                    'code': 'fac123',
                    'name': 'fac 123',
                    'number': '1230'
                  },
                  'department': {
                    'id': '123',
                    'code': 'dep123',
                    'name': 'dep 123',
                    'number': '1230'
                  },
                  'unit': {
                    'id': '123',
                    'code': 'unit123',
                    'name': 'unit 123',
                    'number': '1230'
                  },
                  'timeZoneId': 'America/Chicago'
                }
              },
              {
                'employment': {
                  'classification': 'test01',
                  'classifications': [],
                  'code': 'abc03',
                  'description': 'labourdescription',
                  'employeeCategoryID': 143,
                  'employeeClassID': 447,
                  'employeeID': 22204,
                  'gradeID': 55,
                  'grantCodeID': 554,
                  'id': 777,
                  'jobClassID': 6598,
                  'number': 111,
                  'organizationUnitID': 578,
                  'payGroupID': 986,
                  'positionID': 4454,
                  'projectCodeID': 86,
                  'seniorityID': 99,
                  'shiftID': 784,
                  'skillID': 777,
                  'statusCodeID': 75,
                  'unionCodeID': 35,
                  'whenEffective': '12-06-1994',
                  'whenExpire': '12-09-2021'
                },
                'hours': 7,
                'isScheduledHours': false,
                'startDate': '2018-05-06',
                'person': {
                  'code': 'abc',
                  'expanded': true,
                  'firstName': 'Bob',
                  'lastName': 'Ross'
                },
                'location': {
                  'facility': {
                    'id': '123',
                    'code': 'fac123',
                    'name': 'fac 123',
                    'number': '1230'
                  },
                  'department': {
                    'id': '123',
                    'code': 'dep123',
                    'name': 'dep 123',
                    'number': '1230'
                  },
                  'unit': {
                    'id': '123',
                    'code': 'unit123',
                    'name': 'unit 123',
                    'number': '1230'
                  },
                  'timeZoneId': 'America/Chicago'
                }
              }
            ]
          };

          httpClient.get.and.returnValue(Observable.of(scheduleCodeResult));
          dateFormatter.toUrlDate.and.callFake((date) => date.format('YYYY-MM-DD'));
          service.getSchedulesByCode('code123', scheduleWeeks, 'SelfScheduling').subscribe((result) => {
            svcResult = result;
          });

        });

        it('should assign the schedules', () => {
          expect(svcResult[0].days[0].events).not.toBeUndefined();
          expect(svcResult[0].days[0].events.length).toBe(3);
          expect(svcResult[0].days[0].events[0].hours).toBe(3);
          expect(svcResult[0].days[0].events[1].hours).toBe(5);
          expect(svcResult[0].days[0].events[2].hours).toBe(7);
        });

        it('should total hours for all days that are scheduled', () => {
          // The third event is not scheduled hours, to only the first two events add to weekly total.
          expect(svcResult[0].weeklyHours).toBe(8);
        });
      });
    });
  });
});
