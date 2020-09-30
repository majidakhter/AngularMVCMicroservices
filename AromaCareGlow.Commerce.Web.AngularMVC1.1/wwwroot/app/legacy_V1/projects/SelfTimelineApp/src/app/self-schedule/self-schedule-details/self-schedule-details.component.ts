

import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { SelfScheduleState } from '../../store/self-schedule/states/self-schedule.state';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { Employee } from 'src/app/time-management-domain/employee';
import { IActivity } from 'src/app/time-management-domain/activity';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import * as _ from 'lodash';
import { SelfScheduleAdd } from '../../store/self-schedule/states/self-schedule-add.state';
import { SetSelectedActivity, SetPreferenceSetting, SetDisplayShiftNeeds, SetPreferenceModal } from '../../store/self-schedule/actions/self-schedule.actions';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { TranslateService } from '@ngx-translate/core';
import { IProfile } from 'src/app/time-management-domain/profile';

@Component({
  selector: 'wf-self-schedule-details',
  templateUrl: './self-schedule-details.component.html',
  styleUrls: ['./self-schedule-details.component.scss']
})

@AutoUnsubscribe()
export class SelfScheduleDetailsComponent implements OnInit, OnDestroy {
  activityCount: number;
  selfScheduledActivityCount: number;
  paycodeCount: number;
  selectedDayForSummary: Moment;
  schedules: ISchedule[];
  department: string;
  facility: string;
  unit: string;
  startTime: string;
  endTime: string;
  activityStaffingPlanCoverage: IActivityStaffingPlanCoverage[];
  defaultShiftFlag = false;
  activity: IActivity;
  activityStaffingPlanCoverageArray: Array<IActivityStaffingPlanCoverage> = [];
  preferenceActivityIds: Array<number>;
  preferenceProfileId: string;
  preferenceOrganizationEntityId: string;
  profileCode: string;
  viewedSelfSchedulePeriods: Array<SelfSchedulePeriod>;
  qualifiedCoverage: IActivityStaffingPlanCoverage[];

  @Select(SelfScheduleState.getSelectedActivity) selectedActivity$: Observable<IActivity>;
  @Select(SelfScheduleAdd.getActivityStaffingPlanCoverages) activityStaffingPlanCoverage$: Observable<IActivityStaffingPlanCoverage[]>;
  @Select(SelfScheduleState.getSelectedDay) selectedDay$: Observable<IScheduleCalendarDay>;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;
  @Select(SelfScheduleState.getViewedSelfSchedulePeriods) viewedSelfSchedulePeriods$: Observable<Array<SelfSchedulePeriod>>;
  @Select(SelfScheduleState.getQualifiedCoverage) qualifiedCoverage$: Observable<Array<IActivityStaffingPlanCoverage>>;

  constructor(
    public dateFormatter: DateFormatter,
    public store: Store,
    private employeeSdkService: EmployeeSdkService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.selectedDay$.subscribe((day: IScheduleCalendarDay) => {
      if (day) {
        this.schedules = day.events;
        this.selectedDayForSummary = day.date;
        this.activityCount = day.events.filter(schedule => schedule.activity !== undefined && schedule.source !== 'SelfScheduled').length;
        this.selfScheduledActivityCount = day.events.filter(schedule => schedule.activity !== undefined && schedule.source === 'SelfScheduled').length;
        this.paycodeCount = day.events.filter(schedule => schedule.payCode !== null && schedule.activity === undefined).length;
      }
    });

    this.preferenceSetting$.subscribe((preferenceSetting: PreferenceSetting) => {
      if (preferenceSetting) {
        this.preferenceActivityIds = preferenceSetting.profiles[0].activities.map(activity => activity['id']).map(Number);
        this.preferenceProfileId = String(preferenceSetting.profiles[0].id);
        this.getPreferredShift();
      }
    });

    this.qualifiedCoverage$.subscribe(qualifiedCoverage => {
      if (qualifiedCoverage) {
        this.qualifiedCoverage = qualifiedCoverage;
        this.getPreferredShift();
      }
    });
  }

  getPreferredShift() {
    if (this.qualifiedCoverage) {
      this.activityStaffingPlanCoverageArray = this.qualifiedCoverage.filter(r => {
        return r.profile.id.toString() === this.preferenceProfileId;
      });
      this.activityStaffingPlanCoverageArray = this.activityStaffingPlanCoverageArray.filter(r => this.preferenceActivityIds.indexOf(parseInt(r.activity.id, 10)) >= 0);
      this.activityStaffingPlanCoverageArray = this.activityStaffingPlanCoverageArray.sort(this.sortActivities);
      if (this.qualifiedCoverage.length > 0 && this.activityStaffingPlanCoverageArray.length) {
        this.activity = this.activityStaffingPlanCoverageArray[0].activity;
        this.profileCode = this.activityStaffingPlanCoverageArray[0].profile.code;
        this.formatScheduleTime(this.activityStaffingPlanCoverageArray[0].activity);
      }
    }
  }

  sortActivities(activity1, activity2) {
    const diff = moment(activity1['activity']['startTime'], 'HH:mm:ss').unix() - moment(activity2['activity']['startTime'], 'HH:mm:ss').unix();
    if (diff === 0) {
      return (activity1['activity']['code'].toUpperCase() < activity2['activity']['code'].toUpperCase() ? -1 :
      (activity1['activity']['code'].toUpperCase() > activity2['activity']['code'].toUpperCase() ? 1 : 0));
    }
    return diff;
  }

  formatScheduleTime(activity?: IActivity): void {
    this.activity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
    activity = activity ? activity : this.activity;
    const start = moment(activity.startTime, 'HH:mm').format();
    this.startTime = this.dateFormatter.to24HourTime(moment(start));
    const end = moment(start).add(activity.hours, 'hours').add(activity.lunchHours, 'hours');
    this.endTime = this.dateFormatter.to24HourTime(end);
  }

  /* istanbul ignore next */
  ngOnDestroy(): void { }
}
