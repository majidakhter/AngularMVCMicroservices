

import { StaffCommitmentSchedulePeriod } from 'src/app/time-management-domain/staff-commitment-schedule-period';

export interface IEmployeeStaffingCommitmentResponse {
   employeeCode: string;
   schedulePeriods: StaffCommitmentSchedulePeriod[];
   pendingSchedulePeriodValidation: boolean;
}
