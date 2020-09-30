
import { Injectable } from '@angular/core';

/**
 * Configuration interface for interacting with the employee controller.
 */
export interface IEmployeeSdkConfig {
  /**
   * Service endpoint for getting the timezone information for the specified employee.
   */
  GET_EMPLOYEE_FACILITIES_URL: string;
  GET_EMPLOYEE_DEPARTMENTS_URL: string;
  GET_EMPLOYEE_UNITS_URL: string;
  GET_EMPLOYEE_AUTHORIZATION_URL: string;
  GET_EMPLOYEE_DETAILS_URL: string;
  GET_EMPLOYEE_PAY_CODES_URL: string;
  GET_EMPLOYEE_CURRENT_PAY_PERIOD_URL: string;
  GET_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL: string;
  PUT_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL: string;
  GET_EMPLOYEE_QUICKCODE_URL: string;
  GET_EMPLOYEE_SCHEDULE_EXCEPTION_URL: string;
}

@Injectable()
export class EmployeeSdkConfig implements IEmployeeSdkConfig {
  GET_EMPLOYEE_FACILITIES_URL = 'employee/{employeeCode}/facility?constraint={constraint}&status=1';
  GET_EMPLOYEE_DEPARTMENTS_URL = 'employee/{employeeCode}/facility/{facilityId}/department?constraint={constraint}&status=1';
  GET_EMPLOYEE_UNITS_URL = 'employee/{employeeCode}/department/{departmentId}/unit?constraint={constraint}&status=1';
  GET_EMPLOYEE_DETAILS_URL = 'employee/{code}';
  GET_EMPLOYEE_PAY_CODES_URL = 'employee/{employeeCode}/pay-code?constraint=schedule&effectiveDate={date}';
  GET_EMPLOYEE_CURRENT_PAY_PERIOD_URL = 'employee/{code}/pay-period?type=current';
  GET_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL = 'employee/{employeeCode}/self-schedule-preference';
  PUT_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL = 'employee/{employeeCode}/self-schedule-preference';
  GET_EMPLOYEE_AUTHORIZATION_URL = 'employee/{code}/authorization?constraint=monthlyview';
  GET_EMPLOYEE_QUICKCODE_URL = 'employee/{code}/quick-code?effectiveDate={effectiveDate}&effectiveEndDate={effectiveEndDate}';
  GET_EMPLOYEE_SCHEDULE_EXCEPTION_URL = 'employee/{employeeCode}/schedule-exception?startDate={startDate}&endDate={endDate}';
}
