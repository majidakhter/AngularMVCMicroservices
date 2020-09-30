

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetCommitmentsRefreshStatus, SetDisplayShiftNeeds, SetEmployee, SetPreferenceModal, SetPreferenceSetting, SetSchedulePeriods, SetSelectedActivity, SetSelectedDate, SetSelfSchedulePeriod,
  SetShift, SetViewedSelfSchedulePeriods, SetPreferredShifts, SetQualifiedProfiles, SetActivityStaffingPlanCoverages, SetQualifiedCoverage } from '../actions/self-schedule.actions';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { Employee } from 'src/app/time-management-domain/employee';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { IActivity } from 'src/app/time-management-domain/activity';
import { Moment } from 'moment';
import { IProfile } from 'src/app/time-management-domain/profile';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';

export interface ISelfScheduleStateModel {
  selectedDay: IScheduleCalendarDay;
}

export interface IEmployee {
  employee: Employee;
}

export interface ISchedulePeriods {
  schedulePeriods: Array<SchedulePeriod>;
}

export interface ISelfSchedulePeriod {
  selfSchedulePeriod: SchedulePeriod;
}

export interface IPreferenceSetting {
  preferenceSetting: PreferenceSetting;
}

export interface ISelectedActivity {
  selectedActivity: IActivity;
}

export interface IDisplayShiftNeeds {
  displayShiftNeeds: number;
}

export interface IShift {
  shift: IActivity;
  currentDate: Moment;
  profile: IProfile;
}

export interface IViewedSelfSchedulePeriods {
  viewedSelfSchedulePeriods: Array<SelfSchedulePeriod>;
}

export interface ICommitmentsRefreshStatus {
  isRefreshCompleted: boolean;
}

export interface IPreferenceModal {
  openPreferenceModal: boolean;
}

export interface IPreferredShifts {
  preferredShifts: Array<IActivity>;
}

export interface IQualifiedProfiles {
  qualifiedProfiles: Array<IProfile>;
}

export interface IQualifiedCoverage {
  qualifiedCoverage: Array<IActivityStaffingPlanCoverage>;
}

@State<ISelfScheduleStateModel>({
  name: 'selfschedule',
  defaults: {
    selectedDay: null
  }
})

@State<IEmployee>({
  name: 'employee',
  defaults: {
    employee: null
  }
})

@State<ISchedulePeriods>({
  name: 'SchedulePeriods',
  defaults: {
    schedulePeriods: null
  }
})

@State<ISelfSchedulePeriod>({
  name: 'SelfSchedulePeriod',
  defaults: {
    selfSchedulePeriod: null
  }
})

@State<IPreferenceSetting>({
  name: 'PreferenceSetting',
  defaults: {
    preferenceSetting: null
  }
})

@State<ISelectedActivity>({
  name: 'SelectedActivity',
  defaults: {
    selectedActivity: null
  }
})

@State<IDisplayShiftNeeds>({
  name: 'DisplayShiftNeeds',
  defaults: {
    displayShiftNeeds: null
  }
})

@State<IShift>({
  name: 'shift',
  defaults: {
    shift: null,
    currentDate: null,
    profile: null
  }
})

@State<IViewedSelfSchedulePeriods>({
  name: 'PreferenceSetting',
  defaults: {
    viewedSelfSchedulePeriods: new Array<SelfSchedulePeriod>()
  }
})

@State<ICommitmentsRefreshStatus>({
  name: 'commitmentsRefreshStatus',
  defaults: {
    isRefreshCompleted: false
  }
})

@State<IPreferenceModal>({
  name: 'preferenceModal',
  defaults: {
    openPreferenceModal: false
  }
})

@State<IPreferredShifts>({
  name: 'PreferredShifts',
  defaults: {
    preferredShifts: []
  }
})

@State<IQualifiedProfiles>({
  name: 'QualifiedProfiles',
  defaults: {
    qualifiedProfiles: []
  }
})

@State<IQualifiedProfiles>({
  name: 'QualifiedProfiles',
  defaults: {
    qualifiedProfiles: []
  }
})

@State<IQualifiedCoverage>({
  name: 'QualifiedCoverage',
  defaults: {
    qualifiedCoverage: []
  }
})

export class SelfScheduleState {
  @Selector()
  static getSelectedDay(state: ISelfScheduleStateModel): IScheduleCalendarDay {
    return state.selectedDay;
  }

  @Selector()
  static getEmployee(state: IEmployee): Employee {
    return state.employee;
  }

  @Selector()
  static getSchedulePeriods(state: ISchedulePeriods): Array<SchedulePeriod> {
    return state.schedulePeriods;
  }

  @Selector()
  static getSelfSchedulePeriod(state: ISelfSchedulePeriod): SchedulePeriod {
    return state.selfSchedulePeriod;
  }

  @Selector()
  static getPreferenceSetting(state: IPreferenceSetting): PreferenceSetting {
    return state.preferenceSetting;
  }

  @Selector()
  static getSelectedActivity(state: ISelectedActivity): IActivity {
    return state.selectedActivity;
  }

  @Selector()
  static getDisplayShiftNeeds(state: IDisplayShiftNeeds): number {
    return state.displayShiftNeeds;
  }

  @Selector()
  static getShift(state: IShift): IShift {
    return {
      shift: state.shift,
      currentDate: state.currentDate,
      profile: state.profile
    };
  }

  @Selector()
  static getViewedSelfSchedulePeriods(state: IViewedSelfSchedulePeriods): Array<SelfSchedulePeriod> {
    return state.viewedSelfSchedulePeriods;
  }

  @Selector()
  static getCommitmentsRefreshStatus(state: ICommitmentsRefreshStatus): boolean {
    return state.isRefreshCompleted;
  }

  @Selector()
  static getPreferenceModal(state: IPreferenceModal): boolean {
    return state.openPreferenceModal;
  }

  @Selector()
  static getPreferredShifts(state: IPreferredShifts): Array<IActivity> {
    return state.preferredShifts;
  }

  @Selector()
  static getQualifiedProfiles(state: IQualifiedProfiles): Array<IProfile> {
    return state.qualifiedProfiles;
  }

  @Selector()
  static getQualifiedCoverage(state: IQualifiedCoverage): Array<IActivityStaffingPlanCoverage> {
    return state.qualifiedCoverage;
  }

  @Action(SetSelectedDate)
  setSelectedDay(ctx: StateContext<ISelfScheduleStateModel>, { payload }: SetSelectedDate) {
    ctx.patchState({
      selectedDay: payload
    });
  }

  @Action(SetEmployee)
  SetEmployee(ctx: StateContext<IEmployee>, { payload }: SetEmployee) {
    ctx.patchState({
      employee: payload
    });
  }

  @Action(SetSchedulePeriods)
  SetSchedulePeriods(ctx: StateContext<ISchedulePeriods>, { payload }: SetSchedulePeriods) {
    ctx.patchState({
      schedulePeriods: payload
    });
  }

  @Action(SetSelfSchedulePeriod)
  SetSelfSchedulePeriod(ctx: StateContext<ISelfSchedulePeriod>, { payload }: SetSelfSchedulePeriod) {
    ctx.patchState({
      selfSchedulePeriod: payload
    });
  }

  @Action(SetPreferenceSetting)
  SetPreferenceSetting(ctx: StateContext<IPreferenceSetting>, { payload }: SetPreferenceSetting) {
    ctx.patchState({
      preferenceSetting: payload
    });
  }

  @Action(SetSelectedActivity)
  SetSelectedActivity(ctx: StateContext<ISelectedActivity>, { payload }: SetSelectedActivity) {
    ctx.patchState({
      selectedActivity: payload
    });
  }

  // displayShiftNeeds = 0 if defaultShift, displayShiftNeeds = 1 if AllAvailableShifts
  @Action(SetDisplayShiftNeeds)
  SetDisplayShiftNeeds(ctx: StateContext<IDisplayShiftNeeds>, { payload }: SetDisplayShiftNeeds) {
    ctx.patchState({
      displayShiftNeeds: payload
    });
  }

  // sets shift from Add Shifts dropdown
  @Action(SetShift)
  SetShift(ctx: StateContext<IShift>, { payload }: SetShift) {
    ctx.patchState({
      shift: payload.shift,
      currentDate: payload.currentDate,
      profile: payload.profile
    });
  }

  @Action(SetViewedSelfSchedulePeriods)
  SetViewedSelfSchedulePeriods(ctx: StateContext<IViewedSelfSchedulePeriods>, { payload }: SetViewedSelfSchedulePeriods) {
    ctx.patchState({
      viewedSelfSchedulePeriods: payload
    });
  }

  @Action(SetCommitmentsRefreshStatus)
  SetCommitmentsRefreshStatus(ctx: StateContext<ICommitmentsRefreshStatus>, { payload }: SetCommitmentsRefreshStatus) {
    ctx.patchState({
      isRefreshCompleted: payload
    });
  }

  @Action(SetPreferenceModal)
  SetPreferenceModal(ctx: StateContext<IPreferenceModal>, { payload }: SetPreferenceModal) {
    ctx.patchState({
      openPreferenceModal: payload
    });
  }

  @Action(SetPreferredShifts)
  SetPreferredShifts(ctx: StateContext<IPreferredShifts>, { payload }: SetPreferredShifts) {
    ctx.patchState({
      preferredShifts: payload
    });
  }

  @Action(SetQualifiedProfiles)
  SetQualifiedProfiles(ctx: StateContext<IQualifiedProfiles>, { payload }: SetQualifiedProfiles) {
    ctx.patchState({
      qualifiedProfiles: payload
    });
  }

  @Action(SetQualifiedCoverage)
  SetActivityStaffingPlanCoverages(ctx: StateContext<IQualifiedCoverage>, { payload }: SetQualifiedCoverage) {
    ctx.patchState({
      qualifiedCoverage: payload
    });
  }
}
