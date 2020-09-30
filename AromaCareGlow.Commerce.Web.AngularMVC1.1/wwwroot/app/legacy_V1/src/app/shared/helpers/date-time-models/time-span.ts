

import * as moment from 'moment';
import { Moment, Duration } from 'moment';
import * as _ from 'lodash';

/**
 * A class used to represent a length of time
 * Includes utility functions to detect overlap and merge together multiple time spans
 */
export class TimeSpan {

  constructor(start: Moment, end: Moment) {
    this.start = start;
    this.end = end;
  }
  get duration(): Duration {
    return moment.duration(this.end.diff(this.start));
  }

  start: Moment;
  end: Moment;
  /**
   * Construct a span from a start time and a specific duration, rather than providing an end time
   */
  static fromDuration(start: Moment, duration: Duration): TimeSpan {
    const end = start.clone();
    end.add(duration);
    return new this(start, end);
  }

  /**
   * Takes in a set of time spans and attempts to merge all of them together
   *  resulting in a hopefully smaller list of time spans, which effectively covers the
   *  same periods of time as the original array
   * @param spans a set of time spans to reduce
   */
  public static mergeReduceTimeSpans(spans: TimeSpan[]): TimeSpan[] {
    const resultSpans = _.clone(spans);
    resultSpans.sort((a, b) => a.start.diff(b.start));
    for (let i = 0; i < resultSpans.length - 1; i++) {
      const mergedResult = resultSpans[i].tryMergeWith(resultSpans[i + 1]);
      if (mergedResult != null) {
        resultSpans.splice(i, 2, mergedResult);
        i--;
      }
    }
    return resultSpans;
  }

  /**
   * Attempt a merge with another time span. If the two cannot be merged, then this function returns null
   * Will merge two spans even if there is no overlap --
   * I.E. 1:00-2:00 will merge with 2:00-3:00 into 1:00-3:00
   * @param other Another time span to attempt to merge with
   */
  public tryMergeWith(other: TimeSpan): TimeSpan {
    if (!this.mergesWith(other)) {
      return null;
    }
    const newSpan = new TimeSpan(
      this.start.isBefore(other.start) ? this.start : other.start,
      this.end.isAfter(other.end) ? this.end : other.end
    );
    return newSpan;
  }

  /**
   * Will return true if this time span overlaps with or touches the other time span
   * Differs from collision in that it will return true if one ends at the same time the other starts
   * @param other another time span to compare with
   */
  private mergesWith(other: TimeSpan): boolean {
    return this.start.isSameOrBefore(other.end) && this.end.isSameOrAfter(other.start);
  }

  /**
   * Checks to see if there is overlap between two time spans
   * I.E. 1:00-3:00 collides with 2:59-4:00, but not with 3:00-4:00
   * @param other another time span to compare with
   */
  public collidesWith(other: TimeSpan): boolean {
    return this.start.isBefore(other.end) && this.end.isAfter(other.start);
  }
}
