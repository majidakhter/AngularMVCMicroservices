
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { Employee } from 'src/app/time-management-domain/employee';
import { SetEmployee, SetPreferenceSetting, SetSchedulePeriods, SetSelectedActivity, SetSelfSchedulePeriod, SetViewedSelfSchedulePeriods, SetPreferenceModal, SetQualifiedProfiles, SetQualifiedCoverage } from '../store/self-schedule/actions/self-schedule.actions';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { ModalComponent } from '@wfm/modal';
import { SelfScheduleState } from '../store/self-schedule/states/self-schedule.state';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { GroupSelfScheduledPeriodMode, SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import * as _ from 'lodash';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { SelfSchedulePeriodDetailsResponse } from 'src/app/time-management-sdk/employee-schedule-sdk/self-schedule-period-details-response';
import { SignalrService } from 'src/app/time-management-sdk/signalr/signalr.service';
import { SignalrConfig } from 'src/app/time-management-sdk/signalr/signalr.config';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { ICoverage, IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { IActivity } from 'src/app/time-management-domain/activity';
import { IProfile } from 'src/app/time-management-domain/profile';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';

export enum SelfScheduledPeriodMode {
  Start = 0,
  Exist = 1,
  NotExist = 2,
  Setup = 3
}

@Component({
  selector: 'wf-self-schedule',
  templateUrl: './self-schedule.component.html',
  styleUrls: ['./self-schedule.component.scss']
})

@AutoUnsubscribe()
export class SelfScheduleComponent implements OnInit, OnDestroy {
  selfScheduledPeriodMode = SelfScheduledPeriodMode;
  checkSchedulePeriod: number = SelfScheduledPeriodMode.Start;
  employee: Employee;
  employeeCode: string;
  organizationUnitId: string;
  organizationUnitName: string;
  monthsCount = 18;
  schedulePeriod: SchedulePeriod;
  isPreferenceAvailable = false;
  isAccessPeriodStartInFuture = false;
  employeeSubscription: Subscription;
  schedulePeriodSubscription: Subscription;
  selfSchedulePreferenceSubcription: Subscription;
  selfScheduleOpens: string;
  groupSelfScheduleStatus: number;
  groupSelfScheduledPeriodMode = GroupSelfScheduledPeriodMode;
  selfSchedulePeriodDetails: SelfSchedulePeriodDetailsResponse;
  selfSchedulePeriods: SchedulePeriod[];
  isSelectedSelfScheduleExits = true;
  SelfSchedulePeriodDetails;

  @ViewChild(ModalComponent) modal: ModalComponent;
  @Select(SelfScheduleState.getSelfSchedulePeriod) schedulePeriod$: Observable<SchedulePeriod>;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;
  @Select(SelfScheduleState.getPreferenceModal) preferenceModal$: Observable<boolean>;

  constructor(
    private employeeSdkService: EmployeeSdkService,
    private store: Store,
    private employeeScheduleSdkService: EmployeeScheduleSdkService,
    private dateFormatter: DateFormatter,
    private translateService: TranslateService,
    private signalrService: SignalrService,
    private signalrConfig: SignalrConfig,
    private organizationSdkService: OrganizationSdkService,
    private employeeOrganizationSdkService: EmployeeOrganizationSdkService
  ) { }

  ngOnInit() {
    this.connectToSignalR();
    const start = moment().startOf('day');
    const end = moment().add(this.monthsCount, 'months').endOf('day');
    this.employeeCode = this.store.selectSnapshot<string>(AuthState.getEmployeeCode);
    this.employeeSubscription = this.employeeSdkService.getEmployee(this.employeeCode).subscribe(res => {
      this.setEmployeeOrganizationDetails(res); // To store the Employee information
      this.schedulePeriodSubscription = this.employeeScheduleSdkService.getSchedulePeriods(this.organizationUnitId, start, end).subscribe((schedulePeriods) => {
        this.store.dispatch(new SetSchedulePeriods(schedulePeriods)); // To store the SchedulePeriods information
        this.checkSchedulePeriod = SelfScheduledPeriodMode.NotExist;
        this.checkSchedulePeriodStatus(schedulePeriods);
      });
    });

    this.preferenceSetting$.subscribe((preferenceSetting: PreferenceSetting) => {
      if (preferenceSetting) {
        this.isPreferenceAvailable = true;
      }
    });

    this.preferenceModal$.subscribe((preferencePopUp: boolean) => {
      if (preferencePopUp) {
        this.modal.open();
      } else {
        this.modal.close();
      }
    });
  }

  getQualifiedProfilesAndCoverage(){
    const selfSchedulePeriods = this.selfSchedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling'); 
    this.schedulePeriod = selfSchedulePeriods.find(item => item.selfScheduleStatus === GroupSelfScheduledPeriodMode.Exist);
    const activityStaffingCoverage = this.organizationSdkService.getActivityStaffingCoverage(this.organizationUnitId,
      this.schedulePeriod.start, this.schedulePeriod.end, null, 'SelfSchedule'); // To get the Activity Staffing Coverage
    const qualifiedProfiles = this.employeeOrganizationSdkService.getSelfScheduleEmployeeProfiles(this.employeeCode, this.organizationUnitId, this.schedulePeriod.start, this.schedulePeriod.end);
    const join = forkJoin([activityStaffingCoverage, qualifiedProfiles]);
    return join;
  }

  checkSchedule(CurrentMode: number) {
    this.checkSchedulePeriod = CurrentMode;
    if (this.checkSchedulePeriod === SelfScheduledPeriodMode.Exist) {
      this.selfSchedulePreferenceSubcription = this.employeeSdkService.getSelfSchedulePreference(this.employeeCode).subscribe((res: PreferenceSetting) => {
        const selectedPreferenceSetting = new PreferenceSetting();
        selectedPreferenceSetting.organizationEntityId = res.organizationEntityId;
        selectedPreferenceSetting.profiles = res.profiles;
        selectedPreferenceSetting.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
        res.viewedSelfSchedulePeriods.forEach((x) => {
          selectedPreferenceSetting.viewedSelfSchedulePeriods.push(new SelfSchedulePeriod(x.startDate, x.endDate));
        });
        this.store.dispatch(new SetViewedSelfSchedulePeriods(selectedPreferenceSetting.viewedSelfSchedulePeriods));
        if (selectedPreferenceSetting.profiles.length) {
          this.store.dispatch(new SetPreferenceSetting(selectedPreferenceSetting)); // To store the selectedRecentOrgGroup information
          this.isPreferenceAvailable = true;
        }
        if (!this.isPreferenceAvailable && this.selfSchedulePeriods.some(item => item.selfScheduleStatus === GroupSelfScheduledPeriodMode.Exist)) {
          let join = this.getQualifiedProfilesAndCoverage();
          join.subscribe(result => {
            const qualifiedProfiles = result[1];
            const coverage = result[0];
            const qualifiedCoverage = coverage.activityStaffingPlanCoverages.filter(c => qualifiedProfiles.some(profile => profile.id === c.profile.id));
            this.store.dispatch(new SetSelfSchedulePeriod(this.schedulePeriod));
            this.store.dispatch(new SetQualifiedProfiles(qualifiedProfiles));
            this.store.dispatch(new SetQualifiedCoverage(qualifiedCoverage));
            this.modal.open();
          });
        } else {
          this.isPreferenceAvailable = true;
        }
      });
    }
  }

  IsSelectedSelfScheduleExits(event) {
    this.isSelectedSelfScheduleExits = event;
  }

  private setEmployeeOrganizationDetails(res: Employee) {
    const organizationUnit = res.employment.location.unit || res.employment.location.department || res.employment.location.facility;
    this.organizationUnitId = organizationUnit.id;
    this.store.dispatch(new SetEmployee(res)); // To store the Employee information
  }

  private checkSchedulePeriodStatus(schedulePeriods: SchedulePeriod[]) {
    if (schedulePeriods) {
      this.selfSchedulePeriods = schedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling');
      if (this.selfSchedulePeriods.length > 0) {
        const schedulePeriodDetailCalls = [];
        _.map(this.selfSchedulePeriods, (selfSchedulePeriod) => {
          schedulePeriodDetailCalls.push(this.employeeScheduleSdkService.getSelfSchedulePeriodDetails(this.employeeCode, this.organizationUnitId, selfSchedulePeriod.start));
        });
        forkJoin(schedulePeriodDetailCalls).subscribe((selfSchedulePeriodDetails: SelfSchedulePeriodDetailsResponse[]) => {
          _.map(selfSchedulePeriodDetails, (selfSchedulePeriodDetail, index) => {
            this.selfSchedulePeriods[index].statusMessage = this.getSelfScheduleStatusMessage(this.selfSchedulePeriods[index], selfSchedulePeriodDetail);
            this.selfSchedulePeriods[index].selfScheduleStatus = this.getSelfScheduleStatus(this.selfSchedulePeriods[index], selfSchedulePeriodDetail);
          });
          if (this.selfSchedulePeriods.every(selfSchedulePeriod => (selfSchedulePeriod.selfScheduleStatus === GroupSelfScheduledPeriodMode.Closed))) {
            this.checkForSetupStatus(schedulePeriods);
          } else {
            if (this.selfSchedulePeriods.length === 1) {
              this.store.dispatch(new SetSchedulePeriods(this.selfSchedulePeriods)); // To store the SchedulePeriod information
              this.selfScheduleOpens = this.selfSchedulePeriods[0].statusMessage;
              this.groupSelfScheduleStatus = this.selfSchedulePeriods[0].selfScheduleStatus;
              this.selfSchedulePeriodDetails = selfSchedulePeriodDetails[0];
              this.hideOrShowSelfSchedule(selfSchedulePeriodDetails[0], SelfScheduledPeriodMode.Exist);
            } else {
              this.isSelectedSelfScheduleExits = this.selfSchedulePeriods.some(item => item.selfScheduleStatus === GroupSelfScheduledPeriodMode.Exist);
              this.store.dispatch(new SetSchedulePeriods(this.selfSchedulePeriods));
              this.checkSchedulePeriod = this.selfScheduledPeriodMode.Exist;
              this.groupSelfScheduleStatus = this.groupSelfScheduledPeriodMode.Exist;
              this.isAccessPeriodStartInFuture = false;
              this.checkSchedule(SelfScheduledPeriodMode.Exist);
            }
          }
        });
      } else {
        this.checkForSetupStatus(schedulePeriods);
      }
    }
  }

  private getSelfScheduleStatusMessage(schedulePeriod, selfSchedulePeriodStatus): string {
    const remainingDays = this.getSelfScheduleRemainingDays(schedulePeriod, selfSchedulePeriodStatus);
    if(remainingDays <= 0){
      return this.translateService.instant('self-schedule-period.no-self-schedule-period');
    }
    const selfScheduleStatus = (selfSchedulePeriodStatus.canSelfSchedule && (selfSchedulePeriodStatus.accessPeriodStartDate === null ||
      selfSchedulePeriodStatus.accessPeriodStartDate <= moment().format('YYYY-MM-DD'))) ?
      (remainingDays > 1 ? remainingDays + ' ' + this.translateService.instant('self-schedule-period.remaining-days') :
        (remainingDays === 1 ? remainingDays + ' ' + this.translateService.instant('self-schedule-period.remaining-day') : null)) :
      selfSchedulePeriodStatus.accessPeriodStartDate == null ? this.translateService.instant('self-schedule-period.no-self-schedule-period') :
        moment(selfSchedulePeriodStatus.accessPeriodStartDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD') ?
          (remainingDays > 1 ? remainingDays + ' ' + this.translateService.instant('self-schedule-period.remaining-days') :
            (remainingDays === 1 ? remainingDays + ' ' + this.translateService.instant('self-schedule-period.remaining-day') : null)) :
          this.translateService.instant('self-schedule-period.self-scheduling-closed-until') + ' ' +
          this.translateService.instant('self-schedule-preference.self-schedule-opens', {
            date: this.dateFormatter.toMonthDateYear(moment(selfSchedulePeriodStatus.accessPeriodStartDate)),
            time: this.dateFormatter.to24HourTime(moment(selfSchedulePeriodStatus.accessPeriodStartDate))
          });
    return selfScheduleStatus;
  }

  private getSelfScheduleStatus(schedulePeriod, selfSchedulePeriodStatus): GroupSelfScheduledPeriodMode {
    const remainingDays = this.getSelfScheduleRemainingDays(schedulePeriod, selfSchedulePeriodStatus);
    if(remainingDays <= 0){
      return GroupSelfScheduledPeriodMode.Closed;
    }
    const selfScheduleStatus = selfSchedulePeriodStatus.canSelfSchedule && (selfSchedulePeriodStatus.accessPeriodStartDate === null ||
      selfSchedulePeriodStatus.accessPeriodStartDate <= moment().format('YYYY-MM-DD')) ? GroupSelfScheduledPeriodMode.Exist :
      selfSchedulePeriodStatus.accessPeriodStartDate == null ? GroupSelfScheduledPeriodMode.Closed :
        selfSchedulePeriodStatus.accessPeriodStartDate !== null &&
          moment(selfSchedulePeriodStatus.accessPeriodStartDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD') ?
          GroupSelfScheduledPeriodMode.Exist :
          GroupSelfScheduledPeriodMode.Opens;

    return selfScheduleStatus;
  }

  private getSelfScheduleRemainingDays(schedulePeriod, selfSchedulePeriodStatus): number {
    let endDate: moment.Moment;
    if (selfSchedulePeriodStatus.accessPeriodEndDate == null) {
      endDate = schedulePeriod.selfScheduleEnd;
      return endDate.diff(moment().startOf('day'), 'days');
    } else {
      endDate = moment(selfSchedulePeriodStatus.accessPeriodEndDate);
      return (endDate.diff(moment().startOf('day'), 'days')) + 1;
    }
  }

  private checkForSetupStatus(schedulePeriods: SchedulePeriod[]) {
    this.schedulePeriod = schedulePeriods.find(schedulePeriod => schedulePeriod.status === 'Self Scheduling');
    if (this.schedulePeriod) {
      this.selfScheduleOpensMessage(SelfScheduledPeriodMode.NotExist); // marking as NotExist cause all the Self Schedule Period Status are closed
    } else {
      this.schedulePeriod = schedulePeriods.find(schedulePeriod => schedulePeriod.status === 'Setup');
      if (this.schedulePeriod) {
        this.selfScheduleOpensMessage(SelfScheduledPeriodMode.Setup);
      } else {
        this.checkSchedulePeriod = SelfScheduledPeriodMode.NotExist;
      }
    }
  }

  private selfScheduleOpensMessage(currentMode: number) {
    this.employeeScheduleSdkService.getSelfSchedulePeriodDetails(this.employeeCode, this.organizationUnitId, this.schedulePeriod.start).subscribe((result) => {
      this.selfSchedulePeriodDetails = result;
      this.selfScheduleOpens = this.translateService.instant('self-schedule-period.self-scheduling-closed-until') + ' ' +
        this.translateService.instant('self-schedule-preference.self-schedule-opens', {
          date: this.dateFormatter.toMonthDateYear(moment(this.selfSchedulePeriodDetails.accessPeriodStartDate)),
          time: this.dateFormatter.to24HourTime(moment(this.selfSchedulePeriodDetails.accessPeriodStartDate))
        });

      this.groupSelfScheduleStatus = result.canSelfSchedule ? GroupSelfScheduledPeriodMode.Exist :
        result.accessPeriodStartDate == null ? GroupSelfScheduledPeriodMode.Closed :
          result.accessPeriodStartDate !== null &&
            moment(result.accessPeriodStartDate).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD') ?
            GroupSelfScheduledPeriodMode.Exist : GroupSelfScheduledPeriodMode.Opens;

      this.hideOrShowSelfSchedule(result, currentMode);
    });
  }

  private hideOrShowSelfSchedule(result: any, currentMode: number) {
    if (this.groupSelfScheduleStatus === GroupSelfScheduledPeriodMode.Closed) {
      this.checkSchedule(SelfScheduledPeriodMode.NotExist); // Self Scheduling Closed
    } else {
      if (currentMode === SelfScheduledPeriodMode.Setup && result.accessPeriodStartDate == null && this.groupSelfScheduleStatus === GroupSelfScheduledPeriodMode.Exist) {
        this.groupSelfScheduleStatus = GroupSelfScheduledPeriodMode.Closed; // Schedule Period is in setup
      } else if (result.canSelfSchedule && result.accessPeriodStartDate !== null) {
        if (moment(result.accessPeriodStartDate) > moment()) {
          this.checkSchedulePeriod = GroupSelfScheduledPeriodMode.Opens; // Self Scheduling is available for future date
          this.isAccessPeriodStartInFuture = true;
        } else {
          this.checkSchedule(currentMode);
        }
      } else {
        if (moment(result.accessPeriodStartDate) > moment()) {
          this.checkSchedulePeriod = GroupSelfScheduledPeriodMode.Opens; // Self Scheduling available for future date
          this.isAccessPeriodStartInFuture = true;
        } else {
          this.checkSchedule(currentMode);
        }
      }
    }
  }

  private connectToSignalR() {
    this.signalrService.configure();
    this.signalrService.registerEvent(this.signalrConfig.SELF_SCHEDULE_DATA_CHANGED_EVENT);
    this.signalrService.startConnection();
  }

  /* istanbul ignore next */
  ngOnDestroy(): void { }
}
