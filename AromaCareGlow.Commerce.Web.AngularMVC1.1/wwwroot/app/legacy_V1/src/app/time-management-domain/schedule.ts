import * as moment from 'moment';
import { Moment } from 'moment';
import { IActivity, Activity } from './activity';
import { IEmployee, mapEmployee } from './employee';
import { IJobClass } from './job-class';
import { IDepartment, IFacility, IUnit } from './org-unit';
import { IPosition } from './position';
import { IProfile } from './profile';
import { IEmployeeRequest } from './employee-request';
import { IStaffingLevels } from './staffing-levels';
import { IPayCode } from './pay-code';
import { TimeSpan } from '../shared/helpers/date-time-models/time-span';
import { IEmployment } from './quick-code';
import { EventTypes } from './event-types';

export interface ISchedule {
  startDate: Moment;
  requestedDate: Moment;
  requestForDates: Array<any>;
  hasStartTime: boolean;
  status: string;
  hours: number;
  amount: number;
  lunchHours: number;
  guid: string;
  employment: IEmployment;
  timeZone: string;
  jobClass: IJobClass;
  payCode: IPayCode;
  activity: IActivity;
  profile: IProfile;
  position: IPosition;
  facility: IFacility;
  department: IDepartment;
  unit: IUnit;
  employee: IEmployee;
  isScheduledHours: boolean;
  isExtraShift: boolean;
  isScheduleRetractable: boolean;
  etag: string; // This is same like as in the 'ICalendarEventsStateModel'.
  isTradeRequested: boolean;
  readonly isActivity: boolean;
  readonly endDate: Moment;
  isScheduleTradable: boolean;
  requestedReason: string;
  source: string;
  scheduleTradeParticipant: string;
  scheduleTradeStatus: string;
  eventType: EventTypes;
  person: IEmployee;
  isTradeRequireEqualLength: boolean;
}

export class Schedule implements ISchedule {
  startDate: Moment;
  requestedDate: Moment;
  requestForDates: Array<any>;
  hasStartTime: boolean;
  status: string;
  hours: number;
  amount: number;
  lunchHours: number;
  guid: string;
  employment: IEmployment;
  timeZone: string;
  jobClass: IJobClass;
  payCode: IPayCode;
  activity: IActivity;
  profile: IProfile;
  position: IPosition;
  facility: IFacility;
  department: IDepartment;
  unit: IUnit;
  employee: IEmployee;
  isScheduledHours: boolean;
  isExtraShift: boolean;
  isScheduleRetractable: boolean;
  etag: string;
  isTradeRequested: boolean;
  isScheduleTradable: boolean;
  requestedReason: string;
  source: string;
  scheduleTradeParticipant: string;
  scheduleTradeStatus: string;
  eventType: EventTypes;
  person: IEmployee;
  isTradeRequireEqualLength : boolean;

  get isActivity(): boolean {
    return !!this.activity;
  }

  get endDate(): Moment {
    return this.startDate ? this.startDate.clone().add(this.hours, 'hours').add(this.lunchHours, 'hours') : null;
  }

  public static getTimeSpan(schedule: ISchedule): TimeSpan {
    return new TimeSpan(schedule.startDate, schedule.endDate);
  }

  public static isOverlapping(schedule1: ISchedule, schedule2: ISchedule): boolean {
    if (!schedule1.hasStartTime || !schedule2.hasStartTime) {
      return false;
    }
    return Schedule.getTimeSpan(schedule1).collidesWith(Schedule.getTimeSpan(schedule2));
  }
  protected static assignStandardData<T extends ISchedule>(json: any, schedule: T): T {
    schedule.isScheduledHours = json.isScheduledHours;
    schedule.startDate = moment.parseZone(json.startDate);
    schedule.requestedDate = moment(json.requestedDate);
    schedule.requestForDates = json.requestForDates;
    schedule.hasStartTime = json.hasStartTime;
    schedule.status = json.status;
    schedule.hours = json.hours;
    schedule.amount = json.amount;
    schedule.jobClass = json.jobClass;
    schedule.employment = json.employment;
    schedule.lunchHours = json.lunchHours;
    schedule.profile = json.profile;
    schedule.position = json.position;
    schedule.isExtraShift = json.isExtraShift;
    schedule.guid = json.guid;
    schedule.facility = json.location ? json.location.facility : null;
    schedule.department = json.location ? json.location.department : null;
    schedule.unit = json.location ? json.location.unit : null;
    schedule.timeZone = json.location ? json.location.timeZoneId : null;
    schedule.etag = json.etag;
    schedule.isTradeRequested = json.isTradeRequested;
    schedule.isScheduleTradable = json.isScheduleTradable;
    schedule.isScheduleRetractable = json.isScheduleRetractable;
    schedule.requestedReason = json.requestedReason;
    schedule.employee = json.employee && json.employee.employment ? mapEmployee(json.employee) : json.person;
    schedule.source = json.source;
    if (schedule.facility) {
      schedule.facility.timeZoneId = json.location.timeZoneId;
    }
    schedule.scheduleTradeParticipant = json.scheduleTradeParticipant;
    schedule.scheduleTradeStatus = json.scheduleTradeStatus;
    schedule.isTradeRequireEqualLength = json.isTradeRequireEqualLength;
    return schedule;
  }

  public static fromJson(json: any): Schedule {
    let result = new Schedule();
    result = this.assignStandardData(json, result);
    result.payCode = json.payCode;
    result.activity = Activity.fromJson(json.activity);

    return result;
  }
}

export class ScheduleWithRequestDetails extends Schedule {
  public employeeRequest?: IEmployeeRequest;
  public staffingLevels?: IStaffingLevels;
}
