

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelfScheduleState, IPreferenceModal } from '../../store/self-schedule/states/self-schedule.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Employee } from 'src/app/time-management-domain/employee';
import { GroupSelfScheduledPeriodMode, SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { IProfile } from 'src/app/time-management-domain/profile';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { IActivityStaffingPlanCoverage, ICoverage } from 'src/app/time-management-domain/coverage';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { PreferenceSetting, SelfSchedulePeriod, SelfSchedulePreferenceActivity, SelfSchedulePreferenceProfile } from 'src/app/time-management-domain/preference-setting';
import { SetActivityStaffingPlanCoverages, SetPreferenceModal, SetPreferenceSetting, SetPreferredShifts, SetSelectedActivity, SetQualifiedCoverage } from '../../store/self-schedule/actions/self-schedule.actions';
import { Activity, IActivity } from 'src/app/time-management-domain/activity';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as _ from 'lodash';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'wf-self-schedule-preference',
  templateUrl: './self-schedule-preference.component.html',
  styleUrls: ['./self-schedule-preference.component.scss']
})

@AutoUnsubscribe()
export class SelfSchedulePreferenceComponent implements OnInit, OnDestroy {
  @Select(SelfScheduleState.getSchedulePeriods) schedulePeriods$: Observable<Array<SchedulePeriod>>;
  @Select(SelfScheduleState.getEmployee) loggedInEmployee$: Observable<Employee>;
  @Select(SelfScheduleState.getSelfSchedulePeriod) schedulePeriod$: Observable<SchedulePeriod>;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;
  @Select(SelfScheduleState.getViewedSelfSchedulePeriods) viewedSelfSchedulePeriods$: Observable<Array<SelfSchedulePeriod>>;
  @Select(SelfScheduleState.getQualifiedCoverage) qualifiedCoverage$: Observable<Array<IActivityStaffingPlanCoverage>>;
  @Select(SelfScheduleState.getPreferenceModal) preferenceModal$: Observable<Boolean>;

  qualifiedCoverage: IActivityStaffingPlanCoverage[];
  qualifiedProfiles: IProfile[];
  organizationUnitName: string;
  range: string;
  startDate: Moment;
  endDate: Moment;
  organizationUnitId: string;
  employeeCode: string;
  profiles: IProfile[];
  schedulePeriod: SchedulePeriod;
  coverage: ICoverage;
  activityList: Array<IActivity> = [];
  isActivityMatched = false;
  activity: IActivity;
  preferredShifts = [];
  profileId: number;
  isApplyButtonDisabled = true;
  isCancelButtonDisabled = false;
  profileCode: string;
  employeeProfileSubscription: Subscription;
  activityStaffingCoverageSubscription: Subscription;
  previouslySelectedPreference: PreferenceSetting;
  activityCode: string;
  activityDetails: IActivity[];
  profilesNotFound = false;
  viewedSelfSchedulePeriods: Array<SelfSchedulePeriod>;
  isSchedulePeriodChanged = false;

  constructor(
    public employeeOrganizationSdkService: EmployeeOrganizationSdkService,
    public store: Store,
    private organizationSdkService: OrganizationSdkService,
    private translateService: TranslateService,
    private dateFormater: DateFormatter,
    private employeeSdkService: EmployeeSdkService
  ) { }

  ngOnInit() {
    this.employeeCode = this.store.selectSnapshot<string>(AuthState.getEmployeeCode);
    this.loggedInEmployee$.subscribe((loggedInEmployee: Employee) => {
      if (loggedInEmployee) {
        const organizationUnit = loggedInEmployee.employment.location.unit || loggedInEmployee.employment.location.department || loggedInEmployee.employment.location.facility;
        this.organizationUnitId = organizationUnit.id;
        this.organizationUnitName = this.translateService.instant('self-schedule-preference.facility', {
          department: organizationUnit.name,
          facility: loggedInEmployee.employment.location.facility.code
        });
      }
    });

    this.qualifiedCoverage$.subscribe(coverage => {
      this.qualifiedCoverage = coverage;
      if (this.qualifiedCoverage) {
        this.qualifiedProfiles = this.store.selectSnapshot<Array<IProfile>>(SelfScheduleState.getQualifiedProfiles);
        this.schedulePeriod = this.store.selectSnapshot<SchedulePeriod>(SelfScheduleState.getSelfSchedulePeriod);
        this.previouslySelectedPreference = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
        if (this.qualifiedProfiles && this.schedulePeriod) {
          this.startDate = this.schedulePeriod.start;
          this.endDate = this.schedulePeriod.end;
          this.getProfiles();
          const isPreferenceMatched = this.isPreferenceMatched();
          this.isCancelButtonDisabled = false;
          if (this.qualifiedCoverage.length && this.qualifiedProfiles.length && !isPreferenceMatched) {
            this.isApplyButtonDisabled = false;
            this.isCancelButtonDisabled = true;
            this.isSchedulePeriodChanged = true;
          }
        }
      }
    });

    this.viewedSelfSchedulePeriods$.subscribe((selfSchedulePeriods: Array<SelfSchedulePeriod>) => {
      if (selfSchedulePeriods) {
        this.viewedSelfSchedulePeriods = selfSchedulePeriods;
      }
    });
  }

  isPreferenceMatched(): boolean {
    const preferences = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
    if (preferences) {
      const filteredCoverage = this.qualifiedCoverage.filter(c => c.profile.id.toString() === preferences.profiles[0].id.toString() &&
      preferences.profiles[0].activities.some(activity => activity.id.toString() === c.activity.id.toString()));
      return Math.abs(filteredCoverage.length - preferences.profiles[0].activities.length) > 0 ? false : true;
    } else {
      return false;
    }
  }

  getSchedulePeriodDuration() {
    if (this.startDate && this.endDate) {
      return this.translateService.instant('self-schedule-preference.schedule-period', {
        start: this.dateFormater.toMonthDay(this.startDate),
        end: this.dateFormater.toMonthDay(this.endDate)
      });
    }
  }

  getProfiles(): void {
      if (this.qualifiedProfiles && this.qualifiedProfiles.length > 0) {
        this.profilesNotFound = false;
        this.profiles = this.qualifiedProfiles; // To get the profiles
        if (this.previouslySelectedPreference) {
          this.isCancelButtonDisabled = false;
            this.profileId = this.previouslySelectedPreference.profiles[0].id;
            const profile = _.filter(this.profiles, (c) => {
              return c.id.toString() === this.profileId.toString();
            });

          if (profile && profile.length > 0) {
            this.profileCode = profile[0].code;
            this.filterByProfileCode(this.profileCode);
          } else {
            this.profileCode = this.profiles[0].code;
            this.profileId = parseInt(this.profiles[0].id, 10);
            this.filterByProfileCode(this.profileCode);
            this.store.dispatch(new SetPreferenceModal(true));
          }
        } else {
          this.isCancelButtonDisabled = true;
          this.profileCode = this.profiles[0].code;
          this.profileId = parseInt(this.profiles[0].id, 10);
          this.filterByProfileCode(this.profileCode);
        }
      } else {
        this.profilesNotFound = true;
        this.profileId = null;
        this.profileCode = null;
        this.profiles = null;
        this.activity = null;
        this.activityList = null;
        this.store.dispatch(new SetPreferenceModal(true));
      }
  }

  getActivities(profileId: number) {
    this.isApplyButtonDisabled = true;
    const profileCoverage = this.qualifiedCoverage.filter(coverage => coverage.profile.id.toString() === profileId.toString());
    const activities = profileCoverage.map(c => c.activity);
    this.activityList = activities.sort(this.sortActivities);
    this.profileId = profileId;
    const activityIds = this.activityList.map(activity => activity.id);
    let previousSelection;
    if (this.previouslySelectedPreference && this.previouslySelectedPreference.profiles[0].id === profileId) {
      previousSelection = this.previouslySelectedPreference.profiles[0].activities.map(activity => activity.id.toString());
    }
    if (this.isSchedulePeriodChanged && previousSelection) {
      if (activityIds.find(id => previousSelection.indexOf(id.toString()) >= 0)) {
        this.preferredShifts = this.previouslySelectedPreference.profiles[0].activities.map(activity => activity.id.toString());
      } else {
        this.preferredShifts = [];
        this.preferredShifts.push(this.activityList[0].id.toString());
      }
      this.isApplyButtonDisabled = false;
    } else {
      this.preferredShifts = (this.previouslySelectedPreference && this.previouslySelectedPreference.profiles[0].id === profileId) ? this.previouslySelectedPreference.profiles[0].activities.map(activity => activity.id.toString()) : [];
    }
  }

  filterByProfileCode(profileCode: string) {
    this.isApplyButtonDisabled = true;
    this.activityCode = null;
    this.activity = null;
    this.preferredShifts = [];
    this.activityList = this.qualifiedCoverage.filter(c => {
      return c.profile.code === profileCode;
    }).map(coverage => coverage.activity);
    this.activityList = this.activityList.sort(this.sortActivities);
    this.isActivityMatched = this.activityList.length === 0 ? true : false;
    if (this.previouslySelectedPreference) {
      const activityDetails = _.filter(this.activityList, (r) => this.previouslySelectedPreference.profiles[0].activities
        .map(activity => activity['id']).toString().indexOf(r.id.toString()) >= 0);
      const qualifiedProfileCoverage = this.qualifiedCoverage.filter(c => {
        return c.profile.code === profileCode && (activityDetails.length > 0 && activityDetails[0].id === c.activity.id);
      });
      const prevProfile = this.previouslySelectedPreference.profiles[0].id.toString();
      if ((activityDetails.length > 0) && (qualifiedProfileCoverage[0].profile.id.toString() === prevProfile)) {
        this.activityCode = activityDetails[0].code;
        this.activity = (activityDetails[0]) as IActivity;
        this.preferredShifts = activityDetails.map(shift => shift.id.toString());
      } else if (this.activityList.length > 0) {
        this.activityCode = this.activityList[0].code;
        this.activity = (this.activityList[0]) as IActivity;
        this.isApplyButtonDisabled = false;
        this.store.dispatch(new SetPreferenceModal(true));
        this.preferredShifts.push(this.activityList[0].id.toString());
        this.isCancelButtonDisabled = true;
      }
    } else if (this.activityList.length > 0) {
      this.activityCode = this.activityList[0].code;
      this.activity = (this.activityList[0]) as IActivity;
      this.preferredShifts.push(this.activityList[0].id.toString());
      this.isApplyButtonDisabled = false;
    }
  }

  sortActivities(activity1, activity2) {
    const diff = moment(activity1['startTime'], 'HH:mm:ss').unix() - moment(activity2['startTime'], 'HH:mm:ss').unix();
    if (diff === 0) {
      return (activity1['code'].toUpperCase() < activity2['code'].toUpperCase() ? -1 :
      (activity1['code'].toUpperCase() > activity2['code'].toUpperCase() ? 1 : 0));
    }
    return diff;
  }

  getTimeRange(item: any) {
    const startTime = moment(item.startTime, 'HH:mm').format('HH:mm');
    const endTime = moment(startTime, 'HH:mm').add(item.hours, 'hours').add(item.lunchHours, 'hours').format('HH:mm');
    return `${startTime} - ${endTime} (${item.hours} hrs)`;
  }

  closeApprovalModal() {
    this.resetPreferenceSetting();
    this.store.dispatch(new SetPreferenceModal(false));
  }

  getApplyButtonStatus() {
    this.isApplyButtonDisabled = (this.preferredShifts.length > 0) ? false : true;
  }

  savePreferenceSetting() {
    this.activityList = this.activityList.sort(this.sortActivities);
    const preferredShifts = this.activityList.filter(activity => this.preferredShifts.indexOf(activity.id.toString()) >= 0).map(shift => shift);
    const selectedRecentOrgGroup = new PreferenceSetting();
    selectedRecentOrgGroup.organizationEntityId = this.organizationUnitId;
    const profiles = [];
    const activities = [];
    preferredShifts.forEach(activity => activities.push(new SelfSchedulePreferenceActivity(parseInt(activity.id, 10))));
    profiles.push(new SelfSchedulePreferenceProfile(this.profileId, activities));
    selectedRecentOrgGroup.profiles = profiles;
    selectedRecentOrgGroup.viewedSelfSchedulePeriods = this.viewedSelfSchedulePeriods.length > 0 ? this.viewedSelfSchedulePeriods : new Array<SelfSchedulePeriod>();
    this.employeeSdkService.updatePreferenceSetting(this.employeeCode, selectedRecentOrgGroup);
    this.store.dispatch(new SetPreferenceSetting(selectedRecentOrgGroup)); // To store the selectedRecentOrgGroup information
    this.store.dispatch(new SetSelectedActivity(preferredShifts[0]));
    this.closeApprovalModal();
  }

  private resetPreferenceSetting() {
    if (this.previouslySelectedPreference) {
      this.profileId = this.previouslySelectedPreference.profiles[0].id;
      const profile = _.filter(this.profiles, (c) => {
        return c.id.toString() === this.profileId.toString();
      });

      if (profile && profile.length > 0) {
        this.profileCode = profile[0].code;
      }
      this.filterByProfileCode(this.profileCode);
    }
  }

  /* istanbul ignore next */
  ngOnDestroy(): void { }
}
