

import { ScheduleCalendarComponent } from './schedule-calendar.component';
import * as moment from 'moment';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { TranslateService } from '@ngx-translate/core';
import { DateFormats } from '../date-formats/date-formats';
import { DateFormatter } from '../date-formats/date-formatter';
import { Subject, Observable, of, throwError } from 'rxjs';
import { TransactionRequestSdkService } from 'src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.service';
import { Store } from '@ngxs/store';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { Employee } from 'src/app/time-management-domain/employee';
import { IEmployment } from 'src/app/time-management-domain/employment';
import { SchedulePeriod } from '../calendar/schedule-period';
import { ICoverage, IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { formatDate } from '@angular/common';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { EventDetailsSetup } from 'projects/SelfScheduleApp/src/app/self-schedule/event-details-setup.service';
import { ScheduleSdkService } from 'src/app/time-management-sdk/schedule-sdk/schedule-sdk.service';
import { SelfScheduleState, IShift } from 'projects/SelfScheduleApp/src/app/store/self-schedule/states/self-schedule.state';
import { IScheduleCalendarDay } from './models/IScheduleCalendarDay';
import { ISelectedDay } from 'src/app/common-service/model/ISelectedDay';
import { IActivity } from 'src/app/time-management-domain/activity';
import { ModalComponent } from '@wfm/modal';
import { SelfScheduleAdd } from 'projects/SelfScheduleApp/src/app/store/self-schedule/states/self-schedule-add.state';
import * as _ from 'lodash';
import { IPreferredShift } from './models/IPreferredShift';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';

export class RetractSelfScheduleMessageServiceMock {
  public subject = new Subject<any>();

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

let expectedEmployeeResult =
{
  id: 4930,
  code: 'AdminVishal',
  firstName: 'Vishal',
  lastName: 'Singhal',
  preferredName: 'Vishal',
  employment: {
    effectiveDate: moment('2018-05-19'),
    profession: {
      jobClass: {
        "status": "Uncalculated",
        id: '12',
        code: 'Job Class 1',
        name: 'Job Class 1',
        number: '40001'
      },
      shift: {
        id: '1',
        code: '1',
        name: 'Day Shift',
        number: '1'
      },
      fte: 0,
      classification: {
        id: '1',
        code: 'FT',
        name: 'Full-Time Hourly',
        number: null
      },
      approvedHours: 0,
      position: {
        jobClasses: [{
          "status": "Uncalculated",
          id: '12',
          code: 'Job Class 1',
          name: 'Job Class 1',
          number: '40001'
        }],
        id: '1234',
        code: 'LaborView',
        number: null,
        name: 'A1-0101'
      },
      hireDate: moment('2018-05-19'),
      seniorityDate: moment('2018-05-19')
    },
    location: {
      facility: {
        timeZoneId: '',
        status: '',
        id: '9',
        code: 'Laborview',
        name: 'Laborview Facility',
        number: '42000'
      },
      department: {
        status: '',
        id: '474',
        code: 'EmpLaborviews',
        name: 'EmpLaborviews',
        number: '98781212'
      },
      unit: null,
      timeZoneId: 'America/Chicago'
    }
  }
};
const preferenceSettingMock = {
  organizationEntityId: '135',
  profiles: [{
    id: 90,
    activities: [{id: 36}, {id: 37}, {id: 38}]
  }]
};

const activityStaffingPlanCoverageMock: IActivityStaffingPlanCoverage[] = [
  {
    profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
    profile: { id: '90', code: 'test code', name: 'test name', number: '4' },
    activity: {
      startTime: '07:00:00',
      hours: 8,
      lunchHours: 1,
      payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
      start: moment('2019-09-03T07:00:00'),
      end: moment('05-08-2019'),
      id: '36', 
      code: 'DAY8', 
      name: 'DAY8', 
      number: '16'
    },
    days: [{ needDate: '2018-08-01', need: 4, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
  },
  {
    profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
    profile: { id: '90', code: 'test code', name: 'test name', number: '4' },
    activity: {
      startTime: '15:00:00',
      hours: 8,
      lunchHours: 1,
      payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
      start: moment('2019-09-03T15:00:00'),
      end: moment('05-08-2019'),
      id: '38',
      code: 'EVE8',
      name: 'EVE8',
      number: '16'
    },
    days: [{ needDate: '2018-08-01', need: 4, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
  },
  {
    profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
    profile: { id: '90', code: 'test code', name: 'test name', number: '4' },
    activity: {
      startTime: '23:00:00',
      hours: 8,
      lunchHours: 1,
      payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
      start: moment('2019-09-03T23:00:00'),
      end: moment('05-08-2019'),
      id: '38', 
      code: 'NIGHT8', 
      name: 'NIGHT8', 
      number: '16'
    },
    days: [{ needDate: '2018-08-01', need: 1, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
  }
];

const mockViewChildren = {
  toArray: () => {
    return [{
      _menuOpen: false,
      closeMenu: () => {}
    },
    {
      _menuOpen: true,
      closeMenu: () => {}
    }
    ];
  }
};

const selectedActivity = {
  id: 38,
  code: 'NIGHT8',
  name: 'NIGHT8',
  startTime: '23:00:00',
  hours: 8,
  lunchHours: 0,
  payCode: null
};

describe('ScheduleCalendarComponent', () => {
  let component: ScheduleCalendarComponent;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockTransactionService: jasmine.SpyObj<TransactionRequestSdkService>;
  let expectedActivityStaffingPlanCoverage;
  let retractSelfScheduleMessageServiceMock;
  let mockEventDetailsSetup: jasmine.SpyObj<EventDetailsSetup>;
  const retractResponse = [];
  let storeMock: jasmine.SpyObj<Store>;
  let mockOrganizationSdkService: jasmine.SpyObj<OrganizationSdkService>;
  let employeeCode: string;
  let employeeSdkServiceMock: jasmine.SpyObj<EmployeeSdkService>;
  let empOrgServiceMock: jasmine.SpyObj<EmployeeOrganizationSdkService>;
  let mockScheduleSdkService: jasmine.SpyObj<ScheduleSdkService>;
  let mockModal: jasmine.SpyObj<ModalComponent>;
  let expectedResultSelectedDay: ISelectedDay;
  let scheduleCalendarWeeks: any[];
  let employeeScheduleSdkServiceMock: jasmine.SpyObj<EmployeeScheduleSdkService>;

  beforeEach(() => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockTransactionService = jasmine.createSpyObj('TransactionRequestSdkService', ['retractTransactionRequest']);
    mockOrganizationSdkService = jasmine.createSpyObj('OrganizationSdkService', ['getOrgLevels', 'getActivityStaffingCoverage']);
    mockEventDetailsSetup = jasmine.createSpyObj('EventDetailsSetup', ['mapEvent']);
    employeeSdkServiceMock = jasmine.createSpyObj('EmployeeSdkService', ['getFacilities', 'getAuthorization', 'getEmployee', 'getDepartments', 'getUnits', 'getPayCodes', 'getCurrentPayPeriod',
      'getQuickCode']);
    empOrgServiceMock = jasmine.createSpyObj('EmployeeOrganizationService', ['getEmployeePositions', 'getEmployeeActivities', 'getEmployeeJobClasses', 'getEmployeeProfiles', 'getEmployeePayCodes', 'getSelfScheduleEmployeeProfiles']);
    mockScheduleSdkService = jasmine.createSpyObj('ScheduleSdkService', ['saveSchedule']);
    employeeScheduleSdkServiceMock = jasmine.createSpyObj('EmployeeScheduleSdkService', ['getSchedules']);
    mockModal = jasmine.createSpyObj('ModalComponent', ['open', 'close']);
    storeMock = jasmine.createSpyObj('Store', ['selectSnapshot', 'dispatch']);
    component = createComponent();
  });

  function createComponent(): ScheduleCalendarComponent {
    component = new ScheduleCalendarComponent(mockTranslateService,
      storeMock,
      new DateFormatter(new DateFormats()),
      new DateFormats(),
      mockTransactionService,
      retractSelfScheduleMessageServiceMock,
      mockOrganizationSdkService,
      empOrgServiceMock,
      mockEventDetailsSetup,
      mockScheduleSdkService,
      employeeScheduleSdkServiceMock);
    employeeCode = 'ARA01';
    component.validationModal = mockModal;

    storeMock.selectSnapshot.and.callFake(x => {
      if (x === AuthState.getEmployeeCode) {
        return employeeCode;
      }
      if (x === SelfScheduleState.getEmployee) {
        return expectedEmployeeResult;
      }

      if (x === SelfScheduleState.getPreferenceSetting) {
        return preferenceSettingMock;
      }
      if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
        return activityStaffingPlanCoverageMock;
      }
      if (x === SelfScheduleState.getSelectedActivity) {
        return selectedActivity;
      }
    });

    Object.defineProperty(component, 'loggedInEmployee$', { writable: true });
    Object.defineProperty(component, 'preferenceSetting$', { writable: true });
    Object.defineProperty(component, 'schedulePeriod$', { writable: true });
    Object.defineProperty(component, 'selectedDay$', { writable: true });

    retractSelfScheduleMessageServiceMock = RetractSelfScheduleMessageServiceMock;
    return component;
  }


  expectedResultSelectedDay = {
    date: moment('04-23-2018'),
    etag: '123',
    showOpenShifts: false
  };

  const events1: ISchedule[] = [
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
      'lunchHours': 0,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': null,
      'activity': {
        'id': '5',
        'code': 'test code',
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null,
      'isTradeRequireEqualLength':true
    }
  ];

  const event: ISchedule = {
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
      'id': '117',
      'code': 'Blue01',
      'name': 'Blue01',
      'number': null
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
    'facility': {
      'id': '160',
      'code': 'ADMINS',
      'name': 'ADMINS',
      'number': '99991',
      'timeZoneId': 'America/Chicago',
      'status': 'true'
    },
    'department': {
      'id': '161',
      'code': 'ADMINS',
      'name': 'ADMINS',
      'number': '99993',
      'status': 'true'
    },
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
    'eventType': null,
    'person': null,
    'scheduleTradeStatus': null,
    'isTradeRequireEqualLength':true
  };

  const currentEvent: ISchedule[] = [
    {
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
        'id': '36',
        'code': 'DAY8',
        'name': 'DAY8',
        'number': '8',
        'startTime': '07:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2018-05-19'),
        'end': moment('2018-05-19')
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
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null,
      'isTradeRequireEqualLength':true
    }
  ];

  const currentEventMock: ISchedule[] = [
    {
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
      'payCode': {id: '97', code: 'test code', name: 'test name', number: '6'},
      'activity': null,
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
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null,
      'isTradeRequireEqualLength':true
    }
  ];

  let changeShiftEvent = {
    "isScheduledHours": true,
    "startDate": "2020-06-16T12:00:00.000Z",
    "requestedDate": null,
    "requestForDates": null,
    "hasStartTime": true,
    "status": "Uncalculated",
    "hours": 8,
    "amount": 0,
    "jobClass": {
      "id": 131,
      "code": "AR1",
      "name": "AR1",
      "number": 11100
    },
    "employment": null,
    "lunchHours": 0,
    "profile": {
      "id": 89,
      "code": "ARA01",
      "name": "ARA01",
      "number": null
    },
    "position": {
      "jobClass": {
        "id": 131,
        "code": "AR1",
        "name": "AR1",
        "number": 11100
      },
      "id": 294,
      "code": "ARA01",
      "name": "ARA01",
      "number": 11111
    },
    "isExtraShift": false,
    "guid": "dfe23bdd-dfdc-4914-9c36-f565f72c5c86",
    "facility": {
      "id": 134,
      "code": "ActiveRoster",
      "name": "ActiveRoster",
      "number": 11000,
      "timeZoneId": "America/Chicago"
    },
    "department": {
      "id": 135,
      "code": "AR Department A",
      "name": "AR Department A",
      "number": 11110
    },
    "unit": null, 
    "timeZone": "America/Chicago",
    "etag": "\"637250499337970000\"",
    "isTradeRequested": false,
    "isScheduleTradable": true,
    "isScheduleRetractable": false,
    "requestedReason": null,
    "employee": {
      "id": 4948,
      "code": "AdminAjay",
      "firstName": "Ajay",
      "lastName": "Kumar",
      "preferredName": "Ajay",
      "middleName": null,
      "jobClass": null
    },
    "source": "SelfScheduled",
    "scheduleTradeParticipant": "None",
    "scheduleTradeStatus": null,
    "isTradeRequireEqualLength": false,
    "payCode": null,
    "activity": {
      "id": 37,
      "code": "EVE8",
      "name": "EVE8",
      "startTime": "15:00:00",
      "hours": 8,
      "lunchHours": 0,
      "payCode": null,
      "configuration": null,
      "profile": {
        "id": 89,
        "code": "ARA01",
        "name": "ARA01",
        "number": null
      },
      "selectedDate": "2020-06-16T12:00:00.000Z",
      "etag": "\"637250499337970000\""
    },
    "location": {
      "facility": {
        "id": 134,
        "code": "ActiveRoster",
        "name": "ActiveRoster",
        "number": 11000,
        "timeZoneId": "America/Chicago"
      },
      "department": {
        "id": 135,
        "code": "AR Department A",
        "name": "AR Department A",
        "number": 11110
      },
      "unit": null,
      "timeZoneId": "America/Chicago",
      "configuration": {
        "isExtraShift": false
      }
    }
  }
  scheduleCalendarWeeks = [
    {
      days : [{
        date: moment('2018-05-17', 'YYYY-MM-DD'),
        isActive: true,
        events: [],
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
      {
        date: moment('2018-05-18', 'YYYY-MM-DD'),
        isActive: true,
        events: events1,
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
      {
        date: moment('2018-05-19', 'YYYY-MM-DD'),
        isActive: true,
        events: currentEvent,
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
      {
        date: moment('2018-05-20', 'YYYY-MM-DD'),
        isActive: true,
        events: events1,
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
      {
        date: moment('2018-05-21', 'YYYY-MM-DD'),
        isActive: true,
        events: [],
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
      {
        date: moment('2018-05-22', 'YYYY-MM-DD'),
        isActive: true,
        events: [],
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
      {
        date: moment('2018-05-23', 'YYYY-MM-DD'),
        isActive: true,
        events: [],
        isCurrentPayPeriod: true,
        etag: 'etag2'
      },
    ],
      isCurrent: true,
      numCurrentDays: 7,
      weeklyHours: 80
    }
  ];

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
      days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
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
      days: [{ needDate: '2019-09-16', need: 8, coverage: 0 }],
      profile: { id: '90', code: 'ARA02', name: 'ARA02', number: null }
    }];

  const expectedEmployee: Employee = {
    id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
    employment: {
      profession: {},
      location: {
        facility: { id: '102' },
        timeZoneId: 'CST'
      }
    } as IEmployment
  };
  const expectedSchedulePeriod: SchedulePeriod = { start: moment('06-08-2019'), end: moment('07-08-2019'), status: 'Self Scheduling' };
  const expectedSelectedRecentOrgGroup = new PreferenceSetting();
  expectedSelectedRecentOrgGroup.organizationEntityId = '34';
  expectedSelectedRecentOrgGroup.profiles = [{id: 76, activities: [{id: 21}]}];

  const expectedSelectedRecentOrgGroup1 = new PreferenceSetting();
  expectedSelectedRecentOrgGroup1.organizationEntityId = '34';
  expectedSelectedRecentOrgGroup.profiles = [{id: 132, activities: [{id: 21}]}];

  const expectedSelectedRecentOrgGroup2 = new PreferenceSetting();
  expectedSelectedRecentOrgGroup2.organizationEntityId = '34';
  expectedSelectedRecentOrgGroup2.profiles = [{id: 37, activities: [{id: 37}]}];
  const previousOverlapSchedule = [{
    events: []
  }
  ];

  const expectedCoverage: ICoverage = {
    organizationEntityId: 34,
    activityStaffingPlanCoverages: [{
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-01-07', need: 4, coverage: 1 }]
    }, {
      profileGroup: { id: '233', code: 'test code1', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code1', name: 'test name1', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code1', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code1', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-01-07', need: 4, coverage: 1 }]
    }
    ]
  };

  const expectedCoverage2: ICoverage = {
    organizationEntityId: 34,
    activityStaffingPlanCoverages: [{
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-01-07', need: 4, coverage: 1 }]
    }, {
      profileGroup: { id: '233', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code1', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code1', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-01-07', need: 4, coverage: 1 }]
    }
    ]
  };
  const expectedCoverage1: ICoverage = {
    organizationEntityId: 34,
    activityStaffingPlanCoverages: [{
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-01-07', need: 4, coverage: 1 }]
    }, {
      profileGroup: { id: '233', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-01-07', need: 4, coverage: 1 }]
    }
    ]
  };

  const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
  const expectedProfiles1 = [{ id: '132', code: 'test code', name: 'test name', number: '4' }];

  describe('when default clickhandler is called', () => {
    let clickSpy;
    const scheduleCalendarDay = {
      date: moment('2018-08-01', 'YYYY-MM-DD'),
      isActive: true,
      events: [],
      isCurrentPayPeriod: true,
      etag: 'etag2'
    };

    beforeEach(() => {
      component = createComponent();
      clickSpy = spyOn(component, 'clickHandler').and.callThrough();
      component.clickHandler(scheduleCalendarDay, false);
    });

    it('should call the clickHandler', () => {
      expect(clickSpy).toHaveBeenCalledWith(scheduleCalendarDay, false);
    });
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      component = createComponent();
      component.loggedInEmployee$ = of(expectedEmployee);
      component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
      component.schedulePeriod$ = of(expectedSchedulePeriod);
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      empOrgServiceMock.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
      employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of(previousOverlapSchedule));
      component.ngOnInit();
    });
    it('component should be defined', () => {
      expect(component).toBeDefined();
    });
  });

  describe('When no logged -in employee details are available', () => {
    beforeEach(() => {
      component = createComponent();
      component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
      component.schedulePeriod$ = of(expectedSchedulePeriod);
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      empOrgServiceMock.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
      employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of(previousOverlapSchedule));

      let result = undefined;
      component.loggedInEmployee$ = of(result);
      component.ngOnInit();
    });
    it('When logged in employee is not available', () => {
      expect(component.loggedInEmployee).toBeUndefined();
    });
  });

  describe('When no preference setting', () => {
    beforeEach(() => {
      component = createComponent();
      let result = undefined;
      component.preferenceSetting$ = of(result);
      component.schedulePeriod$ = of(expectedSchedulePeriod);
      component.loggedInEmployee$ = of(expectedEmployee);
      component.ngOnInit();
    });
    it('When preference setting is not available', () => {
       expect(component.preferenceSetting$).toBeUndefined;
    });
  });

  describe('#isNeedCountZero', () => {

    const qualifiedCoverageMock = [{
      days: [
        {
          coverage: 0,
          need: 8,
          needDate: '2020-06-14'
        },
        {
          coverage: 0,
          need: 0,
          needDate: '2020-06-15'
        }
      ]
    }]

    describe('when need count is not zero for clicked day', () => {
      const activityStaffingPlanCoverage = []
      const clickedDay = {
        date: moment('2020-06-14')
      }
      beforeEach(() => {
        component = createComponent();
        storeMock.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getQualifiedCoverage) {
            return qualifiedCoverageMock;
          }
        });
      });

      it('should not return false when need count is not zero', () => {
        expect(component.isNeedCountZero(clickedDay)).toBe(false);
      });
    });
    describe('when need count is zero for clicked day', () => {
      const activityStaffingPlanCoverage = [];
      const clickedDay = {
        date: moment('2020-06-15')
      }
      beforeEach(() => {
        component = createComponent();
        storeMock.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getQualifiedCoverage) {
            return qualifiedCoverageMock;
          }
        });
      });

      it('should not return true when need count is  zero', () => {
        expect(component.isNeedCountZero(clickedDay)).toBe(true);
      });
    });
  });

  // code for getAllOtherAvailableShifts function
  describe('#getAllOtherAvailableShifts', () => {
    let $event: MouseEvent;
    $event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
    const currentDay = {
      date: moment('2018-08-01', 'YYYY-MM-DD'),
      isActive: true,
      events: events1,
      etag: 'etag3',
      needCount: 1
    };

    const profiles = [
      {
        code: 'ARA01',
        id: '89',
        name: 'ARA01',
        number: null
      },
      {
        code: 'ARA02',
        id: '90',
        name: 'ARA02',
        number: null
      },
      {
        code: 'ARA03',
        id: '91',
        name: 'ARA03',
        number: null
      }
    ];

    beforeEach(() => {
      component = createComponent();
    });

    describe('when clicked is undefined', () => {
      const clickedDay = undefined;
      beforeEach(() => {
        component.getAllOtherAvailableShifts(clickedDay, $event);
      });
      it('should not show the other available shifts', () => {
        expect(clickedDay).toBe(undefined);
      });
    });

    describe('when filteredActivities array is empty', () => {
      const activityStaffingPlanCoverage = [];
      beforeEach(() => {
        storeMock.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getPreferenceSetting) {
            return preferenceSettingMock;
          }
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activityStaffingPlanCoverage;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
        });
        component.profiles = profiles;
        component.getAllOtherAvailableShifts(currentDay, $event);
      });

      it('should not show the activities under add shifts dropdown', () => {
        expect(component.addActivityDetails.changeActivityDetailShifts).toBe(undefined);
      });
    });

    describe('when preferredshifts array is empty', () => {
      const preferenceSettingResult = {
        organizationEntityId: '135',
        profiles: [{
          id: 20,
          activities: []
        }]
      };

      beforeEach(() => {
        storeMock.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getPreferenceSetting) {
            return preferenceSettingResult;
          }
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activityStaffingPlanCoverageMock;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
        });
        component.profiles = profiles;
        component.getAllOtherAvailableShifts(currentDay, $event);
      });

      it('should get length of preferred shifts', () => {
         expect(component.addActivityDetails.otherActivityDetails['test code'].length).toBe(2);
      });
    });
    describe('when othershiftsAvailable array is empty', () => {
      const preferenceSettingResult = {
        organizationEntityId: '135',
        profiles: [{
          id: 90,
          activities: [{id: 36}, {id: 38}, {id: 21}]
        }]
      };

      beforeEach(() => {
        storeMock.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getPreferenceSetting) {
            return preferenceSettingResult;
          }
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activityStaffingPlanCoverageMock;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
        });
        component.profiles = profiles;
        component.getAllOtherAvailableShifts(currentDay, $event);
      });

      it('should not show activities under other available shifts section', () => {
        expect(component.addActivityDetails.otherActivityDetails).toEqual({});
      });
    });

    describe('when current day has zero needs', () => {
      const activityStaffingPlanCoverageResult: IActivityStaffingPlanCoverage[] = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '90', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '07:00:00',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('2019-09-03T07:00:00'),
            end: moment('05-08-2019'),
            id: '36',
            code: 'DAY8',
            name: 'DAY8',
            number: '16'
          },
          days: [{ needDate: '2018-08-01', need: 1, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
        }
      ];

      beforeEach(() => {
        storeMock.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getPreferenceSetting) {
            return preferenceSettingMock;
          }
          if (x === SelfScheduleAdd.getActivityStaffingPlanCoverages) {
            return activityStaffingPlanCoverageResult;
          }
          if (x === SelfScheduleState.getSelectedActivity) {
            return selectedActivity;
          }
        });
        component.profiles = profiles;
        component.getAllOtherAvailableShifts(currentDay, $event);
      });

      it('should not show the filtered activties', () => {
        expect(component.addActivityDetails.otherActivityDetails).toEqual({});
      });
    });
  });

  // spec for getToolTipTemplate function
  describe('#getToolTipTemplate', () => {
    let templateString: string;

    beforeEach(() => {
      mockTranslateService.instant.and.returnValue('12:00 - 8:00');
    });

    describe('when event is activity', () => {

      beforeEach(() => {
        component = createComponent();
      });

      it('should create template string for displaying tooltip for activity when unit is null', () => {
        templateString = component.toolTipTemplate(event);
        expect(templateString).toEqual(`<div><span>Blue01</span><br><span>12:00 - 8:00</span><br><span>ADMINS</span><br><span>ADMINS</span></div>`);
      });

      it('clickHandler', () => {
        component.clickHandler = null;
      });

      it('should create template string for displaying tooltip for activity when unit is not null', () => {
        event.unit = {
          id: 'id_test',
          code: 'code_test',
          name: 'name_test',
          number: 'number_test',
          status: 'status_test'
        };
        event.hours = null;
        templateString = component.toolTipTemplate(event);
        expect(templateString).toEqual('<div><span>Blue01</span><br><span>12:00 - 8:00</span><br><span>ADMINS</span><br><span>ADMINS</span><br><span>code_test</span></div>');
      });
    });

    describe('when event is paycode', () => {
      beforeEach(() => {
        component = createComponent();
        event.activity = null;
        event.payCode = {
          'id': '5',
          'code': 'Blue01',
          'name': 'Blue01',
          'number': '8'
        };
        templateString = component.toolTipTemplate(event);
      });

      it('should create template string for displaying tooltip for paycode', () => {
        expect(templateString).toEqual('<div><span>Blue01</span><br><span>12:00 - 8:00</span></div>');
      });
    });
  });
  describe('#retractTransactionRequest', () => {
    beforeEach(() => {
      component = createComponent();
      component.loggedInEmployee$ = of(expectedEmployee);
      component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
    });

    describe('when called transaction retract service', () => {
      const coverage: ICoverage = {
        organizationEntityId: 34,
        activityStaffingPlanCoverages: [{
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
            end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
            id: '163', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
        }
        ]
      };
      beforeEach(() => {
        component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
        mockTransactionService.retractTransactionRequest.and.returnValue(of(retractResponse));
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverage));
        component.retractSelfSchedule(events1);
      });
      it('should call the transaction request-retract services', () => {
        expect(mockTransactionService.retractTransactionRequest).toHaveBeenCalled();
      });
    });

    describe('when called to get staffing coverage', () => {
      const coverage: ICoverage = {
        organizationEntityId: 34,
        activityStaffingPlanCoverages: [{
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
            end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
            id: '21', code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
        }
        ]
      };
      beforeEach(() => {
        component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
        mockTransactionService.retractTransactionRequest.and.returnValue(of(retractResponse));
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverage));
        component.schedulePeriod$ = of(expectedSchedulePeriod);
      });
      it('should call the transaction request-retract services when the profile code is available', () => {
        component.coverage = coverage;
        component.previouslySelectedPreference = expectedSelectedRecentOrgGroup;
        component.getActivityStaffingCoverage('test code', 121);
        expect(component.profileId).toEqual(121);
      });
      it('should call the transaction request-retract services when the profile code is not available', () => {
        component.previouslySelectedPreference = expectedSelectedRecentOrgGroup;
        component.getActivityStaffingCoverage('', 121);
        expect(component.profileId).toEqual(undefined);
      });
    });

    describe('when called to get the profiles', () => {
      beforeEach(() => {
        component.loggedInEmployee$ = of(expectedEmployee);
        component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup1);
        component.schedulePeriod$ = of(expectedSchedulePeriod);
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
        empOrgServiceMock.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles1));
      });
      it('should call when profiles are not found', () => {
        empOrgServiceMock.getSelfScheduleEmployeeProfiles.and.returnValue(of([]));
        employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of(previousOverlapSchedule));
        component.getProfiles();
        expect(component.profilesNotFound).toBeTruthy();
      });
      it('should call when the profile is found  without previously selected preference', () => {
        employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of(previousOverlapSchedule));
        component.getProfiles();
        expect(component.profileId).toBe(132);
      });
    });

    describe('when called to get the profiles', () => {
      beforeEach(() => {
        component.loggedInEmployee$ = of(expectedEmployee);
        component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup1);
        component.schedulePeriod$ = of(expectedSchedulePeriod);
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
        empOrgServiceMock.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles1));
        component.previouslySelectedPreference = expectedSelectedRecentOrgGroup;
      });
      it('should call when profiles are not found', () => {
        employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of(previousOverlapSchedule));
        component.getProfiles();
        expect(component.profilesNotFound).toBeFalsy();
      });
    });

    describe('when scheduledPeriod is empty', () => {
      beforeEach(() => {
        component.loggedInEmployee$ = of(expectedEmployee);
        component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup1);
        let scheduledPeriod = undefined;
        component.schedulePeriod$ = of(scheduledPeriod);
      });
      it('should call when profiles are not found', () => {
        employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of(previousOverlapSchedule));
        component.getProfiles();
        expect(component.schedulePeriod).toBe(undefined);
      });
    });

    describe('when called to calculate activity end date', () => {
      const activity = {
        "id": 100,
        "code": "DAY8",
        "name": "DAY8",
        "startTime": "07:00:00",
        "hours": 8,
        "lunchHours": 0,
        "payCode": null,
        "startTimeAsMoment": "2020-01-27T01:30:43.480Z",
        "configuration":
        {
          "isDisplayedOnMonthlyView": true,
          "isOnCall": false,
          "isTimeOff": false
        }
      }
      let activityEndDate;
      beforeEach(() => {
        component = createComponent();
        activityEndDate = component.calculateActivityEndDate(activity);
      })
      it('should call calculateActivityEndDate with activity as parameter', () => {
        expect(activityEndDate).toBe('07:00 - 15:00');
      });
      it('should call calculateActivityEndDate with activity is of undefined', () => {
        const activity = undefined;
        component.calculateActivityEndDate(activity);
        expect(component.activity).toBeUndefined();
      });
    });

    describe('when requested to change the shift with non overlapping shifts', () => {
      const activity = {
        'id': 36,
        'code': 'DAY8',
        'name': 'DAY8',
        'startTime': '07:00:00',
        'hours': 6,
        'lunchHours': 1,
        'payCode': null,
        'configuration': null,
        'selectedDate' : moment('2020-05-16T04:00:00.000-05:00')
      }
      const expectedDay = {
        'date': moment('2018-05-19'),
        'isActive': true,
        'events': events1,
        'isCurrentPayPeriod': true,
        'etag': 'test etag'
      };
      beforeEach(() => {
        storeMock.selectSnapshot.and.returnValue(expectedEmployeeResult);
        mockScheduleSdkService.saveSchedule.and.returnValue(throwError({ status: 500, error: 'error-check' }));
        component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
        spyOn(component, 'getOverlappingShifts');
      });
      it('should call change shift', () => {
        component.selectedDay = expectedDay;
        component.selectedProfile = expectedSelectedRecentOrgGroup;
        component.calendarWeeks = scheduleCalendarWeeks;
        component.overlapModal = mockModal;
        component.changeShift({changeShiftEvent:events1, day:expectedDay, activity:activity, overrideValidation:false});
        expect(component.getOverlappingShifts).toHaveBeenCalled();
      });
    });

    describe('when requested to change the shift', () => {
      let expectedSchedules: ISchedule[];
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
          'isTradeRequireEqualLength' : false,
          'activity': {
            'id': '39',
            'code': 'EVE8',
            'name': 'EVE8',
            'number': '8',
            'startTime': '15:00:00',
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

      const activity = {
        'id': 38,
        'code': 'NIGHT8',
        'name': 'NIGHT8',
        'startTime': '23:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'configuration': null,
        'selectedDate' : moment('2020-05-16T04:00:00.000-05:00')
      }

      const expectedDay = {
        'date': moment('2018-05-19'),
        'isActive': true,
        'events': expectedSchedules,
        'isCurrentPayPeriod': true,
        'etag': 'test etag'
      };

      beforeEach(() => {
        storeMock.selectSnapshot.and.returnValue(expectedEmployeeResult);
        mockScheduleSdkService.saveSchedule.and.returnValue(throwError({ status: 500, error: 'error-check' }));
        component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
        spyOn(component, 'getOverlappingShifts');
      });

      it('should call change shift', () => {
        component.selectedDay = expectedDay;
        component.selectedProfile = expectedSelectedRecentOrgGroup;
        component.calendarWeeks = scheduleCalendarWeeks;
        component.changeShift({changeShiftEvent:expectedSchedules, day:expectedDay, activity:activity, overrideValidation:false});
        expect(component.getOverlappingShifts).toHaveBeenCalled();
      });
    });

    describe('when requested to change the shift with over-lapping shifts', () => {
      let expectedSchedules: ISchedule[];
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
          'startDate': moment('2018-05-19'),
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
          'isTradeRequireEqualLength' : false,
          'activity': {
            'id': '39',
            'code': 'EVE8',
            'name': 'EVE8',
            'number': '8',
            'startTime': '15:00:00',
            'hours': 8,
            'lunchHours': 1,
            'payCode': null,
            'start': moment('2018-05-19'),
            'end': moment('2018-05-20')
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
      const activity = {
        'id': '36',
        'code': 'DAY8',
        'name': 'DAY8',
        'number': '8',
        'startTime': '07:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2018-05-19'),
        'end': moment('2018-05-19')
      }
      const expectedDay = {
        'date': moment('2018-05-19'),
        'isActive': true,
        'events': expectedSchedules,
        'isCurrentPayPeriod': true,
        'etag': 'test etag'
      };

      const expectedChangeShiftActivity = {
        "id": 225,
        "code": "EveShift",
        "name": "Eve8",
        "startTime": "15:30:00",
        "hours": 6,
        "lunchHours": 1,
        "payCode": null,
        "configuration": null,
        "selectedDate" : moment('2020-05-16T04:00:00.000-05:00')
      }

      beforeEach(() => {
        component.selectedDay = expectedDay;
        component.selectedProfile = expectedSelectedRecentOrgGroup;
        component.calendarWeeks = scheduleCalendarWeeks;
        component.overlapModal = mockModal;
      });

      it('should display overlapping pop-up when override-validation is false', () => {
        component.changeShift({changeShiftEvent:expectedSchedules, day:expectedDay, activity:activity, overrideValidation:false});
        expect(component.overlapModal.open).toHaveBeenCalled();
      });

      it('should display overlapping pop-up when override-validation is true ', () => {
        mockScheduleSdkService.saveSchedule.and.returnValue(throwError({ status: 500, error: 'error-check' }));
        component.changeShiftActivity = expectedChangeShiftActivity
        component.changeShift({changeShiftEvent:expectedSchedules, day:expectedDay, activity:activity, overrideValidation:true});
        expect(component.overlapModal.open).toHaveBeenCalled();
      });
    });
  });

  describe('handleError', () => {
    beforeEach(() => {
      component = createComponent();
      const error = {
        "headers": { "normalizedNames": {}, "lazyUpdate": null }, "status": 400, "statusText": "OK", "url": "https://localhost:44308/schedule/9c26c232-7772-4103-8148-0967fa471f4e?overrideValidation=false",
        "ok": false, "name": "HttpErrorResponse", "message": "Http failure response for https://localhost:44308/schedule/9c26c232-7772-4103-8148-0967fa471f4e?overrideValidation=false: 400 OK", "error": { "httpStatusCode": "BadRequest", "errorCode": "VALIDATION_MESSAGES_EXIST", "message": "", "content": { "validationMessages": [{ "scheduleId": "9c26c232-7772-4103-8148-0967fa471f4e", "description": "Employee exceeded need", "severityLevel": "Warning" }, { "scheduleId": "9c26c232-7772-4103-8148-0967fa471f4e", "description": "Employee exceeded Coverage Period need", "severityLevel": "Warning" }, { "scheduleId": "9c26c232-7772-4103-8148-0967fa471f4e", "description": "Employee Weekly hours exceed Weekly approved hours", "severityLevel": "Warning" }, { "scheduleId": "9c26c232-7772-4103-8148-0967fa471f4e", "description": "Employee does not have a preference to work this shift", "severityLevel": "Warning" }], "overridable": true } }
      }
      component.handleError(error);
    });

    it('handle validation errors', () => {
      expect(component.openApprovalModal).toBeDefined();
    });
  });

  describe('handleValidationErrors', () => {
    beforeEach(() => {
      component = createComponent();
      const errorInfo = {
        httpStatusCode: "BadRequest", errorCode: '"' + 'VALIDATION_MESSAGES_EXIST' + '"',
        message: "",
        content: {
          validationMessages: [{ scheduleId: "9c26c232-7772-4103-8148-0967fa471f4e", description: "Employee exceeded need", severityLevel: "Warning" }, { scheduleId: "9c26c232-7772-4103-8148-0967fa471f4e", description: "Employee exceeded Coverage Period need", severityLevel: "Warning" },
          { scheduleId: "9c26c232-7772-4103-8148-0967fa471f4e", description: "Employee Weekly hours exceed Weekly approved hours", severityLevel: "Warning" }, { scheduleId: "9c26c232-7772-4103-8148-0967fa471f4e", description: "Employee does not have a preference to work this shift", severityLevel: "Warning" }], overridable: true
        }
      };
      component.handleValidationErrors(errorInfo);
    });

    it('handle validation errors', () => {
      expect(component).toBeDefined();
    });
  });

  describe('when requested to change the shift', () => {
    const scheduleResult = {} as ISchedule;
    let expectedSchedules: ISchedule[];

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
        'isTradeRequireEqualLength' : false,
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

    const activity = {
      'id': 39,
      'code': 'NIGHT8',
      'name': 'NIGHT8',
      'startTime': '23:00:00',
      'hours': 6,
      'lunchHours': 1,
      'payCode': null,
      'configuration': null,
      'selectedDate' : moment('2020-05-16T04:00:00.000-05:00')
    }

    const expectedDay = {
      'date': moment('2018-05-19'),
      'isActive': true,
      'events': expectedSchedules,
      'isCurrentPayPeriod': true,
      'etag': 'test etag',
    };

    const expectedChangeShiftActivity = {
      "id": 225,
      "code": "EveShift",
      "name": "Eve8",
      "startTime": "15:30:00",
      "hours": 6,
      "lunchHours": 1,
      "payCode": null,
      "configuration": null,
      "selectedDate" : moment('2020-05-16T04:00:00.000-05:00')
    }

    beforeEach(() => {
      storeMock.selectSnapshot.and.returnValue(expectedEmployeeResult);
      mockScheduleSdkService.saveSchedule.and.returnValue(of(scheduleResult));
      component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
      component.changeShiftActivity = expectedChangeShiftActivity;
      spyOn(component, 'getOverlappingShifts');
    });

    it('should call change shift', () => {
      component.selectedDay = expectedDay;
      component.selectedProfile = expectedSelectedRecentOrgGroup;
      component.calendarWeeks = scheduleCalendarWeeks;
      component.changeShift({changeShiftEvent: events1, day: expectedDay, activity: activity, overrideValidation: false});
      expect(component.getOverlappingShifts).toHaveBeenCalled();
    });
  });


describe('#getothershiftsavailable', () => {
    let $event: MouseEvent;
    $event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
    let event5: ISchedule = {
      'employment': null,
      'hours': 7,
      'isScheduledHours': false,
      'startDate': moment('2020-01-07'),
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
      'isTradeRequireEqualLength' : false,
      'activity': {
        'id': '44',
        'code': 'DAY8',
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
        'id': '117',
        'code': 'Blue01',
        'name': 'Blue01',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
      'unit': {
        'id': '23',
        'code': 'GH',
        'name': 'GH',
        'number': '23',
        'status': 'true'
      },
      'isActivity': true,
      'endDate': moment('2018-05-19'),
      'etag': 'aaaaa',
      'isTradeRequested': false,
      'isScheduleRetractable': false,
      'isScheduleTradable': true,
      'requestedReason': null,
      'source': 'SelfScheduled',
      'scheduleTradeParticipant': null,
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    };
    let event: ISchedule = {
      'employment': null,
      'hours': 7,
      'isScheduledHours': false,
      'startDate': moment('2020-01-07'),
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
        'id': '44',
        'code': 'test code',
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
        'id': '117',
        'code': 'test code',
        'name': 'test code',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    };

    let activityStaffingPlanCoverageMock: IActivityStaffingPlanCoverage[] = [
      {
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '117', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment('2019-09-03T07:00:00'),
          end: moment('05-08-2019'),
          id: '21',
          code: 'EVE8',
          name: 'EVE8',
          number: '16'
        },
        days: [{ needDate: '2018-05-06', need: 4, coverage: 1 }, { needDate: "2018-05-06", need: 0, coverage: 1 }, { needDate: "2018-05-06", need: 7, coverage: 1 }]
      }
    ];

    let expectedSchedules = [
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
        'activity': {
          'id': '44',
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
    ] as ISchedule[];

    let expectedActivity = {
      'id': '44',
      'code': 'DAY8',
      'name': 'test name',
      'number': '8',
      'startTime': '16:00',
      'hours': 8,
      'lunchHours': 1,
      'payCode': null,
      'start': moment('2019-07-22'),
      'end': moment('2019-07-23')
    } as IActivity;

    let expecteddays = {
      "date": "2020-04-18T18:30:00.000Z", "isActive": true,
      "events": [{
        "isScheduledHours": true, "startDate": "2020-04-19T12:00:00.000Z",
        "requestedDate": null, "requestForDates": null, "hasStartTime": true,
        "status": "Uncalculated", "hours": 8, "amount": 0,
        "jobClass": { "id": 131, "code": "AR1", "name": "AR1", "number": 11100 },
        "employment": null, "lunchHours": 0, "profile": { "id": '89', "code": "ARA01", "name": "ARA01", "number": null },
        "position": {
          "jobClass": { "id": 131, "code": "AR1", "name": "AR1", "number": 11100 },
          "id": 294, "code": "ARA01", "name": "ARA01", "number": 11111
        },
        "isExtraShift": false, "guid": "284af5d2-2dc5-4732-b707-1ee67788df95",
        "facility": {
          "id": 134, "code": "ActiveRoster", "name": "ActiveRoster",
          "number": 11000, "timeZoneId": "America/Chicago"
        },
        "department": { "id": 135, "code": "AR Department A", "name": "AR Department A", "number": 11110 },
        "unit": null, "timeZone": "America/Chicago", "etag": "\"637175161600600000\"", "isTradeRequested": false,
        "isScheduleTradable": false, "isScheduleRetractable": false, "requestedReason": null,
        "employee": {
          "id": 4951, "code": "AdminAnantha", "firstName": "Anantha", "lastName": "Rambabu",
          "preferredName": "Anantha", "middleName": null, "jobClass": null
        }, "source": "SelfScheduled",
        "scheduleTradeParticipant": "None", "scheduleTradeStatus": null, "payCode": null,
        "activity": {
          "id": '44', "code": "NP", "name": "Non Productive", "startTime": "07:00:00",
          "hours": 8, "lunchHours": 0, "payCode": null, "startTimeAsMoment": "2020-02-17T01:30:40.084Z", "configuration": { "isDisplayedOnMonthlyView": true, "isOnCall": false, "isTimeOff": false }
        }, "location": { "facility": { "id": 134, "code": "ActiveRoster", "name": "ActiveRoster", "number": 11000, "timeZoneId": "America/Chicago" }, "department": { "id": 135, "code": "AR Department A", "name": "AR Department A", "number": 11110 }, "unit": null, "timeZoneId": "America/Chicago", "configuration": { "isExtraShift": false } }
      }], "etag": "\"637175161600600000\"", "needCount": 8
    };

    let expecteddaysWithoutEvent = {
      "date": "2020-04-18T18:30:00.000Z", "isActive": true,
      "events": [{
        "isScheduledHours": true, "startDate": "2020-04-19T12:00:00.000Z",
        "requestedDate": null, "requestForDates": null, "hasStartTime": true,
        "status": "Uncalculated", "hours": 8, "amount": 0,
        "jobClass": { "id": 131, "code": "AR1", "name": "AR1", "number": 11100 },
        "employment": null, "lunchHours": 0, "profile": { "id": '89', "code": "ARA01", "name": "ARA01", "number": null },
        "position": {
          "jobClass": { "id": 131, "code": "AR1", "name": "AR1", "number": 11100 },
          "id": 294, "code": "ARA01", "name": "ARA01", "number": 11111
        },
        "isExtraShift": false, "guid": "284af5d2-2dc5-4732-b707-1ee67788df95",
        "facility": {
          "id": 134, "code": "ActiveRoster", "name": "ActiveRoster",
          "number": 11000, "timeZoneId": "America/Chicago"
        },
        "department": { "id": 135, "code": "AR Department A", "name": "AR Department A", "number": 11110 },
        "unit": null, "timeZone": "America/Chicago", "etag": "\"637175161600600000\"", "isTradeRequested": false,
        "isScheduleTradable": false, "isScheduleRetractable": false, "requestedReason": null,
        "employee": {
          "id": 4951, "code": "AdminAnantha", "firstName": "Anantha", "lastName": "Rambabu",
          "preferredName": "Anantha", "middleName": null, "jobClass": null
        }, "source": "SelfScheduled",
        "scheduleTradeParticipant": "None", "scheduleTradeStatus": null, "payCode": null,
        "activity": null, "location": { "facility": { "id": 134, "code": "ActiveRoster", "name": "ActiveRoster", "number": 11000, "timeZoneId": "America/Chicago" }, "department": { "id": 135, "code": "AR Department A", "name": "AR Department A", "number": 11110 }, "unit": null, "timeZoneId": "America/Chicago", "configuration": { "isExtraShift": false } }
      }], "etag": "\"637175161600600000\"", "needCount": 8
    };

    const coverageWithMultipleActivities: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:01',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '23', code: 'test code1', name: 'test name1', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:02',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'Aname', number: '4' },
        activity: {
          startTime: '13:03',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '23', code: 'test code1', name: 'test name1', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code1', name: 'Bname', number: '4' },
        activity: {
          startTime: '13:00',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      }
      ]
    };

    const coverageWithMultipleActivities1: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'Aest name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '23', code: 'test code1', name: 'test name1', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'Aname', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '23', code: 'test code1', name: 'test name1', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code1', name: 'test name', number: '4' },
        activity: {
          startTime: '16:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      }
      ]
    };

    const coverage: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '89', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      }
      ]
    };

    const coverage1: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '25', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 5 }]
      }
      ]
    };

    const coverageWithNoNeed: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '25', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 0, coverage: 5 }]
      }
      ]
    };

    describe('when event is SelfScheduled and activity codes are not same', () => {
        beforeEach(() => {
            component.profileId = 150;
            component = createComponent();
            component.activityList = activityStaffingPlanCoverageMock;
            mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverage));
            component.schedules = expectedSchedules;
            component.activity = expectedActivity;
            component.preferredActivityIds = [89, 117];
            component.profiles = [{ id: '25', code: 'test code', name: 'test name', number: '4' }];
            component.getOtherShiftsAvailable(event5, expecteddays, $event);
        });

      it('should show the list of available shifts', () => {
        expect(event5.activity.code).toBe('DAY8');
      });
      it('should show the list of available shifts', () => {
        component.getOtherShiftsAvailable(event, expecteddays, $event);
        expect(event.activity.code).toBe('test code');
      });
      it('when there are no needs', () => {
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverageWithNoNeed));
        component.getOtherShiftsAvailable(event, expecteddays, $event);
        expect(component.coverage).toEqual(coverageWithNoNeed);
      });
    });

    describe('when event is SelfScheduled and activity codes are not same', () => {
      beforeEach(() => {
        component.profileId = 150;
        component = createComponent();
        component.activityList = activityStaffingPlanCoverageMock;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverageWithMultipleActivities));
        component.schedules = expectedSchedules;
        component.activity = expectedActivity;
        component.profiles = [{ id: '89', code: 'test code', name: 'test name', number: '4' }];
        component.getOtherShiftsAvailable(event5, expecteddays, $event);
      });

      it('should show the list of available shifts', () => {
        expect(component.selectedGuid).toBe(event5.guid);
      });
    });

    describe('when event is SelfScheduled and profile codes are same', () => {
      beforeEach(() => {
        component.profileId = 150;
        component = createComponent();
        component.activityList = activityStaffingPlanCoverageMock;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverageWithMultipleActivities1));
        component.schedules = expectedSchedules;
        component.activity = expectedActivity;
        component.profiles = [{ id: '89', code: 'test code', name: 'test name', number: '4' }];
        component.getOtherShiftsAvailable(event5, expecteddays, $event);
      });

      it('should show the list of available shifts', () => {
        expect(component.coverage).toEqual(coverageWithMultipleActivities1);
      });
    });

    describe('when event is SelfScheduled and needs sorting', () => {
      beforeEach(() => {
        component.profileId = 150;
        component = createComponent();
        component.activityList = activityStaffingPlanCoverageMock;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
        component.schedules = expectedSchedules;
        component.activity = expectedActivity;
        component.profiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
        component.getOtherShiftsAvailable(event5, expecteddays, $event);
      });

      it('should show the list of available shifts', () => {
        component.getOtherShiftsAvailable(event5, expecteddays, $event);
        expect(component.coverage).toEqual(expectedCoverage);
      });
    });

    describe('when event is SelfScheduled and activity codes are not same', () => {
      beforeEach(() => {
        component.profileId = 150;
        component = createComponent();
        component.activityList = activityStaffingPlanCoverageMock;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage2));
        component.schedules = expectedSchedules;
        component.activity = expectedActivity;
        component.profiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
        component.getOtherShiftsAvailable(event5, expecteddays, $event);
      });

      it('should show the list of available shifts', () => {
        component.getOtherShiftsAvailable(event5, expecteddays, $event);
        expect(component.coverage).toEqual(expectedCoverage2);
      });
    });

    describe('when event is SelfScheduled , profileid for event and staffing plan are not same', () => {
        beforeEach(() => {
            component.profileId = 150;
            component = createComponent();
            component.activityList = activityStaffingPlanCoverageMock;
            mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverage1));
            component.schedules = expectedSchedules;
            component.activity = expectedActivity;
            component.profiles = [{ id: '25', code: 'test code', name: 'test name', number: '4' }];
            component.getOtherShiftsAvailable(event5, expecteddays, $event);
        });

      it('should show the list of available shifts', () => {
        expect(component.coverage).toEqual(coverage1);
      });
    });

    describe('when event is SelfScheduled , and schedules are not available', () => {
      beforeEach(() => {
        component.profileId = 150;
        component = createComponent();
        component.activityList = activityStaffingPlanCoverageMock;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverage1));
        component.schedules = undefined;
        component.activity = expectedActivity;
        component.profiles = [{ id: '25', code: 'test code', name: 'test name', number: '4' }];
        component.getOtherShiftsAvailable(event5, expecteddaysWithoutEvent, $event);
      });

      it('should show the list of available shifts', () => {
        expect(component.coverage).toEqual(coverage1);
      });
    });

    describe('when event is SelfScheduled, activity codes are same', () => {
        beforeEach(() => {
            component.profileId = 150;
            component = createComponent();
            component.activityList = activityStaffingPlanCoverageMock;
            mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
            component.schedules = expectedSchedules;
            component.activity = expectedActivity;
            component.otherShiftAvailable = [{ "id": { "id": 44, "code": "EVE8", "name": "EVE8", "startTime": "15:00:00", "hours": 8, "lunchHours": 0, "payCode": null, "configuration": null }, "timings": "15:00 - 23:00 (8 hrs)", "activity": " (EVE8)", "needs": "2 needed" }, { "id": { "id": 38, "code": "NIGHT8", "name": "NIGHT8", "startTime": "23:00:00", "hours": 8, "lunchHours": 0, "payCode": null, "configuration": null }, "timings": "23:00 - 07:00 (8 hrs)", "activity": " (NIGHT8)", "needs": "5 needed" }, { "id": { "id": 41, "code": "NPNM", "name": "Non Productive Not Monitored", "startTime": "07:00:00", "hours": 8, "lunchHours": 0, "payCode": null, "configuration": null }, "timings": "07:00 - 15:00 (8 hrs)", "activity": " (NPNM)", "needs": "1 needed" }, { "id": { "id": 228, "code": "Test", "name": "Test", "startTime": "07:00:00", "hours": 8, "lunchHours": 8, "payCode": null, "configuration": null }, "timings": "07:00 - 15:00 (8 hrs)", "activity": " (Test)", "needs": "9 needed" }, { "id": { "id": 229, "code": "Test1", "name": "Test1", "startTime": "07:00:00", "hours": 9, "lunchHours": 9, "payCode": null, "configuration": null }, "timings": "07:00 - 16:00 (9 hrs)", "activity": " (Test1)", "needs": "6 needed" }];
            component.profiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
            component.getOtherShiftsAvailable(event5, expecteddays, $event);
        });

      it('should call get other shifts available when acitivity codes are same', () => {
        expect(component.otherShiftAvailable.length).toEqual(2);
      });
    });

    describe('when event is SelfScheduled, selected profile and activity staffing plan profile codes are same', () => {
      beforeEach(() => {
        component.profileId = 150;
        component = createComponent();
        component.activityList = activityStaffingPlanCoverageMock;
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage1));
        component.schedules = expectedSchedules;
        component.activity = expectedActivity;
        component.profiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
        component.otherShiftAvailable = [
          {
            "id": {
              "id": 44,
              "code": "EVE8",
              "name": "EVE8",
              "startTime": "15:00:00",
              "hours": 8,
              "lunchHours": 0,
              "payCode": null,
              "configuration": null
            },
            "timings": "15:00 - 23:00 (8 hrs)",
            "activity": " (EVE8)",
            "needs": "2 needed",
            "profileName": 12
          },
          {
            "id": {
              "id": 38,
              "code": "NIGHT8",
              "name": "NIGHT8",
              "startTime": "23:00:00",
              "hours": 8,
              "lunchHours": 0,
              "payCode": null,
              "configuration": null
            },
            "timings": "23:00 - 07:00 (8 hrs)",
            "activity": " (NIGHT8)",
            "needs": "5 needed",
            "profileName": 1
          },
          {
            "id": {
              "id": 41,
              "code": "NPNM",
              "name": "Non Productive Not Monitored",
              "startTime": "07:00:00",
              "hours": 8,
              "lunchHours": 0,
              "payCode": null,
              "configuration": null
            },
            "timings": "07:00 - 15:00 (8 hrs)",
            "activity": " (NPNM)",
            "needs": "1 needed",
            "profileName": 3
          },
          {
            "id": {
              "id": 228,
              "code": "Test",
              "name": "Test",
              "startTime": "07:00:00",
              "hours": 8,
              "lunchHours": 8,
              "payCode": null,
              "configuration": null
            },
            "timings": "07:00 - 15:00 (8 hrs)",
            "activity": " (Test)",
            "needs": "9 needed",
            "profileName": 56
          },
          {
            "id": {
              "id": 229,
              "code": "Test1",
              "name": "Test1",
              "startTime": "07:00:00",
              "hours": 9,
              "lunchHours": 9,
              "payCode": null,
              "configuration": null
            },
            "timings": "07:00 - 16:00 (9 hrs)",
            "activity": " (Test1)",
            "needs": "6 needed",
            "profileName": 1
          }
        ];
           component.getOtherShiftsAvailable(event5, expecteddays, $event);
      });

      it('should call get other shifts available when selected profile and activity staffing plan profile codes are same', () => {
        expect(component.otherShiftAvailable.length).toEqual(1);
      });
    });

    describe('when event is undefined', () => {
        beforeEach(() => {
            component.profileId = 150;
            let eventEmpty = undefined;
            component = createComponent();
            component.activityList = activityStaffingPlanCoverageMock;
            mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
            component.schedules = expectedSchedules;
            component.activity = expectedActivity;
            component.profiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
            component.getOtherShiftsAvailable(eventEmpty, undefined, $event);
        });

      it('should call get other shifts available when acitivity codes arnede same', () => {
        expect(component.activity).toBeDefined();
      });
    });
  });

  describe('#filterPreferredShifts', () => {
    beforeEach(() => {
      component = createComponent();
      component.preferredActivityIds = [37, 117];
    });

    describe('when shifts are present', () => {
      beforeEach(() => {
        component.otherShiftAvailable = [
          {
            "profileCode": "ARA01",
            "profileName": "ARA01",
            "activities": [
              {
                "activity": {
                  "id": 37,
                  "code": "bbb",
                  "name": "EVE8",
                  "startTime": "16:00:00",
                  "hours": 8,
                  "lunchHours": 0,
                  "payCode": null,
                  "configuration": null,
                  "profile": {
                    "id": 37,
                    "code": "ARA01",
                    "name": "ARA01",
                    "number": null
                  },
                  "selectedDate": "2020-06-05T12:00:00.000Z",
                  "etag": "\"637235739119510000\""
                },
                "timings": "15:00 - 23:00 (8 hrs)",
                "activityCode": " (EVE8)",
                "needs": "9 needed"
              },
              {
                "activity": {
                  "id": 38,
                  "code": "bbb",
                  "name": "NIGHT8",
                  "startTime": "15:00:00",
                  "hours": 8,
                  "lunchHours": 0,
                  "payCode": null,
                  "configuration": null,
                  "profile": {
                    "id": 89,
                    "code": "ARA01",
                    "name": "ARA01",
                    "number": null
                  },
                  "selectedDate": "2020-06-05T12:00:00.000Z",
                  "etag": "\"637235739119510000\""
                },
                "timings": "23:00 - 07:00 (8 hrs)",
                "activityCode": " (NIGHT8)",
                "needs": "4 needed"
              },
              {
                "activity": {
                  "id": 40,
                  "code": "aaa",
                  "name": "Non Productive",
                  "startTime": "15:00:00",
                  "hours": 8,
                  "lunchHours": 1,
                  "payCode": null,
                  "configuration": null,
                  "profile": {
                    "id": 89,
                    "code": "ARA01",
                    "name": "ARA01",
                    "number": null
                  },
                  "selectedDate": "2020-06-05T12:00:00.000Z",
                  "etag": "\"637235739119510000\""
                },
                "timings": "08:00 - 17:00 (8 hrs)",
                "activityCode": " (NP)",
                "needs": "6 needed"
              }
            ]
          }
          ];
        let preferredShifts: IPreferredShift[] = [
            {
              "activity": {
                "id": "37",
                "code": "EVE8",
                "name": "EVE8",
                "startTime": "15:00:00",
                "hours": 8,
                "lunchHours": 0,
                "payCode": null,
                "configuration": null,
                "profile": {
                  "id": "37",
                  "code": "ARA01",
                  "name": "ARA01",
                  "number": null
                },
                "number": "37",
                "start": moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
                "end": moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
                "selectedDate": "2020-06-05T12:00:00.000Z",
                "etag": "\"637235739119510000\""
              },
              "timings": "15:00 - 23:00 (8 hrs)",
              "activityCode": " (EVE8)",
              "needs": "9 needed"
            } ,
            {
              "activity": {
                "id": "38",
                "code": "NIGHT8",
                "name": "NIGHT8",
                "startTime": "23:00:00",
                "hours": 8,
                "lunchHours": 0,
                "payCode": null,
                "configuration": null,
                "profile": {
                  "id": "89",
                  "code": "ARA01",
                  "name": "ARA01",
                  "number": null
                },
                "number": "37",
                "start": moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
                "end": moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
                "selectedDate": "2020-06-05T12:00:00.000Z",
                "etag": "\"637235739119510000\""
              },
              "timings": "23:00 - 07:00 (8 hrs)",
              "activityCode": " (NIGHT8)",
              "needs": "4 needed"
            },
            {
              "activity": {
                "id": "40",
                "code": "NP",
                "name": "Non Productive",
                "startTime": "08:00:00",
                "hours": 8,
                "lunchHours": 1,
                "payCode": null,
                "configuration": null,
                "profile": {
                  "id": "89",
                  "code": "ARA01",
                  "name": "ARA01",
                  "number": null
                },
                "number": "37",
                "start": moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
                "end": moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
                "selectedDate": "2020-06-05T12:00:00.000Z",
                "etag": "\"637235739119510000\""
              },
              "timings": "08:00 - 17:00 (8 hrs)",
              "activityCode": " (NP)",
              "needs": "6 needed"
            }
          ];
        component.preferredShifts = preferredShifts; 
        component.previouslySelectedPreference = expectedSelectedRecentOrgGroup2;
        component.filterPreferredShifts();
      });
      it('Should add the preferred-shifts to the array', ()=> {
        expect(component.preferredShifts.length).toBe(4);
      })
    });

    describe('when shifts are empty', () => {
      beforeEach(() => {
        component.otherShiftAvailable = [
          {
            "profileCode": "ARA01",
            "profileName": "ARA01",
            "activities": []
          }];
        component.previouslySelectedPreference = expectedSelectedRecentOrgGroup2;
        component.filterPreferredShifts();
      });
      it('Preferred shifts array should be empty', ()=> {        
        expect(component.preferredShifts.length).toBe(0);
      })
    });  
});

describe(('#sortPreferredShifts'), () => {
  const activityList = [
    {
      "activity": {
        "id": 37,
        "code": "bbb",
        "name": "EVE8",
        "startTime": "16:00:00",
        "hours": 8,
        "lunchHours": 0,
        "payCode": null,
        "configuration": null,
        "profile": {
          "id": 37,
          "code": "ARA01",
          "name": "ARA01",
          "number": null
        },
        "selectedDate": "2020-06-05T12:00:00.000Z",
        "etag": "\"637235739119510000\""
      },
      "timings": "15:00 - 23:00 (8 hrs)",
      "activityCode": " (EVE8)",
      "needs": "9 needed"
    },
    {
      "activity": {
        "id": 38,
        "code": "bbb",
        "name": "NIGHT8",
        "startTime": "15:00:00",
        "hours": 8,
        "lunchHours": 0,
        "payCode": null,
        "configuration": null,
        "profile": {
          "id": 89,
          "code": "ARA01",
          "name": "ARA01",
          "number": null
        },
        "selectedDate": "2020-06-05T12:00:00.000Z",
        "etag": "\"637235739119510000\""
      },
      "timings": "23:00 - 07:00 (8 hrs)",
      "activityCode": " (NIGHT8)",
      "needs": "4 needed"
    },
    {
      "activity": {
        "id": 40,
        "code": "aaa",
        "name": "Non Productive",
        "startTime": "15:00:00",
        "hours": 8,
        "lunchHours": 1,
        "payCode": null,
        "configuration": null,
        "profile": {
          "id": 89,
          "code": "ARA01",
          "name": "ARA01",
          "number": null
        },
        "selectedDate": "2020-06-05T12:00:00.000Z",
        "etag": "\"637235739119510000\""
      },
      "timings": "08:00 - 17:00 (8 hrs)",
      "activityCode": " (NP)",
      "needs": "6 needed"
    }
    ];
  beforeEach(() => {
    component = createComponent();
  });
  it('Activity1.startdate < Activity2.startdate', () => {
    let res = component.sortPreferredShifts(activityList[0],activityList[1]);
    expect(res).toBeGreaterThan(0);
  });
  it('when startdate is equal and Activity1.code < Activity2.code', () => {
    let res = component.sortPreferredShifts(activityList[1],activityList[2]);
    expect(res).toEqual(1);
  });
  it('when startdate is equal and Activity1.code > Activity2.code', () => {
    let res = component.sortPreferredShifts(activityList[2],activityList[1]);
    expect(res).toEqual(-1);
  });
  it('when startdate is equal and code is equal', () => {
    let res = component.sortPreferredShifts(activityList[1],activityList[1]);
    expect(res).toEqual(0);
  });
});

  describe('#sortCalendarCells', () => {
    const eventArray: Array<ISchedule> = [{
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
      'isTradeRequireEqualLength' : false,
      'activity': {
        'id': '5',
        'code': 'aaa',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      },
      'profile': {
        'id': '117',
        'code': 'Blue01',
        'name': 'Blue01',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    },
    {
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
      'isTradeRequireEqualLength' : false,
      'activity': {
        'id': '5',
        'code': 'bbb',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      },
      'profile': {
        'id': '117',
        'code': 'Blue01',
        'name': 'Blue01',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    },
    {
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
      'payCode': { 'id': '97', 'code': 'aaa', 'name': 'test name', 'number': '6' },
      'isTradeRequireEqualLength' : false,
      'activity': null,
      'profile': {
        'id': '117',
        'code': 'Blue01',
        'name': 'Blue01',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    },
    {
      'employment': null,
      'hours': 7,
      'isScheduledHours': false,
      'startDate': moment('2018-05-05'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': { 'id': '97', 'code': 'bbb', 'name': 'test name', 'number': '6' },
      'isTradeRequireEqualLength' : false,
      'activity': null,
      'profile': {
        'id': '117',
        'code': 'Blue01',
        'name': 'Blue01',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    },
    {
      'employment': null,
      'hours': 7,
      'isScheduledHours': false,
      'startDate': moment('2018-05-05'),
      'requestedDate': moment('2018-05-01'),
      'requestForDates': [],
      'hasStartTime': true,
      'status': 'yes',
      'amount': 5,
      'lunchHours': 1,
      'guid': 'aaaaa',
      'timeZone': '1',
      'jobClass': null,
      'payCode': { 'id': '97', 'code': 'bbb', 'name': 'test name', 'number': '6' },
      'isTradeRequireEqualLength' : false,
      'activity': null,
      'profile': {
        'id': '117',
        'code': 'Blue01',
        'name': 'Blue01',
        'number': null
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
      'facility': {
        'id': '160',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99991',
        'timeZoneId': 'America/Chicago',
        'status': 'true'
      },
      'department': {
        'id': '161',
        'code': 'ADMINS',
        'name': 'ADMINS',
        'number': '99993',
        'status': 'true'
      },
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
      'eventType': null,
      'person': null,
      'scheduleTradeStatus': null
    }];
    beforeEach(() => {

    });
    it('sortCalendarCells - Array with value', () => {
      let sortedArray = component.sortCalendarCells(eventArray);
      expect(sortedArray[0].payCode.code).toEqual('bbb');
    });
  });

  describe(('#sortActivitiesList'), () => {
    const activity = [{
      'activity': {
        'id': '5',
        'code': 'bbb',
        'name': 'test name',
        'number': '8',
        'startTime': '16:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      }
    },
    {
      'activity': {
        'id': '5',
        'code': 'bbb',
        'name': 'test name',
        'number': '8',
        'startTime': '15:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      }
    },
    {
      'activity': {
        'id': '5',
        'code': 'aaa',
        'name': 'test name',
        'number': '8',
        'startTime': '15:00:00',
        'hours': 8,
        'lunchHours': 1,
        'payCode': null,
        'start': moment('2019-07-22'),
        'end': moment('2019-07-23')
      }
    }];
    beforeEach(() => {
      component = createComponent();
    });
    it('Activity1.startdate < Activity2.startdate', () => {
      let res = component.sortActivitiesList(activity[0],activity[1]);
      expect(res).toBeGreaterThan(0);
    });
    it('when startdate is equal and Activity1.code < Activity2.code', () => {
      let res = component.sortActivitiesList(activity[1],activity[2]);
      expect(res).toEqual(1);
    });
    it('when startdate is equal and Activity1.code > Activity2.code', () => {
      let res = component.sortActivitiesList(activity[2],activity[1]);
      expect(res).toEqual(-1);
    });
    it('when startdate is equal and code is equal', () => {
      let res = component.sortActivitiesList(activity[1],activity[1]);
      expect(res).toEqual(0);
    });
  });

  describe('#onClickHandler', () => {
    const currentDay = {
      date: moment('2018-05-19', 'YYYY-MM-DD'),
      isActive: true,
      events: events1,
      etag: 'etag3',
      needCount: 1
    };

    const selectedActivityMock = {
      id: 36,
      code: 'DAY8',
      name: 'DAY8',
      startTime: '07:00:00',
      hours: 8,
      lunchHours: 0,
      payCode: null
    };

    describe('when clicked day event is self scheduled', () => {
      beforeEach(() => {
        component = createComponent();
        component.calendarWeeks = scheduleCalendarWeeks;
        component.onClickHandler(currentDay);
      });
      it('Should not add the activity in calendar cell', () => {
        expect(currentDay.events[0].source).toEqual('SelfScheduled');
      });
    });
    describe('when clicked day has Manual event', ()=> {
      beforeEach(() => {
        component = createComponent();
        events1[0].source = 'Manual';
        currentDay.events = events1;
        component.calendarWeeks = scheduleCalendarWeeks;
        component.overlapModal = mockModal;
        component.onClickHandler(currentDay);
      });
      it('should add the activity in the calendar cell', () => {
        expect(component.overlapModal.open).toHaveBeenCalled();
      });
    });
    describe('when clicked day has Manual event & there are no overlapping shifts available', ()=> {
      const clickedDay = {
        date: moment('2018-05-18', 'YYYY-MM-DD'),
        isActive: true,
        events: [],
        etag: 'etag3',
        needCount: 1
      };
      beforeEach(() => {
        component = createComponent();
        events1[0].source = 'Manual';
        clickedDay.events = events1;
        component.calendarWeeks = scheduleCalendarWeeks;
        storeMock.selectSnapshot.and.returnValue(selectedActivityMock);
        component.onClickHandler(clickedDay);
      });
      it('should not add the activity in the calendar cell', () => {
        expect(selectedActivityMock.id).toBe(36);
      });
    });
  });

  describe('#addShift', () => {
    const selectedShift = {
      activity: {
        id: 36,
        code: 'DAY8',
        name: 'DAY8',
        startTime: '07:00:00',
        hours: 8,
        lunchHours: 0,
        payCode: null
      },
      activityCode: "DAY8",
      needs: "8 needed ",
      profile: { id: 90, code: "ARA02", name: "ARA02", number: null },
      profileName: "ARA02",
      timings: "07:00 - 15:00 (8 hrs)"
    }
    const currentDate = { date: moment('2018-05-19') };
    beforeEach(() => {
      component = createComponent();
      component.overlapModal = mockModal;
      component.calendarWeeks = scheduleCalendarWeeks;
      component.addShift(selectedShift, currentDate);
    });
    it('should get non-overlapping shifts', () => {
      expect(selectedShift.activity.id).toBe(36);
    });

    describe('when there are no overlapping shifts', () => {
      const scheduleCalendarWeeksMock: any = [
        {
          days: [{
            date: moment('2018-05-17', 'YYYY-MM-DD'),
            isActive: true,
            events: [],
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          {
            date: moment('2018-05-18', 'YYYY-MM-DD'),
            isActive: true,
            events: events1,
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          {
            date: moment('2018-05-19', 'YYYY-MM-DD'),
            isActive: true,
            events: undefined,
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          {
            date: moment('2018-05-20', 'YYYY-MM-DD'),
            isActive: true,
            events: [],
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          {
            date: moment('2018-05-21', 'YYYY-MM-DD'),
            isActive: true,
            events: [],
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          {
            date: moment('2018-05-22', 'YYYY-MM-DD'),
            isActive: true,
            events: [],
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          {
            date: moment('2018-05-23', 'YYYY-MM-DD'),
            isActive: true,
            events: [],
            isCurrentPayPeriod: true,
            etag: 'etag2'
          },
          ],
          isCurrent: true,
          numCurrentDays: 7,
          weeklyHours: 80
        }
      ];
      beforeEach(() => {
        component.calendarWeeks = scheduleCalendarWeeksMock;
        component.addShift(selectedShift, currentDate);
      });
      it('store Mock to have been called', () => {
        expect(storeMock.dispatch).toHaveBeenCalled();
      });
    });

    describe('when add shift overlaps with previous calendar day shifts', () => {
      const scheduleCalendarWeeksMock: any = [
        {
          days: [
            {
              date: moment('2018-05-16', 'YYYY-MM-DD'),
              isActive: true,
              events: [{
                'source': 'SelfSchedule',
                'startDate': moment('2020-05-16T23:00:00.000'),
                'lunchHours': 0,
                'hours': 10,
                'activity': {
                  'id': '5',
                  'code': 'test code',
                  'name': 'test name',
                  'number': '10',
                  'startTime': '23:00',
                  'hours': 0,
                  'lunchHours': 1,
                  'payCode': null
                },
              }],
            },
          ],
        }
      ];
      const clickedDate = { date: moment('2018-05-17') };
      beforeEach(() => {
        component.calendarWeeks = scheduleCalendarWeeksMock;
        component.addShift(selectedShift, clickedDate);
      });
      it('should open overlap modal popup', () => {
        expect(component.overlapModal.open).toHaveBeenCalled();
      });
    })

    describe('when add shift overlaps with next day of schedule period end Date', () => {
      const scheduleCalendarWeeksMock: any = [
        {
          'source': 'SelfSchedule',
          'startDate': moment('2018-05-17T23:00:00.000'),
          'hours': 10,
          'lunchHours': 0,
          'activity': {
            'id': '5',
            'code': 'test code',
            'name': 'test name',
            'number': '10',
            'startTime': '23:00:00',
            'hours': 10,
            'lunchHours': 0,
            'payCode': null
          }
        }
      ];

      const currentDayScheduleMock: any = [
        {
          days: [
            {
              date: moment('2018-05-16', 'YYYY-MM-DD'),
              events: [],
            },
          ],
        }
      ];
      const clickedDate = { date: moment('2018-05-17') };
      beforeEach(() => {
        component.calendarWeeks = currentDayScheduleMock;
        employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of({
          events: scheduleCalendarWeeksMock
        }
        ));
        component.addShift(selectedShift, clickedDate);
        component.overlapModal = mockModal;

      });
      it('should open overlap modal popup', () => {
        expect(component.overlapModal.open).toHaveBeenCalled();
      });
    });

    describe('when add shift overlaps with previous day of schedule period start Date', () => {
      const scheduleCalendarWeeksMock: any = [
        {
          'source': 'SelfSchedule',
          'startDate': moment('2018-05-14T23:00:00.000'),
          'hours': 10,
          'lunchHours': 0,
          'activity': {
            'id': '5',
            'code': 'test code',
            'name': 'test name',
            'number': '10',
            'startTime': '23:00',
            'hours': 10,
            'lunchHours': 0,
            'payCode': null

          }
        }
      ];

      const currentDayScheduleMock: any = [
        {
          days: [
            {
              date: moment('2018-05-15', 'YYYY-MM-DD'),
              events: [],
            },
            {
              date: moment('2018-05-16', 'YYYY-MM-DD'),
              events: [],
            },
            {
              date: moment('2018-05-17', 'YYYY-MM-DD'),
              events: [],
            },
          ],
        }
      ];
      const clickedDate = { date: moment('2018-05-15') };
      beforeEach(() => {
        component.calendarWeeks = currentDayScheduleMock;
        employeeScheduleSdkServiceMock.getSchedules.and.returnValue(of({
          events: scheduleCalendarWeeksMock
        }
        ));
        component.addShift(selectedShift, clickedDate);
        component.overlapModal = mockModal;

      });
      it('should open overlap modal popup', () => {
        expect(component.overlapModal.open).toHaveBeenCalled();
      });
    });
  });

  describe('#filterByProfileCode', () => {
    const coverage: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          end: moment(formatDate(new Date(), 'yyyy-MM-dd', 'en')),
          id: '21', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'), need: 4, coverage: 1 }]
      }
      ]
    };

    beforeEach(() => {
      // mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(coverage));
      component.coverage = coverage;
      component.activityList = activityStaffingPlanCoverageMock;
      component.previouslySelectedPreference = expectedSelectedRecentOrgGroup;
      component.filterByProfileCode('test code');
    });
    it('should set the activity value', () => {
      expect(component.activityCode).toBe('test code');
    });
  });

  describe('#filterByProfileCode activity length', () => {
    const coverage: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: []
    };

    beforeEach(() => {
      component.coverage = coverage;
      component.filterByProfileCode('test code');
    });
    it('activity length is of zero', () => {
      expect(component.activityList.length).toBe(0);
    });
  });

  describe('#getActivityStaffingCoverage', () => {
    beforeEach(() => {
      component = createComponent();
      component.schedulePeriod$ = of(undefined);
      component.getActivityStaffingCoverage();
    });
    it('When schedule period is undefined', () => {
       expect(component.schedulePeriod).toBe(undefined);
    });
  });

  describe('close', () => {
    beforeEach(() => {
      component = createComponent();
      component.overlapModal = mockModal;
      component.close();
    });
    it('should call close method', () => {
      expect(component.overlapModal.close).toHaveBeenCalled();
    });
  });
});
