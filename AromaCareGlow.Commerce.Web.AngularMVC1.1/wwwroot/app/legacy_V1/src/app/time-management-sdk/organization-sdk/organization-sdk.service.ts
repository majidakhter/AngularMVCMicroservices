
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from '../../environment/environment.service';
import { Observable } from 'rxjs/Observable';
import { ILevelHierarchy } from '../../time-management-domain/level-hierarchy';
import { OrganizationSdkConfig } from './organization-sdk.config';
import { ILevelHierarchyResponse } from './level-hierarchy-response';
import { Moment } from 'moment';
import { ICoverage } from 'src/app/time-management-domain/coverage';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';

@Injectable()
export class OrganizationSdkService {

  private config: OrganizationSdkConfig;

  constructor(private http: HttpClient,
    private envService: EnvironmentService,
    private dateFormatter: DateFormatter) {
    this.config = new OrganizationSdkConfig();
  }

  public getOrgLevels(): Observable<ILevelHierarchy> {
    const uri = this.envService.baseApiPath + this.config.GET_ORG_LEVEL;
    return this.http.get<ILevelHierarchyResponse>(uri)
      .map((result: ILevelHierarchyResponse) => {
        return {
          trunk: _.find(result.levels, { type: 'Facility' }),
          branch: _.find(result.levels, { type: 'Department' }),
          leaf: _.find(result.levels, { type: 'Unit' })
        };
      });
  }

  public getActivityStaffingCoverage(entityId: string, startDate: Moment, endDate: Moment, profileGroupId?: string, constraint?: string,
      profileId?: string): Observable<ICoverage> {
    let uri = this.envService.baseApiPath + this.config.GET_ACTIVITY_STAFFING_COVERAGE_URL
      .replace('{entityId}', entityId)
      .replace('{startDate}', this.dateFormatter.toUrlDate(startDate))
      .replace('{endDate}', this.dateFormatter.toUrlDate(endDate));

    if (profileGroupId != null) {
      uri += '&profileGroupId=' + profileGroupId;
    }

    if (constraint != null) {
      uri += '&constraint=' + constraint;
    }

    if (profileId != null) {
      uri += '&profileId=' + profileId;
    }

    return this.http.get<ICoverage>(uri);
  }
}
