
import { Moment } from 'moment';
import { IScheduleCalendarDay } from './IScheduleCalendarDay';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { ScheduleCalendarWeek } from './ScheduleCalendarWeek';
import { IScheduleCalendarWeek } from './IScheduleCalendarWeek';

export class CalendarWeekDay implements IScheduleCalendarDay {
  date?: Moment;
  isActive?: boolean;
  events?: ISchedule[];
  etag: string;
}

export class CalendarWeek extends ScheduleCalendarWeek implements IScheduleCalendarWeek {
  isCurrent = false;
  numCurrentDays = 0;
  days: CalendarWeekDay[] = [];
  weeklyHours = 0;

  constructor(startDate: Moment, periodStartDate: Moment, periodEndDate: Moment) {
    super();
    const date = startDate.clone();

    for (let i = 0; i < 7; i++) {
      let isActive = false;

      const startOfPeriod = periodStartDate.startOf('day');
      const endOfPeriod = periodEndDate.endOf('day');

      if (date.isBetween(startOfPeriod, endOfPeriod, null, '[]')) {
        this.isCurrent = isActive = true;
        this.numCurrentDays++;
      }

      this.days.push({
        date: date.clone(),
        isActive: isActive,
        events: [],
        etag: null
      });

      date.add(1, 'd');
    }
  }

 public recalculateHours(): void {
    this.weeklyHours = 0;
    this.days.forEach(day => day.events.forEach(e => {
      this.weeklyHours += e.isScheduledHours ? e.hours : 0;
    }));
  }

  sortDayEvents(): void {
    super.sortDayEvents();
  }
}
