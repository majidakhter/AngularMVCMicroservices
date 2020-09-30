

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeSdkConfig } from './employee-sdk.config';
import { map } from 'rxjs/internal/operators';
import { EnvironmentService } from '../../environment/environment.service';
import 'rxjs/add/operator/map';
import * as _ from 'underscore';
import * as moment from 'moment';
import { IEmployeeAuthorization, IEmployeeAuthorizationRaw } from '../../time-management-domain/authorization-access';
import { IFacility, IDepartment, IUnit } from '../../time-management-domain/org-unit';
import { of, Observable } from 'rxjs';
import { Employee, mapEmployee, IEmployeeSchedulException, IEmployeeScheduleExceptionResponse } from '../../time-management-domain/employee';
import { DateFormatter } from '../../shared/date-formats/date-formatter';
import { IPayCodeWithPermissionConfiguration } from '../../time-management-domain/pay-code';
import { PayPeriod } from '../../time-management-domain/pay-period';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { IQuickCode } from 'src/app/time-management-domain/quick-code';

export enum OrgUnitConstraint {
  ForCalendar = 'Schedule',
  ForActivity = 'ActivitySchedule',
  ForSelection = 'ScheduleSelection'
}

export enum ScheduleValueValidationMessages {
  All = 'All',
  Amount = 'Amount',
  None = 'None',
  Hours = 'Hours'
}

export enum IssueTypes {
  EMPLOYEE_COMMITMENT = 'Employee Commitment',
  WEEKENDS = 'Weekends',
  OVERTIME = 'Overtime',
  SAFE_SCHEDULING = 'Safe Scheduling',
  EQUITABLE_SCHEDULING = 'Equitable Scheduling',
  CREDENTIALS = 'Credentials'
}

@Injectable()
export class EmployeeSdkService {
  static Constraints = OrgUnitConstraint;

  constructor(
    private http: HttpClient,
    private employeeSdkConfig: EmployeeSdkConfig,
    private envService: EnvironmentService,
    private dateFormatter: DateFormatter
  ) { }

  public getFacilities(employeeCode: string, constraint: OrgUnitConstraint = OrgUnitConstraint.ForSelection): Observable<any> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_FACILITIES_URL
      .replace('{employeeCode}', employeeCode)
      .replace('{constraint}', constraint);

    return this.http.get(uri).pipe(
      map(facilities => {
        return facilities;
      })
    );
  }

  public getDepartments(employeeCode: string, facility: IFacility, constraint: OrgUnitConstraint = OrgUnitConstraint.ForSelection): Observable<any> {
    if (facility) {
      const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_DEPARTMENTS_URL
        .replace('{employeeCode}', employeeCode)
        .replace('{facilityId}', facility.id.toString())
        .replace('{constraint}', constraint);

      return this.http.get(uri).pipe(
        map(result => {
          return result['departments'];
        })
      );
    } else {
      return of<IFacility[]>([]);
    }
  }

  public getUnits(employeeCode: string, department: IDepartment, constraint: OrgUnitConstraint = OrgUnitConstraint.ForSelection): Observable<any> {
    if (department) {
      const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_UNITS_URL
        .replace('{employeeCode}', employeeCode)
        .replace('{departmentId}', department.id.toString())
        .replace('{constraint}', constraint);

      return this.http.get(uri).pipe
        (map((result) => {
          return result['units'];
        })
        );
    } else {
      return of<IUnit[]>([]);
    }
  }

  public getAuthorization(employeeCode: string): Observable<IEmployeeAuthorization> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_AUTHORIZATION_URL
      .replace('{code}', employeeCode);
    return this.http.get<IEmployeeAuthorizationRaw>(uri).pipe(
      map((result) => {
        return this.mapAuthorization(result);
      })
    );
  }

  public getEmployee(employeeCode: string): Observable<Employee> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_DETAILS_URL
      .replace('{code}', employeeCode);
    return this.http.get(uri)
      .pipe(
        map((result) => {
          return mapEmployee(result);
        }));
  }

  private mapAuthorization(result: IEmployeeAuthorizationRaw): IEmployeeAuthorization {
    return {
      payCode: result.scheduleAccess,
      activity: result.publishedScheduleAccess,
      clearSchedule: result.clearScheduleAccess,
      scheduleTrade: result.scheduleTradeAccess,
      retractCalendarRequest: result.cancelAccess,
      rosterAccess: result.rosterAccess,
      selfScheduleAccess: result.selfScheduleAccess
    };
  }

  public getPayCodes(employeeCode: string, effectiveDate): Observable<IPayCodeWithPermissionConfiguration[]> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_PAY_CODES_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{date}', this.dateFormatter.toUrlDate(effectiveDate));
    return this.http.get<{ payCodes: IPayCodeWithPermissionConfiguration[] }>(uri)
      .map((result) => {
        result.payCodes.forEach((val) => {
          const validation = val.configuration.scheduleValueValidation;
          val.isAmountRequired = validation === ScheduleValueValidationMessages.All || validation === ScheduleValueValidationMessages.Amount;
          val.areHoursRequired = validation === ScheduleValueValidationMessages.All || validation === ScheduleValueValidationMessages.Hours;
        });
        return result.payCodes;
      });
  }

  public getCurrentPayPeriod(employeeCode: string): Observable<PayPeriod> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_CURRENT_PAY_PERIOD_URL
      .replace('{code}', employeeCode);

    return this.http.get(uri, { observe: 'response' })
      .map((result) => {
        if (result.body['payPeriods'].length > 0) {
          const payPeriod = result.body['payPeriods'][0];
          return new PayPeriod(payPeriod.id, payPeriod.beginDate, payPeriod.endDate, payPeriod.type);
        }
        return null;
      });
  }

  public getSelfSchedulePreference(employeeCode: string): Observable<PreferenceSetting> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL
      .replace('{employeeCode}', employeeCode);
    return this.http.get<PreferenceSetting>(uri);
  }

  public updatePreferenceSetting(employeeCode: string, latestPreferenceSetting: PreferenceSetting) {
    if (latestPreferenceSetting) {
      const uri = this.envService.baseApiPath + this.employeeSdkConfig.PUT_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL
        .replace('{employeeCode}', employeeCode);
      this.http.put(uri, latestPreferenceSetting, { responseType: 'text' }).subscribe();
    }
  }

  public getQuickCode(quickCode: string, effectiveDate, effectiveEndDate): Observable<IQuickCode[]> {
    const endDate = effectiveEndDate != null ? this.dateFormatter.toUrlDate(effectiveEndDate) : null;
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_QUICKCODE_URL
      .replace('{code}', quickCode)
      .replace('{effectiveDate}', this.dateFormatter.toUrlDate(effectiveDate))
      .replace('{effectiveEndDate}', endDate);
    return this.http.get<IQuickCode[]>(uri).pipe(map((result) => {
      if ((result !== undefined) || (result !== null)) {
        return result['quickCodes'];
      }
    })
    );
  }

  public getEmployeeScheduleExceptions(employeeCode: string, startDate, endDate): Observable<IEmployeeScheduleExceptionResponse> {
    const uri = this.envService.baseApiPath + this.employeeSdkConfig.GET_EMPLOYEE_SCHEDULE_EXCEPTION_URL
      .replace('{employeeCode}', employeeCode)
      .replace('{startDate}', this.dateFormatter.toUrlDate(startDate))
      .replace('{endDate}', this.dateFormatter.toUrlDate(endDate));
    return this.http.get<IEmployeeSchedulException[]>(uri).pipe(map((result) => {
      return this.getFormattedEmployeeScheduleExceptions(result['exceptions']);
    })
    );
  }

  public getFormattedEmployeeScheduleExceptions(exceptions: IEmployeeSchedulException[]) {
    const issueType = {};
    let totalCount = 0;
    exceptions = _.chain(exceptions).sortBy('issueType').sortBy('description').value();
    exceptions = _.sortBy(exceptions, (exception: IEmployeeSchedulException) => moment(exception.startDate));
    const issueTypes: string [] = Object.keys(IssueTypes).map(e => IssueTypes[e]);
    exceptions.forEach(exception => {
      if (issueTypes.indexOf(exception.issueType) !== -1) {
        if (!issueType[exception.issueType]) {
          issueType[exception.issueType] = { 'count': 0 };
        }
        this.groupByIssueDescription(issueType, exception);
        totalCount++;
      }
    });
    const issues: IEmployeeScheduleExceptionResponse = {
      issueTypeExceptions : issueType,
      totalCount: totalCount
    };
    return issues;
  }
  public groupByIssueDescription(issueType, exception) {

    if (!issueType[exception.issueType][exception.description]) {
      issueType[exception.issueType][exception.description] = { count: 0 };
    }
    this.groupByMonthlyExceptions(issueType, exception);
  }
  public groupByMonthlyExceptions(issueType, exception: IEmployeeSchedulException) {
    const sDate = this.dateFormatter.toShortMonth(moment(exception.startDate));
    if (!issueType[exception.issueType][exception.description][sDate]) {
      issueType[exception.issueType][exception.description][sDate] = [];
    }
    issueType[exception.issueType][exception.description][sDate].push(exception);
    issueType[exception.issueType]['count'] = parseInt(issueType[exception.issueType]['count'], 10) + 1;
    issueType[exception.issueType][exception.description]['count'] = parseInt(issueType[exception.issueType][exception.description]['count'], 10) + 1;
  }
}
