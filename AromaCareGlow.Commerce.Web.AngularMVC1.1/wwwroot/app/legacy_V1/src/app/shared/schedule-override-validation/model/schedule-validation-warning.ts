
import { IErrorValidationWarning } from '../../validation-warnings/models/error-validation-warnings';

export interface IScheduleValidationWarning {
    errorCode: string;
    override: boolean;
    validationException: IErrorValidationWarning;
    otherExceptions: boolean;
}
