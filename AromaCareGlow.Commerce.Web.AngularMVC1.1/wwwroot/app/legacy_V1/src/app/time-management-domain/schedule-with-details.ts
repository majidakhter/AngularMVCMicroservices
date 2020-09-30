
import { IActivity, Activity, ActivityWithConfig, IActivityWithConfig } from './activity';
import { IPayCode, IPayCodeWithPermissionConfiguration, IPayCodeWithIndicatorConfiguration } from './pay-code';
import { ISchedule, Schedule } from './schedule';
import { ILocation, ILocationWithConfig, LocationWithConfig } from './location';

export interface IScheduleDetailed<ActivityType extends IActivity, PayCodeType extends IPayCode, LocationType extends ILocation> extends ISchedule {
  activity: ActivityType;
  payCode: PayCodeType;
  location: LocationType;
}

export class ScheduleDetailed<ActivityType extends IActivity, PayCodeType extends IPayCode, LocationType extends ILocation>
  extends Schedule implements IScheduleDetailed<ActivityType, PayCodeType, LocationType> {
  activity: ActivityType;
  payCode: PayCodeType;
  location: LocationType;

  public static fromJsonWithPayCodePermissionConfig(json: any): ScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation> {
    let result = new ScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>();
    result = this.assignStandardData(json, result);
    result.payCode = json.payCode;
    result.activity = Activity.fromJson(json.activity);
    return result;
  }

  public static fromJsonWithIndicatorConfigruation(json: any): ScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig> {
    let result = new ScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>();
    result = this.assignStandardData(json, result);
    result.payCode = json.payCode;
    result.activity = ActivityWithConfig.fromJson(json.activity);
    result.location = LocationWithConfig.fromJson(json.location);
    return result;
  }
}
