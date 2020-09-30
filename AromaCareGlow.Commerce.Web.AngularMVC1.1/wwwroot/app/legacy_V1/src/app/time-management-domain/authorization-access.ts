export interface IAuthorizationAccess {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canExecute?: boolean;
}

export interface IEmployeeAuthorization {
  activity: IAuthorizationAccess;
  payCode: IAuthorizationAccess;
  clearSchedule?: IAuthorizationAccess;
  scheduleTrade?: IAuthorizationAccess;
  retractCalendarRequest?: IAuthorizationAccess;
  rosterAccess?: IAuthorizationAccess;
  selfScheduleAccess?: IAuthorizationAccess;
}

export interface IEmployeeAuthorizationRaw {
  scheduleAccess: IAuthorizationAccess;
  publishedScheduleAccess: IAuthorizationAccess;
  clearScheduleAccess?: IAuthorizationAccess;
  scheduleTradeAccess?: IAuthorizationAccess;
  cancelAccess?: IAuthorizationAccess;
  rosterAccess?: IAuthorizationAccess;
  selfScheduleAccess?: IAuthorizationAccess;
}
