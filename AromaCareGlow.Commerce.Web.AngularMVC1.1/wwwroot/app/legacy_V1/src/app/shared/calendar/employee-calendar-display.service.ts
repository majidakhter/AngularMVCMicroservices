

import { Injectable } from '@angular/core';
import { DateFormatter } from '../date-formats/date-formatter';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { SchedulePeriod } from './schedule-period';
import { IScheduleCalendarWeek } from '../schedule-calendar/models/IScheduleCalendarWeek';
import * as moment from 'moment';
import { IScheduleCalendarDay } from '../schedule-calendar/models/IScheduleCalendarDay';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { CalendarWeek } from '../schedule-calendar/models/calendar-week.model';
import { Observable } from 'rxjs/Observable';

/**
 * Service for use by the EmployeeCalendarDisplay components for finding schedule information.
 */
@Injectable()
export class EmployeeCalendarDisplayService {
  constructor(
    private dateFormatter: DateFormatter,
    private sdkService: EmployeeScheduleSdkService) { }

  /**
   * Helper method to do some date math to see if we need to add another week to account for misalignment of schedule period start to week start
   *
   * @param schedulePeriod the schedule period to initialize the weeks for.
   * @returns An array with the weeks needed to display the schedule period.
   */
  public initWeeks(schedulePeriod: SchedulePeriod): Array<IScheduleCalendarWeek> {
    // Determine the start of the week according to the browser
    const startOfWeek = moment().startOf('week');

    const schedulePeriodStart = schedulePeriod.start;
    const schedulePeriodEnd = schedulePeriod.end;
    // If the schedule period doesn't start on the same day as the start of the week, we will have partial weeks to contend with.
    // Here we hope that they are equal and then change them if not.
    let actualBlockStart = schedulePeriodStart.clone();

    if (startOfWeek.day() !== schedulePeriodStart.day()) {
      // Rats. We need to start generation of the start of the week that the schedule period is in.
      const daysApart = startOfWeek.day() - schedulePeriodStart.day();
      actualBlockStart = schedulePeriodStart.clone();
    }

    // loop through and make payPeriodWeeks for the weeks in the range
    const startDayOfWeek = actualBlockStart.clone();
    const weeks: Array<IScheduleCalendarWeek> = [];

    while (startDayOfWeek.isBefore(schedulePeriodEnd, 'day')) {
      weeks.push(new CalendarWeek(startDayOfWeek, schedulePeriodStart, schedulePeriodEnd));
      startDayOfWeek.add(1, 'w');
    }
    return weeks;
  }

  /**
   * Fills in the schedule information for the passed-in array of @type{IScheduleCalendarWeek} objects.
   *
   * @param employeeCode The employee code.
   * @param weeks The array of calendar weeks.
   * @return Observable of the results.
   */
  public getSchedulesByCode(employeeCode: string, weeks: Array<IScheduleCalendarWeek>, constraint: string): Observable<Array<IScheduleCalendarWeek>> {

    // let emp: IEmployee = { id: null, code: employeeCode, firstName: null, lastName: null, canEdit: null, middleName: null};

    return this.sdkService.getSchedules(employeeCode, this.dateFormatter.toUrlDate(weeks[0].days[0].date), this.dateFormatter.toUrlDate(weeks[weeks.length - 1].days[6].date), null, constraint)
      .map((result) => {
        return this.assignSchedules(weeks, result);
      });
  }

  /**
   * Helper method to take a list of daily schedules and use them to fill in the calendar weeks.
   *
   * @param weeks The array of IScheduleCalendarWeeks to fill
   * @param schedules The schedules for the days of the week to use to fill in the CalendarWeeks.
   */
  private assignSchedules(weeks: Array<IScheduleCalendarWeek>, scheduleResult): Array<IScheduleCalendarWeek> {
    weeks.forEach((week: IScheduleCalendarWeek) => {
      week.days.forEach((day: IScheduleCalendarDay) => {
        day.etag = scheduleResult.etag;
      });
    });

    if (scheduleResult.events.length === 0) {
      return weeks;
    }

    let nextSchedule: ISchedule = scheduleResult.events.shift();

    // for each week
    for (let weeksIndex = 0; weeksIndex < weeks.length && nextSchedule; weeksIndex++) {
      const week = weeks[weeksIndex];

      // for each day
      for (let dayIndex = 0; dayIndex < week.days.length && nextSchedule; dayIndex++) {
        const day = week.days[dayIndex];

        // while the schedule belongs on this day
        while (nextSchedule && this.dateFormatter.toShortDate(day.date) === this.dateFormatter.toShortDate(nextSchedule.startDate)) {
          if (nextSchedule.isScheduledHours) {
            week.weeklyHours += nextSchedule.hours;
          }

          // save the schedule
          day.events.push(nextSchedule);

          // get the next schedule that needs to be added : all schedules added
          nextSchedule = scheduleResult.events.length > 0 ? scheduleResult.events.shift() : null;
        }
      }
    }

    return weeks;
  }
}
