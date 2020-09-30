import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import * as _ from 'underscore';
import { EnvironmentService } from '../../environment/environment.service';
import { AppFeatures } from './app.features';
import { AppSdkConfig } from './app-sdk.config';

@Injectable({
  providedIn: 'root'
})
export class AppSdkService {
  private appSdkConfig: AppSdkConfig;
  constructor(
    private envService: EnvironmentService,
    private http: HttpClient) {
      this.appSdkConfig = new AppSdkConfig();
     }

  public getFeatures(): Observable<AppFeatures> {
    const uri = this.envService.baseApiPath + this.appSdkConfig.GET_FEATURES_URL;
    return this.http.get(uri).map((res) => {
      return this.mapFeaturesResponse(res);
    });
  }
  private mapFeaturesResponse(result: any): AppFeatures {
    const features = new AppFeatures();
    features.isExtraShiftEnabled = _.any(result.features, (f: any) => f.name === 'ExtraShiftsEnabled');
    features.isQualifiedStaffEnabled = _.any(result.features, (f: any) => f.name === 'QualifiedStaff');
    features.isWeeklyViewEnabled = _.any(result.features, (f: any) => f.name === 'WeeklyView');
    features.isWeeklyViewDemographicsPopoverEnabled = _.any(result.features, (f: any) => f.name === 'WeeklyView:DemographicsPopover');
    features.isWeeklyViewScheduleExceptionsEnabled = _.any(result.features, (f: any) => f.name === 'WeeklyView:ScheduleExceptions');
    features.isWeeklyViewEditTargetNeedsEnabled = _.any(result.features, (f: any) => f.name === 'WeeklyView:EditTargetNeeds');
    return features;
  }
}
