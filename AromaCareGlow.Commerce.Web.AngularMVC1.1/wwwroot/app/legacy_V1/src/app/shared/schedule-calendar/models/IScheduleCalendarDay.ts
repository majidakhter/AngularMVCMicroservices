

import { Moment } from 'moment';
import { ISchedule } from '../../../time-management-domain/schedule';

export interface IScheduleCalendarDay {

  date?: Moment;
  isActive?: boolean;
  events?: ISchedule[];
  isCurrentPayPeriod?: boolean;
  etag: string;
  needCount?: number;
}
