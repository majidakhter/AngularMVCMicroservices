
import { SelfSchedulePreferenceComponent } from './self-schedule-preference.component';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { Store } from '@ngxs/store';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { Employee } from 'src/app/time-management-domain/employee';
import { IEmployment } from 'src/app/time-management-domain/employment';
import { of } from 'rxjs';
import { IProfile } from 'src/app/time-management-domain/profile';
import { IActivityStaffingPlanCoverage, ICoverage } from 'src/app/time-management-domain/coverage';
import * as moment from 'moment';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { Activity, IActivity } from 'src/app/time-management-domain/activity';
import { SelfScheduleState } from '../../store/self-schedule/states/self-schedule.state';

describe('SelfSchedulePreferenceComponent', () => {
  let mockEmployeeOrganizationSdkService: jasmine.SpyObj<EmployeeOrganizationSdkService>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockOrganizationSdkService: jasmine.SpyObj<OrganizationSdkService>;
  let component: SelfSchedulePreferenceComponent;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockDateformatter: jasmine.SpyObj<DateFormatter>;
  let mockEmployeeSdkService: jasmine.SpyObj<EmployeeSdkService>;

  function createComponent(): SelfSchedulePreferenceComponent {
    component = new SelfSchedulePreferenceComponent(mockEmployeeOrganizationSdkService, mockStore, mockOrganizationSdkService, mockTranslateService, mockDateformatter, mockEmployeeSdkService);
    Object.defineProperty(component, 'loggedInEmployee$', { writable: true });
    Object.defineProperty(component, 'viewedSelfSchedulePeriods$', { writable: true });
    Object.defineProperty(component, 'schedulePeriods$', { writable: true });
    Object.defineProperty(component, 'schedulePeriod$', { writable: true });
    Object.defineProperty(component, 'preferenceSetting$', { writable: true });
    Object.defineProperty(component, 'qualifiedCoverage$', { writable: true });
    return component;
  }

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
      days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
    }
    ]
  };
  const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
  const expectedSchedulePeriod: SchedulePeriod = { start: moment('06-08-2019'), end: moment('07-08-2019'), status: 'Self Scheduling' };
  let expectedEmployee: Employee = {
    id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
    employment: {
      profession: {},
      location: {
        facility: { id: '102' },
        timeZoneId: 'CST'
      }
    } as IEmployment
  };
  const expectedActivity: IActivity = {
    startTime: '13:00', hours: 6, lunchHours: 1,
    payCode: { id: '32', code: '76', name: 'test paycode', number: '8' },
    start: moment('2019-09-12'), end: moment('2019-09-12'),
    id: '33', code: '77', name: 'test activity', number: '12'
  };
  const expectedPreferenceSetting = new PreferenceSetting();
  expectedPreferenceSetting.organizationEntityId = '34';
  expectedPreferenceSetting.profiles = [{
    id: 89,
    activities: [{id: 36}]
  }];
  expectedPreferenceSetting.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();

  const expectedViewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
  expectedViewedSelfSchedulePeriods.push(new SelfSchedulePeriod('2020-01-01', '2020-01-15'));
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

  const expectedQualifiedProfiles: IProfile[] = [
    {
      id: '89',
      code: 'ARA01',
      name: 'ARA01',
      number: null
    },
    {
      id: '90',
      code: 'ARA02',
      name: 'ARA02',
      number: null
    }
  ];

  beforeEach(() => {
    mockEmployeeOrganizationSdkService = jasmine.createSpyObj('EmployeeOrganizationSdkService', ['getSelfScheduleEmployeeProfiles', 'subscribe']);
    mockStore = jasmine.createSpyObj<Store>('Store', ['selectSnapshot', 'dispatch', 'subscribe']);
    mockOrganizationSdkService = jasmine.createSpyObj('OrganizationSdkService', ['getActivityStaffingCoverage', 'subscribe']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockDateformatter = jasmine.createSpyObj('DateFormatter', ['toMonthDay']);
    mockEmployeeSdkService = jasmine.createSpyObj('EmployeeSdkService', ['getEmployee', 'subscribe', 'updatePreferenceSetting']);
    mockStore.selectSnapshot.and.callFake(x => {
      if (x === SelfScheduleState.getQualifiedProfiles) {
        return expectedQualifiedProfiles;
      }
      if (x === SelfScheduleState.getSelfSchedulePeriod) {
        return expectedSchedulePeriod;
      }
      if (x === SelfScheduleState.getPreferenceSetting) {
        return expectedPreferenceSetting;
      }
    });
    component = createComponent();
  });

  describe('#ngOnInit', () => {
    describe('When employee information is available', () => {
      beforeEach(() => {
        component.loggedInEmployee$ = of(expectedEmployee);
        component.viewedSelfSchedulePeriods$ = of(expectedViewedSelfSchedulePeriods);
        component.qualifiedCoverage$ = of(expectedQualifiedCoverage);
        component.ngOnInit();
      });
      it('organizationUnitId will have the data', () => {
        expect(component.organizationUnitId).toEqual('102');
      });
    });

    describe('When qualified coverage is there but schedule period is undefined', () => {
      beforeEach(() => {
        spyOn(component, 'getProfiles');
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getQualifiedProfiles) {
            return expectedQualifiedProfiles;
          }
          if (x === SelfScheduleState.getSelfSchedulePeriod) {
            return undefined;
          }
          if (x === SelfScheduleState.getPreferenceSetting) {
            return expectedPreferenceSetting;
          }
        });
        component.loggedInEmployee$ = of(expectedEmployee);
        component.viewedSelfSchedulePeriods$ = of(expectedViewedSelfSchedulePeriods);
        component.qualifiedCoverage$ = of(expectedQualifiedCoverage);
        component.ngOnInit();
      });
      it('should not call getProfile method', () => {
        expect(component.getProfiles).toHaveBeenCalledTimes(0);
      });
    });

    describe('When previously selected preference is undefined', () => {
      beforeEach(() => {
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getQualifiedProfiles) {
            return expectedQualifiedProfiles;
          }
          if (x === SelfScheduleState.getSelfSchedulePeriod) {
            return expectedSchedulePeriod;
          }
          if (x === SelfScheduleState.getPreferenceSetting) {
            return undefined;
          }
        });
        component.loggedInEmployee$ = of(expectedEmployee);
        component.viewedSelfSchedulePeriods$ = of(expectedViewedSelfSchedulePeriods);
        component.qualifiedCoverage$ = of(expectedQualifiedCoverage);
        component.ngOnInit();
      });
      it('previouslySelectedPreference will not have the data', () => {
        expect(component.previouslySelectedPreference).toEqual(undefined);
      });
    });

    describe('When employee information is not available, qualified coverage is undefined and viewedSelfSchedulePeriods is not available', () => {
      beforeEach(() => {
        expectedEmployee = undefined;
        component.loggedInEmployee$ = of(expectedEmployee);
        component.viewedSelfSchedulePeriods$ = of(undefined);
        component.qualifiedCoverage$ = of(undefined);
        component.ngOnInit();
      });

      it('organizationUnitId will have the data', () => {
        expect(component.organizationUnitId).toEqual(undefined);
      });
      it('viewedSelfSchedulePeriods will not have the data', () => {
        expect(component.viewedSelfSchedulePeriods).toEqual(undefined);
      });
      it('qualified coverage should be undefined', () => {
        expect(component.qualifiedCoverage).toEqual(undefined);
      });
    });

    describe('When isPreferenceMatched is true', () => {
      const expectedPreferenceSettingMock = new PreferenceSetting();
      beforeEach(() => {
        expectedPreferenceSettingMock.profiles = [{
          id: 76,
          activities: [{ id: 21 }, { id: 38 }]
        }];
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === SelfScheduleState.getQualifiedProfiles) {
            return expectedQualifiedProfiles;
          }
          if (x === SelfScheduleState.getSelfSchedulePeriod) {
            return expectedSchedulePeriod;
          }
          if (x === SelfScheduleState.getPreferenceSetting) {
            return expectedPreferenceSettingMock;
          }
        });
        component.loggedInEmployee$ = of(expectedEmployee);
        component.viewedSelfSchedulePeriods$ = of(expectedViewedSelfSchedulePeriods);
        component.qualifiedCoverage$ = of(expectedQualifiedCoverage);
        component.ngOnInit();
      });
      it('isSchedulePeriodChanged will be true', () => {
        expect(component.isSchedulePeriodChanged).toEqual(true);
      });
    });
  });

  describe('#isPreferenceMatched', () => {
    let result;
    const expectedSelectedRecentOrgGroup = new PreferenceSetting();
    beforeEach(() => {
      expectedSelectedRecentOrgGroup.profiles = [{
        id: 76,
        activities: [{ id: 21 }, { id: 38 }]
      }];
      mockStore.selectSnapshot.and.callFake(x => {
        if (x === SelfScheduleState.getPreferenceSetting) {
          return expectedSelectedRecentOrgGroup;
        }
      });
      component.qualifiedCoverage = [
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
        });
        result = component.isPreferenceMatched();
      });
      it('the isPreferenceMatched() will return true', () => {
        expect(result).toEqual(true);
      });
    });
  });

  describe('#getprofiles', () => {
    beforeEach(() => {
      component.qualifiedProfiles = expectedQualifiedProfiles;
      component.previouslySelectedPreference = expectedPreferenceSetting;
      component.qualifiedCoverage = expectedQualifiedCoverage;
    });
    describe('When qaulified profiles array has data', () => {
      beforeEach(() => {
        component.getProfiles();
      });
      it('should list-out the qualified profiles in the preference popup', () => {
        expect(component.profiles[0].code).toEqual('ARA01');
      });
    });

    describe('When qaulified profiles do not match with previously selected profile', () => {
      beforeEach(() => {
        const previousPreference = new PreferenceSetting();
        previousPreference.organizationEntityId = '34';
        previousPreference.profiles = [{
          id: 91,
          activities: [{ id: 74 }]
        }];
        component.previouslySelectedPreference = previousPreference;
        component.getProfiles();
      });
      it('should display the profiles in the preference popup', () => {
        expect(component.profiles[0].code).toEqual('ARA01');
      });
    });

    describe('When qaulified profiles array does not have data', () => {
      beforeEach(() => {
        component.qualifiedProfiles = undefined;
        component.getProfiles();
      });
      it('should not list-out the qualified profiles in the preference popup', () => {
        expect(component.profiles).toEqual(null);
      });
    });
  });

  describe('#filterByProfileCode', () => {
    let profileCode;
    describe('When previouslySelectedPreference is undefined and profileCode does not match with qualifiedCoverage profile codes', () => {
      beforeEach(() => {
        profileCode = 92;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = undefined;
        component.filterByProfileCode(profileCode);
      });
      it('activity list should be empty', () => {
        expect(component.activityList.length).toEqual(0);
      });
    });
  });

  describe('#getActivities', () => {
    let profileId;
    describe('When profileId and previously selected preference profileIds are same', () => {
      beforeEach(() => {
        profileId = 89;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = expectedPreferenceSetting;
        component.getActivities(profileId);
      });
      it('preferredShifts array should have data', () => {
        expect(component.preferredShifts.length).toEqual(1);
      });
    });

    describe('When profileId and previously selected preference profileIds are difference', () => {
      beforeEach(() => {
        profileId = 90;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = expectedPreferenceSetting;
        component.getActivities(profileId);
      });
      it('preferredShifts array should be empty', () => {
        expect(component.preferredShifts.length).toEqual(0);
      });
    });

    describe('When profileId and previously selected preference profileIds are same and isSchedulePeriodChanged flag is true', () => {
      beforeEach(() => {
        profileId = 89;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = expectedPreferenceSetting;
        component.isSchedulePeriodChanged = true;
        component.getActivities(profileId);
      });
      it('preferredShifts array should have data', () => {
        expect(component.preferredShifts.length).toEqual(1);
      });
    });

    describe('When isSchedulePeriodChanged flag is true but previous selection activities do not match with activity list', () => {
      const preferenceSettingMock = new PreferenceSetting();
      preferenceSettingMock.organizationEntityId = '34';
      preferenceSettingMock.profiles = [{
        id: 89,
        activities: [{ id: 40 }]
      }];
      beforeEach(() => {
        profileId = 89;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = preferenceSettingMock;
        component.isSchedulePeriodChanged = true;
        component.getActivities(profileId);
      });
      it('preferredShifts array should have data', () => {
        expect(component.preferredShifts.length).toEqual(1);
      });
    });
  });

  describe('#getSchedulePeriodDuration', () => {
    describe('When startdate and enddate are defined', () => {
      beforeEach(() => {
        component.schedulePeriod = expectedSchedulePeriod;
        component.startDate = expectedSchedulePeriod.start;
        component.endDate = expectedSchedulePeriod.end;
        component.getSchedulePeriodDuration();
      });
      it('should show the schedule period duration in the popup', () => {
        expect(component.startDate).toEqual(moment('06-08-2019'));
      });
    });
    describe('When startDate and endDate are undefined', () => {
      beforeEach(() => {
        component.getSchedulePeriodDuration();
      });
      it('should not show the schedule period duration in the popup', () => {
        expect(component.startDate).toEqual(undefined);
      });
    });
  });

  describe('displaying activity time range', () => {
    beforeEach(() => {
      const item = {
        'profileGroup': null,
        'profile': {
          'id': 443,
          'code': 'daily',
          'name': 'daily',
          'number': null
        },
        'activity': {
          'id': 163,
          'code': 'DAY8',
          'name': 'DAY8',
          'startTime': '07:00:00',
          'hours': 8,
          'lunchHours': 0,
          'payCode': null,
          'configuration': null
        },
        'days': [
          {
            'needDate': '2020-01-05',
            'need': 6,
            'coverage': 0
          },
          {
            'needDate': '2020-01-06',
            'need': 6,
            'coverage': 0
          }
        ]
      };
      component.previouslySelectedPreference = expectedPreferenceSetting;
      component.coverage = expectedCoverage;
      component.getTimeRange(item);
    });
    it('activityDetails will not have the data', () => {
      expect(component.coverage).toEqual(expectedCoverage);
    });
  });

  describe('#closeApprovalModal', () => {
    describe('When Selected Profile is matched', () => {
      beforeEach(() => {
        component.profiles = expectedQualifiedProfiles;
        component.schedulePeriod = expectedSchedulePeriod;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = expectedPreferenceSetting;
        component.closeApprovalModal();
      });
      it('profileCode will have the date', () => {
        expect(component.profileCode).toEqual('ARA01');
      });
    });
    describe('When Selected Profile is not matched', () => {
      beforeEach(() => {
        component.profiles = [{ id: '32', code: 'test code1', name: 'test name1', number: '5' }];
        component.schedulePeriod = expectedSchedulePeriod;
        component.qualifiedCoverage = expectedQualifiedCoverage;
        component.previouslySelectedPreference = expectedPreferenceSetting;
        component.closeApprovalModal();
      });
      it('profileCode will not have the date', () => {
        expect(component.profileCode).toBeUndefined();
      });
    });
  });

  describe('#getApplyButtonStatus', () => {
    let parameterActivity;
    beforeEach(() => {
      parameterActivity = {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('05-08-2019'),
        end: moment('05-08-2019'),
        id: '44', code: 'test code', name: 'test name', number: '16'
      };
    });
    describe(('When preferredShits array has data'), () => {
      beforeEach(() => {
        component.preferredShifts = ['21', '44'];
        component.getApplyButtonStatus();
      });
      it('should set the isApplyButtonDisabled as false', () => {
        expect(component.isApplyButtonDisabled).toEqual(false);
      });
      it('activityID is equal to parameterActivityId', () => {
        expect(component.preferredShifts[1]).toEqual(parameterActivity.id);
      });
    });
    describe(('When preferredShits array is empty'), () => {
      beforeEach(() => {
        component.preferredShifts = [];
        component.getApplyButtonStatus();
      });
      it('should set the isApplyButtonDisabled as true', () => {
        expect(component.isApplyButtonDisabled).toEqual(true);
      });
    });
  });

  describe('#savePreferenceSetting', () => {
    let employee;
    const activityMock: IActivity[] = [
      {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('2019-09-03T07:00:00'),
        end: moment('05-08-2019'),
        id: '21',
        code: 'DAY8',
        name: 'DAY8',
        number: '16'
      },
      {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('2019-09-03T07:00:00'),
        end: moment('05-08-2019'),
        id: '21',
        code: 'morng2',
        name: 'morng2',
        number: '16'
      },
      {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('2019-09-03T07:00:00'),
        end: moment('05-08-2019'),
        id: '36',
        code: 'EVE8',
        name: 'EVE8',
        number: '16'
      }
    ];
    beforeEach(() => {
      mockEmployeeSdkService.updatePreferenceSetting.and.returnValue(of({}));
      employee = { code: 77 };
      component.organizationUnitId = '103';
      component.activity = expectedActivity;
      component.profileId = 42;
      mockEmployeeOrganizationSdkService.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
      component.schedulePeriod$ = of(expectedSchedulePeriod);
      mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
      component.activityList = activityMock;
      component.preferredShifts = ['21', '34'];
    });
    describe(('When viewedSelfSchedulePeriods has value'), () => {
      beforeEach(() => {
        component.viewedSelfSchedulePeriods = expectedViewedSelfSchedulePeriods;
        component.savePreferenceSetting();
      });
      it('should call the close', () => {
        mockStore.selectSnapshot.and.returnValue(true);
        expect(component.store.selectSnapshot<boolean>(SelfScheduleState.getPreferenceModal)).toBe(true);
      });
      it('should call the updatePreferenceSetting service', () => {
        expect(mockEmployeeSdkService.updatePreferenceSetting).toHaveBeenCalled();
      });
    });
    describe(('When viewedSelfSchedulePeriods does not have value'), () => {
      beforeEach(() => {
        component.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
        component.savePreferenceSetting();
      });
      it('should call the close', () => {
        mockStore.selectSnapshot.and.returnValue(true);
        expect(component.store.selectSnapshot<boolean>(SelfScheduleState.getPreferenceModal)).toBe(true);
      });
      it('should call the updatePreferenceSetting service', () => {
        expect(mockEmployeeSdkService.updatePreferenceSetting).toHaveBeenCalled();
      });
    });
  });

  describe(('#sortActivities'), () => {
    const activity = [{
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
    {
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
    },
    {
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
    }];
    beforeEach(() => {
      component = createComponent();
    });
    it('Activity1.startdate < Activity2.startdate', () => {
      const res = component.sortActivities(activity[0], activity[1]);
      expect(res).toBeGreaterThan(0);
    });
    it('when startdate is equal and Activity1.code < Activity2.code', () => {
      const res = component.sortActivities(activity[1], activity[2]);
      expect(res).toEqual(1);
    });
    it('when startdate is equal and Activity1.code > Activity2.code', () => {
      const res = component.sortActivities(activity[2], activity[1]);
      expect(res).toEqual(-1);
    });
    it('when startdate is equal and code is equal', () => {
      const res = component.sortActivities(activity[1], activity[1]);
      expect(res).toEqual(0);
    });
  });
});
