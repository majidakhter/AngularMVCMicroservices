

import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { DateFormats } from './date-formats';

@Injectable()
export class DateFormatter {
  constructor(
    private dateFormats: DateFormats
  ) { }

  /**
   * Formats the specified Moment object into a string formatted in a way the API URL will understand (2018-02-01). This
   * will always default to US formatting as our API is using US.
   */
  public toUrlDate(date: Moment): string {
    //  Always switch to English formatting when generating a date format to pass to our APIs.
    const enDate = date.clone().locale('en');
    return this.format(enDate, this.dateFormats.URL_DATE);
  }

  /**
   * Formats the specified Moment object into a ISO date only string.  IE: 'YYYY-MM-DD'.
   */
  public toIsoDate(date: Moment): string {
    return this.format(date, this.dateFormats.ISO_DATE);
  }

  /**
   * Formats the specified Moment object into a ISO date time string, which is the default for moment.js.  IE: 'YYYY-MM-DDTHH:mm:ss-Offset'.
   */
  public toIsoDateTime(date: Moment): string {
    return this.format(date, this.dateFormats.DEFAULT).replace(/\+/gi, '%2B');
  }

  /**
   * Formats the specified Moment object into a string that contains a localized version which only contains the Month and Day parts (ie: Feb 1).
   */
  public toMonthDay(date: Moment): string {
    return this.format(date, this.dateFormats.DATE_MONTH_DAY);
  }

  /**
   * Date format that returns just the Day of Month part of the date. (ie: 23)
   */
  public toDayOfMonth(date: Moment): string {
    return this.format(date, this.dateFormats.DAY_OF_MONTH);
  }

  /**
   * Date format that returns a 3 cahracter representation of the month. (ie: Mar)
   */
  public toShortMonth(date: Moment): string {
    return this.format(date, this.dateFormats.MONTH_SHORT);
  }

  /**
   * Formats the specified Moment object into a string that contains a localized version which only contains the DayOfWeek DayOfMonth parts (ie: 1 Feb).
   */
  public toDayOfWeekDayOfMonth(date: Moment): string {
    return this.format(date, this.dateFormats.DATE_DAY_OF_WEEK_DAY_OF_MONTH);
  }

  /**
   * Formats the specified Moment object into a string that contains a localized version which only contains the Date part (ie 02/01/2018).
   */
  public toShortDate(date: Moment): string {
    return this.format(date, this.dateFormats.DATE_SHORT);
  }

  public to24HourTime(date: Moment): string {
    return this.format(date, this.dateFormats.TIME_24HOUR_SHORT);
  }

  /**
   * Formats the specified Moment object into a string as Day of Week (medium form) with the long date format. This format
   * is not fully localized because it assumes US order and punctuation.
   * Example: Tue Apr 10, 2018
   * @param date The date to format
   */
  public toDayOfWeekLongDate(date: Moment): string {
    return this.format(date, this.dateFormats.DAY_OF_WEEK_LONG_DATE);
  }

  /**
   * Formats the specified Moment object using the specified format string.
   */
  public format(date: Moment, format: string): string {
    return date.format(format); //  tslint:disable-line: wfm-no-moment-format
  }

  /**
   * Formats the specified Moment object into a string that contains a localized version which only contains the Month, Day and Year parts (ie: Feb 1, 2018).
   */
  public toMonthDateYear(date: Moment): string {
    return this.format(date, this.dateFormats.DATE_MONTH_DAY_YEAR);
  }
}
