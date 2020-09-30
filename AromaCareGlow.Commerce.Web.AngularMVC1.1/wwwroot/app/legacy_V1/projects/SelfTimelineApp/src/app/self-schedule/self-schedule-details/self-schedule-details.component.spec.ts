

import { SelfScheduleDetailsComponent } from './self-schedule-details.component';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { of } from 'rxjs';
import * as moment from 'moment';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { Store } from '@ngxs/store';
import { SelfScheduleState } from '../../store/self-schedule/states/self-schedule.state';
import { IActivity } from 'src/app/time-management-domain/activity';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { TranslateService } from '@ngx-translate/core';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';

describe('SelfScheduleDetailsComponent', () => {
  let component: SelfScheduleDetailsComponent;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  let mockStore: jasmine.SpyObj<Store>;
  let employeeSdkServiceMock = jasmine.createSpyObj('EmployeeSdkService', ['updatePreferenceSetting']);
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  function createComponent(): SelfScheduleDetailsComponent {
    const componentMock = new SelfScheduleDetailsComponent(mockDateFormatter, mockStore, employeeSdkServiceMock, mockTranslateService);
    Object.defineProperty(componentMock, 'selectedDay$', { writable: true });
    Object.defineProperty(componentMock, 'selectedActivity$', { writable: true });
    Object.defineProperty(componentMock, 'activityStaffingPlanCoverage$', { writable: true });
    Object.defineProperty(componentMock, 'preferenceSetting$', { writable: true });
    Object.defineProperty(componentMock, 'viewedSelfSchedulePeriods$', { writable: true });
    Object.defineProperty(componentMock, 'qualifiedCoverage$', { writable: true });
    return componentMock;
  }

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

  const selectedActivity = {
    id: 38,
    code: 'NIGHT8',
    name: 'NIGHT8',
    startTime: '23:00:00',
    hours: 8,
    lunchHours: 0,
    payCode: null
  };

  const expectedSelectedRecentOrgGroup = new PreferenceSetting();
  expectedSelectedRecentOrgGroup.organizationEntityId = '34';
  expectedSelectedRecentOrgGroup.profiles = [{
    id: 89,
    activities: [{id : 36}]
  }];
  expectedSelectedRecentOrgGroup.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();

  const expectedViewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
  expectedViewedSelfSchedulePeriods.push(new SelfSchedulePeriod('2020-01-01', '2020-01-15'));

  function getExpectedSchedules(): ISchedule[] {
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
          'start': moment('2019-09-03T07:00:00'),
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
        'payCode': {
          'id': '5',
          'code': 'test paycode',
          'name': 'test name',
          'number': '8'
        },
        'isTradeRequireEqualLength' : false,
        'activity': undefined,
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
    return events;
  }

  const expectedQualifiedCoverage: IActivityStaffingPlanCoverage[] = [
    {
      profileGroup: { id: '1', code: 'RN', name: 'RN', number: '5', displayOrder: 88 },
      profile: { id: '89', code: 'ARA01', name: 'ARA01', number: '4' },
      activity: {
        startTime: '07:00:00',
        hours: 8,
        lunchHours: 1,
        payCode: null,
        start: moment('2018-08-01T07:00:00'),
        end: moment('2018-08-01T15:00:00'),
        id: '36',
        code: 'DAY8',
        name: 'DAY8',
        number: '16'
      },
      days: [{ needDate: '2018-08-01', need: 4, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
    },
    {
      profileGroup: { id: '1', code: 'RN', name: 'RN', number: '5', displayOrder: 88 },
      profile: { id: '89', code: 'ARA01', name: 'ARA01', number: '4' },
      activity: {
        startTime: '15:00:00',
        hours: 8,
        lunchHours: 1,
        payCode: null,
        start: moment('2018-08-01T15:00:00'),
        end: moment('2018-08-01T23:00:00'),
        id: '37',
        code: 'EVE8',
        name: 'EVE8',
        number: '16'
      },
      days: [{ needDate: '2018-08-01', need: 4, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
    },
    {
      profileGroup: { id: '1', code: 'RN', name: 'RN', number: '5', displayOrder: 88 },
      profile: { id: '90', code: 'ARA02', name: 'ARA02', number: '4' },
      activity: {
        startTime: '23:00:00',
        hours: 8,
        lunchHours: 1,
        payCode: null,
        start: moment('2018-08-01T23:00:00'),
        end: moment('2018-08-02T07:00:00'),
        id: '38',
        code: 'NIGHT8',
        name: 'NIGHT8',
        number: '16'
      },
      days: [{ needDate: '2018-08-01', need: 1, coverage: 1 }, { needDate: '2018-05-06', need: 0, coverage: 1 }]
    }
  ];

  beforeEach(() => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockDateFormatter = jasmine.createSpyObj('DateFormatter', ['toMonthDateYear', 'toShortDate', 'toMonthDay', 'format', 'to24HourTime']);
    mockStore = jasmine.createSpyObj('Store', ['selectSnapshot', 'dispatch', 'subscribe']);
    mockStore.selectSnapshot.and.callFake(x => {
      if (x === SelfScheduleState.getEmployee) {
        return expectedEmployeeResult;
      }
      if (x === SelfScheduleState.getSelectedActivity) {
        return selectedActivity;
      }
    });
  });

  describe('#ngOnInit', () => {
    let expectedResultSelectedDay: IScheduleCalendarDay;
    let expectedSchedules: ISchedule[];
    let expectedActivity: IActivity;
    let expectedActivityStaffingPlanCovergae;

    beforeEach(() => {
      mockStore.selectSnapshot.and.returnValue(expectedEmployeeResult);
      component = createComponent();
      expectedSchedules = getExpectedSchedules();
      expectedResultSelectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': expectedSchedules, 'isCurrentPayPeriod': true, 'etag': 'test etag' };
      expectedActivity = {
        'code': 'DAY8',
        'start': moment('2019-09-03T07:00:00'),
        'end': moment('2019-07-23'),
        'number': null,
        'hours': 8, 'id': '36', 'lunchHours': 0,
        'name': 'DAY8', 'payCode': null, 'startTime': '07:00'
      };
      expectedActivityStaffingPlanCovergae = [
        {
          profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
          profile: { id: '132', code: 'test code', name: 'test name', number: '4' },
          activity: {
            startTime: '13:45',
            hours: 8,
            lunchHours: 1,
            payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
            start: moment('2019-09-03T07:00:00'),
            end: moment('05-08-2019'),
            id: 21, code: 'test code', name: 'test name', number: '16'
          },
          days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
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

      component.selectedDay$ = of(expectedResultSelectedDay);
      component.selectedActivity$ = of(expectedActivity);
      component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
      component.activityStaffingPlanCoverage$ = of(expectedActivityStaffingPlanCovergae);
      component.viewedSelfSchedulePeriods$ = of(expectedViewedSelfSchedulePeriods);
      component.qualifiedCoverage$ = of(expectedQualifiedCoverage);
    });

    describe('When all data is received and the data is valid', () => {
      beforeEach(() => {
        component.ngOnInit();
      });
      it('selectedDayForSummary, activityCount & paycodeCount will have the valid data', () => {
        expect(component.selectedDayForSummary).toEqual(expectedResultSelectedDay.date);
        expect(component.activityCount).toEqual(1);
        expect(component.paycodeCount).toEqual(1);
      });
    });

    describe('When selectedDay has no valid data', () => {
      beforeEach(() => {
        expectedResultSelectedDay = undefined;
        component.selectedDay$ = of(expectedResultSelectedDay);
        component.ngOnInit();
      });
      it('selectedDayForSummary, activityCount & paycodeCount will be undefined', () => {
        expect(component.selectedDayForSummary).toEqual(undefined);
        expect(component.activityCount).toEqual(undefined);
        expect(component.paycodeCount).toEqual(undefined);
      });
    });

    describe('When loggedInEmployee has no valid data', () => {
      beforeEach(() => {
        const expectedEmployee = undefined;
        mockStore.selectSnapshot.and.returnValue(expectedEmployee);
        component.ngOnInit();
      });
      it('department & facility will be undefined', () => {
        expect(component.department).toEqual(undefined);
        expect(component.facility).toEqual(undefined);
      });
    });

    describe('When selectedActivity has no valid data', () => {
      beforeEach(() => {
        const expectedActivityValue = undefined;
        component.selectedActivity$ = of(expectedActivityValue);
        component.ngOnInit();
      });
      it('startTime & endTime will be undefined', () => {
        expect(component.startTime).toEqual(undefined);
        expect(component.endTime).toEqual(undefined);
      });
    });

    describe('When preferenceSetting has no valid data', () => {
      beforeEach(() => {
        const expectedPreferenceSetting = undefined;
        component.preferenceSetting$ = of(expectedPreferenceSetting);
        component.ngOnInit();
      });
      it('preferenceActivityId will be undefined', () => {
        expect(component.preferenceActivityIds).toEqual(undefined);
      });
    });

    describe('When viewedSelfSchedulePeriods has no valid data', () => {
      beforeEach(() => {
        const expectedViewedSelfSchedulePeriodsList = undefined;
        component.viewedSelfSchedulePeriods$ = of(expectedViewedSelfSchedulePeriodsList);
        component.ngOnInit();
      });
      it('viewedSelfSchedulePeriods will be undefined', () => {
        expect(component.viewedSelfSchedulePeriods).toEqual(undefined);
      });
    });

    describe('When qualified coverage is undefined', () => {
      beforeEach(() => {
        component.qualifiedCoverage$ = of(undefined);
        component.ngOnInit();
      });
      it('viewedSelfSchedulePeriods will be undefined', () => {
        expect(component.profileCode).toEqual(undefined);
      });
    });
  });

  describe(('#formatScheduleTime'), () => {
    const activity: IActivity = {
      'id': '5',
      'code': 'test activity',
      'name': 'test name',
      'number': '8',
      'startTime': '16:00:00',
      'hours': 8,
      'lunchHours': 1,
      'payCode': null,
      'start': moment('2019-09-03T07:00:00'),
      'end': moment('2019-07-23')
    };
    beforeEach(() => {
      component = createComponent();
      component.activity = activity;
      component.formatScheduleTime();
    });

    it('when activity is not null', () => {
      expect(component.startTime).toBe(undefined);
    });
  });

  describe('#getPreferredShift', () => {
    beforeEach(() => {
      component = createComponent();
    });

    describe('when qualifiedCoverage is null', () => {
      beforeEach(() => {
        component.activity = null;
        component.qualifiedCoverage = null
        component.getPreferredShift();
      });

      it('activity will be null', () => {
        expect(component.activity).toBe(null)
      });
    });

    describe('when qualifiedCoverage is defined, qualifiedCoverage and activityStaffingPlanCoverageArray length is greater than zero ', () => {
      beforeEach(() => {
        component.preferenceActivityIds = [37]
        component.preferenceProfileId = '89';
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.getPreferredShift();
      });

      it('activity should be defined', () => {
        expect(component.activity.startTime).toBe('23:00:00');
      });
    });
  });

  describe(('#sortActivities'), () => {
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
      let res = component.sortActivities(activity[0],activity[1]);
      expect(res).toBeGreaterThan(0);
    });
    it('when startdate is equal and Activity1.code < Activity2.code', () => {
      let res = component.sortActivities(activity[1],activity[2]);
      expect(res).toEqual(1);
    });
    it('when startdate is equal and Activity1.code > Activity2.code', () => {
      let res = component.sortActivities(activity[2],activity[1]);
      expect(res).toEqual(-1);
    });
    it('when startdate is equal and code is equal', () => {
      let res = component.sortActivities(activity[1],activity[1]);
      expect(res).toEqual(0);
    });
  });
});
