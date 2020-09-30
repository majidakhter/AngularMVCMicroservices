

import { SchedulePeriod } from './schedule-period';
import * as moment from 'moment';
import { DateRange } from '../helpers/date-time-models/date-range';
// import { DateRange } from "../../helpers/date-time-models/date-range";

describe('SchedulePeriod', () => {
  const schedulePeriod: SchedulePeriod = new SchedulePeriod(
    moment('2018-11-01', 'YYYY-MM-DD'),
    moment('2018-11-16', 'YYYY-MM-DD'),
    'balancing',
    moment('2018-12-01', 'YYYY-MM-DD'),
    moment('2018-12-30', 'YYYY-MM-DD')
  );
  describe('#schedulePeriodContainsDateRange', () => {
    let result: boolean;
    describe('when date range is undefined', () => {
      beforeEach(() => {
        result = SchedulePeriod.schedulePeriodContainsDateRange(null, schedulePeriod);
      });

      it('should return false', () => {
        expect(result).toEqual(false);
      });
    });

    describe('when date range start is before schedule period start date', () => {
      let scheduleDateRangeResult: boolean;
      beforeEach(() => {
        const dateRange: DateRange = new DateRange(moment('2018-10-28', 'YYYY-MM-DD'), moment('2018-11-05', 'YYYY-MM-DD'));
        scheduleDateRangeResult = SchedulePeriod.schedulePeriodContainsDateRange(dateRange, schedulePeriod);
      });

      it('should return false', () => {
        expect(scheduleDateRangeResult).toEqual(false);
      });
    });

    describe('when date range start is same as schedule period start date', () => {
      let scheduleDateRangeResult: boolean;
      beforeEach(() => {
        const dateRange: DateRange = new DateRange(moment('2018-11-01', 'YYYY-MM-DD'), moment('2018-11-05', 'YYYY-MM-DD'));
        scheduleDateRangeResult = SchedulePeriod.schedulePeriodContainsDateRange(dateRange, schedulePeriod);
      });

      it('should return true', () => {
        expect(scheduleDateRangeResult).toEqual(true);
      });
    });

    describe('when date range start is after schedule period start date', () => {
      describe('when date range end is before schedule period end', () => {
        let scheduleDateRangeResult: boolean;
        beforeEach(() => {
          const dateRange: DateRange = new DateRange(moment('2018-11-05', 'YYYY-MM-DD'), moment('2018-11-08', 'YYYY-MM-DD'));
          scheduleDateRangeResult = SchedulePeriod.schedulePeriodContainsDateRange(dateRange, schedulePeriod);
        });

        it('should return true', () => {
          expect(scheduleDateRangeResult).toEqual(true);
        });
      });

      describe('when date range end is the same as the schedule period end', () => {
        let scheduleDateRangeResult: boolean;
        beforeEach(() => {
          const dateRange: DateRange = new DateRange(moment('2018-11-05', 'YYYY-MM-DD'), moment('2018-11-16', 'YYYY-MM-DD'));
          scheduleDateRangeResult = SchedulePeriod.schedulePeriodContainsDateRange(dateRange, schedulePeriod);
        });

        it('should return true', () => {
          expect(scheduleDateRangeResult).toEqual(true);
        });
      });

      describe('when date range end is after schedule period end', () => {
        let scheduleDateRangeResult: boolean;
        beforeEach(() => {
          const dateRange: DateRange = new DateRange(moment('2018-11-05', 'YYYY-MM-DD'), moment('2018-11-30', 'YYYY-MM-DD'));
          scheduleDateRangeResult = SchedulePeriod.schedulePeriodContainsDateRange(dateRange, schedulePeriod);
        });

        it('should return false', () => {
          expect(scheduleDateRangeResult).toEqual(false);
        });
      });
    });
  });
});
