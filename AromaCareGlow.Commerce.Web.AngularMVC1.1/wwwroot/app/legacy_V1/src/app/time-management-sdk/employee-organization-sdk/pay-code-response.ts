import { IPayCodeWithPermissionConfiguration } from 'src/app/time-management-domain/pay-code';

export interface IPayCodeResponse {
  payCodes: IPayCodeWithPermissionConfiguration[];
}
