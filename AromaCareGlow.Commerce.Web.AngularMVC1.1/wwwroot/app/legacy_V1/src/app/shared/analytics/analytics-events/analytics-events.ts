
export enum AnalyticsCategory {
  PAYCODE = 'paycode',
  ACTIVITY = 'activity',
  SCHEDULE_VALIDATION_ERROR = 'schedule-validation-error',
  OPEN_SHIFT = 'open-shift',
  ROSTER_VIEW = 'employee-roster-view'
}

export interface IAnalyticsEvent {
  category: AnalyticsCategory | string;
  action: string;
  label?: string;
}
