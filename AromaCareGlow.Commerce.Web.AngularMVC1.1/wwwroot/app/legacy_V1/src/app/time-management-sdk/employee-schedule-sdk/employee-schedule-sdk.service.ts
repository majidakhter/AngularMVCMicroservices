

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeScheduleSdkConfig } from './employee-schedule-sdk.config';
import { IScheduleResponse } from './schedule-response';
import { IOpenShiftResponse, OpenShift, IOpenShift } from './open-shift-response';
import { IEmployeeScheduleResult } from './schedule-result';
import 'rxjs/add/operator/map';
import { EnvironmentService } from '../../environment/environment.service';
import { ISchedule } from '../../time-management-domain/schedule';
import { IOpenShiftRequest } from './open-shift-request';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import * as moment from 'moment';
import { IScheduleDetailed, ScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';
import { Moment } from 'moment';
import { SelfSchedulePeriodDetailsResponse } from './self-schedule-period-details-response';

export enum ScheduleValueValidationMessages {
  ALL = 'All',
  AMOUNT = 'Amount',
  NONE = 'None',
  HOURS = 'Hours'
}

export enum EmployeeScheduleQueryType {
  IncludePayPeriodSummariesAndRequests = 'IncludePayPeriodSummariesAndRequests',
  StaffingLevels = 'StaffingLevels',
  None = ''
}

@Injectable()
export class EmployeeScheduleSdkService {
  constructor(
    private http: HttpClient,
    private envService: EnvironmentService,
    private dateFormatter: DateFormatter,
    private employeeScheduleSdkConfig: EmployeeScheduleSdkConfig
  ) { }

  public getSchedules(employeeCode: string, startDate: string, endDate: string, queryType?: EmployeeScheduleQueryType, constraint?: string): Observable<IEmployeeScheduleResult> {
    const serviceUrl = constraint === 'SelfScheduling' ? this.employeeScheduleSdkConfig.GET_EMPLOYEE_SELF_SCHEDULE_URL : this.employeeScheduleSdkConfig.GET_EMPLOYEE_SCHEDULE_URL;
    let uri = (this.envService.baseApiPath + serviceUrl)
      .replace('{code}', employeeCode)
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate);
    uri = queryType ? uri.replace('{query}', queryType) : uri.replace('&_query={query}', '');

    return this.http.get<IScheduleResponse>(uri, { observe: 'response' })
      .map((result) => {
        const etag = result.headers.get('etag');
        const schedules = result.body.schedules;
        const events: IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>[] = schedules.map(s => {
          const event = ScheduleDetailed.fromJsonWithIndicatorConfigruation(s);
          event.etag = etag;
          return event;
        });

        return {
          events: events,
          etag: etag
        };
      });
  }

  public getSchedulePeriods(organizationUnitId, start, end): Observable<Array<SchedulePeriod>> {
    const uri = this.envService.baseApiPath + this.employeeScheduleSdkConfig.GET_SCHEDULE_PERIODS_URL
      .replace('{entityId}', organizationUnitId)
      .replace('{startDate}', this.dateFormatter.toUrlDate(start))
      .replace('{endDate}', this.dateFormatter.toUrlDate(end));

    return this.http.get(uri).map(result => {
      if (result['schedulePeriods'] && result['schedulePeriods'].length > 0) {
        return this.mapSchedulePeriods(result['schedulePeriods']);
      }
    });
  }

  public mapSchedulePeriods(schedulePeriods): Array<SchedulePeriod> {
    for (const schedulePeriod of schedulePeriods) {
      schedulePeriod.start = moment(schedulePeriod.dateRange.begin);
      schedulePeriod.end = moment(schedulePeriod.dateRange.end);
      schedulePeriod.status = schedulePeriod.status === 'SelfScheduling' ? 'Self Scheduling' : schedulePeriod.status;
      schedulePeriod.selfScheduleStart = moment(schedulePeriod.selfSchedulePeriod.begin);
      schedulePeriod.selfScheduleEnd = moment(schedulePeriod.selfSchedulePeriod.end);
    }
    return schedulePeriods;
  }

  public getShifts(employeeCode: string, start: string, end: string): Observable<IOpenShiftResponse> {
    const uri = this.envService.baseApiPath + this.employeeScheduleSdkConfig.GET_EMPLOYEE_OPEN_SHIFTS_URL
      .replace('{code}', employeeCode)
      .replace('{start}', start)
      .replace('{end}', end);
    return this.http.get<IOpenShiftResponse>(uri)
      .map((result) => {
        return {
          shifts: result.shifts.map(shift => OpenShift.fromJSON(shift))
        } as IOpenShiftResponse;
      });
  }

  public getSelfSchedulePeriodDetails(employeeCode: string, organizationId: string, startDate: Moment): Observable<SelfSchedulePeriodDetailsResponse> {
    const uri = this.envService.baseApiPath + this.employeeScheduleSdkConfig.GET_EMPLOYEE_GROUP_SCHEDULE_URL
      .replace('{code}', employeeCode)
      .replace('{organizationId}', organizationId)
      .replace('{startDate}', this.dateFormatter.toUrlDate(startDate));

     return this.http.get<SelfSchedulePeriodDetailsResponse>(uri)
      .map((result) => {
        return result;
      });
  }

  public requestShift(employeeCode: string, requestedShift: IOpenShift, requestReason: string, overrideValidation: boolean = false): Observable<{ schedule: ISchedule }> {
    const uri = this.envService.baseApiPath + this.employeeScheduleSdkConfig.REQUEST_EMPLOYEE_OPEN_SHIFTS_URL
      .replace('{code}', employeeCode)
      .replace('{overrideValidation}', overrideValidation.toString());

    const organizationUnit = requestedShift.location.unit || requestedShift.location.department || requestedShift.location.facility;

    const requestBody: IOpenShiftRequest = {
      start: this.dateFormatter.toIsoDateTime(requestedShift.start),
      end: this.dateFormatter.toIsoDateTime(requestedShift.end),
      activityId: requestedShift.activity.id,
      profileId: requestedShift.profile.id,
      organizationUnitId: organizationUnit.id,
      comment: requestReason
    };

    return this.http.post<{ schedule: ISchedule }>(uri, requestBody);
  }
}
