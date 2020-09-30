import { ScheduleValidationMessage } from './schedule-validation-message';

export interface IScheduleValidationWarnings {
  validationMessages: Array<ScheduleValidationMessage>;
  overridable: boolean;
}

export class ScheduleValidationWarnings implements IScheduleValidationWarnings {
    validationMessages: Array<ScheduleValidationMessage>;
    overridable: boolean;
}
