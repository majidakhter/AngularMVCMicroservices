

import { Sorter } from 'src/app/time-management-domain/sorter';

export abstract class ScheduleCalendarWeek {

  sortDayEvents(this): void {
    this.days.forEach(day => day.events.forEach(e => {
      day.events = Sorter.defaultScheduleSort(day.events);
    }));
  }

}
