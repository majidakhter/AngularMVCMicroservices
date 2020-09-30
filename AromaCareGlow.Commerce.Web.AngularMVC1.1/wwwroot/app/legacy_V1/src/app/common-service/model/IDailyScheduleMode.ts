export enum DailyFormMode {
  View,
  EditActivity,
  EditPaycode,
  ViewTrade,
  ViewTradeDetails
}

export interface IDailyScheduleMode {
  currentMode: DailyFormMode;
}
