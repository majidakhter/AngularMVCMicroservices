
import { IActivityWithConfig } from '../../time-management-domain/activity';
import { IProfile } from '../../time-management-domain/profile';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';

export interface IOpenShiftResponse {
  shifts: IOpenShift[];
}

export interface IOpenShift {
  activity: IActivityWithConfig;
  start: Moment;
  end: Moment;
  location: ILocationWithConfig;
  profile: IProfile;
}

export class OpenShift implements IOpenShift {
  public activity: IActivityWithConfig;
  public start: Moment;
  public end: Moment;
  public location: ILocationWithConfig;
  public profile: IProfile;

  public static fromJSON(json: IOpenShift) {
    const shift = new OpenShift();
    shift.activity = json.activity;
    shift.start = moment.parseZone(json.start);
    shift.end = moment.parseZone(json.end);
    shift.location = json.location;
    shift.profile = json.profile;
    return shift;
  }
}
