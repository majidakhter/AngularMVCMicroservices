
import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { SelfScheduleAdd, IActivityStaffingPlanCoverages } from '../../../store/self-schedule/states/self-schedule-add.state';
import { Observable } from 'rxjs';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { SelfScheduleState } from '../../../store/self-schedule/states/self-schedule.state';
import * as moment from 'moment';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'needs-validation-modal',
  templateUrl: './needs-validation-modal.component.html',
  styleUrls: ['./needs-validation-modal.component.scss']
})
export class NeedsValidationModalComponent implements OnInit, OnChanges {

  @Output() close = new EventEmitter<boolean>();
  @Input() selectedDate;
  @Input() addShiftCoverage : IActivityStaffingPlanCoverage;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;
  @Select(SelfScheduleAdd.getActivityStaffingPlanCoverages) activityStaffingPlanCoverage$: Observable<IActivityStaffingPlanCoverage[]>;
  selectedPreferenceSetting: PreferenceSetting;
  range: any;
  profileName: string;
  constructor(public store: Store,
    public dateFormatter: DateFormatter,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.preferenceSetting$.subscribe((preferenceSetting: PreferenceSetting) => {
      if (preferenceSetting) {
        this.selectedPreferenceSetting = preferenceSetting;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.addShiftCoverage && changes.addShiftCoverage.currentValue) {
      const coverage = changes.addShiftCoverage.currentValue;
      this.profileName = coverage.profile.name;
      const start =  moment(coverage.activity.startTime, 'HH:mm').format();
      const end = moment(start).add(coverage.activity.hours, 'hours').add(coverage.activity.lunchHours, 'hours');
      this.range = this.translateService.instant('self-schedule-period.preference-period', {
        start: this.dateFormatter.to24HourTime(moment(start)),
        end: this.dateFormatter.to24HourTime(end)
      });
    }
  }

  closeApprovalModal() {
    this.close.emit();
  }

}
