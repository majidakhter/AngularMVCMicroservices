

import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DocumentRef } from '../document-ref/document-ref.service';

@Component({
  selector: 'wf-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})

export class TimeInputComponent {
  @Input() timeValue: Date = new Date();
  @Input() timeFormat = 'HH:mm';
  @Input() hourFormat = '24';
  @Output() timeChanged: EventEmitter<any> = new EventEmitter<Date>();
  @Input() isTimeInputDisabled: boolean;
  @Input() tradeTimeValue: Date;
  date: Date;
  constructor(
    private documentRef: DocumentRef
  ) { }

  timeBlurEvent(value: string): void {
    const momentTest = moment(value, this.timeFormat);
    let validDate = momentTest.toDate();
    const newDate = new Date();

    (this.tradeTimeValue) ?
      this.date = new Date(this.tradeTimeValue.getFullYear(), this.tradeTimeValue.getMonth(), this.tradeTimeValue.getDate(), this.tradeTimeValue.getHours(), this.tradeTimeValue.getMinutes()) :
      this.date = new Date(this.timeValue.getFullYear(), this.timeValue.getMonth(), this.timeValue.getDate(), newDate.getHours(), newDate.getMinutes());

      validDate = new Date(this.timeValue.getFullYear(), this.timeValue.getMonth(), this.timeValue.getDate(), validDate.getHours(), validDate.getMinutes());

    this.timeValue = momentTest.isValid() ? validDate : this.date;

    this.timeChangedEvent(this.timeValue);
  }

  timeChangedEvent(value: Date): void {
    this.timeChanged.emit(value);
  }

  timeFocusEvent(): void {
    //  We have to set the date/time nav buttons manually because PrimeNG uses FontAwesome icons with no built-in way to customize
    //  Setting the css content attribute will not work with our index-based WFM icons
    const documentRef = this.documentRef;
    setTimeout(() => {
      const upButtons = documentRef.getDocument().getElementsByClassName('fa-angle-up');
      if (upButtons) {
        _.forEach(upButtons, (upButton: any) => {
          upButton.classList.add('icon-ge');
          upButton.classList.add('icon-ge-chevron_up');
        });
      }

      const downButtons = documentRef.getDocument().getElementsByClassName('fa-angle-down');
      if (downButtons) {
        _.forEach(downButtons, (downButton: any) => {
          downButton.classList.add('icon-ge');
          downButton.classList.add('icon-ge-chevron_down');
        });
      }
    });
  }
}
