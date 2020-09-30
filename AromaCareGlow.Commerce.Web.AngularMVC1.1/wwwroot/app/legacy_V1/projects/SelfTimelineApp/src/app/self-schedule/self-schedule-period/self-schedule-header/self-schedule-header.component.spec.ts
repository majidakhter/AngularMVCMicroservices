
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { SelfScheduleState } from '../../../store/self-schedule/states/self-schedule.state';
import { of } from 'rxjs';
import * as moment from 'moment';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { IActivity } from 'src/app/time-management-domain/activity';
import { SelfScheduleHeaderComponent } from './self-schedule-header.component';

describe('SelfScheduleFiltersComponent', () => {
  let component: SelfScheduleHeaderComponent;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  function createComponent(): SelfScheduleHeaderComponent {
    const componentMock = new SelfScheduleHeaderComponent(mockDateFormatter, mockStore, mockTranslateService);
    Object.defineProperty(componentMock, 'selectedActivity$', { writable: true });
    Object.defineProperty(componentMock, 'activityStaffingPlanCoverage$', { writable: true });
    Object.defineProperty(componentMock, 'preferenceSetting$', { writable: true });
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

  const expectedSelectedRecentOrgGroup = new PreferenceSetting();
  expectedSelectedRecentOrgGroup.organizationEntityId = '34';
  expectedSelectedRecentOrgGroup.profiles = [{
    id: 132,
    activities: [{id : 21}]
  }];
  expectedSelectedRecentOrgGroup.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();

  const selectedActivity = {
    id: 38,
    code: 'NIGHT8',
    name: 'NIGHT8',
    startTime: '23:00:00',
    hours: 8,
    lunchHours: 0,
    payCode: null
  };

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
    let expectedActivity: IActivity;
    let expectedActivityStaffingPlanCovergae;

    beforeEach(() => {
      mockStore.selectSnapshot.and.returnValue(expectedEmployeeResult);
      component = createComponent();
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

      component.selectedActivity$ = of(expectedActivity);
      component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
      component.activityStaffingPlanCoverage$ = of(expectedActivityStaffingPlanCovergae);
    });

    describe('When the loggedInEmployee has unit value', () => {
      let expectedEmployeeWithUnit;
      beforeEach(() => {
        expectedEmployeeWithUnit = {
          id: 1245,
          code: 'ARA01',
          firstName: 'ARA01',
          lastName: 'ARA01',
          employment: {
            profession: null,
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
                id: 133,
                code: 'AR Unit',
                name: 'AR Unit',
                number: 11110
              },
              timeZoneId: 'America/Chicago'
            },
            effectiveDate: '2008-08-10',
            expireDate: null,
            classification: 'PrimaryHome'
          }
        };
        mockStore.selectSnapshot.and.returnValue(expectedEmployeeWithUnit);
        component.ngOnInit();
      });
      it('unit will have the valid data', () => {
        expect(component.unit).toEqual(expectedEmployeeWithUnit.employment.location.unit.code);
      });
    });

    describe(('#getScheduleDisplayTime'), () => {
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
          spyOn(component, 'formatScheduleTime');
        });
        it('Formatting time to Display', () => {
          component.getScheduleDisplayTime();
          expect(component.formatScheduleTime).toHaveBeenCalled();
        });
        it('with activity parameter', () => {
          component.getScheduleDisplayTime(activity);
          expect(component.formatScheduleTime).toHaveBeenCalled();
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
        const ActivityStaffingPlanCovergae = [
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
              id: '22', code: 'test code', name: 'test name', number: '16'
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
        component.activityStaffingPlanCoverage$ = of(ActivityStaffingPlanCovergae);
        component.ngOnInit();
      });
      it('viewedSelfSchedulePeriods will be undefined', () => {
        expect(component.profileCode).toEqual(undefined);
      });
    });
  });

  describe(('#editPreference'), () => {
    beforeEach(() => {
      component = createComponent();
      component.editPreference();
    });
    it('when edit button is clicked', () => {
      mockStore.selectSnapshot.and.returnValue(true);
      expect(component.store.selectSnapshot<boolean>(SelfScheduleState.getPreferenceModal)).toBe(true);
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

  describe('#formatScheduleTime', () => {
    beforeEach(() => {
        component = createComponent();
        mockDateFormatter.to24HourTime.and.callFake((date: moment.Moment) => {
            return date.format('HH:mm');
        });
        mockStore.selectSnapshot.and.returnValue(selectedActivity);
        component.formatScheduleTime()
      });
    
    it('when activity is null', () => {
      expect(component.startTime).toBe('23:00');
      expect(component.endTime).toBe('07:00');
    })
  });

  describe(('#onDocumentClick'), () => {
    beforeEach(() => {
      component = createComponent();
      component.onDocumentClick();
    });
    it('when click event is triggered in window', () => {
      expect(component.defaultShiftFlag).toBeFalsy();
    });
  });

  describe('#onSelectShift', () => {
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
    });

    describe('when onSelectShift method is called', () => {
      beforeEach(() => {
        component.onSelectShift(activity);
      });

      it('should set the activity and allAvailableShifts to 0', () => {
        expect(component.activity).toBe(activity);
        expect(component.allAvailableShifts).toBe('0');
      });
    });
  });

  describe('#onSelectionChange', () => {
    beforeEach(() => {
      component =createComponent();
    });
    describe('when onSelectionChange method is called', () => {
      beforeEach(() => {
        component.onSelectionChange('0');
      });

      it('should call dispacth', () => {
        expect(mockStore.dispatch).toHaveBeenCalled()
      });
    });
  });

  describe(('#toggleDropdown'), () => {
    beforeEach(() => {
      component = createComponent();
    });

    describe(('toggleDropdown called without parameters'), () => {
      beforeEach(() => {
        component.toggleDropdown();
      });
      it('Should invert the default-shift flag status', () => {
        expect(component.defaultShiftFlag).toBeTruthy();
      });
    });

    describe(('toggleDropdown called with parameters'), () => {
      let event = { type: 'click', stopPropagation: function () { } };

      beforeEach(() => {
        spyOn(event, 'stopPropagation');
        component.toggleDropdown(event);
      });

      it('Should invert the default-shift flag status', () => {
        expect(component.defaultShiftFlag).toBeTruthy();
      });
    });
  });
});