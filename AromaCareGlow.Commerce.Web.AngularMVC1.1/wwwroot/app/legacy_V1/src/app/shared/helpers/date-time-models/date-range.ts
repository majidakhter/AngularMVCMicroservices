
import { Moment } from 'moment';

/**
 * A class used to represent a range of dates
 */
export class DateRange {
  constructor(startDate: Moment, endDate: Moment) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
  public startDate: Moment;
  public endDate: Moment;

  get startTime(): string {
    return this.startDate.format('HH:mm:ss'); //  tslint:disable-line: wfm-no-moment-format
  }

  get endTime(): string {
    return this.endDate.format('HH:mm:ss'); //  tslint:disable-line: wfm-no-moment-format
  }

  isTimeEqual(dateRange): boolean {
    return (this.startTime === dateRange.startTime && this.endTime === dateRange.endTime);
  }
}
