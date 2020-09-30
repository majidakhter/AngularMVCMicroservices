
import { Component, Input, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { TransactionRequestSdkService } from 'src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.service';
import { RetractSelfScheduleMessageService } from 'src/app/time-management-sdk/transaction-request-sdk/retract-self-schedule-message.service';
import { MapEventFn, EventDisplayType } from '@api-wfm/ng-sympl-ux';
import { EventDetailsSetup } from '../event-details-setup.service';

@Component({
  selector: 'wf-quick-view-schedule',
  templateUrl: './quick-view-schedule.component.html',
  styleUrls: ['./quick-view-schedule.component.scss']
})

@AutoUnsubscribe()
export class QuickViewScheduleComponent implements OnDestroy {
  @Input() event: ISchedule;
  public mapEvent: MapEventFn<ISchedule>;
  public extendedDisplay: EventDisplayType = EventDisplayType.Extended;
  isClicked = false;

  constructor(
    private transactionRequestSdkService: TransactionRequestSdkService,
    public retractSelfScheduleMessageService: RetractSelfScheduleMessageService,
    private eventDetailsSetup: EventDetailsSetup
  ) {
    this.mapEvent = this.eventDetailsSetup.mapEvent;
  }

  retractSelfSchedule() {
    this.transactionRequestSdkService.retractTransactionRequest(this.event.guid, 'SelfScheduled').subscribe((result) => {
      this.retractSelfScheduleMessageService.sendMessage('true');
    });
  }

  /* istanbul ignore next */
  ngOnDestroy() {
  }
}
