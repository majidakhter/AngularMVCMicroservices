

import * as moment from 'moment';
import { DateFormats } from './date-formats';
import { DateFormatter } from './date-formatter';

describe('DateFormatter', () => {
  let formatter: DateFormatter;
  const mockFormats = {
    URL_DATE: 'YYYY-MM-DD',
    DATE_SHORT: 'MM/DD/YYYY',
    DATE_DAY_OF_WEEK_DAY_OF_MONTH: 'ddd D',
    DATE_MONTH_DAY: 'MMM d',
    TIME_24HOUR_SHORT: 'HH:mm',
    DAY_OF_WEEK_LONG_DATE: 'ddd ll',
    DATE_MONTH_DAY_YEAR: 'll'
  };

  beforeEach(() => {
    formatter = new DateFormatter(mockFormats as DateFormats);
  });

  describe('toUrlDate()', () => {
    it('formats date using URL_DATE value', () => {
      const date = moment('01/01/2018');
      expect(formatter.toUrlDate(date)).toEqual('2018-01-01');
    });
    it('always formats to US format, even if original locale for date has no numeral representations for date parts--like Hindi', () => {
      const date = moment('01/01/2018');
      date.locale('hi');
      expect(formatter.toUrlDate(date)).toEqual('2018-01-01');
    });
  });

  describe('toIsoDateTime()', () => {
    it('formats date using DEFAULT value', () => {
      const date = moment('01/01/2018');
      date.hours(16);
      date.minute(30);
      date.second(0);
      date.millisecond(0);
      expect(formatter.toIsoDateTime(date)).toEqual('2018-01-01T16:30:00-06:00');
    });
  });

  describe('toIsoDate()', () => {
    it('formats date using ISO_DATE value', () => {
      const date = moment('01/01/2018');
      expect(formatter.toIsoDate(date)).toEqual('2018-01-01T00:00:00-06:00');
    });
  });

  describe('toMonthDay()', () => {
    it('formats date using DATE_MONTH_DAY value', () => {
      const date = moment('01/01/2018');
      expect(formatter.toMonthDay(date)).toEqual('Jan 1');
    });
  });

  describe('toDayOfWeekDayOfMonth()', () => {
    it('formats date using DATE_DAY_OF_WEEK_DAY_OF_MONTH value', () => {
      const date = moment('01/01/2018');
      expect(formatter.toDayOfWeekDayOfMonth(date)).toEqual('Mon 1');
    });
  });

  describe('toShortDate()', () => {
    it('formats date using DATE_SHORT value', () => {
      const date = moment('01-01-2018');
      expect(formatter.toShortDate(date)).toEqual('01/01/2018');
    });
  });

  describe('to24HourTime()', () => {
    it('formats date using TIME_24HOUR_SHORT value', () => {
      const date = moment();
      date.hours(16);
      date.minute(30);
      date.second(0);
      date.millisecond(0);
      expect(formatter.to24HourTime(date)).toEqual('16:30');
    });
  });

  describe('toDayOfWeekLongDate()', () => {
    it('formats date using DAY_OF_WEEK_LONG_DATE value', () => {
      const date = moment('01-01-2018');
      expect(formatter.toDayOfWeekLongDate(date)).toEqual('Mon Jan 1, 2018');
    });
  });

  describe('format()', () => {
    it('formats date using specified format string', () => {
      const date = moment('01/01/2018');
      const format = 'MMM D';
      expect(formatter.format(date, format)).toEqual('Jan 1');
    });
  });

  describe('toMonthDateYear()', () => {
    it('formats date using DATE_MONTH_DAY_YEAR value', () => {
      const date = moment('01/01/2018');
      expect(formatter.toMonthDateYear(date)).toEqual('Jan 1, 2018');
    });
  });
});
