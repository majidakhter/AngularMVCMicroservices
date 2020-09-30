
import { Injectable } from '@angular/core';

export interface ITransactionRequestSdkConfig {
  /**
   * Service endpoint for getting the timezone information for the specified employee.
   */
  RETRACT_TRANSACTION_REQUEST_URL: string;
  CREATE_TRANSACTION_REQUEST_URL: string;
  RETRACT_TRANSACTION_REQUEST_SELF_SCHEDULE_URL: string;
  TRADE_DETAILS_URL: string;
}

@Injectable()
export class TransactionRequestSdkConfig implements ITransactionRequestSdkConfig {
  RETRACT_TRANSACTION_REQUEST_URL = 'transaction-request/{guid}/_cancel';
  RETRACT_TRANSACTION_REQUEST_SELF_SCHEDULE_URL = 'transaction-request/{guid}/_cancel?constraint=SelfScheduled';
  CREATE_TRANSACTION_REQUEST_URL = 'transaction-request/pay-code/_create';
  TRADE_DETAILS_URL = 'schedule/{guid}/trade-details';
  ACCEPT_SCHEDULE_TRADE_URL = 'employee/{employeeCode}/shift/trade/{guid}/_accept';
  DECLINE_SCHEDULE_TRADE_URL = 'employee/{employeeCode}/shift/trade/{guid}/_decline';
  RETRACT_SCHEDULE_TRADE_URL = 'employee/{employeeCode}/shift/trade/{guid}/_retract';
}
