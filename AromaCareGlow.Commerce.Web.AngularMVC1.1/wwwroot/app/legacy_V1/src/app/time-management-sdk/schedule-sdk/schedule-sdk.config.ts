

import { Injectable } from '@angular/core';

export interface IScheduleSdkConfig {
  ADD_SCHEDULE_URL: string;
  ADD_SCHEDULE_TRADE_URL: string;
  GET_TRADE_PERIOD_URL: string;
  GET_TRADABLE_SCHEDULES_URL: string;
  GET_ELIGIBLE_TRADABLE_SCHEDULES_URL: string;
  UPDATE_SCHEDULE_URL: string;
  GET_ROSTER_SUMMARY: string;
  GET_ROSTER_EMPLOYEE_LIST: string;
  DELETE_SCHEDULE_URL: string;
}

@Injectable()
export class ScheduleSdkConfig implements IScheduleSdkConfig {
  ADD_SCHEDULE_URL = 'schedule?overrideValidation={overrideValidation}';
  ADD_SCHEDULE_TRADE_URL = 'schedule/{requestingScheduleId}/trade?overrideValidation={overrideValidation}';
  GET_TRADE_PERIOD_URL = 'schedule/{scheduleId}/trade-period';
  GET_TRADABLE_SCHEDULES_URL = 'schedule/?_query=Trade&scheduleId={scheduleId}&tradeDate={tradeDate}&startTimeRangeBegin={rangeBegin}&startTimeRangeEnd={rangeEnd}';
  GET_ELIGIBLE_TRADABLE_SCHEDULES_URL = 'schedule/?_query=Trade&scheduleId={scheduleId}&tradeDate={tradeDate}&startTimeRangeBegin={startTimeRangeBegin}&startTimeRangeEnd={startTimeRangeEnd}';
  UPDATE_SCHEDULE_URL = 'schedule/{guid}?overrideValidation={overrideValidation}';
  GET_ROSTER_SUMMARY = '/schedule/{scheduleGuid}/roster-summary?minimumOverlap={minimumOverlap}';
  GET_ROSTER_EMPLOYEE_LIST = 'schedule/{scheduleGuid}/roster?groupType={groupType}&groupId={groupId}&minimumOverlap={minimumOverlap}';
  DELETE_SCHEDULE_URL = 'schedule/{guid}';
}
