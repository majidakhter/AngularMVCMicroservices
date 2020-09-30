
//  import * as moment from 'moment';
//  import { PayPeriod } from './pay-period';
//  import { IScheduleCalendarDay } from './schedule-calendarday';
//  import { IScheduleCalendarWeek, ScheduleCalendarWeek } from './schedule-calendarweek';
//  import { ISchedule } from './schedule';

//  export class PayPeriodDay implements IScheduleCalendarDay {
//    date?: moment.Moment;
//    isCurrentPayPeriod?: boolean;
//    isActive?: boolean;
//    events?: ISchedule[];
//    etag: string;
//  }

//  export class PayPeriodWeek extends ScheduleCalendarWeek implements IScheduleCalendarWeek {
//    isCurrent: boolean = false;
//    numCurrentDays: number = 0;
//    days: IScheduleCalendarDay[] = [];
//    weeklyHours: number = 0;

//    constructor(startDate: moment.Moment, payperiod: PayPeriod) {
//      super();
//      let date = startDate.clone();

//      for (let i = 0; i < 7; i++) {
//        let curr = false,
//          isActive = false;

//        if (date.isBetween(moment(payperiod.beginDate).startOf('day'), moment(payperiod.endDate).endOf('day'), null, '[]')) {
//          this.isCurrent = curr = true;
//          this.numCurrentDays++;
//        }

//        if (date.isSameOrAfter(payperiod.beginDate)) {
//          isActive = true;
//        }

//        this.days.push({
//          date: date.clone(),
//          isCurrentPayPeriod: curr,
//          isActive: isActive,
//          events: [],
//          etag: null
//        });

//        date.add(1, 'd');
//      }
//    }

//    recalculateHours(): void {
//      this.weeklyHours = 0;
//      this.days.forEach(day => day.events.forEach(e => {
//        this.weeklyHours += e.isScheduledHours ? e.hours : 0;
//      }));
//    }

//    public sortDayEvents(): void {
//      super.sortDayEvents();
//    }
//  }
