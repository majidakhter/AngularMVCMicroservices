

import { Component, Input, EventEmitter, Output, OnInit, forwardRef, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateInputService } from './date-input.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Calendar } from 'primeng/components/calendar/calendar';
import { DateFormatter } from '../date-formats/date-formatter';
@Component({
  selector: 'wf-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /*istanbul ignore if*/
      useExisting: forwardRef(/*istanbul ignore next*/() => /*istanbul ignore next*/DateInputComponent),
      multi: true
    }
  ]
})

export class DateInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  constructor(
    private dateInputService: DateInputService,
    private translateService: TranslateService,
    private dateFormatter: DateFormatter
  ) { }
  @Input() dateFormat: string;
  @Input() dateValue: Date = new Date();
  @Input() multiDateSelect: boolean;
  @Input() minDateValue: Date = new Date(0);
  @Input() maxDateValue: Date;
  @Output() dateChanged: EventEmitter<any> = new EventEmitter<Date>();
  dateFormatDisplay: string;

  public selectedSingleDate: Date;
  public selectedDateList: Date[];

  viewDates: string;
  private prevSelectedDateList: Date[];
  @ViewChild('calendar') calendar: Calendar;
  private propagateChange: Function = () => { };
  onModelTouched: Function = () => { };

  ngOnInit(): void {
    //  The formats need to be in the following format:
    //  Ours: MM/dd/yyyy
    //  PrimeNG: mm/dd/yy
    //  Moment: MM/DD/YYYY
    if (!this.dateFormat) {
      this.dateFormat = moment.localeData().longDateFormat('L');
    }

    if (this.multiDateSelect) {
      this.selectedDateList = [this.dateValue];
      this.prevSelectedDateList = [this.dateValue];
      this.dateFormatDisplay = 'M dd, yy';
    } else {
      this.dateFormatDisplay = this.dateFormat.toLowerCase().replace('yyyy', 'yy');
      this.selectedSingleDate = this.dateValue;
    }
  }

  ngAfterViewInit(): void {
    //  Sets the icons if the component is displayed always
    this.dateInputService.setNavigationIcons();
  }

  onDateChanged(): void {
    if (this.multiDateSelect) {
      this.displayMultipleDates();
    }
    this.dateChanged.emit(this.multiDateSelect ? this.selectedDateList : this.selectedSingleDate);
  }

  displayMultipleDates() {
    const groupDatesByMonth: { [month: string]: Date[] } = _.groupBy(
      _.sortBy(this.selectedDateList, e => e),
      (date: Date) => this.dateFormatter.toShortMonth(moment(date)));
    const selectedDaysByMonth: string[] = _.map(
      groupDatesByMonth,
      (days: Date[], month: string) => {
        const selectedDay = _.map(days, (day: Date) => this.dateFormatter.toDayOfMonth(moment(day)));
        return month += ' ' + selectedDay;
      });
    this.viewDates = this.translateService.instant('quick-view-schedule.selected', {
      selectedDays: selectedDaysByMonth.join(', ')
    });
  }

  done() {
    this.calendar.overlayVisible = false;
  }

  cancel() {
    if (this.multiDateSelect) {
      this.selectedDateList = this.prevSelectedDateList;
    }
    this.calendar.overlayVisible = false;
  }

  onInputBlur = () => {
    this.onModelTouched();
    this.onDateChanged();
  }

  onInputFocus(): void {
    // Sets the icons if the component is displayed on focus of an input
    this.dateInputService.setNavigationIcons();
  }

  // ng forms methods:
  writeValue(value: Date): void {
    this.propagateChange(value);
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }
}
