

import { Injectable } from '@angular/core';

export interface IEmployeeScheduleSdkConfig {
  GET_EMPLOYEE_SCHEDULE_URL: string;
  GET_EMPLOYEE_OPEN_SHIFTS_URL: string;
  REQUEST_EMPLOYEE_OPEN_SHIFTS_URL: string;
  GET_EMPLOYEE_SELF_SCHEDULE_URL: string;
  GET_SCHEDULE_PERIODS_URL: string;
}
@Injectable()
export class EmployeeScheduleSdkConfig implements IEmployeeScheduleSdkConfig {
  GET_EMPLOYEE_SCHEDULE_URL = 'employee/{code}/schedule?constraint=MonthlyView&startDate={startDate}&endDate={endDate}&_query={query}';
  GET_EMPLOYEE_OPEN_SHIFTS_URL = 'employee/{code}/shift?constraint=open&start={start}&end={end}';
  REQUEST_EMPLOYEE_OPEN_SHIFTS_URL = 'employee/{code}/shift/_request?overrideValidation={overrideValidation}';
  GET_EMPLOYEE_SELF_SCHEDULE_URL = 'employee/{code}/schedule?constraint=SelfScheduling&startDate={startDate}&endDate={endDate}&_query={query}';
  GET_SCHEDULE_PERIODS_URL = 'organization/{entityId}/schedule-period?start={startDate}&end={endDate}';
  GET_EMPLOYEE_GROUP_SCHEDULE_URL = 'employee/{code}/organization/{organizationId}/self-schedule-period?startDate={startDate}';
}
