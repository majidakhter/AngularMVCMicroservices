import { Injectable } from '@angular/core';

export interface IEmployeeOrganizationSdkConfig {
  GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL: string;
  WITH_PROFILE: string;
  GET_EMPLOYEE_ORGANIZATION_ACTIVITIES_URL: string;
  GET_EMPLOYEE_ORGANIZATION_JOB_CLASSES_URL: string;
  GET_EMPLOYEE_ORGANIZATION_PROFILES_URL: string;
  GET_EMPLOYEE_ORGANIZATION_PAY_CODES_URL: string;
  GET_EMPLOYEE_ORGANIZATION_SELF_SCHEDULE_PROFILES_URL: string;
}

@Injectable()
export class EmployeeOrganizationSdkConfig implements IEmployeeOrganizationSdkConfig {
  GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL = 'employee/{employeeCode}/organization/{organizationEntityId}/position?constraint={constraint}&status=1';
  WITH_PROFILE = '&profileId={profileId}';
  GET_EMPLOYEE_ORGANIZATION_ACTIVITIES_URL = 'employee/{employeeCode}/organization/{organizationEntityId}/activity?constraint=schedule&status=1';
  GET_EMPLOYEE_ORGANIZATION_JOB_CLASSES_URL = 'employee/{employeeCode}/organization/{organizationEntityId}/job-class?constraint=schedule&status=1';
  GET_EMPLOYEE_ORGANIZATION_PROFILES_URL = 'employee/{employeeCode}/organization/{organizationEntityId}/profile?constraint=schedule&positionId={positionId}&status=1';
  GET_EMPLOYEE_ORGANIZATION_SELF_SCHEDULE_PROFILES_URL =
    'employee/{employeeCode}/organization/{organizationEntityId}/profile?constraint=selfschedule&scheduleStart={scheduleStart}&scheduleEnd={scheduleEnd}';
  GET_EMPLOYEE_ORGANIZATION_ENTITIES_URL = 'employee/{employeeCode}/organization?constraint=schedulequalification&effectiveDate={date}';
  GET_EMPLOYEE_ORGANIZATION_PAY_CODES_URL = 'employee/{employeeCode}/organization/{organizationEntityId}/pay-code?constraint=schedule';
}
