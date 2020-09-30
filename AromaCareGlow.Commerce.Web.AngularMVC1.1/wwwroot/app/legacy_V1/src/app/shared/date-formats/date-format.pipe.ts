
import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import { DateFormatter } from './date-formatter';
import { DateFormats } from './date-formats';
import * as moment from 'moment';

@Pipe({
  name: 'dateformat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(
    private dateFormatter: DateFormatter,
    private dateFormats: DateFormats
  ) { }

  transform<K extends keyof DateFormats>(value: Moment, format?: K): any {
    if (!value) {
      return value;
    }

    const customFormat = this.dateFormats[format];
    return this.dateFormatter.format(moment(value), customFormat ? customFormat.toString() : format);
  }
}
