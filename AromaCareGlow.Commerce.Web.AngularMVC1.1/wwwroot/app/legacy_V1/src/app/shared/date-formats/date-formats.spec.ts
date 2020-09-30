
import * as moment from 'moment';
import { DateFormats } from './date-formats';

describe('DateFormats', () => {

  describe('constructor initializes default format correctly for', () => {
    const dateFormats = new DateFormats();

    it('URL_DATE', () => {
      expect(dateFormats.URL_DATE).toEqual('YYYY-MM-DD');
    });
    it('DAY_OF_MONTH', () => {
      expect(dateFormats.DAY_OF_MONTH).toEqual('D');
    });
    it('DAY_OF_WEEK_MEDIUM', () => {
      expect(dateFormats.DAY_OF_WEEK_MEDIUM).toEqual('ddd');
    });
    it('DAY_OF_WEEK_SHORT', () => {
      expect(dateFormats.DAY_OF_WEEK_SHORT).toEqual('dd');
    });
    it('TIME_24HOUR_SHORT', () => {
      expect(dateFormats.TIME_24HOUR_SHORT).toEqual('HH:mm');
    });
    it('DATE_SHORT', () => {
      expect(dateFormats.DATE_SHORT).toEqual('L');
    });
    it('DATE_MONTH_YEAR', () => {
      expect(dateFormats.DATE_MONTH_YEAR).toEqual('MMMM YYYY');
    });
    it('DATE_MONTH_DAY (defaults to US locale)', () => {
      expect(dateFormats.DATE_MONTH_DAY).toEqual('MMM D');
    });
    it('DATE_DAY_OF_WEEK_DAY_OF_MONTH', () => {
      expect(dateFormats.DATE_DAY_OF_WEEK_DAY_OF_MONTH).toEqual('ddd D');
    });
  });

  describe('initializes MONTH_DAY correctly', () => {

    const testCases = [
      {
        locale: 'en',
        expectedMonthDayFormat: 'MMM D' //  Originally: MMMM D, YYYY
      },
      {
        locale: 'es',
        expectedMonthDayFormat: 'D [de] MMM' //  Originally: D [de] MMMM [de] YYYY
      },
      {
        locale: 'hy-am',
        expectedMonthDayFormat: 'D MMM' //  Originally: D MMMM YYYY թ.
      },
      {
        locale: 'hu',
        expectedMonthDayFormat: 'MMM D.' //  Originally: YYYY. MMMM D.
      },
      {
        locale: 'cv',
        expectedMonthDayFormat: 'MMM [уйӑхӗн] D[-мӗшӗ]' //  Originally: YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]
      },
      {
        locale: 'ja',
        expectedMonthDayFormat: '年M月D日' //  Originally: YYYY年M月D日
      },
      {
        locale: 'lv',
        expectedMonthDayFormat: 'D. MMM' //  Originally: YYYY. [gada] D. MMMM
      }
    ];

    for (let i = 0; i < testCases.length; i++) {
      const locale = testCases[i].locale;
      const expectedMonthDayFormat = testCases[i].expectedMonthDayFormat;

      it('for ' + locale + ' locale.', () => {
        const date = moment('01/20/2018');
        const originalFormat = date.locale(locale).localeData().longDateFormat('ll');
        const newFormat = DateFormats.determineMonthDayFormat(originalFormat);
        expect(expectedMonthDayFormat).toEqual(newFormat);
      });
    }
  });
});
