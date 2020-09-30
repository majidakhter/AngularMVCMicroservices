
import { IErrorValidationWarning } from '../../validation-warnings/models/error-validation-warnings';

export interface IValidationWarning {
  errorCode: string;
  override: boolean;
  validationException: IErrorValidationWarning;
  otherExceptions: boolean;
}
