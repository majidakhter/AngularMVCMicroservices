

import { IScheduleCalendarDay } from './IScheduleCalendarDay';

/**
 * An IScheduleCalendarWeek is a collection of @type{IScheduleCalendarDay} objects representing a week of time.
 */
export interface IScheduleCalendarWeek {

  /** Indicates whether the week is considered 'current'. The meaning of this may differ by implementation. */
  isCurrent: boolean;

  /** An array of @type{IScheduleCalendarDay} objects representing one week of time. */
  days: IScheduleCalendarDay[];

  /** The sum of the hours for all the schedule for the entire week.  */
  weeklyHours: number;

  /** The number of days this week that are considered 'current'. The meaning of this may differ by implementation. */
  numCurrentDays: number;

  /** Function to sort the week's day's events */
  sortDayEvents: () => void;

  /** Function to recalculate the Hours */
  recalculateHours: () => void;
}
