
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { EnvironmentService } from '../../environment/environment.service';
import { ScheduleSdkConfig } from './schedule-sdk.config';
import { ISchedule, Schedule } from '../../time-management-domain/schedule';
import { IScheduleResponse } from './schedule-response';
import { IScheduleResult } from './schedule-result';
import * as _ from 'lodash';
import { ITradePeriodResponse } from './trade-period-response';
import { IScheduleDateResponse } from './schedule-date-response';
import { IScheduleTradeResponse } from '../../time-management-domain/schedule-trade/schedule-trade-response';
import { IScheduleTradeRequest } from '../../time-management-domain/schedule-trade/schedule-trade-request';
import { TransactionRequestSdkConfig } from '../../time-management-sdk/transaction-request-sdk/transaction-request-sdk.config';
import { Moment } from 'moment';
import { IRosterSummaryResponse, IRosterEmployeeListResponse } from './roster-view.response';
import { IRosterDetailsData } from 'src/app/time-management-domain/roster-view';
import * as moment from 'moment';

@Injectable()
export class ScheduleSdkService {
  constructor(
    private http: HttpClient,
    private scheduleSdkConfig: ScheduleSdkConfig,
    private envService: EnvironmentService,
    private transactionRequestSdkConfig: TransactionRequestSdkConfig
  ) { }

  public saveSchedule(employeeCode, schedule, overrideValidation: boolean = false): Observable<ISchedule> {
    let uri = this.envService.baseApiPath + this.scheduleSdkConfig.ADD_SCHEDULE_URL.replace('{overrideValidation}', overrideValidation.toString());
    const payLoad = {
      employeeCode: employeeCode,
      startDate: schedule.startDate,
      hasStartTime: schedule.hasStartTime,
      hours: schedule.hours,
      amount: schedule.amount,
      payCodeId: schedule.payCode ? schedule.payCode.id : null,
      laborDistributionId: schedule.employment ? schedule.employment.id : null,
      jobClassId: schedule.jobClass ? schedule.jobClass.id : null,
      facilityId: schedule.facility ? schedule.facility.id : null,
      departmentId: schedule.department ? schedule.department.id : null,
      unitId: schedule.unit ? schedule.unit.id : null,
      lunchHours: schedule.lunchHours,
      activityId: schedule.activity ? schedule.activity.id : null,
      profileId: schedule.profile ? schedule.profile.id : null,
      positionId: schedule.position ? schedule.position.id : null,
      source: schedule.source,
      isExtraShift: schedule.isExtraShift ? schedule.isExtraShift : false,
      requestedReason: schedule.requestedReason ? schedule.requestedReason : null
    };
    const headers = new HttpHeaders({
      'If-None-Match': schedule.etag
    });
    // condition to check whether to call update/add event API
    if (schedule.guid) {
      uri = this.envService.baseApiPath + this.scheduleSdkConfig.UPDATE_SCHEDULE_URL.replace('{guid}', schedule.guid).replace('{overrideValidation}', overrideValidation.toString());
      return this.http.put(uri, payLoad, { headers: headers }).map((result) => {
        return Schedule.fromJson(result);
      });
    } else {
      uri = this.envService.baseApiPath + this.scheduleSdkConfig.ADD_SCHEDULE_URL.replace('{overrideValidation}', overrideValidation.toString());
      return this.http.post(uri, payLoad, { headers: headers }).map((result) => {
        return Schedule.fromJson(result);
      });
    }
  }

  public savePayCode(employeeCode, schedule: ISchedule, startDates: Array<Moment>): Observable<ISchedule> {
    const uri = this.envService.baseApiPath + this.transactionRequestSdkConfig.CREATE_TRANSACTION_REQUEST_URL;

    const payLoad = {
      employeeCode: employeeCode,
      hasStartTime: schedule.hasStartTime,
      hours: schedule.hours,
      amount: schedule.amount,
      payCodeId: schedule.payCode.id,
      laborDistributionId: schedule.employment ? schedule.employment.id : null,
      jobClassId: schedule.jobClass ? schedule.jobClass.id : null,
      facilityId: schedule.facility ? schedule.facility.id : null,
      departmentId: schedule.department ? schedule.department.id : null,
      unitId: schedule.unit ? schedule.unit.id : null,
      lunchHours: schedule.lunchHours,
      positionId: schedule.position ? schedule.position.id : null,
      startDates: startDates,
      requestedReason: schedule.requestedReason
    };

    const headers = new HttpHeaders({
      'If-None-Match': schedule.etag
    });

    return this.http.post(uri, payLoad, { headers: headers }).map((result) => {
      return Schedule.fromJson(result);
    });

  }

  public getTradePeriod(scheduleId): Observable<ITradePeriodResponse> {
    const uri = this.envService.baseApiPath + this.scheduleSdkConfig.GET_TRADE_PERIOD_URL
      .replace('{scheduleId}', scheduleId);
    return this.http.get<ITradePeriodResponse>(uri);
  }

  public getEligibleShiftDates(scheduleId, tradeDate, rangeBegin, rangeEnd, scheduleStartTimeBegin, scheduleStartTimeEnd, locationIds): Observable<IScheduleDateResponse> {
    const locationIdUri = '&locationId={locationId}';
    let uri = this.envService.baseApiPath + this.scheduleSdkConfig.GET_TRADABLE_SCHEDULES_URL
      .replace('{scheduleId}', scheduleId)
      .replace('{tradeDate}', tradeDate)
      .replace('{rangeBegin}', rangeBegin)
      .replace('{rangeEnd}', rangeEnd);
    for (const locationId of locationIds) {
      uri += locationIdUri.replace('{locationId}', locationId);
    }
    return this.http.get<IScheduleResponse[]>(uri, { observe: 'response' })
      .map((result) => {
        let schedules = result.body['schedules'] as Array<IScheduleResponse>;
        schedules = schedules.filter(schedule => {
          const time = moment(schedule.startDate.slice(11, 16), 'hh:mm'),
            beforeTime = moment(scheduleStartTimeBegin, 'hh:mm'),
            afterTime = moment(scheduleStartTimeEnd, 'hh:mm');
          if ((time >= beforeTime) && (time <= afterTime)) {
            return schedule;
          }
        });
        return this.convertSchedulesToScheduleDates(schedules);
      });
  }

  public getEligibleShifts(scheduleId, tradeDate, startTimeRangeBegin, startTimeRangeEnd, locationIds): Observable<IScheduleResult> {
    const locationIdUri = '&locationId={locationId}';
    let uri = this.envService.baseApiPath + this.scheduleSdkConfig.GET_ELIGIBLE_TRADABLE_SCHEDULES_URL
      .replace('{scheduleId}', scheduleId)
      .replace('{tradeDate}', tradeDate)
      .replace('{startTimeRangeBegin}', startTimeRangeBegin)
      .replace('{startTimeRangeEnd}', startTimeRangeEnd);
    for (const locationId of locationIds) {
      uri += locationIdUri.replace('{locationId}', locationId);
    }
    return this.http.get<IScheduleResponse[]>(uri, { observe: 'response' })
      .map((result) => {
        const etag = result.headers.get('etag');
        const schedules = result.body['schedules'] as Array<IScheduleResponse>;
        const events: ISchedule[] = schedules.map(s => {
          const event = Schedule.fromJson(s);
          event.etag = etag;
          return event;
        });
        return {
          events: events,
          etag: etag
        };
      });
  }

  public saveScheduleTrade(scheduleTradeRequest: IScheduleTradeRequest): Observable<IScheduleTradeResponse> {
    const uri = this.envService.baseApiPath + this.scheduleSdkConfig.ADD_SCHEDULE_TRADE_URL
      .replace('{requestingScheduleId}', scheduleTradeRequest.requestingScheduleGuid)
      .replace('{overrideValidation}', scheduleTradeRequest.overrideValidation.toString());
    const payLoad = {
      scheduleId: scheduleTradeRequest.acceptingScheduleGuid,
      comment: scheduleTradeRequest.comment
    };
    const headers = new HttpHeaders({
      'If-None-Match': scheduleTradeRequest.etag
    });
    return this.http.post<IScheduleTradeResponse>(uri, payLoad, { headers: headers });
  }

  private convertSchedulesToScheduleDates(eligibleSchedules) {
    const dates = _.map(eligibleSchedules, (schedule) => {
      return {
        date: schedule.startDate.toString().slice(0, 10)
      };
    });
    return {
      eligibleDates: _.uniqBy(dates, (d) => [d.date].join(','))
    };
  }
  public deleteSchedule(schedule): Observable<any> {
    const uri = this.envService.baseApiPath + this.scheduleSdkConfig.DELETE_SCHEDULE_URL.replace('{guid}', schedule.guid);
    const headers = new HttpHeaders({
      'If-None-Match': schedule.etag || ''
    });
    return this.http.delete(uri, { headers: headers });
  }

  public getRosterSummary(scheduleGuid: string): Observable<IRosterSummaryResponse> {
    const uri = this.envService.baseApiPath + this.scheduleSdkConfig.GET_ROSTER_SUMMARY
      .replace('{scheduleGuid}', scheduleGuid)
      .replace('{minimumOverlap}', '00:30:00');
    return this.http.get<IRosterSummaryResponse>(uri).map(
      rosterSummary => {
        return rosterSummary;
      }
    );
  }

  public getEmployeeRosterDetails(data: IRosterDetailsData): Observable<IRosterEmployeeListResponse> {
    const uri = this.envService.baseApiPath + this.scheduleSdkConfig.GET_ROSTER_EMPLOYEE_LIST
      .replace('{scheduleGuid}', data.guid)
      .replace('{groupType}', data.profileType)
      .replace('{groupId}', data.profileId)
      .replace('{minimumOverlap}', '00:30:00');
    return this.http.get<IRosterEmployeeListResponse>(uri).map(
      rosterDetails => {
        return rosterDetails;
      }
    );
  }
}
