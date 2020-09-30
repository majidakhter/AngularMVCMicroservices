

import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { Employee } from 'src/app/time-management-domain/employee';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { IActivity } from 'src/app/time-management-domain/activity';
import { ICommitmentsRefreshStatus, IShift } from '../states/self-schedule.state';
import { IProfile } from 'src/app/time-management-domain/profile';

export class SetSelectedDate {
  static readonly type = '[Schedule] Set Selected Day';

  constructor(public payload: IScheduleCalendarDay) { }
}

export class SetEmployee {
  static readonly type = '[Schedule] Set Employee';

  constructor(public payload: Employee) { }
}

export class SetSchedulePeriods {
  static readonly type = '[Schedule] Set SchedulePeriods';

  constructor(public payload: Array<SchedulePeriod>) { }
}

export class SetSelfSchedulePeriod {
  static readonly type = '[Schedule] Set SelfSchedulePeriod';

  constructor(public payload: SchedulePeriod) { }
}

export class SetPreferenceSetting {
  static readonly type = '[Schedule] Set PreferenceSetting';

  constructor(public payload: PreferenceSetting) { }
}

export class SetActivityStaffingPlanCoverages {
  static readonly type = '[Schedule] Set ActivityStaffingPlanCoverages';

  constructor(public payload: IActivityStaffingPlanCoverage[]) { }
}

export class SetSelectedActivity {
  static readonly type = '[Schedule] Set SelectedActivity';

  constructor(public payload: IActivity) { }
}

export class SetDisplayShiftNeeds {
  static readonly type = '[Schedule] Set DisplayShiftNeeds';

  constructor(public payload: number) { }
}

export class SetShift {
  static readonly type = '[Schedule] Set Shift';

  constructor(public payload: IShift) { }
}

export class SetViewedSelfSchedulePeriods {
  static readonly type = '[Schedule] Set ViewedSelfSchedulePeriods';

  constructor(public payload: Array<SelfSchedulePeriod>) { }
}

export class SetCommitmentsRefreshStatus {
  static readonly type = '[Schedule] Set CommitmentsRefreshStatus';

  constructor(public payload: boolean) { }
}

export class SetPreferenceModal {
  static readonly type = '[Schedule] Set PreferenceModal';

  constructor(public payload: boolean) { }
}

export class SetPreferredShifts {
  static readonly type = '[Schedule] Set SetPreferredShifts';

  constructor(public payload: Array<IActivity>) { }
}

export class SetQualifiedProfiles {
  static readonly type = '[Schedule] Set QualifiedProfiles';

  constructor(public payload: Array<IProfile>) { }
}

export class SetQualifiedCoverage {
  static readonly type = '[Schedule] Set QualifiedCoverage';

  constructor(public payload: Array<IActivityStaffingPlanCoverage>) { }
}