

import * as moment from 'moment';
import { DateFormatPipe } from './date-format.pipe';
import { DateFormats } from './date-formats';

describe('DateFormatPipe', () => {
  const dateFormats = { URL_DATE: 'YYYY-MM-DD' };
  const mockDateFormatter = jasmine.createSpyObj('DateFormatter', ['format']);
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe(mockDateFormatter, dateFormats as DateFormats);
  });

  describe('transform()', () => {
    it('returns original value if it was null or undefined', () => {
      const result = pipe.transform(undefined, undefined);
      expect(result).toBeUndefined();
    });
    it('calls into the dateFormatter using the transformed format string from the DateFormats object', () => {
      const date = moment('01/20/2018');
      pipe.transform(date, 'URL_DATE');
      expect(mockDateFormatter.format).toHaveBeenCalledWith(date, dateFormats.URL_DATE);
    });
    it('calls into the dateFormatter using the specified format string passed to the method', () => {
      const date = moment('01/20/2018');
      pipe.transform(date, 'DATE_MONTH_DAY');
      expect(mockDateFormatter.format).toHaveBeenCalledWith(date, 'DATE_MONTH_DAY');
    });
  });
});
