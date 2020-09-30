
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { EnvironmentService } from '../../environment/environment.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { TransactionRequestSdkConfig } from './transaction-request-sdk.config';
import { ITradeRequest } from 'src/app/time-management-domain/trade-request';
import { IScheduleResponse } from '../schedule-sdk/schedule-response';
import { IScheduleDetailed, ScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';

@Injectable()
export class TransactionRequestSdkService {

  constructor(
    private http: HttpClient,
    private config: TransactionRequestSdkConfig,
    private envService: EnvironmentService
  ) { }

  public retractTransactionRequest(employeeGuid: string, constraint?: string): Observable<any> {
    const serviceUrl = constraint === 'SelfScheduled' ?
      this.config.RETRACT_TRANSACTION_REQUEST_SELF_SCHEDULE_URL : this.config.RETRACT_TRANSACTION_REQUEST_URL;
    const uri = this.envService.baseApiPath + serviceUrl
      .replace('{guid}', employeeGuid);
    return this.http.post(uri, {}).pipe(
      map(result => {
        return result;
      })
    );
  }

  public getTradeDetails(employeeGuid: string): Observable<any> {
    const uri = this.envService.baseApiPath + this.config.TRADE_DETAILS_URL
      .replace('{guid}', employeeGuid);
    return this.http.get(uri, {}).pipe(
      map((result: ITradeRequest) => {
        result.accepting.schedule = this.convertToEventType(result.accepting.schedule);
        result.requesting.schedule = this.convertToEventType(result.requesting.schedule);
        return result;
      })
    );
  }

  convertToEventType(schedule) {
    const scheduleResponse: IScheduleResponse = schedule;
    const newSchedule: IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig> = ScheduleDetailed.fromJsonWithIndicatorConfigruation(scheduleResponse);
    return newSchedule;
  }

  public acceptScheduleTrade(employeeCode: string, employeeCalendarGuid: string): Observable<any> {
    const uri = this.envService.baseApiPath + this.config.ACCEPT_SCHEDULE_TRADE_URL
      .replace('{employeeCode}', employeeCode)
      .replace('{guid}', employeeCalendarGuid);
    return this.http.post(uri, {}).pipe(
      map(result => {
        return result;
      })
    );
  }

  public declineScheduleTrade(employeeCode: string, employeeCalendarGuid: string): Observable<any> {
    const uri = this.envService.baseApiPath + this.config.DECLINE_SCHEDULE_TRADE_URL
      .replace('{employeeCode}', employeeCode)
      .replace('{guid}', employeeCalendarGuid);
    return this.http.post(uri, {}).pipe(
      map(result => {
        return result;
      })
    );
  }

  public retractTradeRequest(employeeCode: string, tradeGuid: string): Observable<any> {
    const uri = this.envService.baseApiPath + this.config.RETRACT_SCHEDULE_TRADE_URL
    .replace('{employeeCode}', employeeCode)
    .replace('{guid}', tradeGuid);
    return this.http.post(uri, {}).pipe(
      map(result => {
        return result;
      })
    );
  }
}
