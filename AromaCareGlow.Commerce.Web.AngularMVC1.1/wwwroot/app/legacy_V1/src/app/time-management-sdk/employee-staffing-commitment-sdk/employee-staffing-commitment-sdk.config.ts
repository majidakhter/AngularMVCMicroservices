
import { Injectable } from '@angular/core';

/**
 * Configuration interface for interacting with the employee controller.
 */
export interface IEmployeeStaffingCommitmentSdkConfig {
  /**
   * Service endpoint for getting the employee staffing commitment information for schedule period.
   */  
  APPROVED_HOURS_STAFF_COMMITMENT_URL: string;
}

@Injectable()
export class EmployeeStaffingCommitmentSdkConfig implements IEmployeeStaffingCommitmentSdkConfig {

  APPROVED_HOURS_STAFF_COMMITMENT_URL =
   'employee/{employeeCode}/staffing-commitment?' +
   'schedulePeriodStartDate={startDate}&schedulePeriodEndDate={endDate}&schedulePeriodStage={periodStage}&' +
   'commitmentType={hoursCommitment}&commitmentType={shiftsCommitment}';
}
