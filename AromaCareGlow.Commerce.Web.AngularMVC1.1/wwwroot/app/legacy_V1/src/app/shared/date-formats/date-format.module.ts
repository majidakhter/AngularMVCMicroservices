
import { NgModule } from '@angular/core';
import { DateFormatter } from './date-formatter';
import { DateFormatPipe } from './date-format.pipe';
import { DateFormats } from './date-formats';

@NgModule({
  providers: [DateFormatter, DateFormats],
  exports: [DateFormatPipe],
  declarations: [DateFormatPipe]
})
export class DateFormatModule { }
