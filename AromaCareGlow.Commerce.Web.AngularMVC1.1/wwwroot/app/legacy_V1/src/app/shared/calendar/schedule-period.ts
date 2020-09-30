

import { Moment } from 'moment';
import { DateRange } from '../helpers/date-time-models/date-range';

export enum GroupSelfScheduledPeriodMode {
  Closed = 0,
  Opens = 1,
  Exist = 2
}

export class SchedulePeriod {
  start: Moment;
  end: Moment;
  status: string;
  statusMessage?: string;
  selfScheduleStart?: Moment;
  selfScheduleEnd?: Moment;
  selfScheduleStatus?: GroupSelfScheduledPeriodMode;

  constructor(start: Moment, end: Moment, status: string, selfScheduleStart: Moment, selfScheduleEnd: Moment) {
    this.start = start;
    this.end = end;
    this.status = status;
    this.selfScheduleStart = selfScheduleStart;
    this.selfScheduleEnd = selfScheduleEnd;
  }

  public static schedulePeriodContainsDateRange(dateRange: DateRange, schedulePeriod: SchedulePeriod): boolean {
    if (!dateRange) {
      return false;
    }

    return dateRange.startDate.isSameOrAfter(schedulePeriod.start, 'day') && dateRange.endDate.isSameOrBefore(schedulePeriod.end, 'day');
  }
}
