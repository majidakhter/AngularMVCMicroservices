

import { OnInit, Component, HostListener } from '@angular/core';
import { IActivity } from 'src/app/time-management-domain/activity';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SelfScheduleState } from '../../../store/self-schedule/states/self-schedule.state';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { SelfScheduleAdd } from '../../../store/self-schedule/states/self-schedule-add.state';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { Employee } from 'src/app/time-management-domain/employee';
import { TranslateService } from '@ngx-translate/core';
import { SetPreferenceModal, SetDisplayShiftNeeds, SetSelectedActivity } from '../../../store/self-schedule/actions/self-schedule.actions';

@Component({
  selector: 'wf-self-schedule-header',
  templateUrl: './self-schedule-header.component.html',
  styleUrls: ['./self-schedule-header.component.scss']
})
export class SelfScheduleHeaderComponent implements OnInit {

  activity: IActivity;
  startTime: string;
  endTime: string;
  activityStaffingPlanCoverageArray: Array<IActivityStaffingPlanCoverage> = [];
  preferenceActivityIds: Array<number>;
  preferenceProfileId: string;
  profileCode: string;
  department: string;
  facility: string;
  unit: string;
  defaultShiftFlag = false;
  allAvailableShifts: string;

  @Select(SelfScheduleState.getSelectedActivity) selectedActivity$: Observable<IActivity>;
  @Select(SelfScheduleAdd.getActivityStaffingPlanCoverages) activityStaffingPlanCoverage$: Observable<IActivityStaffingPlanCoverage[]>;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;

  constructor(
    public dateFormatter: DateFormatter,
    public store: Store,
    private translateService: TranslateService
  ) { }

  @HostListener('document:click', ['$event']) onDocumentClick() {
    this.defaultShiftFlag = false;
  }


  ngOnInit() {
    this.allAvailableShifts = '0';

    const loggedInEmployee = this.store.selectSnapshot<Employee>(SelfScheduleState.getEmployee);
    if (loggedInEmployee) {
      this.department = loggedInEmployee.employment.location.department.code;
      this.facility = loggedInEmployee.employment.location.facility.code;
      if (loggedInEmployee.employment.location.unit) {
        this.unit = loggedInEmployee.employment.location.unit.code;
      }
    }

    this.selectedActivity$.subscribe((selectedActivity: IActivity) => {
      if (selectedActivity) {
        this.activity = selectedActivity;
        this.formatScheduleTime(selectedActivity);
      }
    });

    this.preferenceSetting$.subscribe((preferenceSetting: PreferenceSetting) => {
      if (preferenceSetting) {
        this.preferenceActivityIds = preferenceSetting.profiles[0].activities.map(activity => activity['id']).map(Number);
        this.preferenceProfileId = String(preferenceSetting.profiles[0].id);
        this.allAvailableShifts = '0';
      }
    });

    this.activityStaffingPlanCoverage$.subscribe((res) => {
      if (res && this.preferenceActivityIds) {
        this.activityStaffingPlanCoverageArray = res.filter(r => {
          return r.profile.id.toString() === this.preferenceProfileId;
        });
        this.activityStaffingPlanCoverageArray = this.activityStaffingPlanCoverageArray.filter(r => this.preferenceActivityIds.indexOf(parseInt(r.activity.id, 10)) >= 0);
        this.activityStaffingPlanCoverageArray = this.activityStaffingPlanCoverageArray.sort(this.sortActivities);
        if (res.length > 0 && this.activityStaffingPlanCoverageArray.length) {
          this.activity = this.activityStaffingPlanCoverageArray[0].activity;
          this.profileCode = this.activityStaffingPlanCoverageArray[0].profile.code;
          this.formatScheduleTime(this.activityStaffingPlanCoverageArray[0].activity);
        }
      }
    });
  }

  formatScheduleTime(activity?: IActivity): void {
    this.activity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
    activity = activity ? activity : this.activity;
    const start = moment(activity.startTime, 'HH:mm').format();
    this.startTime = this.dateFormatter.to24HourTime(moment(start));
    const end = moment(start).add(activity.hours, 'hours').add(activity.lunchHours, 'hours');
    this.endTime = this.dateFormatter.to24HourTime(end);
  }

  sortActivities(activity1, activity2) {
    const diff = moment(activity1['activity']['startTime'], 'HH:mm:ss').unix() - moment(activity2['activity']['startTime'], 'HH:mm:ss').unix();
    if (diff === 0) {
      return (activity1['activity']['code'].toUpperCase() < activity2['activity']['code'].toUpperCase() ? -1 :
        (activity1['activity']['code'].toUpperCase() > activity2['activity']['code'].toUpperCase() ? 1 : 0));
    }
    return diff;
  }

  getScheduleDisplayTime(activity?: IActivity): string {
    this.formatScheduleTime(activity);
    return this.translateService.instant('self-schedule-details.default-shift', {
      start: this.startTime,
      end: this.endTime,
      hours: activity ? activity.hours : this.activity.hours
    });
  }

  editPreference() {
    this.store.dispatch(new SetPreferenceModal(true));
  }

  toggleDropdown(event?): void {
    this.defaultShiftFlag = !this.defaultShiftFlag;
    if (event) {
      event.stopPropagation();
    }
  }

  onSelectShift(activity: IActivity): void {
    this.activity = activity;
    this.allAvailableShifts = '0';
    this.store.dispatch(new SetDisplayShiftNeeds(parseInt(this.allAvailableShifts, 10)));
    this.store.dispatch(new SetSelectedActivity(activity));
    this.toggleDropdown();
  }

  onSelectionChange(allAvailableShifts) {
    const val = parseInt(allAvailableShifts, 10);
    this.store.dispatch(new SetDisplayShiftNeeds(val));
  }
}
