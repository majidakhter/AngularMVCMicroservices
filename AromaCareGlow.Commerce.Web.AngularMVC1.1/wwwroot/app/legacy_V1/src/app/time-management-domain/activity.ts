import { Moment } from 'moment';
import * as moment from 'moment';
import { IIdentifier } from './identifier';
import { IBaseScheduleObjectConfig } from './pay-code';

export interface IActivity extends IIdentifier {
  startTime: string;
  hours: number;
  lunchHours: number;
  payCode: IIdentifier;
  readonly start: Moment;
  readonly end: Moment;
}

//  tslint:disable-next-line
export interface IActivityConfig extends IBaseScheduleObjectConfig { }

export interface IActivityWithConfig extends IActivity {
  configuration: IActivityConfig;
}

export class Activity implements IActivity {
  private startTimeAsMoment: Moment;

  constructor(
    public id: string,
    public code: string,
    public name: string,
    //  tslint:disable-next-line:variable-name
    public number: string,
    public startTime: string,
    public hours: number,
    public lunchHours: number,
    public payCode: IIdentifier,
    start: Moment
  ) {
    this.startTimeAsMoment = start;
  }

  public get start(): Moment {
    return this.startTimeAsMoment;
  }

  public get end(): Moment {
    return moment(this.startTimeAsMoment).add(this.hours, 'hours').add(this.lunchHours, 'hours');
  }

  protected static getStartTimeFromJson(json: any): Moment {
    const activityStartTime = moment();

    if (json.startTime) {
      activityStartTime.set('hour', json.startTime.split(':')[0]);
      activityStartTime.set('minute', json.startTime.split(':')[1]);
    }
    return activityStartTime;
  }

  public static fromJson(json: any): Activity {
    if (!json) return undefined;
    return new Activity(
      json.id,
      json.code,
      json.name,
      json.number,
      json.startTime,
      json.hours,
      json.lunchHours,
      null, //  PayCode is not currently mapped and returned.
      this.getStartTimeFromJson(json)
    );
  }
}

export class ActivityWithConfig extends Activity implements IActivityWithConfig {
  constructor(
    public id: string,
    public code: string,
    public name: string,
    //  tslint:disable-next-line:variable-name
    public number: string,
    public startTime: string,
    public hours: number,
    public lunchHours: number,
    public payCode: IIdentifier,
    start: Moment,
    public configuration: IActivityConfig
  ) {
    super(id, code, name, number, startTime, hours, lunchHours, payCode, start);
  }

  public static fromJson(json: any): ActivityWithConfig {
    if (!json) return undefined;
    return new ActivityWithConfig(
      json.id,
      json.code,
      json.name,
      json.number,
      json.startTime,
      json.hours,
      json.lunchHours,
      null, //  PayCode is not currently mapped and returned.
      this.getStartTimeFromJson(json),
      json.configuration
    );
  }
}
