import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

export interface changeActivityDetails {
  changeActivityDetailHeaderDate?: string;
  changeActivityDetailHeaderTitle?: string;
  changeActivityDetailShiftTitle?: string;
  changeActivityDetailShifts: any;
  changeActivityDetailButton?: string;
}

@Component({
  selector: 'wf-self-schedule-activity-changes',
  templateUrl: './self-schedule-activity-changes.component.html',
  styleUrls: ['./self-schedule-activity-changes.component.scss']
})
export class SelfScheduleActivityChangesComponent {

  @Input() changeActivityDetails: changeActivityDetails;
  @Output() changeShiftDetails = new EventEmitter<string>();
  @Output() retractSelfSchedule = new EventEmitter<string>();

  constructor() {
  }

  changeShift(activity) {
    this.changeShiftDetails.emit(activity);
  }

  retractSelfScheduleActivity() {
    this.retractSelfSchedule.emit();
  }
}
