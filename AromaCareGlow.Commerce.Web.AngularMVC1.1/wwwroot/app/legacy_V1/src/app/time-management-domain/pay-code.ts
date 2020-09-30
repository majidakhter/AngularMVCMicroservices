import { Identifier } from '../identifier.model';

export interface IPayCode extends Identifier {
  isAmountRequired?: boolean;
  areHoursRequired?: boolean;
}

export interface IPayCodeWithPermissionConfiguration extends IPayCode {
  configuration: {
    scheduleStartTimeRequired: boolean
    scheduleValueValidation: string
    canCreate: boolean
    canCreateRequest: boolean
    canEdit: boolean
    canEditRequest: boolean
  };
}

export interface IBaseScheduleObjectConfig {
  isDisplayedOnMonthlyView: boolean;
  isOnCall: boolean;
  isTimeOff: boolean;
}

//  tslint:disable-next-line
export interface IPayCodeConfiguration extends IBaseScheduleObjectConfig { }

export interface IPayCodeWithIndicatorConfiguration extends IPayCode {
  configuration: IPayCodeConfiguration;
}
