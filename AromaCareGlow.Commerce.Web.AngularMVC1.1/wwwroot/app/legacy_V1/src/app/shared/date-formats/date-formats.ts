
import * as moment from 'moment';

export class DateFormats {
  constructor() {
    this.DATE_MONTH_DAY = DateFormats.determineMonthDayFormat(moment.localeData().longDateFormat('ll'));
  }

  /**
   * Date format that moment.js uses by Default, which happens to be a date time offset value.
   * Example: 02/03/2018 08:05PM CST =>  2018-02-03T20:05:00-06:00
   */
  public readonly DEFAULT: string = '';
  /**
   * Date format used specifically when formatting dates that will be part of a URL. Our APIs require this format
   * and should NOT include the time component.
   * Example: 02/03/2018 => 2018-02-03
   */
  public readonly URL_DATE: string = 'YYYY-MM-DD';

  /**
   * Date format that returns just the Day of Month part of the date.
   * Example: 02/03/2018 => 3
   */
  public readonly DAY_OF_MONTH: string = 'D';

  /**
   * Date format that returns just the Day of Week part of the date in medium format.
   * Example: 02/03/2018 => Sat
   */
  public readonly DAY_OF_WEEK_MEDIUM: string = 'ddd';

  /**
   * Date format that returns just the Day of Week part of the date in short format.
   * Example: 02/03/2018 => Sa
   */
  public readonly DAY_OF_WEEK_SHORT: string = 'dd';

  /**
   * Date format that returns the year (in YYYY format).
   * Example: 02/03/2018 => 2018
   */
  public readonly YEAR: string = 'YYYY';

  /**
   * Date format that returns just the time part of the date in 24 hour format.
   * Example: 02/03/2018 3:00PM => 15:00
   */
  public readonly TIME_24HOUR_SHORT: string = 'HH:mm';

  /**
   * Date format that returns just the AM/PM time part of the date.
   * Example: 02/03/2018 3:00PM => PM
   */
  public readonly TIME_AMPM: string = 'A';

  /**
   * Date format that returns the date part only, zero padded single digits. This format
   * is fully localized using moment's built-in 'L' format.
   * Example: 2/3/2018 3:00PM => 02/03/2018
   */
  public readonly DATE_SHORT: string = 'L';

  /**
   * Date format string that specifies only the month text in 3 characters.
   * Example: Jun
   */
  public readonly MONTH_SHORT: string = 'MMM';

  /**
   * Date format that returns the month (in long form) and year joined together. This format is not
   * localized fully as it assumes US order.
   * Example: 02/03/2018 => Feburary 2018
   */
  public readonly DATE_MONTH_YEAR: string = 'MMMM YYYY';

  /**
   * Date format that returns the month (in short form) and day of month joined together. This format
   * is fully localized using moment's built-in 'll' format.
   * Example: 02/03/2018 => Feb 3
   */
  public readonly DATE_MONTH_DAY: string = '';

  /**
   * Date format that returns the month (in short form), day of month and year joined together. This format
   * is fully localized using moment's built-in 'll' format.
   * Example: 02/03/2018 => Feb 3, 2018
   */
  public readonly DATE_MONTH_DAY_YEAR: string = 'll';

  /**
   * Date format that returns the day of the week(in short form), month (in short form), day of month and year joined together.
   * This format is fully localized using moment's built-in 'll' format.
   * Example: 02/03/2018 => Sat Feb 3, 2018
   */
  public readonly DATE_DAY_MONTH_DATE_YEAR: string = 'ddd ll';

  /**
   * Date format that returns the Day of Week (medium form) with Day of Month joined together. This format is not
   * localized fully as it assumes US order.
   * Example: 02/03/2018 => Sat 3
   */
  public readonly DATE_DAY_OF_WEEK_DAY_OF_MONTH: string = `${this.DAY_OF_WEEK_MEDIUM} ${this.DAY_OF_MONTH}`;

  /**
   * Date format that returns the Day of Week (medium form) with the long date format. This format
   * is not fully localized because it assumes US order and punctuation.
   * Example: Tue Apr 10, 2018
   */
  public readonly DAY_OF_WEEK_LONG_DATE: string = `${this.DAY_OF_WEEK_MEDIUM} ${this.DATE_MONTH_DAY_YEAR}`;

  /**
   * Date format that specifies a ISO 8601 Date string, with the date and time, but no timezone or offset
   * Example: YYYY-MM-DDTHH:mm:ss.SSS
   */
  public readonly ISO_8601: string = 'YYYY-MM-DDTHH:mm:ss.SSS';

  /**
   * Date format string that specifies the Date only portion of an ISO date string.
   * Example: 2018-07-24
   */
  public readonly ISO_DATE: string = 'YYYY-MM-DD';

  /**
   * Determines the localized format for what would be 'MMM D' in the 'en' locale. Unfortunately, moment does not have a direct
   * long date format for this particular situation (see https:// github.com/moment/moment/issues/3341). This method will take the
   * closest existing long date format (ll) and strip the year part off, accounting for when the YYYY part is in the beginning or
   * end of the format.
   */
  static determineMonthDayFormat(format: string): string {
    if (format.indexOf('YYYY') === 0) {
      //  In some locales, the Year is presented first, along with various punctuation (period, comma) as well as sometimes
      //  hard coded words in brackets. The RegEx below strips everything off that shouldn't be there related to the YYYY prefix.
      return format.replace(/YYYY(\.)?(\s)?(\[([^\x00-\x7F]|\w)+\])?(\s)?/gi, '');
    }

    //  In other locales, the year is presented at the end (or almost end). It can have various punctuation around it as well
    //  as hard coded words in brackets. The RegEx below strips everything off that shouldn't be there related to the YYYY suffix.
    return format.replace(/(\s)?,?(\[([^\x00-\x7F]|\w)+\])?(\s)?YYYY.*/gi, '');
  }

  public dayMonthDateFormat(format: string): string{
    return (moment(format).format('ddd MMM DD'));
  }

  public yearMonthDateFormat(format: string): string{
    return moment(format).format('YYYY-MM-DD');
  }

  public hoursMinutesFormat(format: string): string{
    return moment(format, 'HH:mm:ss').format('HH:mm');
  }
}
