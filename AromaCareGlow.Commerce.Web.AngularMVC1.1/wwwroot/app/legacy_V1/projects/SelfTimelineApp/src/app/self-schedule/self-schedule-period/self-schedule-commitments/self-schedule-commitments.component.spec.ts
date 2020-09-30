
import { SelfScheduleCommitmentsComponent } from './self-schedule-commitments.component';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { IScheduleCalendarWeek } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarWeek';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { SimpleChange, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { EmployeeStaffingCommitmentSdkService } from 'src/app/time-management-sdk/employee-staffing-commitment-sdk/employee-staffing-commitment-sdk.service';
import { Store } from '@ngxs/store';
import * as _ from 'lodash';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { of, throwError } from 'rxjs';
import { IEmployeeStaffingCommitmentResponse } from 'src/app/time-management-sdk/employee-staffing-commitment-sdk/employee-staffing-commitment-response';
import { Employee } from 'src/app/time-management-domain/employee';
import { IEmployment } from 'src/app/time-management-domain/employment';

describe('SelfScheduleCommitmentsComponent', () => {
  let component: SelfScheduleCommitmentsComponent;
  let mockEmployeeStaffingCommitmentSdkService: jasmine.SpyObj<EmployeeStaffingCommitmentSdkService>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  const startDate = moment('2020-02-02');
  const endDate = moment('2020-02-16');

  const employee: Employee = {
    id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
    employment: {
      profession: {},
      location: {
        facility: { id: '102' },
        timeZoneId: 'CST'
      }
    } as IEmployment
  };

  const expectedEmployeeResult = {
    id: 4930,
    code: 'AdminVishal',
    firstName: 'ARA01',
    lastName: 'ARA01',
    employment: {
      profession: {
        jobClass: {
          id: 131,
          code: 'AR1',
          name: 'AR1',
          number: 11100
        },
        shift: null,
        fte: 0,
        classification: {
          id: 1,
          code: 'FT',
          name: 'Full-Time Hourly',
          number: null
        },
        approvedHours: 0,
        weeklyOvertimeHours: 0,
        position: {
          jobClass: {
            id: 131,
            code: 'AR1',
            name: 'AR1',
            number: 11100
          },
          id: 294,
          code: 'ARA01',
          name: 'ARA01',
          number: 11111
        },
        hireDate: '2000-01-01',
        seniorityDate: null
      },
      location: {
        facility: {
          id: 134,
          code: 'AR',
          name: 'AR-fac01',
          number: 11000
        },
        department: {
          id: 135,
          code: 'AR Department A',
          name: 'AR Department A',
          number: 11110
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      effectiveDate: '2008-08-10',
      expireDate: null,
      classification: 'PrimaryHome'
    }
  };
  const expectedSchedulePeriods: Array<SchedulePeriod> = [
    {
      start: startDate,
      end: endDate,
      status: 'Self Scheduling',
      selfScheduleStart: moment('2020-02-02'),
      selfScheduleEnd: moment('202-02-16')
    },
    {
      start: moment(startDate).add(4, 'weeks').endOf('day'),
      end: moment(startDate).add(6, 'weeks').endOf('day'),
      status: 'Self Scheduling',
      selfScheduleStart: moment('2020-02-16'),
      selfScheduleEnd: moment('202-02-29')
    },
    {
      start: moment(startDate).add(8, 'weeks').endOf('day'),
      end: moment(startDate).add(10, 'weeks').endOf('day'),
      status: 'Manual',
      selfScheduleStart: moment('2020-03-01'),
      selfScheduleEnd: moment('2020-03-14')
    }
  ];

  const staffingCommitmentResult: IEmployeeStaffingCommitmentResponse = {
    'employeeCode': 'AdminVishal',
    'schedulePeriods': [
      {
        'staffConfigurationId': 104,
        'startDate': moment('2020-02-02'),
        'endDate': moment('2020-02-15'),
        'staffCommitments': [
          {
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'type': 'MinimumApprovedHoursSchedulePeriod',
            'actual': 8,
            'target': 120,
            'whenUpdated': moment('2020-01-24'),
            'unit': 'Hours',
            'schedulePeriodStage': 'SelfSchedule'
          },
          {
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'type': 'MinimumApprovedHoursSchedulePeriod',
            'actual': 8,
            'target': 120,
            'whenUpdated': moment('2020-01-24'),
            'unit': 'Hours',
            'schedulePeriodStage': 'SelfSchedule'
          },
          {
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'type': 'MinimumWeekendSchedulesInSchedulePeriod',
            'actual': 0,
            'target': 1,
            'whenUpdated': moment('2020-01-24'),
            'unit': 'Shifts',
            'schedulePeriodStage': 'SelfSchedule'
          }
        ]
      }],
    'pendingSchedulePeriodValidation': false
  };

  const staffingCommitmentResultRefreshPending: IEmployeeStaffingCommitmentResponse = {
    'employeeCode': 'AdminVishal',
    'schedulePeriods': [
      {
        'staffConfigurationId': 104,
        'startDate': moment('2020-02-02'),
        'endDate': moment('2020-02-15'),
        'staffCommitments': [
          {
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'type': 'MinimumApprovedHoursSchedulePeriod',
            'actual': 8,
            'target': 120,
            'whenUpdated': moment('2020-01-24'),
            'unit': 'Hours',
            'schedulePeriodStage': 'SelfSchedule'
          },
          {
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'type': 'MinimumApprovedHoursSchedulePeriod',
            'actual': 8,
            'target': 120,
            'whenUpdated': moment('2020-01-24'),
            'unit': 'Hours',
            'schedulePeriodStage': 'SelfSchedule'
          },
          {
            'startDate': moment('2020-02-02'),
            'endDate': moment('2020-02-15'),
            'type': 'MinimumWeekendSchedulesInSchedulePeriod',
            'actual': 0,
            'target': 1,
            'whenUpdated': moment('2020-01-24'),
            'unit': 'Shifts',
            'schedulePeriodStage': 'SelfSchedule'
          }
        ]
      }],
    'pendingSchedulePeriodValidation': true
  };

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['selectSnapshot', 'dispatch', 'subscribe']);
    mockDateFormatter = jasmine.createSpyObj('DateFormatter', ['toMonthDateYear', 'toShortDate', 'toMonthDay', 'format', 'to24HourTime', 'toIsoDate', 'toShortMonth', 'toDayOfMonth']);
    mockEmployeeStaffingCommitmentSdkService = jasmine.createSpyObj('EmployeeStaffingCommitmentSdkService', ['refreshStaffingCommitmets', 'getStaffingCommitmentsForSchedulePeriod', 'subscribe']);
    component = createComponent();
    mockStore.selectSnapshot.and.returnValue(expectedEmployeeResult);
    mockStore.selectSnapshot.and.returnValue(expectedSchedulePeriods);
    component.ngOnInit();
  });
  function createComponent(): SelfScheduleCommitmentsComponent {
    const componentMock = new SelfScheduleCommitmentsComponent(mockEmployeeStaffingCommitmentSdkService, mockStore);
    return componentMock;
  }

  const events: ISchedule[] = [
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-06 10:00'),
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
      'activity': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      },
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'endDate': moment('2018-05-06 18:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-06 15:00'),
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
      'activity': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      },
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'endDate': moment('2018-05-06 23:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-07 08:00'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'Requested',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '2'
      },
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'isActivity': false,
      'endDate': moment('2018-05-07 16:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-07 15:00'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '2'
      },
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'isActivity': false,
      'endDate': moment('2018-05-07 23:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-08 08:00'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '2'
      },
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'isActivity': false,
      'endDate': moment('2018-05-08 16:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-08 15:00'),
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
      'activity': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      },
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'endDate': moment('2018-05-08 23:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-09 08:00'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '2'
      },
      'isTradeRequireEqualLength': false,
      'activity': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      },
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'endDate': moment('2018-05-09 16:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-09 15:00'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '2'
      },
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'isActivity': false,
      'endDate': moment('2018-05-09 23:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
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
      'hours': 8,
      'isScheduledHours': false,
      'startDate': moment('2018-05-09 15:00'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': {
        'id': '21',
        'code': 'test paycode',
        'name': 'test name',
        'number': '2'
      },
      'isTradeRequireEqualLength': false,
      'activity': null,
      'profile': {
        'id': '132',
        'code': 'test profile',
        'name': 'test profile name',
        'number': '8'
      },
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
      'isActivity': false,
      'endDate': moment('2018-05-10 23:00'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
    }
  ];

  const calenderWeek: IScheduleCalendarWeek[] = [
    {
      'isCurrent': true,
      'days': [{
        'etag': 'aaaa',
        'events': events
      }],
      'weeklyHours': 48,
      'numCurrentDays': 2,
      'sortDayEvents': null,
      'recalculateHours': null
    }
  ];

  const activityWithConfig: IActivityWithConfig[] = [
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '8',
      'startTime': '16:00',
      'hours': 8,
      'lunchHours': 1,
      'payCode': null,
      'start': moment('2019-07-22'),
      'end': moment('2019-07-23'),
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': true,
        'isTimeOff': false
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '8',
      'startTime': '16:00',
      'hours': 8,
      'lunchHours': 1,
      'payCode': null,
      'start': moment('2019-07-22'),
      'end': moment('2019-07-23'),
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': false,
        'isTimeOff': true
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '8',
      'startTime': '16:00',
      'hours': 8,
      'lunchHours': 1,
      'payCode': null,
      'start': moment('2019-07-22'),
      'end': moment('2019-07-23'),
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': false,
        'isTimeOff': false
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '8',
      'startTime': '16:00',
      'hours': 8,
      'lunchHours': 1,
      'payCode': null,
      'start': moment('2019-07-22'),
      'end': moment('2019-07-23'),
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': true,
        'isTimeOff': false
      }
    }
  ];

  const payCodeWithConfig: IPayCodeWithIndicatorConfiguration[] = [
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '2',
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': true,
        'isTimeOff': false
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '2',
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': false,
        'isTimeOff': true
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '2',
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': false,
        'isTimeOff': false
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '2',
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': false,
        'isTimeOff': true
      }
    },
    {
      'id': '21',
      'code': 'test paycode',
      'name': 'test name',
      'number': '2',
      'configuration': {
        'isDisplayedOnMonthlyView': true,
        'isOnCall': true,
        'isTimeOff': false
      }
    }
  ];

  calenderWeek[0].days[0].events[0].activity = activityWithConfig[0];
  calenderWeek[0].days[0].events[1].activity = activityWithConfig[1];
  calenderWeek[0].days[0].events[2].payCode = payCodeWithConfig[0];
  calenderWeek[0].days[0].events[3].payCode = payCodeWithConfig[1];
  calenderWeek[0].days[0].events[4].payCode = payCodeWithConfig[2];
  calenderWeek[0].days[0].events[5].activity = activityWithConfig[2];
  calenderWeek[0].days[0].events[6].activity = activityWithConfig[3];
  calenderWeek[0].days[0].events[6].payCode = payCodeWithConfig[3];
  calenderWeek[0].days[0].events[7].payCode = payCodeWithConfig[3];
  calenderWeek[0].days[0].events[8].payCode = payCodeWithConfig[4];

  const change = new SimpleChange([], calenderWeek, true);
  const changes: SimpleChanges = { commitments: change };

  describe('#ngOnChanges', () => {
    beforeEach(() => {
      component = createComponent();
      spyOn(component, 'getHoursAndShiftCommitmentsPerSchedulePeriod');
      component.commitments = calenderWeek;
      component.selfSchedulePeriod = expectedSchedulePeriods[1];
      component.ngOnChanges(changes);
    });

    it('should calculate totalOnCallHours correctly', () => {
      expect(component.totalOnCallHours).toEqual(24);
    });

    it('should calculate totalShifts correctly', () => {
      expect(component.totalShifts).toEqual(1);
    });

    it('should calculate totalTimeOffHours correctly', () => {
      expect(component.totalTimeOffHours).toEqual(24);
    });

    it('should call getHoursAndShiftCommitmentsPerSchedulePeriod', () => {
      expect(component.getHoursAndShiftCommitmentsPerSchedulePeriod).toHaveBeenCalled();
    });

    describe('when there is no changes', () => {
      beforeEach(() => {
        const changeWithNullPV = new SimpleChange(null, calenderWeek, true);
        const changesWithNullPV: SimpleChanges = { commitments: changeWithNullPV };
        component = createComponent();
        spyOn(component, 'getHoursAndShiftCommitmentsPerSchedulePeriod');
        component.commitments = calenderWeek;
        component.selfSchedulePeriod = expectedSchedulePeriods[1];
        component.ngOnChanges(changesWithNullPV);
      });
      it('getHoursAndShiftCommitmentsPerSchedulePeriod will not be called', () => {
        expect(component.getHoursAndShiftCommitmentsPerSchedulePeriod).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('#getHoursAndShiftCommitmentsPerSchedulePeriod', () => {
    beforeEach(() => {
      spyOn(component, 'checkRefreshedCommitment');
      component.selfSchedulePeriod = expectedSchedulePeriods[1];
      component.loggedInEmployee = employee;
      component.getHoursAndShiftCommitmentsPerSchedulePeriod();
    });
    it('should fetch actual and target hours', () => {
      expect(component.checkRefreshedCommitment).toHaveBeenCalled();
    });
  });

  describe('#when the value is not refreshed yet', () => {
    beforeEach(() => {
      jasmine.clock().install();
      component.loggedInEmployee = employee;
      component.selfSchedulePeriod = expectedSchedulePeriods[1];
      mockEmployeeStaffingCommitmentSdkService.getStaffingCommitmentsForSchedulePeriod.and.returnValue(of(staffingCommitmentResultRefreshPending));
      component.checkRefreshedCommitment();
    });
    afterEach(() => {
      jasmine.clock().uninstall();
    });
    it('all values would be zero', (done) => {
      setTimeout(() => {
        component.checkRefreshedCommitment();
      }, 500);

      jasmine.clock().tick(500);
      expect(component.targetHours).toEqual(0);
      expect(component.actualHours).toEqual(0);
      expect(component.targetShifts).toEqual(0);
      expect(component.actualShifts).toEqual(0);
      done();
    });
  });

  describe('#checkRefreshedCommitment', () => {
    beforeEach(() => {
      jasmine.clock().install();
      component.loggedInEmployee = employee;
      component.selfSchedulePeriod = expectedSchedulePeriods[1];
      mockEmployeeStaffingCommitmentSdkService.getStaffingCommitmentsForSchedulePeriod.and.returnValue(of(staffingCommitmentResult));
      component.checkRefreshedCommitment();
    });

    it('else path of check refresh commitments', (done) => {
      expect(component.targetHours).toEqual(240);
      expect(component.actualHours).toEqual(16);
      expect(component.targetShifts).toEqual(1);
      expect(component.actualShifts).toEqual(0);
      done();
    });
  });

  describe('When Subscribe of employee staffing commitment fails', () => {
    let validationError;
    beforeEach(() => {
      validationError = {
        error: {
          httpStatusCode: '400', errorCode: 'VALIDATION_MESSAGES_EXIST', message: 'validation error\' has expired.',
          content: {
            overridable: 'true',
            validationMessages: [
              { scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' },
              { scheduleId: '2', description: 'Validation Warning 2', severityLevel: 'Warning' }
            ]
          }
        }
      };
      component.loggedInEmployee = employee;
      component.selfSchedulePeriod = expectedSchedulePeriods[1];
      mockEmployeeStaffingCommitmentSdkService.getStaffingCommitmentsForSchedulePeriod.and.returnValue(throwError(validationError));
      component.checkRefreshedCommitment();
    });
    it('scheduleValidationWarnings validation Message exists', () => {
      expect(component.isRefreshPending).toEqual(false);
    });
  });

});
