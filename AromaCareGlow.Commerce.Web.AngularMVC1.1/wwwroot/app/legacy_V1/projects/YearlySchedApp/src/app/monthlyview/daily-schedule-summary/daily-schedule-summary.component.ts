
import { Component, Input } from '@angular/core';
import { Moment } from 'moment';

@Component({
  selector: 'wf-daily-schedule-summary',
  templateUrl: './daily-schedule-summary.component.html',
  styleUrls: ['./daily-schedule-summary.component.scss']
})

export class DailyScheduleSummaryComponent {

  @Input() selectedDayForSummary: Moment;
  @Input() openShiftCount: number;
  @Input() scheduledActivityCount: number;
  @Input() requestedActivityCount: number;
  @Input() payCodeCount: number;
  @Input() requestorTradeCount: number;
  @Input() acceptorTradeCount: number;

}
