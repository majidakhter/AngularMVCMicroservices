import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { IOrganizationEntity } from 'src/app/time-management-domain/organization-entity';
import { IPayCodeWithPermissionConfiguration } from 'src/app/time-management-domain/pay-code';
import { EnvironmentService } from '../../environment/environment.service';
import { IActivity } from '../../time-management-domain/activity';
import { IJobClass } from '../../time-management-domain/job-class';
import { IPosition } from '../../time-management-domain/position';
import { IProfile } from '../../time-management-domain/profile';
import { ScheduleValueValidationMessages } from '../employee-schedule-sdk/employee-schedule-sdk.service';
import { IOrganizationEntityResponse } from '../organization-sdk/organization-response';
import { IActivityResponse } from './activity-response';
import { EmployeeOrganizationSdkConfig } from './employee-organization-sdk.config';
import { IJobClassesResponse } from './job-class-response';
import { IPayCodeResponse } from './pay-code-response';
import { IPositionResponse } from './position-response';
import { IProfileResponse } from './profile-response';

@Injectable()
export class EmployeeOrganizationSdkService {
  private config: EmployeeOrganizationSdkConfig;
  constructor(private http: HttpClient,
    private envService: EnvironmentService,
    private dateFormatter: DateFormatter) {
    this.config = new EmployeeOrganizationSdkConfig();
  }

  public getEmployeePositions(employeeCode: string, organizationEntityId: string, forActivities: boolean = true, profileId: string = null): Observable<IPosition[]> {
    let uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{organizationEntityId}', organizationEntityId || '')
      .replace('{constraint}', forActivities ? 'ActivitySchedule' : 'Schedule');

    if (profileId) {
      uri = uri + this.config.WITH_PROFILE.replace('{profileId}', profileId);
    }

    return this.http.get<IPositionResponse>(uri)
      .map((result: IPositionResponse): IPosition[] => {
        return result.positions;
      });
  }

  public getEmployeeActivities(employeeCode: string, organizationEntityId: string): Observable<IActivity[]> {
    const uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_ACTIVITIES_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{organizationEntityId}', organizationEntityId || '');

    return this.http.get<IActivityResponse>(uri)
      .map((result: IActivityResponse): IActivity[] => {
        return result.activities;
      });
  }

  public getEmployeeJobClasses(employeeCode: string, organizationEntityId: string): Observable<IJobClass[]> {
    const uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_JOB_CLASSES_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{organizationEntityId}', organizationEntityId || '');

    return this.http.get<IJobClassesResponse>(uri)
      .map((result: IJobClassesResponse): IJobClass[] => {
        return result.jobClasses;
      });
  }

  public getEmployeePayCodes(employeeCode: string, organizationEntityId: string): Observable<IPayCodeWithPermissionConfiguration[]> {
    const uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_PAY_CODES_URL
            .replace('{employeeCode}', employeeCode || '')
            .replace('{organizationEntityId}', organizationEntityId || '');

    return this.http.get<IPayCodeResponse>(uri)
        .map((result: IPayCodeResponse): IPayCodeWithPermissionConfiguration[] => {
          result.payCodes.forEach((val) => {
              const validation = val.configuration.scheduleValueValidation;
              val.isAmountRequired = validation === ScheduleValueValidationMessages.ALL || validation === ScheduleValueValidationMessages.AMOUNT;
              val.areHoursRequired = validation === ScheduleValueValidationMessages.ALL || validation === ScheduleValueValidationMessages.HOURS;
            });
            return result.payCodes;
        });
}

  public getEmployeeProfiles(employeeCode: string, organizationEntityId: string, position: IPosition): Observable<IProfile[]> {
    const uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_PROFILES_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{organizationEntityId}', organizationEntityId || '')
      .replace('{positionId}', position ? position.id : '');

    return this.http.get<IProfileResponse>(uri)
      .map((result: IProfileResponse): IProfile[] => {
        return result.profiles;
      });
  }

  public getSelfScheduleEmployeeProfiles(employeeCode: string, organizationEntityId: string, scheduleStart, scheduleEnd): Observable<IProfile[]> {
    const uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_SELF_SCHEDULE_PROFILES_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{organizationEntityId}', organizationEntityId || '')
      .replace('{scheduleStart}', this.dateFormatter.toUrlDate(scheduleStart))
      .replace('{scheduleEnd}', this.dateFormatter.toUrlDate(scheduleEnd));

    return this.http.get<IProfileResponse>(uri)
      .map((result: IProfileResponse): IProfile[] => {
        return result.profiles;
      });
  }

  public getOrganizationEntities(employeeCode: string, effectiveDate): Observable<IOrganizationEntity[]> {
    const uri = this.envService.baseApiPath + this.config.GET_EMPLOYEE_ORGANIZATION_ENTITIES_URL
      .replace('{employeeCode}', employeeCode || '')
      .replace('{date}', this.dateFormatter.toUrlDate(effectiveDate));
    return this.http.get<IOrganizationEntityResponse>(uri)
      .map((result: IOrganizationEntityResponse): IOrganizationEntity[] => {
        return result.entities;
      });
  }
}
