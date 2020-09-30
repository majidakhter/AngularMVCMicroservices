

import { IShift, SelfScheduleState } from './self-schedule.state';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import * as moment from 'moment';
import { SetCommitmentsRefreshStatus, SetDisplayShiftNeeds, SetEmployee, SetPreferenceSetting, SetSchedulePeriods, SetSelectedActivity, SetSelectedDate, SetSelfSchedulePeriod,
  SetShift, SetViewedSelfSchedulePeriods, SetPreferenceModal, SetPreferredShifts, SetQualifiedProfiles, SetQualifiedCoverage } from '../actions/self-schedule.actions';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { Employee } from 'src/app/time-management-domain/employee';
import { IEmployment } from 'src/app/time-management-domain/employment';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { IActivity } from 'src/app/time-management-domain/activity';
import { IProfile } from 'src/app/time-management-domain/profile';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';

describe('SelfScheduleState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([
          SelfScheduleState
        ])
      ]
    });
  });

  function getSchedulePeriods() {
    const startDate = moment().startOf('day');
    const endDate = moment(startDate).add(2, 'weeks').endOf('day');
    let schedulePeriods: Array<SchedulePeriod>;

    schedulePeriods = [
      { start: startDate, end: endDate, status: 'Self Scheduling' },
      { start: moment(startDate).add(4, 'weeks').endOf('day'), end: moment(startDate).add(6, 'weeks').endOf('day'), status: 'Self Scheduling' },
      { start: moment(startDate).add(8, 'weeks').endOf('day'), end: moment(startDate).add(10, 'weeks').endOf('day'), status: 'Manual' }
    ];
    return schedulePeriods;
  }

  describe('#SetSelectedDate', () => {
    describe('when setting selectedDay', () => {
      let selectedDay: IScheduleCalendarDay;
      beforeEach(() => {
        selectedDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': [], 'isCurrentPayPeriod': true, 'etag': 'test etag' };
        store = TestBed.get(Store);
        store.dispatch(new SetSelectedDate(selectedDay));
      });

      it('should update store', (done) => {
        store.selectOnce(state => state.selfschedule.selectedDay).subscribe((day: IScheduleCalendarDay) => {
          expect(day).toEqual(selectedDay);
          done();
        });
      });
    });
  });

  describe('#getSelectedDay', () => {
    describe('when there is a selectedDay', () => {
      let selectedDay: IScheduleCalendarDay;
      let mockDay: IScheduleCalendarDay;
      beforeEach(() => {
        mockDay = { 'date': moment('2019-07-22'), 'isActive': true, 'events': [], 'isCurrentPayPeriod': true, 'etag': 'test etag' };
        selectedDay = SelfScheduleState.getSelectedDay({
          selectedDay: mockDay
        });
      });

      it('should get selectedDay from store', () => {
        expect(selectedDay).toEqual(mockDay);
      });
    });

    describe('when there is no selectedDay', () => {
      let selectedDay: IScheduleCalendarDay;
      beforeEach(() => {
        selectedDay = SelfScheduleState.getSelectedDay({
          selectedDay: null
        });
      });
      it('should get null from store', () => {
        expect(selectedDay).toBeNull();
      });
    });
  });

  describe('#SetEmployee', () => {
    describe('when setting Employee', () => {
      let loggedInEmployee: Employee;
      beforeEach(() => {
        loggedInEmployee = {
          id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
          employment: {
            profession: {},
            location: {
              facility: { id: '102' },
              timeZoneId: 'CST'
            }
          } as IEmployment
        };
        store = TestBed.get(Store);
        store.dispatch(new SetEmployee(loggedInEmployee));
      });

      it('should update the employee information in store', (done) => {
        store.selectOnce(state => state.selfschedule.employee).subscribe((employeeRes: Employee) => {
          expect(employeeRes).toEqual(loggedInEmployee);
          done();
        });
      });
    });
  });

  describe('#getEmployee', () => {
    describe('when there is an Employee', () => {
      let loggedInEmployee: Employee;
      let mockEmployee: Employee;
      beforeEach(() => {
        mockEmployee = {
          id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
          employment: {
            profession: {},
            location: {
              facility: { id: '102' },
              timeZoneId: 'CST'
            }
          } as IEmployment
        };

        loggedInEmployee = SelfScheduleState.getEmployee({
          employee: mockEmployee
        });
      });

      it('should get the employee from store', () => {
        expect(loggedInEmployee).toEqual(mockEmployee);
      });
    });
  });

  describe('#SetSchedulePeriods', () => {
    describe('when setting SchedulePeriods', () => {
      const schedulePeriods: Array<SchedulePeriod> = getSchedulePeriods();
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetSchedulePeriods(schedulePeriods));
      });

      it('should update the schedulePeriods in store', (done) => {
        store.selectOnce(state => state.selfschedule.schedulePeriods).subscribe((schedulePeriodsRes: Array<SchedulePeriod>) => {
          expect(schedulePeriodsRes).toEqual(schedulePeriods);
          done();
        });
      });
    });
  });

  describe('#getSchedulePeriods', () => {
    describe('when there is SchedulePeriods', () => {
      let schedulePeriods: Array<SchedulePeriod>;
      const mockSchedulePeriods: Array<SchedulePeriod> = getSchedulePeriods();
      beforeEach(() => {
        schedulePeriods = SelfScheduleState.getSchedulePeriods({
          schedulePeriods: mockSchedulePeriods
        });
      });

      it('should get the SchedulePeriods from store', () => {
        expect(schedulePeriods).toEqual(mockSchedulePeriods);
      });
    });
  });

  describe('#SetSelfSchedulePeriod', () => {
    describe('when setting SchedulePeriod', () => {
      const schedulePeriod: SchedulePeriod = { start: moment().add(4, 'weeks').endOf('day'), end: moment().add(6, 'weeks').endOf('day'), status: 'Self Scheduling' };
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetSelfSchedulePeriod(schedulePeriod));
      });

      it('should update the schedulePeriod in store', (done) => {
        store.selectOnce(state => state.selfschedule.selfSchedulePeriod).subscribe((schedulePeriodRes: SchedulePeriod) => {
          expect(schedulePeriodRes).toEqual(schedulePeriod);
          done();
        });
      });
    });
  });

  describe('#getSelfSchedulePeriod', () => {
    describe('when there is SchedulePeriod', () => {
      let schedulePeriod: SchedulePeriod;
      const mockSchedulePeriod: SchedulePeriod = { start: moment().add(4, 'weeks').endOf('day'), end: moment().add(6, 'weeks').endOf('day'), status: 'Self Scheduling' };
      beforeEach(() => {
        schedulePeriod = SelfScheduleState.getSelfSchedulePeriod({
          selfSchedulePeriod: mockSchedulePeriod
        });
      });

      it('should get the SchedulePeriod from store', () => {
        expect(schedulePeriod).toEqual(mockSchedulePeriod);
      });
    });
  });

  describe('#SetPreferenceSetting', () => {
    describe('when setting SetPreferenceSetting', () => {
      const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      const preferenceSetting: PreferenceSetting = { organizationEntityId: '234', profiles: [{ id: 12, activities: [{ id: 5 }] }], viewedSelfSchedulePeriods: viewedSelfSchedulePeriods };
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetPreferenceSetting(preferenceSetting));
      });

      it('should update the preferenceSetting in store', (done) => {
        store.selectOnce(state => state.selfschedule.preferenceSetting).subscribe((preferenceSettingRes: PreferenceSetting) => {
          expect(preferenceSettingRes).toEqual(preferenceSetting);
          done();
        });
      });
    });
  });

  describe('#getPreferenceSetting', () => {
    describe('when there is PreferenceSetting', () => {
      let preferenceSetting: PreferenceSetting;
      const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      const mockpreferenceSetting: PreferenceSetting = { organizationEntityId: '234', profiles: [{ id: 12, activities: [{ id: 5 }] }], viewedSelfSchedulePeriods: viewedSelfSchedulePeriods };
      beforeEach(() => {
        preferenceSetting = SelfScheduleState.getPreferenceSetting({
          preferenceSetting: mockpreferenceSetting
        });
      });

      it('should get the PreferenceSetting from store', () => {
        expect(preferenceSetting).toEqual(mockpreferenceSetting);
      });
    });
  });

  describe('#SetViewedSelfSchedulePeriods', () => {
    describe('when setting ViewedSelfSchedulePeriods', () => {
      const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      viewedSelfSchedulePeriods.push(new SelfSchedulePeriod('2020-01-01', '2020-01-15'));
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetViewedSelfSchedulePeriods(viewedSelfSchedulePeriods));
      });

      it('should update the viewedSelfSchedulePeriods in store', (done) => {
        store.selectOnce(state => state.selfschedule.viewedSelfSchedulePeriods).subscribe((res: Array<SelfSchedulePeriod>) => {
          expect(res).toEqual(viewedSelfSchedulePeriods);
          done();
        });
      });
    });
  });

  describe('#getViewedSelfSchedulePeriods', () => {
    describe('when viewedSelfSchedulePeriods is available', () => {
      let viewedSelfSchedulePeriods: Array<SelfSchedulePeriod>;
      const mockViewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      mockViewedSelfSchedulePeriods.push(new SelfSchedulePeriod('2020-01-01', '2020-01-15'));
      beforeEach(() => {
        viewedSelfSchedulePeriods = SelfScheduleState.getViewedSelfSchedulePeriods({
          viewedSelfSchedulePeriods: mockViewedSelfSchedulePeriods
        });
      });

      it('should get the PreferenceSetting from store', () => {
        expect(viewedSelfSchedulePeriods).toEqual(mockViewedSelfSchedulePeriods);
      });
    });
  });

  describe('#SetSelectedActivity', () => {
    describe('when setting SetSelectedActivity', () => {
      const activity: IActivity = {
        id: '234',
        code: 'ara01',
        name: 'ara01',
        startTime: '2019-07-22',
        hours: 6,
        start: moment('2019-07-22'),
        lunchHours: 1,
        payCode: null,
        end: moment('2019-07-23'),
        number: ''
      };
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetSelectedActivity(activity));
      });

      it('should update the SelectedActivity in store', (done) => {
        store.selectOnce(state => state.selfschedule.selectedActivity).subscribe((activityRes: IActivity) => {
          expect(activityRes).toEqual(activity);
          done();
        });
      });
    });
  });

  describe('#getSelectedActivity', () => {
    describe('when there is SelectedActivity', () => {
      let activity: IActivity;
      const mockSelectedActivity: IActivity = {
        id: '234',
        code: 'ara01',
        name: 'ara01',
        startTime: '2019-07-22',
        hours: 6,
        start: moment('2019-07-22'),
        lunchHours: 1,
        payCode: null,
        end: moment('2019-07-23'),
        number: ''
      };
      beforeEach(() => {
        activity = SelfScheduleState.getSelectedActivity({
          selectedActivity: mockSelectedActivity
        });
      });

      it('should get the PreferenceSetting from store', () => {
        expect(activity).toEqual(mockSelectedActivity);
      });
    });
  });

  describe('#SetDisplayShiftNeeds', () => {
    describe('when setting DisplayShiftNeeds', () => {
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetDisplayShiftNeeds(0));
      });

      it('should update the SetDisplayShiftNeeds in store', (done) => {
        store.selectOnce(state => state.selfschedule.displayShiftNeeds).subscribe((response: number) => {
          expect(response).toEqual(0);
          done();
        });
      });
    });
  });

  describe('#GetDisplayShiftNeeds', () => {
    describe('when there is DisplayShiftNeeds', () => {
      let resp;
      beforeEach(() => {
        resp = SelfScheduleState.getDisplayShiftNeeds({
          displayShiftNeeds: 0
        });
      });

      it('should get the DisplayShiftNeeds from store', () => {
        expect(resp).toEqual(0);
      });
    });
  });

  describe('#SetShift', () => {
    describe('when setting SetShift', () => {
      const activity: IActivity = {
        id: '234',
        code: 'ara01',
        name: 'ara01',
        startTime: '2019-07-22',
        hours: 6,
        start: moment('2019-07-22'),
        lunchHours: 1,
        payCode: null,
        end: moment('2019-07-23'),
        number: ''
      };
      const profile: IProfile = {
        code: 'ARA01',
        id: '89',
        name: 'ARA01',
        number: null
      };
      const shift: IShift = {
        shift: activity,
        currentDate: moment('2019-07-23'),
        profile: profile
      };
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetShift(shift));
      });

      it('should update the shift in store', (done) => {
        store.selectOnce(state => state.selfschedule.shift).subscribe((activityRes: IActivity) => {
          expect(activityRes).toEqual(activity);
          done();
        });
      });
    });
  });

  describe('#getShift', () => {
    describe('when there is getShift', () => {
      let activity: IShift;
      const mockShift: IActivity = {
        id: '234',
        code: 'ara01',
        name: 'ara01',
        startTime: '2019-07-22',
        hours: 6,
        start: moment('2019-07-22'),
        lunchHours: 1,
        payCode: null,
        end: moment('2019-07-23'),
        number: ''
      };
      const mockProfile: IProfile = {
        code: 'ARA01',
        id: '89',
        name: 'ARA01',
        number: null
      };
      beforeEach(() => {
        activity = SelfScheduleState.getShift({
          shift: mockShift,
          currentDate: moment('2019-07-22'),
          profile: mockProfile
        });
      });

      it('should get the shift from store', () => {
        expect(activity.shift).toEqual(mockShift);
      });
    });
  });

  describe('#SetCommitmentsRefreshStatus', () => {
    describe('when setting SetCommitmentsRefreshStatus', () => {
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetCommitmentsRefreshStatus(false));
      });

      it('should update the CommitmentsRefreshStatus in store', (done) => {
        store.selectOnce(state => state.selfschedule.isRefreshCompleted).subscribe((response: boolean) => {
          expect(response).toEqual(false);
          done();
        });
      });
    });
  });

  describe('#GetCommitmentsRefreshStatus', () => {
    describe('when there is CommitmentsRefreshStatus', () => {
      let resp;
      beforeEach(() => {
        resp = SelfScheduleState.getCommitmentsRefreshStatus({
          isRefreshCompleted: false
        });
      });

      it('should get the CommitmentsRefreshStatus from store', () => {
        expect(resp).toEqual(false);
      });
    });
  });

  describe('#SetPreferenceModal', () => {
    describe('when setting SetPreferenceModal', () => {
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetPreferenceModal(true));
      });

      it('should update the PreferenceModal in store', (done) => {
        store.selectOnce(state => state.selfschedule.openPreferenceModal).subscribe((response: boolean) => {
          expect(response).toEqual(true);
          done();
        });
      });
    });
  });

  describe('#GetPreferenceModal', () => {
    describe('when there is PreferenceModal', () => {
      let resp;
      beforeEach(() => {
        resp = SelfScheduleState.getPreferenceModal({
          openPreferenceModal: false
        });
      });

      it('should get the PreferenceModal from store', () => {
        expect(resp).toEqual(false);
      });
    });
  });

  describe('#SetPreferredShifts', () => {
    describe('when setting SetPreferredShifts', () => {
      const activityArray: Array<IActivity> = [{
        id: '234',
        code: 'ara01',
        name: 'ara01',
        startTime: '2019-07-22',
        hours: 6,
        start: moment('2019-07-22'),
        lunchHours: 1,
        payCode: null,
        end: moment('2019-07-23'),
        number: ''
      }];
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetPreferredShifts(activityArray));
      });

      it('should update the PreferredShifts in store', (done) => {
        store.selectOnce(state => state.selfschedule.preferredShifts).subscribe((activityRes: Array<IActivity>) => {
          expect(activityRes).toEqual(activityArray);
          done();
        });
      });
    });
  });

  describe('#getPreferredShifts', () => {
    describe('when there are PreferredShifts', () => {
      let preferredShitsArray: Array<IActivity>;
      const mockSelectedActivity: Array<IActivity> = [{
        id: '234',
        code: 'ara01',
        name: 'ara01',
        startTime: '2019-07-22',
        hours: 6,
        start: moment('2019-07-22'),
        lunchHours: 1,
        payCode: null,
        end: moment('2019-07-23'),
        number: ''
      }];
      beforeEach(() => {
        preferredShitsArray = SelfScheduleState.getPreferredShifts({
          preferredShifts: mockSelectedActivity
        });
      });

      it('should get the PreferredShifts from store', () => {
        expect(preferredShitsArray).toEqual(mockSelectedActivity);
      });
    });
  });

  describe('#SetQualifiedProfiles', () => {
    describe('when setting SetQualifiedProfiles', () => {
      const qualifiedProfiles: Array<IProfile> = [{
        id: '234',
        code: 'ara01',
        name: 'ara01',
        number: '7'
      }];
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetQualifiedProfiles(qualifiedProfiles));
      });

      it('should update the QualifiedProfiles in store', (done) => {
        store.selectOnce(state => state.selfschedule.qualifiedProfiles).subscribe((profileRes: Array<IProfile>) => {
          expect(profileRes).toEqual(qualifiedProfiles);
          done();
        });
      });
    });
  });

  describe('#getQualifiedProfiles', () => {
    describe('when there are QualifiedProfiles', () => {
      let qualifiedProfilesArray: Array<IProfile>;
      const mockQualifiesProfile: Array<IProfile> = [{
        id: '234',
        code: 'ara01',
        name: 'ara01',
        number: '7'
      }];
      beforeEach(() => {
        qualifiedProfilesArray = SelfScheduleState.getQualifiedProfiles({
          qualifiedProfiles: mockQualifiesProfile
        });
      });

      it('should get the QualifiedProfiles from store', () => {
        expect(qualifiedProfilesArray).toEqual(mockQualifiesProfile);
      });
    });
  });

  describe('#SetQualifiedCoverage', () => {
    describe('when setting SetQualifiedCoverage', () => {
      const qualifiedCoverage: Array<IActivityStaffingPlanCoverage> = [
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
        }];
      beforeEach(() => {
        store = TestBed.get(Store);
        store.dispatch(new SetQualifiedCoverage(qualifiedCoverage));
      });

      it('should update the QualifiedCoverage in store', (done) => {
        store.selectOnce(state => state.selfschedule.qualifiedCoverage).subscribe((coverageRes: Array<IActivityStaffingPlanCoverage>) => {
          expect(coverageRes).toEqual(qualifiedCoverage);
          done();
        });
      });
    });
  });

  describe('#getQualifiedCoverage', () => {
    describe('when there are QualifiedCoverage', () => {
      let qualifiedCoverageArray: Array<IActivityStaffingPlanCoverage>;
      const mockQualifiesCoverage: Array<IActivityStaffingPlanCoverage> = [{
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
      }];
      beforeEach(() => {
        qualifiedCoverageArray = SelfScheduleState.getQualifiedCoverage({
          qualifiedCoverage: mockQualifiesCoverage
        });
      });

      it('should get the QualifiedCoverage from store', () => {
        expect(qualifiedCoverageArray).toEqual(mockQualifiesCoverage);
      });
    });
  });
});
