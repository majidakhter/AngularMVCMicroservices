
import { ScheduleValidationMessage } from './schedule-validation-message';

export interface IErrorValidationWarning {
  validationMessages: Array<ScheduleValidationMessage>;
  overridable: boolean;
}

export class ErrorValidationWarnings implements IErrorValidationWarning {
  constructor(
    public validationMessages: Array<ScheduleValidationMessage>,
    public overridable: boolean
  ) { }
}
