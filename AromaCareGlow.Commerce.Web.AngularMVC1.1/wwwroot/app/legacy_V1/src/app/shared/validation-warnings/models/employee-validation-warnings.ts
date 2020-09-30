
import { ScheduleValidationMessage } from './schedule-validation-message';

export interface IEmployeeValidationWarnings {
  entityId: string | number;
  employeeId: number;
  lastName: string;
  firstName: string;
  warnings: Array<ScheduleValidationMessage>;
  overridable: boolean;
  otherException?: boolean;
}

export class EmployeeValidationWarnings implements IEmployeeValidationWarnings {
  constructor(
    public entityId: string | number,
    public employeeId: number,
    public lastName: string,
    public firstName: string,
    public warnings: Array<ScheduleValidationMessage>,
    public overridable: boolean,
    public otherException: boolean = false
  ) { }
}
