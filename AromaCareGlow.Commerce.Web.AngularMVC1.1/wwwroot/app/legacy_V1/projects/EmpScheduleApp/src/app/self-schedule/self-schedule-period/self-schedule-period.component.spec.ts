
import { IPDropDown, SelfSchedulePeriodComponent } from './self-schedule-period.component';
import { EmployeeCalendarDisplayService } from 'src/app/shared/calendar/employee-calendar-display.service';
import * as moment from 'moment-timezone';
import { config, of, Subject, throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { CalendarWeek } from 'src/app/shared/schedule-calendar/models/calendar-week.model';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { IScheduleCalendarWeek } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarWeek';
import * as _ from 'lodash';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { Store } from '@ngxs/store';
import { IEmployment } from 'src/app/time-management-domain/employment';
import { SetPreferenceModal, SetSelectedActivity } from '../../store/self-schedule/actions/self-schedule.actions';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { ICoverage } from 'src/app/time-management-domain/coverage';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { ScheduleSdkService } from 'src/app/time-management-sdk/schedule-sdk/schedule-sdk.service';
import { SelfScheduleAdd } from '../../store/self-schedule/states/self-schedule-add.state';
import { SelfScheduleState } from '../../store/self-schedule/states/self-schedule.state';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { Employee, IEmployeeSchedulException } from 'src/app/time-management-domain/employee';
import { IActivity } from 'src/app/time-management-domain/activity';
import { ModalComponent } from '@wfm/modal';
import { TransactionRequestSdkService } from 'src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.service';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { ChangeDetectorRef } from '@angular/core';
import { KeyValue } from '@angular/common';
import { SignalrConfig } from 'src/app/time-management-sdk/signalr/signalr.config';

export class RetractSelfScheduleMessageServiceMock {
  public subject = new Subject<any>();

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}

describe('SelfSchedulePeriodComponent', () => {
  let component: SelfSchedulePeriodComponent;
  let mockEmployeeCalendarDisplayService: jasmine.SpyObj<EmployeeCalendarDisplayService>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockEmployeeOrganizationSdkService: jasmine.SpyObj<EmployeeOrganizationSdkService>;
  let mockOrganizationSdkService: jasmine.SpyObj<OrganizationSdkService>;
  let mockEmployeeSdkService: jasmine.SpyObj<EmployeeSdkService>;
  let mockScheduleSdkService: jasmine.SpyObj<ScheduleSdkService>;
  let mockModal: jasmine.SpyObj<ModalComponent>;
  const mockRetractSelfScheduleMessageService: RetractSelfScheduleMessageServiceMock = new RetractSelfScheduleMessageServiceMock();
  let mockTransactionRequestSdkService: jasmine.SpyObj<TransactionRequestSdkService>;
  let mockEmployeeScheduleSdkService: jasmine.SpyObj<EmployeeScheduleSdkService>;
  const mockSignalrService = jasmine.createSpyObj('SignalrService', ['subscribe', 'triggerEvent', 'onEvent']);
  let mockValidationModal: jasmine.SpyObj<ModalComponent>;
  const startDate = moment().startOf('day');
  let signalrSubject;
  let expectedSchedules: ISchedule[];
  let expectedActivity: IActivity;
  let expectedActivityStaffingPlanCoverage;
  let changeDetectorMock: jasmine.SpyObj<ChangeDetectorRef>;
  const mockSignalRConfig = new SignalrConfig();
  expectedSchedules = [
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
      'activity': {
        'id': '5',
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
      'scheduleTradeStatus': null,
      'eventType': null,
      'person': null
    }
  ];
  const endDate = moment(startDate).add(2, 'weeks').endOf('day');
  const expectedSchedulePeriods: Array<SchedulePeriod> = [
    {
      start: startDate,
      end: endDate,
      status: 'Self Scheduling',
      selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
      selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
      statusMessage: '7 days remaining',
      selfScheduleStatus: 2
    },
    {
      start: moment(startDate).add(4, 'weeks').endOf('day'),
      end: moment(startDate).add(6, 'weeks').endOf('day'),
      status: 'Self Scheduling',
      selfScheduleStart: moment(startDate).add(5, 'weeks').endOf('day'),
      selfScheduleEnd: moment(startDate).add(7, 'weeks').endOf('day'),
      statusMessage: '10 days remaining',
      selfScheduleStatus: 2
    },
    {
      start: moment(startDate).add(8, 'weeks').endOf('day'),
      end: moment(startDate).add(10, 'weeks').endOf('day'),
      status: 'Manual',
      selfScheduleStart: moment(startDate).add(11, 'weeks').endOf('day'),
      selfScheduleEnd: moment(startDate).add(13, 'weeks').endOf('day'),
      statusMessage: 'closed',
      selfScheduleStatus: 0
    }
  ];
  const mockDefaultActivity: IActivity = {
    startTime: '13:45',
    hours: 8,
    lunchHours: 1,
    payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
    start: moment('01-04-2020'),
    end: moment('01-04-2020'),
    id: '21', code: 'test code', name: 'test name', number: '16'
  };
  const activeCoverage = [
    {
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: 44, code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
    },
    {
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: 38,
        code: 'NIGHT8',
        name: 'NIGHT8',
        number: '16'
      },
      days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
    }];
  const expectedEmployeeResult = {
    id: 1245,
    code: 'ARA01',
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
  const expectedWithUnitResult = {
    id: 1245,
    code: 'ARA01',
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
        unit: {
          id: 145,
          code: 'unit 1',
          name: 'unit 1',
          number: 1111
        },
        timeZoneId: 'America/Chicago'
      },
      effectiveDate: '2008-08-10',
      expireDate: null,
      classification: 'PrimaryHome'
    }
  };

  const expectedWithNoUnitResult = {
    id: 1245,
    code: 'ARA01',
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

  const selectedActivity = {
    id: 38,
    code: 'NIGHT8',
    name: 'NIGHT8',
    number: '7',
    startTime: '23:00:00',
    hours: 8,
    lunchHours: 0,
    payCode: null
  };

  beforeEach(() => {
    mockEmployeeCalendarDisplayService = jasmine.createSpyObj('EmployeeCalendarDisplayService', ['initWeeks', 'getSchedulesByCode', 'subscribe']);
    mockStore = jasmine.createSpyObj('Store', ['selectSnapshot', 'dispatch', 'subscribe']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toMonthDateYear', 'toShortDate', 'toMonthDay', 'format', 'to24HourTime', 'toIsoDate', 'toShortMonth', 'toDayOfMonth']);
    mockEmployeeOrganizationSdkService = jasmine.createSpyObj('EmployeeOrganizationSdkService', ['getEmployeeProfiles', 'getSelfScheduleEmployeeProfiles', 'subscribe']);
    mockOrganizationSdkService = jasmine.createSpyObj('OrganizationSdkService', ['getActivityStaffingCoverage', 'getSelfScheduleEmployeeProfiles', 'subscribe']);
    mockEmployeeSdkService = jasmine.createSpyObj('EmployeeSdkService', ['getSelfSchedulePreference', 'getEmployeeScheduleExceptions', 'subscribe']);
    mockScheduleSdkService = jasmine.createSpyObj('ScheduleSdkService', ['saveSchedule']);
    mockModal = jasmine.createSpyObj('successModal', ['open', 'close']);
    mockValidationModal = jasmine.createSpyObj('validationModal', ['open', 'close']);
    mockTransactionRequestSdkService = jasmine.createSpyObj('TransactionRequestSdkService', ['retractTransactionRequest']);
    mockEmployeeScheduleSdkService = jasmine.createSpyObj('EmployeeScheduleSdkService', ['getSelfSchedulePeriodDetails']);
    changeDetectorMock = jasmine.createSpyObj('ChangeDetection', ['detectChanges']);
    component = createComponent();
    mockStore.selectSnapshot.and.callFake(x => {
      if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
        return activeCoverage;
      }
      if (x === SelfScheduleState.getEmployee) {
        return expectedEmployeeResult;
      }
      if (x === SelfScheduleState.getSelectedActivity) {
        return selectedActivity;
      }
    });
  });

  function createComponent(): SelfSchedulePeriodComponent {
    signalrSubject = new Subject();
    mockSignalrService.connectionCompleted = new Subject<boolean>();
    mockSignalrService.connectionChanged = new Subject<boolean>();
    mockSignalrService.onEvent.and.returnValue(signalrSubject);
    const comp = new SelfSchedulePeriodComponent(mockEmployeeCalendarDisplayService, mockStore, mockTranslateService, mockDateFormatter, mockEmployeeOrganizationSdkService,
      mockOrganizationSdkService, mockEmployeeSdkService, mockScheduleSdkService, mockTransactionRequestSdkService, mockRetractSelfScheduleMessageService, mockEmployeeScheduleSdkService,
      changeDetectorMock, mockSignalrService, mockSignalRConfig);
    comp.successModal = mockModal;
    comp.validationModal = mockValidationModal;
    comp.needsModal = mockModal;
    Object.defineProperty(comp, 'loggedInEmployee$', { writable: true });
    Object.defineProperty(comp, 'schedulePeriods$', { writable: true });
    Object.defineProperty(comp, 'schedulePeriod$', { writable: true });
    Object.defineProperty(comp, 'preferenceSetting$', { writable: true });
    Object.defineProperty(comp, 'selectedActivity$', { writable: true });
    Object.defineProperty(comp, 'activityStaffingPlanCoverage$', { writable: true });
    Object.defineProperty(comp, 'setDisplayShiftNeeds$', { writable: true });
    Object.defineProperty(comp, 'currentShift$', { writable: true });
    Object.defineProperty(comp, 'commitmentsRefreshStatus$', { writable: true });
    return comp;
  }
  function createCalendarWeeks() {
    let expectedSchedulesResult: ISchedule[];
    expectedSchedulesResult = [
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
        'endDate': moment('2018-05-19'),
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
    const scheduleDays1: IScheduleCalendarDay[] = [{ date: moment('2020-05-25'), etag: '', events: expectedSchedulesResult, isActive: true, isCurrentPayPeriod: true }];
    const scheduleDays2: IScheduleCalendarDay[] = [{ date: moment('2014-05-25'), etag: '', events: [], isActive: true, isCurrentPayPeriod: true }];

    const calendarWeek1 = new CalendarWeek(moment('2020-05-25'), moment('2020-05-25'), moment('2020-05-25'));
    calendarWeek1.isCurrent = true;
    calendarWeek1.days = scheduleDays1;
    calendarWeek1.numCurrentDays = 1;
    calendarWeek1.weeklyHours = 40;

    const calendarWeek2 = new CalendarWeek(moment('2020-05-25'), moment('2020-05-25'), moment('2020-05-25'));
    calendarWeek2.isCurrent = true;
    calendarWeek2.days = scheduleDays2;
    calendarWeek2.numCurrentDays = 1;
    calendarWeek2.weeklyHours = 40;

    const calendarWeeks: Array<IScheduleCalendarWeek> = [calendarWeek1, calendarWeek2];
    return calendarWeeks;
  }

  expectedActivity = {
    'code': 'DAY8',
    'start': moment('2019-09-03T07:00:00'),
    'end': moment('2019-07-23'),
    'number': null,
    'hours': 8, 'id': '36', 'lunchHours': 0,
    'name': 'DAY8', 'payCode': null, 'startTime': '07:00'
  };

  expectedActivityStaffingPlanCoverage = [
    {
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('2019-09-03T07:00:00'),
        end: moment('05-08-2019'),
        id: 21, code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-05-25', events: [{ source: 'SelfScheduled' }], need: 4, coverage: 1 }]
    },
    {
      profileGroup: null,
      activity: {
        code: 'DAY8',
        hours: 8,
        id: '36',
        lunchHours: 0,
        name: 'DAY8',
        payCode: null,
        start: moment('2019-09-03T07:00:00'),
        end: moment('05-08-2019'),
        startTime: '07:00:00',
        number: '10'
      },
      days: [{ needDate: '2020-05-25', events: [{ source: 'SelfScheduled' }], need: 8, coverage: 0 }],
      profile: { id: '90', code: 'ARA02', name: 'ARA02', number: null }
    }];

  const expectedCalendarWeeks: Array<IScheduleCalendarWeek> = createCalendarWeeks();
  const expectedCoverage: ICoverage = {
    organizationEntityId: 34,
    activityStaffingPlanCoverages: []
  };
  const expectedSelectedRecentOrgGroup = new PreferenceSetting();
  expectedSelectedRecentOrgGroup.organizationEntityId = '34';
  expectedSelectedRecentOrgGroup.profiles = [{
    id: 132,
    activities: [{ id: 21 }]
  }];
  const expectedEmployee: Employee = {
    id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
    employment: {
      profession: {},
      location: {
        facility: { id: '102' },
        timeZoneId: 'America/Chicago'
      }
    } as IEmployment
  };

  const NewEmployee: Employee = {
    id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
    employment: {
      profession: {},
      location: {
        facility: { id: '102' },
        unit: { id: '145' },
        timeZoneId: 'America/Chicago'
      }
    } as IEmployment
  };
  const mockExceptions = {
    'exceptions': [
      {
        'guid': 'thisis-a-fake-guid-122349586',
        'description': 'Overtime was exceeded for Schedule Period (Begin: Yesterday, End: The day before Tomorrow) during time frame 1hr to 3pm',
        'issueType': 'ExceedsApprovedHours',
        'startDate': '2019-08-28T12:39:18.000Z',
        'endDate': '2019-09-19T10:16:16.000Z',
        'canDismiss': true,
        'person': {
          'id': 845,
          'code': 'ARA01',
          'firstName': 'Bobby',
          'lastName': 'Jeph',
          'middleName': 'Smith',
          'jobClass': {
            'id': 769,
            'code': 'JOB166',
            'name': 'Junior Doctor',
            'number': 697
          }
        }
      }
    ]
  };
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
      component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
      component.selectedActivity$ = of(expectedActivity);
      component.activityStaffingPlanCoverage$ = of(expectedActivityStaffingPlanCoverage);
      component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
      component.setDisplayShiftNeeds$ = of(0);
      component.currentShift$ = of(null);
      component.commitmentsRefreshStatus$ = of(null);
      component.loggedInEmployee = expectedEmployee;
      component.employeeCode = 'ARA01';
      mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
      mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      mockTranslateService.instant.and.returnValue('Schedule Period: Apr 01, 2019 - May 05, 2019');
      mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(expectedSelectedRecentOrgGroup));
      mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate, accessPeriodEndDate: startDate, canSelfSchedule: true }));
      mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(of(mockExceptions));
      mockEmployeeOrganizationSdkService.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
      const defaultActivity = {
        id: '22',
        code: 'NIGHT8',
        name: 'NIGHT8',
        startTime: '23:00:00',
        hours: 8,
        lunchHours: 0,
        payCode: null
      };
      mockStore.selectSnapshot.and.callFake(x => {
        if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
          return activeCoverage;
        }
        if (x === SelfScheduleState.getEmployee) {
          return expectedWithUnitResult;
        }
        if (x === SelfScheduleState.getSchedulePeriods) {
          return expectedSchedulePeriods;
        }
        if (x === SelfScheduleState.getPreferenceSetting) {
          return expectedSelectedRecentOrgGroup;
        }
        if (x === SelfScheduleState.getSelectedActivity) {
          return defaultActivity;
        }
      });
      mockSignalrService.connectionCompleted.next(false);
      mockDateFormatter.format.and.callFake((date: moment.Moment, format: String) => {
        return date.format('YYYY-MM-DDT12:00:00');
      });
    });

    describe('When schedulePeriods are available', () => {
      beforeEach(() => {
        spyOn(component, 'loadCalenderWeeks');
        component.ngOnInit();
        component.retractSelfScheduleMessageService.sendMessage('');
      });
      it('loadCalenderWeeks should have been called', () => {
        expect(component.loadCalenderWeeks).toHaveBeenCalled();
      });
    });

    describe('When preferenceSettings are not available', () => {
      beforeEach(() => {
        component.preferenceSetting$ = of(undefined);
        component.ngOnInit();
      });
      it('preferenceActivityId is undefined', () => {
        expect(component.preferenceActivityId).toBeUndefined();
      });
    });

    describe('When preferenceSettings is available but no schedulePeriods', () => {
      beforeEach(() => {
        spyOn(component, 'loadCalenderWeeks');
        const expectedSP = [];
        mockStore.selectSnapshot.and.returnValue(expectedSP);
        component.schedulePeriods = expectedSP;

        component.ngOnInit();
      });
      it('loadCalenderWeeks should be called', () => {
        expect(component.loadCalenderWeeks).toHaveBeenCalled();
      });
    });

    describe('When selectedActivity is not available', () => {
      beforeEach(() => {
        spyOn(component, 'loadCalenderWeeks');
        component.preferenceSetting$ = of(undefined);
        component.selectedActivity$ = of(undefined);
        component.ngOnInit();
      });
      it('loadCalenderWeeks should not be called', () => {
        expect(component.loadCalenderWeeks).not.toHaveBeenCalled();
      });
    });

    describe('#register signalr if connected', () => {
      beforeEach(() => {
        expectedCalendarWeeks[0].days[0].date = moment('05-25-2020');
        component.coverage = expectedCoverage;
        component.coverage.activityStaffingPlanCoverages = [
          {
            profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
            profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
            activity: {
              startTime: '13:45',
              hours: 8,
              lunchHours: 1,
              payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
              start: moment('01-04-2020'),
              end: moment('01-04-2020'),
              id: '21', code: 'test code', name: 'test name', number: '16'
            },
            days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
          }
        ];
        mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
        mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
        component.ngOnInit();
        mockSignalrService.connectionCompleted.next(true);
        signalrSubject.next({ OrganizationEntityID: 34, TargetDate: '05-25-2020' });
        mockSignalrService.onEvent.and.returnValue(signalrSubject);
      });
      it('when register signal is called', () => {
        const signalrevent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
        const signalrstart = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].start, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const signalrend = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].end, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const args = [[34], signalrstart, signalrend];
        expect(mockSignalrService.triggerEvent).toHaveBeenCalledWith(signalrevent, args);
      });
    });

    describe('#register signalr if profile and activity not found ', () => {
      const signalrevent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
      const args = [[34], expectedSchedulePeriods[0].start, expectedSchedulePeriods[0].end];
      const signalRActivityStaffingPlanningCoverage = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '112', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('01-04-2020'),
            end: moment('01-04-2020'),
            id: '21', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
        },
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('01-04-2020'),
            end: moment('01-04-2020'),
            id: '22', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
        }
      ];
      const signalRCoverage = {
        organizationEntityId: 34,
        activityStaffingPlanCoverages: signalRActivityStaffingPlanningCoverage
      };
      beforeEach(() => {
        expectedCalendarWeeks[0].days[0].date = moment('05-25-2020');
        mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
        mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
        component.ngOnInit();
        mockSignalrService.connectionCompleted.next(true);
        component.coverage = expectedCoverage;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(signalRCoverage));
        signalrSubject.next({ OrganizationEntityID: 34, TargetDate: '05-25-2020' });
        mockSignalrService.onEvent.and.returnValue(signalrSubject);
      });
      it('when register signal is called', () => {
        const signalrEvent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
        const signalrstart = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].start, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const signalrend = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].end, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const arg = [[34], signalrstart, signalrend];
        expect(mockSignalrService.triggerEvent).toHaveBeenCalledWith(signalrEvent, arg);
      });
    });

    describe('#register signalr if profile & activity not found, need and coverage are same', () => {
      const signalrevent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
      const args = [[34], expectedSchedulePeriods[0].start, expectedSchedulePeriods[0].end];
      const signalRActivityStaffingPlanningCoverage = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '112', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('01-04-2020'),
            end: moment('01-04-2020'),
            id: '21', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 1, coverage: 1 }]
        },
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('01-04-2020'),
            end: moment('01-04-2020'),
            id: '22', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 1, coverage: 1 }]
        }
      ];
      const signalRCoverage = {
        organizationEntityId: 34,
        activityStaffingPlanCoverages: signalRActivityStaffingPlanningCoverage
      };
      beforeEach(() => {
        expectedCalendarWeeks[0].days[0].date = moment('05-25-2020');
        mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
        mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
        component.ngOnInit();
        mockSignalrService.connectionCompleted.next(true);
        component.coverage = expectedCoverage;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(signalRCoverage));
        signalrSubject.next({ OrganizationEntityID: 34, TargetDate: '05-25-2020' });
        mockSignalrService.onEvent.and.returnValue(signalrSubject);
      });
      it('when register signal is called', () => {
        const signalrEvent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
        const signalrstart = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].start, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const signalrend = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].end, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const arg = [[34], signalrstart, signalrend];
        expect(mockSignalrService.triggerEvent).toHaveBeenCalledWith(signalrEvent, arg);
      });
    });

    describe('register signalr if connected & when allAvailableShiftsFlag is 1', () => {
      const signalrevent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
      const args = [[34], expectedSchedulePeriods[0].start, expectedSchedulePeriods[0].end];
      const signalRActivityStaffingPlanningCoverage = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('01-04-2020'),
            end: moment('01-04-2020'),
            id: '44', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
        },
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('01-04-2020'),
            end: moment('01-04-2020'),
            id: '22', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
        }
      ];
      const signalRCoverage = {
        organizationEntityId: 34,
        activityStaffingPlanCoverages: signalRActivityStaffingPlanningCoverage
      };
      beforeEach(() => {
        component.setDisplayShiftNeeds$ = of(1);
        expectedCalendarWeeks[0].days[0].date = moment('2020-05-25');
        mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
        mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
        component.ngOnInit();
        mockSignalrService.connectionCompleted.next(true);
        component.coverage = expectedCoverage;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(signalRCoverage));
        signalrSubject.next({ OrganizationEntityID: 34, TargetDate: '05-25-2020' });
        mockSignalrService.onEvent.and.returnValue(signalrSubject);
      });
      it('when register signal is called', () => {
        const signalrEvent = mockSignalRConfig.REGISTER_ORG_AND_DATE;
        const signalrstart = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].start, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const signalrend = moment.tz(mockDateFormatter.format(expectedSchedulePeriods[0].end, 'YYYY-MM-DDT12:00:00'), 'America/Chicago');
        const arg = [[34], signalrstart, signalrend];
        expect(mockSignalrService.triggerEvent).toHaveBeenCalledWith(signalrEvent, arg);
      });
    });

    describe('#register signalr if not connected', () => {
      beforeEach(() => {
        component.ngOnInit();
        mockSignalrService.connectionCompleted.next(false);
      });
      it('when register signal is called', () => {
        expect(mockSignalrService.triggerEvent).not.toHaveBeenCalledWith();
      });
    });

    describe('#de register event if connected', () => {
      beforeEach(() => {
        component.ngOnDestroy();
        mockSignalrService.connectionChanged.next(true);
      });
      it('when de register signal is called', () => {
        const signalrevent = mockSignalRConfig.DEREGISTER_LISTENER;
        expect(mockSignalrService.triggerEvent).toHaveBeenCalledWith(signalrevent, []);
      });
    });

    describe('#de register event if not connected', () => {
      beforeEach(() => {
        component.ngOnDestroy();
        mockSignalrService.connectionChanged.next(false);
      });
      it('when de register signal is called', () => {
        expect(mockSignalrService.triggerEvent).not.toHaveBeenCalledWith();
      });
    });

    describe('When commitments Refresh Status is true', () => {
      beforeEach(() => {
        component.commitmentsRefreshStatus$ = of(true);
        spyOn(component, 'getEmployeeScheduleExceptions');
        component.ngOnInit();
      });

      it('should set loadingIssuesSpinner', () => {
        expect(component.loadingIssuesSpinner).toEqual(true);
      });

      it('should have been called getEmployeeScheduleExceptions', () => {
        expect(component.getEmployeeScheduleExceptions).toHaveBeenCalled();
      });
    });

    xdescribe('When commitments Refresh Status is false', () => {
      beforeEach(() => {
        component.commitmentsRefreshStatus$ = of(false);
        spyOn(component, 'getEmployeeScheduleExceptions');
        component.ngOnInit();
      });

      it('should set loadingIssuesSpinner', () => {
        expect(component.loadingIssuesSpinner).toEqual(false);
      });
    });
  });

  describe('#populateSchedulePeriodDropdown', () => {
    let expectedSelfSchedulePeriods;
    beforeEach(() => {
      mockStore.selectSnapshot.and.callFake(x => {
        if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
          return activeCoverage;
        }
        if (x === SelfScheduleState.getEmployee) {
          return expectedWithUnitResult;
        }
        if (x === SelfScheduleState.getSchedulePeriods) {
          return expectedSchedulePeriods;
        }
      });
      expectedSelfSchedulePeriods = [
        {
          start: startDate,
          end: endDate,
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
          statusMessage: '7 days remaining',
          selfScheduleStatus: 0
        },
        {
          start: moment(startDate).add(4, 'weeks').endOf('day'),
          end: moment(startDate).add(6, 'weeks').endOf('day'),
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(5, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(7, 'weeks').endOf('day'),
          statusMessage: '10 days remaining',
          selfScheduleStatus: 1
        }];
      component.populateSchedulePeriodDropdown();
    });
    it('loadCalenderWeeks should have been called', () => {
      expect(component.schedulePeriodsIndex).toEqual(0);
    });
    describe('when the selfScheduleStatus of all schedule period is either opens in future or closed', () => {
      beforeEach(() => {
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activeCoverage;
          }
          if (x === SelfScheduleState.getEmployee) {
            return expectedWithUnitResult;
          }
          if (x === SelfScheduleState.getSchedulePeriods) {
            return expectedSelfSchedulePeriods;
          }
        });
        component.populateSchedulePeriodDropdown();
      });
      it('the value of schedulePeriodsIndex changes to that value of first schedule period which is "opens in future"', () => {
        expect(component.schedulePeriodsIndex).toEqual(1);
      });
    });
    describe('when the schedulePeriodsIndex is other than 0', () => {
      beforeEach(() => {
        component.schedulePeriodsIndex = 2;
        component.populateSchedulePeriodDropdown();
      });
      it('the value of groupSelfScheduleStatus is equal to expectedSchedulePeriods[2].selfScheduleStatus which is 0', () => {
        expect(component.groupSelfScheduleStatus).toEqual(0);
      });
    });
    describe('when there is no schedule periods', () => {
      beforeEach(() => {
        const expectedSchedulePeriod = [];
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activeCoverage;
          }
          if (x === SelfScheduleState.getEmployee) {
            return expectedWithUnitResult;
          }
          if (x === SelfScheduleState.getSchedulePeriods) {
            return expectedSchedulePeriod;
          }
        });
        component.populateSchedulePeriodDropdown();
      });
      it('there is nothing to assign', () => {
        expect(component.schedulePeriods.length).toEqual(0);
      });
    });
  });

  describe('#loadCalenderWeeks', () => {
    beforeEach(() => {
      component = createComponent();
    });
    describe('When schedulePeriods has Self Scheduling', () => {
      beforeEach(() => {
        mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(throwError(mockExceptions));
        spyOn(component, 'getEmployeeScheduleExceptions');
        spyOn(component, 'updateOnlyNeeds');
        const expectedManualSchedulePeriods = [
          {
            start: startDate,
            end: endDate,
            status: 'Self Scheduling',
            selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
            statusMessage: null,
            selfScheduleStatus: null
          },
          {
            start: moment(startDate).add(4, 'weeks').endOf('day'),
            end: moment(startDate).add(6, 'weeks').endOf('day'),
            status: 'Manual',
            selfScheduleStart: moment(startDate).add(7, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(9, 'weeks').endOf('day'),
            statusMessage: null,
            selfScheduleStatus: null
          }
        ];
        component.schedulePeriods = expectedManualSchedulePeriods;
        component.loadCalenderWeeks();
      });
      it('getEmployeeScheduleExceptions should have been called', () => {
        expect(component.getEmployeeScheduleExceptions).toHaveBeenCalled();
      });
      it('updateOnlyNeeds should have been called', () => {
        expect(component.updateOnlyNeeds).toHaveBeenCalled();
      });
    });
    describe('When schedulePeriods have no Self Scheduling', () => {
      beforeEach(() => {
        const expectedManualSchedulePeriods = [
          {
            start: startDate,
            end: endDate,
            status: 'Manual',
            selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
            statusMessage: null,
            selfScheduleStatus: null
          },
          {
            start: moment(startDate).add(4, 'weeks').endOf('day'),
            end: moment(startDate).add(6, 'weeks').endOf('day'),
            status: 'Manual',
            selfScheduleStart: moment(startDate).add(7, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(9, 'weeks').endOf('day'),
            statusMessage: null,
            selfScheduleStatus: null
          }
        ];
        component.schedulePeriods = expectedManualSchedulePeriods;
        component.loadCalenderWeeks();
      });
      it('calendarWeeks should not have the data', () => {
        expect(component.calendarWeeks.length).toEqual(0);
      });
    });
  });

  describe('#getEmployeeScheduleExceptions', () => {
    beforeEach(() => {
      const schedulePeriod = {
        start: startDate,
        end: endDate,
        status: 'Self Scheduling',
        selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
        selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
        statusMessage: 'Closed',
        selfScheduleStatus: 0
      };
      component = createComponent();
      component.employeeCode = 'ARA01';
      component.schedulePeriod = schedulePeriod;
      mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(throwError(mockExceptions));
      component.getEmployeeScheduleExceptions();
    });
    it('should throw exception', () => {
      expect(component.failedToLoadData).toBeTruthy();
    });

    describe('when success', () => {
      let mockExceptionsWhenSuccess;
      beforeEach(() => {
        mockExceptionsWhenSuccess = {
          issueTypeException: { 'Employee Commitment': '{count: 6, Maximum Weekly/Bi-Weekly Approved Hours exceeded: {…}, Maximum Daily hours exceeded: {…}' },
          totalCount: 13
        };
        mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(of(mockExceptionsWhenSuccess));
        component.getEmployeeScheduleExceptions();
      });
      it('when the service returns correct value', () => {
        expect(component.employeeScheduleExceptionCount).toEqual(13);
      });
    });
  });

  describe('#selectDay', () => {
    let expectedDay: IScheduleCalendarDay;
    let expectedSchedulesWithSelfScheduling: ISchedule[];
    const scheduleResult = {} as ISchedule;
    let expectedEvents: ISchedule[];

    beforeEach(() => {
      expectedSchedulesWithSelfScheduling = [
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
          'activity': {
            'id': '5',
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
          'source': 'SelfScheduled',
          'scheduleTradeParticipant': null,
          'scheduleTradeStatus': null,
          'eventType': null,
          'person': null
        }
      ];
      expectedEvents = [{
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
        'activity': {
          'id': '5',
          'code': 'EVE8',
          'name': 'EVE8',
          'number': '8',
          'startTime': '12:00:00',
          'hours': 8,
          'lunchHours': 1,
          'payCode': null,
          'start': moment('2019-07-22'),
          'end': moment('2019-07-23')
        },
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
        'scheduleTradeStatus': null,
        'isTradeRequireEqualLength': true
      }];
      expectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedEvents, 'isCurrentPayPeriod': true, 'etag': 'test etag' };
    });

    describe('#updateNeeds ', () => {
      beforeEach(() => {
        component.employeeCode = 'ARA01';
        mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(expectedCalendarWeeks);
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
        mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
        mockTranslateService.instant.and.returnValue('Schedule Period: Aug 25, 2019 - Sep 14, 2019');
        mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(expectedSelectedRecentOrgGroup));
        component.loggedInEmployee = expectedEmployee;
        component.schedulePeriod = {
          start: startDate,
          end: endDate,
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
          statusMessage: null,
          selfScheduleStatus: null
        };
        expectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag1', 'needCount': 5 };
        component.startDate = moment('05-08-2019');
        component.coverage = expectedCoverage;
        component.coverage.activityStaffingPlanCoverages = [
          {
            profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
            profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
            activity: {
              startTime: '13:45',
              hours: 8,
              lunchHours: 1,
              payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
              start: moment('05-08-2019'),
              end: moment('05-08-2019'),
              id: '38', code: 'NIGHT8', name: 'NIGHT8', number: '16'
            },
            days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
          }
        ];
        mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
        component.preferenceProfileId = 76;
        component.preferenceActivityId = [44];
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activeCoverage;
          }
          if (x === SelfScheduleState.getEmployee) {
            return expectedWithUnitResult;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
        });
        spyOn(component, 'saveActivity');
      });
      describe('When needs are available ', () => {
        beforeEach(() => {
          component.selectDay(expectedDay);
        });
        it('should be able to add shifts successfully', () => {
          expect(component.saveActivity).toHaveBeenCalled();
        });

      });
      describe('When needs are not available', () => {
        beforeEach(() => {
          component.coverage.activityStaffingPlanCoverages = [
            {
              profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
              profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
              activity: {
                startTime: '13:45',
                hours: 8,
                lunchHours: 1,
                payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                start: moment('05-08-2019'),
                end: moment('05-08-2019'),
                id: '38', code: 'NIGHT8', name: 'NIGHT8', number: '16'
              },
              days: [{ needDate: '05-08-2019', need: 1, coverage: 1 }]
            }
          ];
          component.selectDay(expectedDay);
        });
        it('when needed value is false, isLoading is false as well', () => {
          expect(component.isLoading).toEqual(true);
        });
      });
      describe('When schedule periods are not available ', () => {
        beforeEach(() => {
          component.schedulePeriod = null;
          component.selectDay(expectedDay);
        });
        it('should give a validation error', () => {
          expect(component.saveActivity).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('When selectday is false', () => {
      beforeEach(() => {
        component.selectDay(expectedDay, false);
      });
      it('Selected day will not have value', () => {
        expect(component.day).toBeUndefined();
      });
    });

    describe('When day is null', () => {
      beforeEach(() => {
        component = createComponent();
        component.selectDay(null);
      });
      it('Selected day will not have value', () => {
        expect(component.selectedDay).toEqual(null);
      });
    });

    describe('When day is null and flag is false', () => {
      beforeEach(() => {
        component = createComponent();
        component.selectDay(expectedDay, false);
      });
      it('Selected day will not have value', () => {
        expect(component.selectedDay).toEqual(expectedDay);
      });
    });

    describe('When day is not null & does not have selfScheduled event', () => {
      const dayEvent = [{
        'employment': null,
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
        'activity': {
          'id': '5',
          'code': 'NIGHT8',
          'name': 'NIGHT8',
          'number': '8',
          'startTime': '23:00:00',
          'hours': 8,
          'lunchHours': 1,
          'payCode': null,
          'start': moment('2019-07-22'),
          'end': moment('2019-07-23')
        },
        'profile': null,
        'position': null,
        'employee': null,
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
        'source': 'SelfSchedule',
        'scheduleTradeParticipant': null,
        'eventType': null,
        'person': null,
        'scheduleTradeStatus': null,
        'isTradeRequireEqualLength': true
      }];
      beforeEach(() => {
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activeCoverage;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
          mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
        });
        component = createComponent();
        component.loggedInEmployee = {
          id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
          employment: {
            profession: {},
            location: {
              facility: { id: '102' },
              timeZoneId: 'CST'
            }
          } as IEmployment
        };
        component.preferenceProfileId = 76;
        expectedDay.events = dayEvent;
        spyOn(component, 'saveActivity');
        component.selectDay(expectedDay, true);
      });
      it('should be able to add shifts successfully', () => {
        expect(component.saveActivity).toHaveBeenCalled();
      });
    });

    describe('When day is not null, does not have selfScheduled event & unit has a value', () => {
      const dayEvent = [{
        'employment': null,
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
        'activity': {
          'id': '5',
          'code': 'NIGHT8',
          'name': 'NIGHT8',
          'number': '8',
          'startTime': '23:00:00',
          'hours': 8,
          'lunchHours': 1,
          'payCode': null,
          'start': moment('2019-07-22'),
          'end': moment('2019-07-23')
        },
        'profile': null,
        'position': null,
        'employee': null,
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
        'source': 'SelfSchedule',
        'scheduleTradeParticipant': null,
        'eventType': null,
        'person': null,
        'scheduleTradeStatus': null,
        'isTradeRequireEqualLength': true
      }];
      beforeEach(() => {
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activeCoverage;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
          mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
        });
        component = createComponent();
        component.loggedInEmployee = {
          id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
          employment: {
            profession: {},
            location: {
              facility: { id: '102' },
              unit: { id: '52' },
              timeZoneId: 'CST'
            }
          } as IEmployment
        };
        component.preferenceProfileId = 76;
        expectedDay.events = dayEvent;
        spyOn(component, 'saveActivity');
        component.selectDay(expectedDay, true);
      });
      it('should call SelfSchedule event', () => {
        expect(component.selectedDay.events[0].source).toEqual('SelfSchedule');
      });
    });

    describe('When day is not null & has selfScheduled event', () => {
      const dayEvent = [{
        'employment': null,
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
        'activity': {
          'id': '38',
          'code': 'NIGHT8',
          'name': 'NIGHT8',
          'number': '8',
          'startTime': '23:00:00',
          'hours': 8,
          'lunchHours': 1,
          'payCode': null,
          'start': moment('2019-07-22'),
          'end': moment('2019-07-23')
        },
        'profile': null,
        'position': null,
        'employee': null,
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
        'source': 'SelfSchedule',
        'scheduleTradeParticipant': null,
        'eventType': null,
        'person': null,
        'scheduleTradeStatus': null,
        'isTradeRequireEqualLength': true
      }];
      beforeEach(() => {
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activeCoverage;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
          mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
          spyOn(component, 'saveActivity');
        });
        component = createComponent();
        component.loggedInEmployee = {
          id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
          employment: {
            profession: {},
            location: {
              facility: { id: '102' },
              timeZoneId: 'CST'
            }
          } as IEmployment
        };
        component.preferenceProfileId = 76;
        expectedDay.events = dayEvent;
        component.selectDay(expectedDay, true);
      });
      it('should call SelfSchedule event', () => {
        expect(component.selectedDay.events[0].source).toEqual('SelfSchedule');
      });
    });
  });

  describe('#openApprovalModal', () => {
    beforeEach(() => {
      mockValidationModal.open.and.callFake(() => { });
      component.openApprovalModal();
    });
    it('first selfschedule activity added', () => {
      expect(component.validationModal.open).toHaveBeenCalled();
    });
  });

  describe('#saveActivity', () => {
    const scheduleResult = {} as ISchedule;

    beforeEach(() => {
      mockModal.open.and.callFake(() => { });
      mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
      component.isSelfScheduleExist = false;
      const expectedSaveSchedulePeriods = [
        {
          start: startDate,
          end: endDate,
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
          statusMessage: null,
          selfScheduleStatus: null
        }
      ];
      component.schedulePeriod = expectedSaveSchedulePeriods[0];
      spyOn(component, 'getCoverageSchedules');
      component.saveActivity();
    });
    describe('When self schedule is exit', () => {
      let expectedDay: IScheduleCalendarDay;
      let expectedSchedulesWithSelfScheduling: ISchedule[];
      beforeEach(() => {
        expectedSchedulesWithSelfScheduling = [
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
            'activity': {
              'id': '5',
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
            'source': 'SelfScheduled',
            'scheduleTradeParticipant': null,
            'scheduleTradeStatus': null,
            'eventType': null,
            'person': null
          }
        ];
        expectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedSchedulesWithSelfScheduling, 'isCurrentPayPeriod': true, 'etag': 'test etag' };
        mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
        component.isSelfScheduleExist = true;
        component.selectedDay = expectedDay;
        component.saveActivity();
      });
      it('self schedule is true', () => {
        expect(component.selectedDay.events[0].source).toEqual('SelfScheduled');
      });

      describe('When saveActivity throws error', () => {
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
          mockScheduleSdkService.saveSchedule.and.returnValue(throwError(validationError));
          mockValidationModal.open.and.callFake(() => { });
          component.validationModal = mockValidationModal;
          component.saveActivity();
        });
        it('scheduleValidationWarnings validation Message exists', () => {
          expect(component.isLoading).toEqual(false);
          expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(2);
        });

        describe('When saveActivity throws error', () => {
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
            mockScheduleSdkService.saveSchedule.and.returnValue(throwError(validationError));
            mockValidationModal.open.and.callFake(() => { });
            component.validationModal = mockValidationModal;
            component.saveActivity();
          });
          it('scheduleValidationWarnings validation Message exists', () => {
            expect(component.isLoading).toEqual(false);
            expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(2);
          });

        describe('when the error is other than Validation', () => {
          beforeEach(() => {
            const httpErrorWithAuthentication = {
              error: {
                httpStatusCode: 'Unauthorized', errorCode: 'USER_SESSION_EXPIRED', message: 'The user session for \'API Support apiadmin\' has expired.',
                content: {
                  overridable: 'true',
                  validationMessages: [
                    { scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' }
                  ]
                }
              }
            };
            mockScheduleSdkService.saveSchedule.and.returnValue(throwError(httpErrorWithAuthentication));
            component.saveActivity(false);
          });
          it('scheduleValidationWarnings should be defined with the response error', () => {
            expect(component.isLoading).toEqual(false);
            expect(component.scheduleValidationWarnings).toBeDefined();
          });
        });

        describe('when the error is Insufficient needs', () => {
          beforeEach(() => {
            const activity = {
              startTime: '13:45',
              hours: 8,
              lunchHours: 1,
              payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
              start: '01-04-2020',
              end: '01-04-2020',
              id: '21', code: 'test code', name: 'test name', number: '16'
            };
            const profile = { id: '132', code: 'test code', name: 'test name', number: '4' };   // profile id
            const formModel = {
              startDate:  moment('2018-05-06'),  // selected date
              hasStartTime: true, // activty start time
              hours: 8, // acitivity hours
              amount: 0,
              payCode: null,
              jobClass: expectedEmployee.employment.profession.jobClass,
              facility: expectedEmployee.employment.location.facility,
              department: expectedEmployee.employment.location.department,
              unit: expectedEmployee.employment.location.unit ? expectedEmployee.employment.location.unit : null,
              lunchHours: activity.lunchHours, // activity lunch hours
              activity:  activity,
              profile: profile,
              position: expectedEmployee.employment.profession.position,
              etag: expectedDay.etag,
              source: 9
            };
            const newerror = {
                status: 400,
              error: {
                httpStatusCode: 'BadRequest', errorCode: 'INSUFFICIENT_NEEDS', message: 'The needs are insufficient.',
              },
              content: {
                overridable: 'true',
                validationMessages: [
                  { scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' }
                ]
              }
            };

            mockScheduleSdkService.saveSchedule.and.returnValue(throwError(newerror));
            mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
            mockModal.open.and.callFake(() => { });
            component = createComponent();
            component.formModel = formModel;
            component.coverage = expectedCoverage;
            component.selectDay(expectedDay);
            component.coverage.activityStaffingPlanCoverages = [
              {
                profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
                profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
                activity: {
                  startTime: '13:45',
                  hours: 8,
                  lunchHours: 1,
                  payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                  start: moment('01-04-2020'),
                  end: moment('01-04-2020'),
                  id: '21', code: 'test code', name: 'test name', number: '16'
                },
                days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
              }
            ];
            component.saveActivity(false);
          });
          it('scheduleValidationWarnings should be defined with the response error', () => {
            expect(component.isLoading).toEqual(false);
            expect(component.needsModal.open).toHaveBeenCalled();
          });
        });
      });
    });
  });

    describe('override validation is true', () => {
      beforeEach(() => {
        (component as any).saveActivity(true);
      });
      it('on Success spinner is true', () => {
        expect(component.isLoading).toEqual(false);
      });
    });
  });

  describe('#setTime', () => {
    let expectedDay: IScheduleCalendarDay;
    beforeEach(() => {
      expectedDay = { 'date': moment('04-23-2018'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag' };
      expectedDay.date.hour(9);
      expectedDay.date.minute(33);
      component.selectedDay = expectedDay;
      component.loggedInEmployee = expectedEmployee;
    });

    describe('when the input has a colon and is four characters', () => {
      it('should set the correct time', () => {
        component.setTime('16:20');
        expect(component.startDate.hour()).toBe(16);
        expect(component.startDate.minute()).toBe(20);
      });
    });

    describe('when the input does not have a colon and is two characters', () => {
      it('should set the correct time', () => {
        component.setTime('08');
        expect(component.startDate.hour()).toBe(8);
        expect(component.startDate.minute()).toBe(0);
      });
    });

    describe('when the input does not have a colon and is three characters', () => {
      it('should set the correct time', () => {
        component.setTime('820');
        expect(component.startDate.hour()).toBe(8);
        expect(component.startDate.minute()).toBe(20);
      });
    });

    describe('when the input is null', () => {
      it('should not change the time', () => {
        component.setTime(null);
        expect(component.startDate).toEqual(undefined);
      });
    });
  });

  describe('#close', () => {
    beforeEach(() => {
      component.close();
    });
    it('ModalComponent Close should have been called', () => {
      expect(component.successModal.close).toHaveBeenCalled();
      expect(component.needsModal.close).toHaveBeenCalled();
    });
  });
  describe('#showHideExceptions', () => {
    describe('When exception tab has been clicked', () => {
      beforeEach(() => {
        component = createComponent();
        component.showHideExceptions();
      });
      it('should call the showHideExceptions function', () => {
        expect(component.toggleExceptionFlag).toBe(true);
      });
    });
  });

  describe('#getIssueTypeCount', () => {
    describe('When issue type rendered along with count', () => {
      const issueType = {
        key: 'Employee Commitment',
        value: {
          count: 3
        }
      };
      beforeEach(() => {
        component = createComponent();
      });
      it('should return key and value', () => {
        expect(component.getIssueTypeCount(issueType)).toEqual(`Employee Commitment (3)`);
      });
    });
  });
  describe('#getFormattedMonths', () => {
    describe('When month rendered along with date', () => {
      const employeeException: IEmployeeSchedulException[] = [{
        guid: 'thisis-a-fake-guid-122349599',
        description: 'Weekend was exceeded overtime for Schedule Period',
        issueType: 'Weekends',
        startDate: '2019-07-29',
        endDate: '2019-07-29',
        canDismiss: true,
        person: {
          id: 6924,
          code: 'blue01',
          firstName: 'Boberson',
          lastName: 'Jeph',
          jobClass: {
            id: '437',
            code: 'JOB107',
            name: 'Lab tech',
            number: '749',
            status: ''
          }
        }
      },
      {
        guid: 'thisis-a-fake-guid-122349599',
        description: 'Weekend was exceeded overtime for Schedule Period',
        issueType: 'Weekends',
        startDate: '2019-07-29',
        endDate: '2019-08-15',
        canDismiss: true,
        person: {
          id: 6924,
          code: 'blue01',
          firstName: 'Boberson',
          lastName: 'Jeph',
          jobClass: {
            id: '437',
            code: 'JOB107',
            name: 'Lab tech',
            number: '749',
            status: ''
          }
        }
      },
      {
        guid: 'thisis-a-fake-guid-122349599',
        description: 'Weekend was exceeded overtime for Schedule Period',
        issueType: 'Weekends',
        startDate: '2019-07-29',
        endDate: '2019-07-29',
        canDismiss: true,
        person: {
          id: 6924,
          code: 'blue01',
          firstName: 'Boberson',
          lastName: 'Jeph',
          jobClass: {
            id: '437',
            code: 'JOB107',
            name: 'Lab tech',
            number: '749',
            status: ''
          }
        }
      },
      {
        guid: 'thisis-a-fake-guid-122349599',
        description: 'Weekend was exceeded overtime for Schedule Period',
        issueType: 'Weekends',
        startDate: '2019-07-29',
        endDate: '2019-07-29',
        canDismiss: true,
        person: {
          id: 6924,
          code: 'blue01',
          firstName: 'Boberson',
          lastName: 'Jeph',
          jobClass: {
            id: '437',
            code: 'JOB107',
            name: 'Lab tech',
            number: '749',
            status: ''
          }
        }
      }
      ];

      beforeEach(() => {
        component = createComponent();
      });
      it('should contain - character', () => {
        expect(component.getFormattedMonths('Jul', employeeException)).toContain('-');
      });
      it('should call with count as key', () => {
        expect(component.getFormattedMonths('count', employeeException)).toEqual('');
      });
    });
    describe('when getFormattedMonths have been called', () => {
      const employeeException: IEmployeeSchedulException[] = [{
        guid: 'thisis-a-fake-guid-122349599',
        description: 'Weekend was exceeded overtime for Schedule Period',
        issueType: 'Weekends',
        startDate: '2019-07-29',
        endDate: '2019-07-29',
        canDismiss: true,
        person: {
          id: 6924,
          code: 'blue01',
          firstName: 'Boberson',
          lastName: 'Jeph',
          jobClass: {
            id: '437',
            code: 'JOB107',
            name: 'Lab tech',
            number: '749',
            status: ''
          }
        }
      }
      ];

      beforeEach(() => {
        component = createComponent();
        spyOn(component, 'getFormattedMonths');
        component.getFormattedMonths('Jul', employeeException);
      });
      it('getFormatted should have been called', () => {
        expect(component.getFormattedMonths).toHaveBeenCalledWith('Jul', employeeException);
      });
    });
    describe('isNewLineRequired', () => {
      describe('When issue type rendered along with count', () => {
        const value = {
          'Aug': [],
          'Sep': [],
          'count': 0
        };
        beforeEach(() => {
          component = createComponent();
        });
        it('should return true for Aug Key', () => {
          expect(component.isNewLineRequired('Aug', value, 0)).toBeTruthy();
        });
        it('should return false for count Key', () => {
          expect(component.isNewLineRequired('count', value, 2)).toBeFalsy();
        });
        it('should return false for Sep Key', () => {
          expect(component.isNewLineRequired('Sep', value, 1)).toBeFalsy();
        });
      });
    });
  });
  describe('#addDateRanges', () => {
    const dateRange = ['Nov 17 - Nov 23'];
    const previousString = 'Nov 17 - Nov 23';
    const startDateMonthDay = 'Nov 24';
    const endDateMonthDay = 'Nov 27';

    beforeEach(() => {
      component = createComponent();
      component.addDateRanges(dateRange, previousString, startDateMonthDay, endDateMonthDay);
    });
    it('dateRange array length should be equal to 2', () => {
      expect(dateRange.length).toEqual(2);
    });
    describe('when previousString has no value', () => {
      beforeEach(() => {
        const ExpectedPreviousString = '';
        component.addDateRanges(dateRange, ExpectedPreviousString, startDateMonthDay, endDateMonthDay);
      });
      it('dateRange array length should be equal to 4', () => {
        expect(dateRange.length).toEqual(4);
      });
    });
  });
  describe('#addDates', () => {
    const dateRange = ['Nov 17 - Nov 23'];
    const previousString = 'Nov 17 - Nov 23';
    const startDateShortMonth = 'Nov';
    const startDateDayOfMonth = '24';

    beforeEach(() => {
      component = createComponent();
    });
    it('should return Nov 24 as formatted string', () => {
      expect(component.addDates(dateRange, previousString, startDateShortMonth, startDateDayOfMonth, 1)).toEqual('Nov 24');
    });
  });
  describe('#defaultOrder', () => {
    const arg1: KeyValue<string, []> = { key: 'Mar', value: [] };
    const arg2: KeyValue<string, []> = { key: 'Apr', value: [] };
    beforeEach(() => {
      component = createComponent();
    });
    it('should return defaultOrder zero', () => {
      expect(component.defaultOrder(arg1, arg2)).toBe(0);
    });

  });
  describe('#addShift', () => {
    let expectedDay: IScheduleCalendarDay;
    let expectedSchedulesWithSelfScheduling: ISchedule[];
    const scheduleResult = {} as ISchedule;

    beforeEach(() => {
      expectedSchedulesWithSelfScheduling = [
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
          'activity': {
            'id': '5',
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
          'source': 'SelfScheduled',
          'scheduleTradeParticipant': null,
          'scheduleTradeStatus': null,
          'eventType': null,
          'person': null
        }
      ];
      expectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag' };
    });

    describe('#updateNeeds ', () => {
      describe('When needs are available ', () => {
        beforeEach(() => {
          expectedSchedules = [
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
              'activity': {
                'id': '5',
                'code': 'test activitycode',
                'name': 'test name',
                'number': '8',
                'startTime': '16:00',
                'hours': 8,
                'lunchHours': 1,
                'payCode': null,
                'start': moment('2019-07-22'),
                'end': moment('2019-07-23')
              },
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
              'scheduleTradeStatus': null,
              'eventType': null,
              'person': null
            }
          ];
          component.employeeCode = 'ARA01';
          mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(expectedCalendarWeeks);
          mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
          mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
          mockTranslateService.instant.and.returnValue('Schedule Period: Aug 25, 2019 - Sep 14, 2019');
          mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(expectedSelectedRecentOrgGroup));
          component.schedulePeriod = {
            start: startDate,
            end: endDate,
            status: 'Self Scheduling',
            selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
            statusMessage: null,
            selfScheduleStatus: null
          };
          expectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag1', 'needCount': 5 };
          component.startDate = moment('05-08-2019');
          component.loggedInEmployee = NewEmployee;
          component.coverage = expectedCoverage;
          component.coverage.activityStaffingPlanCoverages = [
            {
              profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
              profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
              activity: {
                startTime: '13:45',
                hours: 8,
                lunchHours: 1,
                payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                start: moment('05-08-2019'),
                end: moment('05-08-2019'),
                id: '21', code: 'test code', name: 'test name', number: '16'
              },
              days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
            }
          ];
          expectedActivity = {
            'code': 'DAY8',
            'start': moment('2019-09-03T07:00:00'),
            'end': moment('2019-07-23'),
            'number': null,
            'hours': 8, 'id': '36', 'lunchHours': 0,
            'name': 'DAY8', 'payCode': null, 'startTime': '07:00'
          };
          const currentShift = {
            'shift': '04:00-8',
            'currentDate': moment('2019-09-03T07:00:00'),
            'expectedActivity': {
              'code': 'DAY8',
              'start': moment('2019-09-03T07:00:00'),
              'end': moment('2019-07-23'),
              'number': null,
              'hours': 8, 'id': '36', 'lunchHours': 0,
              'name': 'DAY8', 'payCode': null, 'startTime': '07:00'
            },
            'profile': {
              'code': 'ARA01',
              'id': '89',
              'name': 'ARA01',
              'number': null
            }
          };
          mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
          component.preferenceProfileId = 76;
          component.preferenceActivityId = [44];
          component.selectedDay = expectedDay;
          component.isLoading = true;
          mockStore.selectSnapshot.and.callFake(x => {
            if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
              return activeCoverage;
            }
            if (x === SelfScheduleState.getEmployee) {
              return expectedWithUnitResult;
            }
          });
          spyOn(component, 'saveActivity');
          component.addShift(currentShift);
        });
        it('Should be able to add currentshift successfully', () => {
          expect(component.saveActivity).toHaveBeenCalled();
        });
      });
      describe('when no unit is available', () => {
        beforeEach(() => {
          component.loggedInEmployee = expectedEmployee;
          expectedSchedules = [
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
              'activity': {
                'id': '5',
                'code': 'test activitycode',
                'name': 'test name',
                'number': '8',
                'startTime': '16:00',
                'hours': 8,
                'lunchHours': 1,
                'payCode': null,
                'start': moment('2019-07-22'),
                'end': moment('2019-07-23')
              },
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
              'scheduleTradeStatus': null,
              'eventType': null,
              'person': null
            }
          ];
          component.employeeCode = 'ARA01';
          mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(expectedCalendarWeeks);
          mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
          mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
          mockTranslateService.instant.and.returnValue('Schedule Period: Aug 25, 2019 - Sep 14, 2019');
          mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(expectedSelectedRecentOrgGroup));
          component.schedulePeriod = {
            start: startDate,
            end: endDate,
            status: 'Self Scheduling',
            selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
            statusMessage: null,
            selfScheduleStatus: null
          };
          expectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag1', 'needCount': 5 };
          component.startDate = moment('05-08-2019');
          component.coverage = expectedCoverage;
          component.coverage.activityStaffingPlanCoverages = [
            {
              profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
              profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
              activity: {
                startTime: '13:45',
                hours: 8,
                lunchHours: 1,
                payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                start: moment('05-08-2019'),
                end: moment('05-08-2019'),
                id: '21', code: 'test code', name: 'test name', number: '16'
              },
              days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
            }
          ];
          expectedActivity = {
            'code': 'DAY8',
            'start': moment('2019-09-03T07:00:00'),
            'end': moment('2019-07-23'),
            'number': null,
            'hours': 8, 'id': '36', 'lunchHours': 0,
            'name': 'DAY8', 'payCode': null, 'startTime': '07:00'
          };
          const currentShift = {
            'shift': '04:00-8',
            'currentDate': moment('2019-09-03T07:00:00'),
            'expectedActivity': {
              'code': 'DAY8',
              'start': moment('2019-09-03T07:00:00'),
              'end': moment('2019-07-23'),
              'number': null,
              'hours': 8, 'id': '36', 'lunchHours': 0,
              'name': 'DAY8', 'payCode': null, 'startTime': '07:00'
            },
            'profile': {
              'code': 'ARA01',
              'id': '89',
              'name': 'ARA01',
              'number': null
            }
          };
          mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
          component.preferenceProfileId = 76;
          component.preferenceActivityId = [44];
          component.selectedDay = expectedDay;
          component.isLoading = true;
          mockStore.selectSnapshot.and.callFake(x => {
            if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
              return activeCoverage;
            }
            if (x === SelfScheduleState.getEmployee) {
              return expectedWithUnitResult;
            }
          });
          spyOn(component, 'saveActivity');
          component.addShift(currentShift);
        });
        it('should be able to add currentshift successfully', () => {
          expect(component.saveActivity).toHaveBeenCalled();
        });
      });
    });

    describe('When day is not null', () => {
      beforeEach(() => {
        mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
        component.preferenceProfileId = 76;
        component.preferenceActivityId = [44];
        component.selectedDay = expectedDay;
        component.addShift(expectedActivity);
      });

      it('Selected day will not get change', () => {
        expect(component.selectedDay.date).toEqual(moment('2019-07-22'));
      });
    });
  });

  describe('#onChangeSchedulePeriod', () => {
    const dropDownEvent: IPDropDown = {
      'label': 'Jan 12 - Feb 21',
      'value': 1,
      'selfScheduleStatus': 2
    };
    beforeEach(() => {
      const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
      mockSignalrService.connectionChanged.next(true);
      const signalrevent = mockSignalRConfig.DEREGISTER_LISTENER;
      mockSignalrService.connectionCompleted.next(false);
      mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
      mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(expectedSelectedRecentOrgGroup));
      mockEmployeeOrganizationSdkService.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
      component.schedulePeriods = expectedSchedulePeriods;
      spyOn(component, 'getCoverageSchedulesAndQualifiedProfiles');
      component.onChangeSchedulePeriod(dropDownEvent);
    });
    it('should have been called loadCalenderWeeks', () => {
      expect(component.getCoverageSchedulesAndQualifiedProfiles).toHaveBeenCalled();
    });
    it('should set schedule period index', () => {
      expect(component.schedulePeriodsIndex).toBe(dropDownEvent.value);
    });

    describe('when the schedulePEriod has Schedule Period which is closed for SelfScheduling', () => {
      beforeEach(() => {
        const expectedClosedSchedulePeriods = [
          {
            start: startDate,
            end: endDate,
            status: 'Self Scheduling',
            selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
            statusMessage: 'Closed',
            selfScheduleStatus: 0
          },
          {
            start: moment(startDate).add(4, 'weeks').endOf('day'),
            end: moment(startDate).add(6, 'weeks').endOf('day'),
            status: 'Self Scheduling',
            selfScheduleStart: moment(startDate).add(5, 'weeks').endOf('day'),
            selfScheduleEnd: moment(startDate).add(7, 'weeks').endOf('day'),
            statusMessage: 'Closed',
            selfScheduleStatus: 0
          }
        ];
        component.schedulePeriods = expectedClosedSchedulePeriods;
        spyOn(component.IsSelectedSelfScheduleExits, 'emit');
        component.onChangeSchedulePeriod(dropDownEvent);
      });
      it('emits false', () => {
        expect(component.IsSelectedSelfScheduleExits.emit).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('#updateOnlyNeeds', () => {
    beforeEach(() => {
      const calendarweeks: Array<IScheduleCalendarWeek> = createCalendarWeeks();
      component.calendarWeeks = calendarweeks;
      expectedSelectedRecentOrgGroup.profiles = [{
        id: 132,
        activities: [{ id: 21 }, { id: 22 }]
      }];
      const defaultActivity = {
        id: '21',
        code: 'NIGHT8',
        name: 'NIGHT8',
        startTime: '23:00:00',
        hours: 8,
        lunchHours: 0,
        payCode: null
      };
      component.coverage = expectedCoverage;
      component.coverage.activityStaffingPlanCoverages = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('05-08-2019'),
            end: moment('05-08-2019'),
            id: '21', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }, { needDate: '2014-05-25', need: 4, coverage: 1 }]
        },
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('05-08-2019'),
            end: moment('05-08-2019'),
            id: '22', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }, { needDate: '2014-05-25', need: 5, coverage: 1 }]
        }
      ];
      mockStore.selectSnapshot.and.callFake(x => {
        if (x === SelfScheduleState.getPreferenceSetting) {
          return expectedSelectedRecentOrgGroup;
        }
        if (x === SelfScheduleState.getSelectedActivity) {
          return defaultActivity;
        }
      });
    });

    describe('when allPreferred Shifts Flag is set', () => {
      beforeEach(() => {
        component.allAvailableShiftsFlag = 1;
        component.updateOnlyNeeds();
      });
      it('to sum the needs of all preferred shifts', () => {
        expect(component.calendarWeeks[0].days[0].needCount).toBe(6);
      });
    });

    describe('when default shift flag is set', () => {
      let expectedDay: IScheduleCalendarDay;
      beforeEach(() => {
        expectedDay = { 'date': moment('2020-05-25'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag' };
        component.allAvailableShiftsFlag = 0;
        component.selectedDay = expectedDay;
        component.schedulePeriod = {
          start: startDate,
          end: endDate,
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
          statusMessage: 'Closed',
          selfScheduleStatus: 0
        };
        component.updateOnlyNeeds();
      });
      it('to display the needs of defaultshift', () => {
        expect(component.calendarWeeks[0].days[0].needCount).toBe(3);
      });

      describe('when need and coverage are equal', () => {
        beforeEach(() => {
          component.coverage.activityStaffingPlanCoverages = [
            {
              profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
              profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
              activity: {
                startTime: '13:45',
                hours: 8,
                lunchHours: 1,
                payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                start: moment('05-08-2019'),
                end: moment('05-08-2019'),
                id: '21', code: 'test code', name: 'test name', number: '16'
              },
              days: [{ needDate: '2020-05-25', need: 1, coverage: 1 }, { needDate: '2014-05-25', need: 4, coverage: 1 }]
            }];
          component.updateOnlyNeeds();
        });
        it('the needcount will be 0', () => {
          expect(component.calendarWeeks[0].days[0].needCount).toBe(0);
        });
      });
    });

    describe('when coverage is not valid', () => {
      beforeEach(() => {
        component.coverage = undefined;
        component.schedulePeriod = {
          start: startDate,
          end: endDate,
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
          statusMessage: 'Closed',
          selfScheduleStatus: 0
        };
        component.allAvailableShiftsFlag = 0;
        component.updateOnlyNeeds();
      });
      it('NeedCount will not have data', () => {
        expect(component.calendarWeeks[0].days[0].needCount).toBe(0);
      });
    });

    describe('when coverage is not valid and scheduleCalendarDay date is same as schedulePeriod start date', () => {
      beforeEach(() => {
        component.coverage = undefined;
        component.schedulePeriod = {
          start: moment('2020-05-25'),
          end: endDate,
          status: 'Self Scheduling',
          selfScheduleStart: moment(startDate).add(3, 'weeks').endOf('day'),
          selfScheduleEnd: moment(startDate).add(5, 'weeks').endOf('day'),
          statusMessage: 'Closed',
          selfScheduleStatus: 0
        };
        component.allAvailableShiftsFlag = 0;
        component.updateOnlyNeeds();
      });
      it('NeedCount will not have data', () => {
        expect(component.calendarWeeks[0].days[0].needCount).toBe(0);
      });

    });

    describe('When coverage and calendar weeks do not match', () => {
      beforeEach(() => {
        component.coverage.activityStaffingPlanCoverages.forEach((coverage) => {
          coverage.days.forEach(day => day.needDate = '2020-05-26');
        });
        component.updateOnlyNeeds();
      });
      it('NeedCount to be zero', () => {
        expect(component.calendarWeeks[0].days[0].needCount).toBe(0);
      });
    });
  });

  describe('#isPreferenceMatched', () => {
    let result;
    let defaultActivity;
    beforeEach(() => {
      expectedSelectedRecentOrgGroup.profiles = [{
        id: 76,
        activities: [{ id: 21 }, { id: 38 }]
      }];
      defaultActivity = {
        id: '21',
        code: 'NIGHT8',
        name: 'NIGHT8',
        startTime: '23:00:00',
        hours: 8,
        lunchHours: 0,
        payCode: null
      };
      mockStore.selectSnapshot.and.callFake(x => {
        if (x === SelfScheduleState.getPreferenceSetting) {
          return expectedSelectedRecentOrgGroup;
        }
        if (x === SelfScheduleState.getSelectedActivity) {
          return defaultActivity;
        }
      });
      component.coverage = expectedCoverage;
      component.coverage.activityStaffingPlanCoverages = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('05-08-2019'),
            end: moment('05-08-2019'),
            id: '38', code: 'NIGHT8', name: 'NIGHT8', number: '16'
          },
          days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
        }];
      result = component.isPreferenceMatched();
    });
    it('the isPreferenceMatched() will return false', () => {
      expect(result).toEqual(false);
    });
    describe('when the prefered activity count is eqal to 1', () => {
      beforeEach(() => {
        expectedSelectedRecentOrgGroup.profiles = [{
          id: 76,
          activities: [{ id: 38 }]
        }];
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getPreferenceSetting) {
            return expectedSelectedRecentOrgGroup;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return defaultActivity;
          }
        });
        result = component.isPreferenceMatched();
      });
      it('the isPreferenceMatched() will return true', () => {
        expect(result).toEqual(true);
      });
    });
  });

  describe('#getCoverageSchedulesAndQualifiedProfiles', () => {
    beforeEach(() => {
      const expectedSchedulePeriod: SchedulePeriod = { start: startDate, end: endDate, status: 'Self Scheduling' };
      component.schedulePeriod = expectedSchedulePeriod;
      component.employeeCode = 'ARA01';
      const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
      mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
      mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(expectedSelectedRecentOrgGroup));
      mockEmployeeOrganizationSdkService.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
      spyOn(component, 'processData');
    });
    describe('when initialWeeks, getActivityStaffingCoverage, getSchedulesByCode, getSelfScheduleEmployeeProfiles have data', () => {
      beforeEach(() => {
        component.getCoverageSchedulesAndQualifiedProfiles();
      });
      it('processData should be called', () => {
        expect(component.processData).toHaveBeenCalled();
      });
    });
  });

  describe('#getCoverageSchedules', () => {
    beforeEach(() => {
      const expectedSchedulePeriod: SchedulePeriod = { start: startDate, end: endDate, status: 'Self Scheduling' };
      component.schedulePeriod = expectedSchedulePeriod;
      component.employeeCode = 'ARA01';
      mockEmployeeCalendarDisplayService.initWeeks.and.returnValue(of(expectedCalendarWeeks));
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      mockEmployeeCalendarDisplayService.getSchedulesByCode.and.returnValue(of(expectedCalendarWeeks));
      spyOn(component, 'processData');
    });
    describe('when initialWeeks, getActivityStaffingCoverage, getSchedulesByCode have data', () => {
      beforeEach(() => {
        component.getCoverageSchedules();
      });
      it('processData should be called', () => {
        expect(component.processData).toHaveBeenCalled();
      });
    });
  });

  describe('#processData', () => {
    describe('when processData called with activityStaffingCoverage, schedulesByCode, qualifiedProfiles', () => {
      beforeEach(() => {
        const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
        const expectedSelectedRecentOrganizationGroup = new PreferenceSetting();
        expectedSelectedRecentOrganizationGroup.organizationEntityId = '34';
        expectedSelectedRecentOrganizationGroup.profiles = [
          { id: 132, activities: [{ id: 21 }] }
        ];
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getPreferenceSetting) {
            return expectedSelectedRecentOrganizationGroup;
          }
        });
        component.schedulePeriods = expectedSchedulePeriods;
        mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(of(mockExceptions));
        const result: any[] = [expectedCoverage, expectedCalendarWeeks, expectedProfiles];
        component.processData(result);
      });
      it('qualifiedProfiles will have data', () => {
        expect(component.qualifiedProfiles[0].id).toEqual('76');
      });
    });
    
    describe('when isSelfScheduleExist is true', () => {
      describe('when isPreferenceMatched is true and selected activity is not available', () => {
        beforeEach(() => {
          const expectedProfiles = [{ id: '132', code: 'test code', name: 'test name', number: '4' }];
          const expectedStaffingCoverage: ICoverage = {
            organizationEntityId: 34,
            activityStaffingPlanCoverages: [
              {
                profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
                profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
                activity: {
                  startTime: '13:45',
                  hours: 8,
                  lunchHours: 1,
                  payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                  start: moment('01-04-2020'),
                  end: moment('01-04-2020'),
                  id: '21', code: 'test code', name: 'test name', number: '16'
                },
                days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
              }
            ]
          };
          const expectedSelectedRecentOrganizationGroup = new PreferenceSetting();
          expectedSelectedRecentOrganizationGroup.organizationEntityId = '34';
          expectedSelectedRecentOrganizationGroup.profiles = [
            { id: 132, activities: [{ id: 21 }] }
          ];
          const result: any[] = [expectedStaffingCoverage, expectedCalendarWeeks, expectedProfiles];
          component.isSelfScheduleExist = true;
          mockStore.selectSnapshot.and.callFake(x => {
            if (x === SelfScheduleState.getPreferenceSetting) {
              return expectedSelectedRecentOrganizationGroup;
            }
            if (x === SelfScheduleState.getSelectedActivity) {
              return undefined;
            }
          });
          component.schedulePeriods = expectedSchedulePeriods;
          mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(of(mockExceptions));
          component.processData(result);
        });
        it('should dispatch an action setting selected activity', () => {
          expect(mockStore.dispatch).toHaveBeenCalledWith(new SetSelectedActivity(mockDefaultActivity));
        });
      });
      describe('when isPreferenceMatched is true and selected activity is available', () => {
        beforeEach(() => {
          const expectedProfiles = [{ id: '132', code: 'test code', name: 'test name', number: '4' }];
          const expectedStaffingCoverage: ICoverage = {
            organizationEntityId: 34,
            activityStaffingPlanCoverages: [
              {
                profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
                profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
                activity: {
                  startTime: '13:45',
                  hours: 8,
                  lunchHours: 1,
                  payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
                  start: moment('01-04-2020'),
                  end: moment('01-04-2020'),
                  id: '21', code: 'test code', name: 'test name', number: '16'
                },
                days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
              }
            ]
          };
          const expectedSelectedRecentOrganizationGroup = new PreferenceSetting();
          expectedSelectedRecentOrganizationGroup.organizationEntityId = '34';
          expectedSelectedRecentOrganizationGroup.profiles = [
              { id: 132, activities: [{id: 21}] }
          ];
          const result: any[] = [expectedStaffingCoverage, expectedCalendarWeeks, expectedProfiles];
          component.isSelfScheduleExist = true;
          mockStore.selectSnapshot.and.callFake(x => {
            if (x === SelfScheduleState.getPreferenceSetting) {
              return expectedSelectedRecentOrganizationGroup;
            }
            if (x === SelfScheduleState.getSelectedActivity) {
              return selectedActivity;
            }
          });
          component.schedulePeriods = expectedSchedulePeriods;
          mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(of(mockExceptions));
          component.processData(result);
        });
        it('should not dispatch any action setting selected activity', () => {
          expect(selectedActivity.id).toEqual(38);
        });
      });
      describe('when isPreferenceMatched is false', () => {
        beforeEach(() => {
          const expectedProfiles = [{ id: '132', code: 'test code', name: 'test name', number: '4' }];
          const expectedSelectedRecentOrganizationGroup = new PreferenceSetting();
          expectedSelectedRecentOrganizationGroup.organizationEntityId = '34';
          expectedSelectedRecentOrganizationGroup.profiles = [
            { id: 132, activities: [{ id: 21 }] }
          ];
          const result: any[] = [expectedCoverage, expectedCalendarWeeks, expectedProfiles];
          component.isSelfScheduleExist = true;
          mockStore.selectSnapshot.and.callFake(x => {
            if (x === SelfScheduleState.getPreferenceSetting) {
              return expectedSelectedRecentOrganizationGroup;
            }
          });
          component.schedulePeriods = expectedSchedulePeriods;
          mockEmployeeSdkService.getEmployeeScheduleExceptions.and.returnValue(of(mockExceptions));
          component.processData(result);
        });
        it('should dispatch an action setting the preference modal with true', () => {
          expect(mockStore.dispatch).toHaveBeenCalledWith(new SetPreferenceModal(true));
        });
      });
    });
  });
});
