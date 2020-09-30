

import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IScheduleCalendarWeek } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarWeek';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import * as _ from 'lodash';
import { DateFormatter } from '../date-formats/date-formatter';
import { DateFormats } from '../date-formats/date-formats';
import { TranslateService } from '@ngx-translate/core';
import { IActivityStaffingPlanCoverage, ICoverage } from 'src/app/time-management-domain/coverage';
import { TransactionRequestSdkService } from 'src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.service';
import { RetractSelfScheduleMessageService } from 'src/app/time-management-sdk/transaction-request-sdk/retract-self-schedule-message.service';
import { IActivity, Activity } from 'src/app/time-management-domain/activity';
import { Employee } from 'src/app/time-management-domain/employee';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { SelfScheduleState, IShift } from 'projects/SelfScheduleApp/src/app/store/self-schedule/states/self-schedule.state';
import { Select, Store } from '@ngxs/store';
import { Moment } from 'moment';
import { IProfile } from 'src/app/time-management-domain/profile';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { SchedulePeriod } from '../calendar/schedule-period';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import * as  moment from 'moment';
import { SelfScheduleActivityChangesComponent } from '../self-schedule-activity-changes/self-schedule-activity-changes.component';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { SetActivityStaffingPlanCoverages, SetShift } from '../../../../../MonthlyView/projects/SelfScheduleApp/src/app/store/self-schedule/actions/self-schedule.actions';
import { EventDisplayType, MapEventFn } from '@api-wfm/ng-sympl-ux';
import { EventDetailsSetup } from 'projects/SelfScheduleApp/src/app/self-schedule/event-details-setup.service';
import { ScheduleSdkService } from 'src/app/time-management-sdk/schedule-sdk/schedule-sdk.service';
import { IScheduleValidationWarning } from '../schedule-override-validation/model/schedule-validation-warning';
import { ErrorValidationWarnings } from '../validation-warnings/models/error-validation-warnings';
import { ScheduleValidationMessage } from '../validation-warnings/models/schedule-validation-message';
import { ModalComponent } from '@wfm/modal';
import { SelfScheduleAdd } from 'projects/SelfScheduleApp/src/app/store/self-schedule/states/self-schedule-add.state';
import { IPreferredShift } from './models/IPreferredShift';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';

enum TooltipPlacement {
  AUTO = <any>'AUTO'
}

@Component({
  selector: 'wf-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss']
})
export class ScheduleCalendarComponent implements OnInit {
  @Select(SelfScheduleState.getEmployee) loggedInEmployee$: Observable<Employee>;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;
  public dayTrackBy: IScheduleCalendarDay;
  public mapEvent: MapEventFn<ISchedule>;
  public summaryDisplay: EventDisplayType = EventDisplayType.Summary;
  needText: string;
  organizationUnitId: string;
  organizationUnitName: string;
  employeeProfileSubscription: Subscription;
  startDate: Moment;
  endDate: Moment;
  employeeCode: string;
  profiles: IProfile[];
  schedulePeriod: SchedulePeriod;
  activityList: Array<IActivityStaffingPlanCoverage> = [];
  activityStaffingCoverageSubscription: Subscription;
  coverage: ICoverage;
  otherShiftAvailable = [];
  currentDay = '';
  public SelfScheduleActivityChangesComponent = SelfScheduleActivityChangesComponent;
  activityCode: string;
  activity: IActivity;
  isActivityMatched = false;
  previouslySelectedPreference: PreferenceSetting;
  activityDetails: IActivityStaffingPlanCoverage[];
  isApplyButtonDisabled = true;
  profileCode: string;
  profileId: any;
  range: string;
  profilesNotFound = false;
  showLoader = false;
  showPageLoader = false;
  changeActivityDetails: any = [];
  loggedInEmployee: Employee;
  formModel: any;
  selectedProfile: any;
  selectedGuid: string;
  otherAvailableShift: any = [];
  addActivityDetails: any = {};
  changeShiftActivity: any = [];
  addShiftLoader = false;
  otherShiftEvent: any;
  scheduleValidationWarnings: IScheduleValidationWarning;
  schedules: ISchedule[];
  selfScheduleLabel = 'SelfSchedule';
  calendarDay: any;
  preferredShifts: IPreferredShift[] = [];
  preferredActivityIds: number[] = [];
  overlapSchedules$: any;
  @ViewChild('validationModal') validationModal: ModalComponent;
  @ViewChild('overlapModal') overlapModal: ModalComponent;
  @Select(SelfScheduleState.getSelfSchedulePeriod) schedulePeriod$: Observable<SchedulePeriod>;
  @Input() calendarWeeks: IScheduleCalendarWeek[];
  @Input() selectedDay?: IScheduleCalendarDay;
  @Input() showMore = false;
  @Input() maxEvents = 4;
  isSelfSchedule = true;
  TooltipPosition = TooltipPlacement;
  @Input() showBtn: IActivity;
  @Input() clickHandler?: (day: IScheduleCalendarDay, flag: boolean) => void = () => { };

  constructor(
    private translateService: TranslateService,
    private store: Store,
    private dateFormatter: DateFormatter,
    private dateFormats: DateFormats,
    private transactionRequestSdkService: TransactionRequestSdkService,
    public retractSelfScheduleMessageService: RetractSelfScheduleMessageService,
    private organizationSdkService: OrganizationSdkService,
    public employeeOrganizationSdkService: EmployeeOrganizationSdkService,
    private eventDetailsSetup: EventDetailsSetup,
    private scheduleSdkService: ScheduleSdkService,
    public employeeScheduleSdkService: EmployeeScheduleSdkService
  ) {
    this.mapEvent = this.eventDetailsSetup.mapEvent;
  }

  ngOnInit() {
    this.employeeCode = this.store.selectSnapshot<string>(AuthState.getEmployeeCode);
    this.loggedInEmployee$.subscribe((loggedInEmployee: Employee) => {
      if (loggedInEmployee) {
        this.loggedInEmployee = loggedInEmployee;
        const organizationUnit = loggedInEmployee.employment.location.unit || loggedInEmployee.employment.location.department || loggedInEmployee.employment.location.facility;
        this.organizationUnitId = organizationUnit.id;
        this.organizationUnitName = this.translateService.instant('self-schedule-preference.facility', {
          department: organizationUnit.name,
          facility: loggedInEmployee.employment.location.facility.code
        });
      }
    });
    this.preferenceSetting$.subscribe((preferenceSetting: PreferenceSetting) => {
      if (preferenceSetting) {
        this.previouslySelectedPreference = preferenceSetting;
        this.preferredActivityIds = preferenceSetting.profiles[0].activities.map(activity => activity.id);
        this.profileId = this.previouslySelectedPreference.profiles[0].id;
        this.selectedProfile = this.previouslySelectedPreference;
        this.getProfiles();
      }
    });
  }

  getOtherShiftsAvailable(event, days, $event): void {
    if (event !== undefined && days !== undefined) {
      this.showLoader = true;
      this.selectedGuid = event.guid;
      this.otherShiftAvailable = [];
      this.changeActivityDetails = [];
      this.preferredShifts = [];

      this.activityStaffingCoverageSubscription = this.organizationSdkService.getActivityStaffingCoverage
        (this.organizationUnitId, event.startDate, event.startDate, null, this.selfScheduleLabel, null)
        .subscribe((coverageResponse: ICoverage) => {
          this.coverage = coverageResponse;

          // Framing Change Shift Activity Details....
          const retractShiftDetail = { 'id': '', 'timings': '', 'activity': '', 'needs': '' };
          const retractStartTime = this.dateFormats.hoursMinutesFormat(event.activity.startTime);
          const retractEndTime = moment(retractStartTime, 'HH:mm').add(event.activity.hours, 'hours').add(event.activity.lunchHours, 'hours').format('HH:mm');
          retractShiftDetail.id = event.activity.id;
          retractShiftDetail.timings = retractStartTime + ' - ' + retractEndTime + ' (' + event.activity.hours + ' hrs)';
          retractShiftDetail.activity = ' (' + event.activity.code + ')';
          retractShiftDetail.needs = '0 needed';
          this.currentDay = this.dateFormats.dayMonthDateFormat(event.startDate);
          this.coverage.activityStaffingPlanCoverages.forEach((actStaffPlanCover) => {
            if (actStaffPlanCover.profile.code === event.profile.code && actStaffPlanCover.activity.code === event.activity.code) {
              actStaffPlanCover.days.forEach((day) => {
                if (day.need - day.coverage > 0) {
                  retractShiftDetail.needs = (day.need - day.coverage) + ' needed';
                }
              });
            }
            if (this.otherShiftAvailable.filter(name => name.profileCode.includes(actStaffPlanCover.profile.code)).length === 0) {
              this.otherShiftAvailable.push({ 'profileCode': actStaffPlanCover.profile.code, 'profileName': actStaffPlanCover.profile.name, 'activities': [] });
              const activeStaffingPlanningCoverage = this.coverage.activityStaffingPlanCoverages.filter(coverage => this.profiles.find(profile => coverage.profile.id === profile.id));
              activeStaffingPlanningCoverage.forEach((activityStaffingPlanCoverage) => {
                const startTime = this.dateFormats.hoursMinutesFormat(activityStaffingPlanCoverage.activity.startTime);
                const endTime = moment(startTime, 'HH:mm').add(activityStaffingPlanCoverage.activity.hours, 'hours').add(activityStaffingPlanCoverage.activity.lunchHours, 'hours').format('HH:mm');
                activityStaffingPlanCoverage.activity['profile'] = activityStaffingPlanCoverage.profile;
                activityStaffingPlanCoverage.activity['selectedDate'] = event.startDate;
                activityStaffingPlanCoverage.activity['etag'] = event.etag;
                if ((activityStaffingPlanCoverage.days[0].need - activityStaffingPlanCoverage.days[0].coverage) > 0 && actStaffPlanCover.profile.id === activityStaffingPlanCoverage.profile.id) {
                  this.otherShiftAvailable[this.otherShiftAvailable.length - 1].activities.push({
                    'activity': activityStaffingPlanCoverage.activity,
                    'timings': startTime + ' - ' + endTime + ' (' + activityStaffingPlanCoverage.activity.hours + ' hrs)',
                    'activityCode': ' (' + activityStaffingPlanCoverage.activity.code + ')',
                    'needs': (activityStaffingPlanCoverage.days[0].need - activityStaffingPlanCoverage.days[0].coverage) + ' needed'
                  });
                }
              });
            }
          });

          // Removing Existing Activities....
          days.events.forEach((schedule) => {
            if (schedule.activity !== undefined && schedule.activity != null) {
              for (let i = 0; i < this.otherShiftAvailable.length; i++) {
                if (this.otherShiftAvailable[i].activities.length === 0) {
                  this.otherShiftAvailable.splice(i, 1);
                  i--;
                } else {
                  this.otherShiftAvailable[i].activities.forEach((act, actIndex) => {
                    if (schedule.activity.id === act.activity.id && schedule.profile.id === act.activity.profile.id) {
                      this.otherShiftAvailable[i].activities.splice(actIndex, 1);
                    }
                  });
                }
              }
            }
          });
          this.filterPreferredShifts();
          // Remove profiles which does not have any activity
          this.otherShiftAvailable = this.otherShiftAvailable.filter(profile => profile.activities.length !== 0);

          // Activities in Ascending Order....
          this.otherShiftAvailable.sort((a, b) => (a.profileName > b.profileName) ? 1 : ((b.profileName > a.profileName) ? -1 : 0));
          this.otherShiftAvailable.forEach((otherShift) => {
            otherShift.activities.sort((a, b) => (a.timings.substring(0, 5) + (a.activityCode.toUpperCase()) > b.timings.substring(0, 5) + (b.activityCode.toUpperCase())) ? 1 :
              ((b.timings.substring(0, 5) + (b.activityCode.toUpperCase()) > a.timings.substring(0, 5) + (a.activityCode.toUpperCase())) ? -1 : 0));
          });

          const unit = event.unit ? event.unit.code + ', ' : '';

          // Change Shift Activity Details....
          this.changeActivityDetails = {
            'changeActivityDetailHeaderDate': this.currentDay,
            'changeActivityDetailHeaderTitle': 'self-schedule-preference.changeActivityDetailHeaderTitle',
            'changeActivityDetailShiftTitle': 'self-schedule-preference.changeActivityDetailShiftTitle',
            'changeActivityDetailShifts': this.otherShiftAvailable,
            'preferredShiftsTitle': 'self-schedule-preference.preferredShiftsTitle',
            'preferredShifts': this.preferredShifts,
            'changeActivityDetailButton': {
              'isActive': true,
              'title': 'self-schedule-preference.changeActivityDetailButtonTitle',
              'shifts': retractShiftDetail,
              'buttonName': 'button.retract',
              'role': event.profile.code,
              'departmentAndFacility': unit + event.department.code + ', ' + event.facility.code
            }
          };
          this.showLoader = false;
        });
    }
    $event.stopPropagation();
  }

  // Filter preferred shifts from Other-shifts
  filterPreferredShifts(): void {
    this.preferredActivityIds.forEach((activityId) => {
    this.otherShiftAvailable.forEach((shift, i) => {
      this.otherShiftAvailable[i].activities.forEach((currentActivity, actIndex) => {
        if ((activityId == parseInt(currentActivity.activity.id)) && (this.previouslySelectedPreference.profiles[0].id === currentActivity.activity.profile.id)) {
          this.preferredShifts.push(this.otherShiftAvailable[i].activities[actIndex]);
          this.otherShiftAvailable[i].activities.splice(actIndex, 1);
        }
      });
    });
  });
  this.preferredShifts = this.preferredShifts.sort(this.sortPreferredShifts);
  }

  // Sort preferred shifts
   sortPreferredShifts(activity1, activity2) {
    const diff = moment(activity1['activity']['startTime'], 'HH:mm:ss').unix() - moment(activity2['activity']['startTime'], 'HH:mm:ss').unix();
    if (diff === 0) {
      return (activity1['activity']['code'].toUpperCase() < activity2['activity']['code'].toUpperCase() ? -1 :
        (activity1['activity']['code'].toUpperCase() > activity2['activity']['code'].toUpperCase() ? 1 : 0));
    }
    return diff;
  }

  changeShift(schedule): void {

    let overLapShifts;

    if (!schedule.overrideValidation) {
      this.changeShiftActivity = schedule.activity;
      overLapShifts = this.getOverlappingShifts(schedule.activity, schedule.day, schedule.changeShiftEvent);
    }
    const activity = this.changeShiftActivity;

    if (overLapShifts) {
      this.overlapModal.open();
    } else {
      this.checkOverlapAndAddorChangeShift(this.updateShift, activity, schedule.day, [activity, schedule])
    }
  }
  updateShift(activity, schedule) {
    this.showPageLoader = true;
    this.loggedInEmployee = this.store.selectSnapshot<Employee>(SelfScheduleState.getEmployee);
    this.selectedProfile.id = this.selectedProfile.profileId;
    const startDate = activity.selectedDate['_i'].toString();
    const createdTime = startDate.split('T')[1].split('.').shift();
    this.formModel = {
      startDate: startDate.replace(createdTime, activity.startTime),
      hasStartTime: true,
      hours: activity.hours,
      amount: 0,
      payCodeId: null,
      laborDistributionId: null,
      jobClass: this.loggedInEmployee.employment.profession.jobClass,
      facility: this.loggedInEmployee.employment.location.facility,
      department: this.loggedInEmployee.employment.location.department,
      unit: null,
      lunchHours: activity.lunchHours,
      activity: activity,
      profile: activity.profile,
      position: this.loggedInEmployee.employment.profession.position,
      source: 9,
      isExtraShift: false,
      requestedReason: null,
      guid: this.selectedGuid,
      etag: activity.etag
    };

    this.scheduleSdkService.saveSchedule(this.employeeCode, this.formModel, schedule.overrideValidation).subscribe(
      updateResponse => {
        this.showPageLoader = false;
        this.retractSelfScheduleMessageService.sendMessage('true');
      },
      error => {
        this.showPageLoader = false;
        this.handleError(error);
      });

  }

  public handleError(error: any): void {
    this.scheduleValidationWarnings = this.handleValidationErrors(error.error);
    this.openApprovalModal();
  }

  public handleValidationErrors(errorInfo): IScheduleValidationWarning {
    if (errorInfo && (errorInfo.errorCode === 'VALIDATION_MESSAGES_EXIST')) {
      const exceptions = new ErrorValidationWarnings(
        errorInfo.content.validationMessages,
        errorInfo.content.overridable
      );
      return { errorCode: errorInfo.errorCode, validationException: exceptions, override: errorInfo.content.overridable, otherExceptions: false } as IScheduleValidationWarning;
    }
    const msg = new ScheduleValidationMessage('', this.translateService.instant(`errors.${errorInfo.errorCode}`), '0');
    const exception = new ErrorValidationWarnings(
      [msg],
      false);
    return { errorCode: errorInfo.errorCode, validationException: exception, override: false, otherExceptions: true };
  }

  addShift(selectedShift, currentDate) {
    const overLapShifts = this.getOverlappingShifts(selectedShift.activity, currentDate);
  
    if (overLapShifts) {
      this.overlapModal.open();
    } else {
      const shift: IShift = {
        shift: _.cloneDeep(selectedShift.activity),
        currentDate: currentDate,
        profile: selectedShift.profile
      };
      this.checkOverlapAndAddorChangeShift(this.dispatchAddShift, selectedShift.activity, currentDate, [shift]);
    }
  }
  dispatchAddShift(shift) {
    this.store.dispatch(new SetShift(shift));
  }
  close() {
    this.overlapModal.close();
  }

  public openApprovalModal(): void {
    this.validationModal.open();
  }
  isNeedCountZero(clickedDay) {
    const qualifiedCoverage = this.store.selectSnapshot<Array<IActivityStaffingPlanCoverage>>(SelfScheduleState.getQualifiedCoverage);
    return qualifiedCoverage.filter(item => item.days.filter(day => day.need !== 0 && this.dateFormatter.toIsoDate(clickedDay.date) === day.needDate).length).length ? false : true;
  }
  getAllOtherAvailableShifts(clickedDay, $event) {
    const defaultActivity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
    if (clickedDay && this.profiles && defaultActivity) {
      this.addActivityDetails = {};
      let shiftsAvailable = [];
      let othershiftsAvailable = [];
      let filteredActivities = [];
      let defaultShifts = [];
      let preferredShifts = [];
      const selectedDay = this.dateFormats.dayMonthDateFormat(clickedDay.date._d);
      const preferenceSetting: PreferenceSetting = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
      const activityStaffingPlanCoverage: IActivityStaffingPlanCoverage[] = this.store.selectSnapshot<IActivityStaffingPlanCoverage[]>(SelfScheduleAdd.getActivityStaffingPlanCoverages);
      const preferredShiftsIds = preferenceSetting.profiles[0].activities.map(activity => activity['id']);
      const qualifiedProfiles = this.profiles.map(profile => parseInt(profile['id'], 10));
      filteredActivities = activityStaffingPlanCoverage && activityStaffingPlanCoverage.filter
        (item => qualifiedProfiles.indexOf(parseInt(item.profile.id, 10)) >= 0 &&
          item.days.filter(day => day.need !== 0 && this.dateFormats.yearMonthDateFormat(clickedDay.date._d) === day.needDate).length > 0);
      preferredShifts = filteredActivities.filter(activity => parseInt(activity.profile.id, 10) === preferenceSetting.profiles[0].id &&
      preferredShiftsIds.indexOf(parseInt(activity.activity.id, 10)) >= 0);
      othershiftsAvailable = _.differenceWith(filteredActivities, preferredShifts, (obj1, obj2) => (obj1.profile.id === obj2.profile.id && obj1.activity.id === obj2.activity.id));
      defaultShifts = filteredActivities.filter(item => parseInt(item.profile.id, 10) === preferenceSetting.profiles[0].id && item.activity.id.toString() === defaultActivity.id.toString() &&
          item.days.filter(day => day.need !== 0 && this.dateFormats.yearMonthDateFormat(clickedDay.date._d) === day.needDate).length > 0);
      const otherFormatedShifts = this.filterPreferredAndOtherShifts(othershiftsAvailable, clickedDay);
      const otherFormatedShiftsGroups = _.groupBy(otherFormatedShifts, 'profileName');
      shiftsAvailable = this.filterPreferredAndOtherShifts(preferredShifts, clickedDay);
      if (filteredActivities.length) {
        this.addActivityDetails = {
          'changeActivityDetailHeaderDate': selectedDay,
          'changeActivityDetailHeaderTitle': 'self-schedule-preference.addShift',
          'changeActivityDetailShiftTitle': 'self-schedule-preference.changeActivityDetailShiftTitle',
          'changeActivityDetailShifts': shiftsAvailable.length ? shiftsAvailable : [],
          'preferredShiftsTitle': 'self-schedule-preference.preferredShiftsTitle',
          'otherActivityDetails': otherFormatedShifts.length ? otherFormatedShiftsGroups : {},
          'defaultShifts': defaultShifts,
          'changeActivityDetailButton': {
            'isActive': false,
            'title': '',
            'shifts': [],
            'buttonName': '',
            'role': '',
            'departmentAndFacility': ''
          }
        };
      }
      $event.stopPropagation();
    }
  }

  filterByProfileCode(profileCode: string) {
    if (profileCode !== undefined && profileCode != null) {
      this.activityCode = null;
      this.activity = null;
      this.activityList = this.coverage.activityStaffingPlanCoverages.filter(c => {
        return c.profile.code === profileCode;
      });
      this.isActivityMatched = this.activityList.length === 0 ? true : false;

      if (this.previouslySelectedPreference) {
        this.activityDetails = _.filter(this.activityList, (r) => this.previouslySelectedPreference.profiles[0].activities.map(activity => activity['id']).indexOf(parseInt(r.activity.id, 10)) >= 0) ;
        const prevProfile = this.previouslySelectedPreference.profiles[0].id.toString();

        if ((this.activityDetails.length > 0) && (this.activityDetails[0].profile.id.toString() === prevProfile)) {
          this.activityCode = this.activityDetails[0].activity.code;
          this.activity = (this.activityDetails[0].activity) as IActivity;
        }
      } else {
        if (this.activityList.length > 0) {
          this.activityCode = this.activityList[0].activity.code;
          this.activity = (this.activityList[0].activity) as IActivity;
          this.isApplyButtonDisabled = false;
        }
      }
    }
  }
  getProfiles(): void {
    this.schedulePeriod$.subscribe((schedulePeriod: SchedulePeriod) => {
      this.schedulePeriod = schedulePeriod;
      if (this.schedulePeriod) {
        this.startDate = this.schedulePeriod.start;
        this.endDate = this.schedulePeriod.end;
      }
      if (this.startDate && this.endDate !== undefined) {
        this.employeeProfileSubscription = this.employeeOrganizationSdkService.getSelfScheduleEmployeeProfiles(
          this.employeeCode, this.organizationUnitId, this.startDate, this.endDate).
          subscribe(profiles => {
            if (profiles && profiles.length > 0) {
              this.profiles = profiles;
              if (this.previouslySelectedPreference) {
                this.profileId = this.previouslySelectedPreference.profiles[0].id;
                this.selectedProfile = this.previouslySelectedPreference;
                const profile = _.filter(this.profiles, (c) => {
                  return c.id.toString() === this.profileId.toString();
                });
                if (profile && profile.length > 0) {
                  this.profileCode = profile[0].code;
                  this.getActivityStaffingCoverage(profile[0].code, this.profileId);
                }
              } else {
                this.profileCode = this.profiles[0].code;
                this.profileId = parseInt(this.profiles[0].id, 10);
                this.selectedProfile = this.profiles[0];
                this.getActivityStaffingCoverage(this.profileCode, this.profileId);
              }
            } else {
              this.profilesNotFound = true;
            }
          });
      }
    });
  }

  getActivityStaffingCoverage(profileCode?: string, profileId?: number): void {
    this.isApplyButtonDisabled = true;
    this.schedulePeriod$.subscribe((schedulePeriod: SchedulePeriod) => {
      this.schedulePeriod = schedulePeriod;
      if (this.schedulePeriod) {
        this.range = this.translateService.instant('self-schedule-preference.schedule-period', {
          start: this.dateFormatter.toMonthDay(this.schedulePeriod.start),
          end: this.dateFormatter.toMonthDay(this.schedulePeriod.end)
        });
        if (profileCode) {
          this.profileId = profileId;
          if (this.coverage) {
            this.filterByProfileCode(profileCode);
          } else {
            this.activityStaffingCoverageSubscription = this.organizationSdkService.getActivityStaffingCoverage
              (this.organizationUnitId, this.schedulePeriod.start, this.schedulePeriod.end, null, 'SelfSchedule')
              .subscribe((coverageResponse: ICoverage) => {
                this.coverage = coverageResponse;
                this.filterByProfileCode(this.profileCode);
                this.store.dispatch(new SetActivityStaffingPlanCoverages(this.coverage.activityStaffingPlanCoverages)); // To store the Employee information
              });
          }
        } else {
          this.activityStaffingCoverageSubscription = this.organizationSdkService.getActivityStaffingCoverage
            (this.organizationUnitId, this.schedulePeriod.start, this.schedulePeriod.end, null, 'SelfSchedule')
            .subscribe((coverageResponse: ICoverage) => {
              this.coverage = coverageResponse;
              this.filterByProfileCode(this.profileCode);
              this.store.dispatch(new SetActivityStaffingPlanCoverages(this.coverage.activityStaffingPlanCoverages)); // To store the Employee information
            });
        }
      }
    });
  }

  // function returning html template as an input for tooltip
  toolTipTemplate(event: ISchedule): string {
    let tooltipTemplate = '';
    const totalHours = event.hours ? event.hours : 0;
    const range = this.translateService.instant('calendar-page.event-time-span', {
      start: this.dateFormatter.to24HourTime(event.startDate),
      end: this.dateFormatter.to24HourTime(event.endDate),
      hours: totalHours
    });
    if (event.activity) {
      tooltipTemplate =
        `<span>${event.profile.code}</span><br><span>${range}</span><br><span>${event.facility.code}</span><br><span>${event.department.code}</span>`;
      if ((event['unit'] && event['unit'] !== null)) {
        tooltipTemplate += `<br><span>${event.unit.code}</span>`;
      }
    } else {
      tooltipTemplate = `<span>${event.payCode.code}</span><br><span>${range}</span>`;
    }
    return tooltipTemplate = `<div>${tooltipTemplate}</div>`;
  }

  retractSelfSchedule(event) {
    this.transactionRequestSdkService.retractTransactionRequest(event.guid, 'SelfScheduled').subscribe(() => {
      this.retractSelfScheduleMessageService.sendMessage(event);
    });
  }

  calculateActivityEndDate(activity) {
    if (activity !== undefined) {
      return moment(activity.startTime, 'HH:mm').format('HH:mm') + ' - ' + moment(activity.startTime, 'HH:mm').add(activity.hours, 'hours').format('HH:mm');
    }
  }

  sortActivitiesList(activity1, activity2) {
    const diff = moment(activity1['activity']['startTime'], 'HH:mm:ss').unix() - moment(activity2['activity']['startTime'], 'HH:mm:ss').unix();
    if (diff === 0) {
      return (activity1['activity']['code'].toUpperCase() < activity2['activity']['code'].toUpperCase() ? -1 :
        (activity1['activity']['code'].toUpperCase() > activity2['activity']['code'].toUpperCase() ? 1 : 0));
    }
    return diff;
  }

  sortActivities(activity1, activity2) {
    const diff = moment(activity1['startDate'], 'HH:mm:ss').unix() - moment(activity2['startDate'], 'HH:mm:ss').unix();
    if (diff === 0) {
      const code1 = (activity1.activity ? activity1.activity.code : activity1.payCode.code).toString().toUpperCase();
      const code2 = (activity2.activity ? activity2.activity.code : activity2.payCode.code).toString().toUpperCase();
      return (code1 < code2 ? -1 : (code1 > code2 ? 1 : 0));
    }
    return diff;
  }

  sortCalendarCells(event: Array<ISchedule>) {
    return event.sort(this.sortActivities);
  }
  onClickHandler(clickedDay): void {
    const selectedActivity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
    const isScheduledFlag = _.some(clickedDay.events, (event) => {
      return event.source === 'SelfScheduled' || (event.activity && event.activity.id === selectedActivity.id);
    });
    this.clickHandler(clickedDay, false);
    if (clickedDay.events.length === 0 || !isScheduledFlag) {
      const overLapShifts = this.getOverlappingShifts(selectedActivity, clickedDay);
      if (overLapShifts) {
        this.overlapModal.open();
      } else {
        this.checkOverlapAndAddorChangeShift(this.clickHandler, selectedActivity, clickedDay, [clickedDay, true]);
      }
    }
  }
  checkOverlapAndAddorChangeShift(callback, activity, clickedDay, args) {
    if (this.overlapSchedules$) {
      this.overlapSchedules$.scheduleObserver.subscribe(result => {
        const schedules = this.getFormattedSchedules(moment(this.overlapSchedules$.scheduleDate).startOf('day'), result.events);
        const currentActivity = this.createDateTimeObject(clickedDay.date, activity);
        if (schedules.find(schedule => this.isThereOverlap(currentActivity, schedule))) {
          this.overlapModal.open();
        } else {
          callback.apply(this, args);
        }
      });
    } else {
      callback.apply(this, args);
    }
  }

  filterPreferredAndOtherShifts(filteredShifts, clickedDay) {
    const availableShifts = [];
    const existingEvents = clickedDay.events.map(item => item.activity && item.activity.id);
    if (filteredShifts.length) {
      filteredShifts = filteredShifts.filter(item => existingEvents.indexOf(item.activity.id) === -1);
      filteredShifts = filteredShifts.sort(this.sortActivitiesList);
      filteredShifts.forEach((shift) => {
          const startTime = this.dateFormats.hoursMinutesFormat(shift.activity.startTime);
          const endTime = moment(startTime, 'HH:mm').add(shift.activity.hours, 'hours').add(shift.activity.lunchHours, 'hours').format('HH:mm');
          const currentDay = shift.days.find(day => this.dateFormats.yearMonthDateFormat(clickedDay.date._d) === day.needDate);
          const timings = this.translateService.instant('schedule-calendar.shift-timings', {
            startTime: startTime,
            endTime: endTime,
            hours: shift.activity.hours
          });
          const activityCode = this.translateService.instant('schedule-calendar.activityCode', {
            activityCode: shift.activity.code
          });
          const needs = this.translateService.instant('schedule-calendar.needs', {
            needs: (currentDay.need - currentDay.coverage)
          });
          if (currentDay.need - currentDay.coverage > 0) {
            availableShifts.push({
              'activity': shift.activity,
              'profileName': shift.profile.code,
              'timings': timings,
              'activityCode': activityCode,
              'needs': needs,
              'profile': shift.profile
            });
          }
        });
      }
      return availableShifts.length ? availableShifts : [];
  }
  getOverlappingShifts(activity, clickedDay, changeShiftEvent?) {
    this.overlapSchedules$ = undefined;
    let currentSchedules = [];
    let isThereOverlap;
    const currentDay = clickedDay.date.clone();
    const calendarDays = this.getCalendarDays();

    let currentDayShifts = this.getShiftsByCalendarDate(currentDay);
    if (changeShiftEvent) {
      currentDayShifts = currentDayShifts.filter(shift => shift.guid !== changeShiftEvent.guid);
    }

    const currentActivity = this.createDateTimeObject(clickedDay.date, activity);
    currentSchedules = this.getFormattedSchedules(currentDay, currentDayShifts);

    isThereOverlap = currentSchedules.find(schedule => this.isThereOverlap(currentActivity, schedule));
    if (isThereOverlap) {
      return isThereOverlap;
    } else {
      const previousDay = clickedDay.date.clone().add(-1, 'days');
      if (previousDay.isSameOrAfter(this.dateFormatter.toIsoDate(calendarDays[0].date))) {
        isThereOverlap = this.checkOverlapSchedulesforCalendarDate(previousDay, currentActivity);
      } else {
        this.overlapSchedules$ = this.getSchedulesByDate(previousDay);
      }
      if (isThereOverlap) {
        return isThereOverlap;
      } else {
        const nextDay = clickedDay.date.clone().add(1, 'days');
        if (nextDay.isSameOrBefore(this.dateFormatter.toIsoDate(calendarDays[calendarDays.length - 1].date))) {
          return this.checkOverlapSchedulesforCalendarDate(nextDay, currentActivity);
        } else {
          this.overlapSchedules$ = this.getSchedulesByDate(nextDay);
        }
      }
    }
  }
  getCalendarDays() {
    let calendarDays = [];
    this.calendarWeeks.forEach((week) => {
      calendarDays = calendarDays.concat(week.days);
    });
    return calendarDays;

  }
  checkOverlapSchedulesforCalendarDate(calendarDay, currentActivity) {
    const calendarDayShifts = this.getShiftsByCalendarDate(calendarDay);
    const currentSchedules = this.getFormattedSchedules(calendarDay, calendarDayShifts);
    return currentSchedules.find(schedule => this.isThereOverlap(currentActivity, schedule));
  }
    getShiftsByCalendarDate(calendarDate) {
      let calendarDays = [] ;
      this.calendarWeeks.forEach((calendar) => {
        calendarDays = calendarDays.concat(calendar.days);
      });
      const shifts = calendarDays.find(day => day.date.date() === calendarDate.date());
      return shifts ? shifts.events : [];

    }
    getFormattedSchedules(currentDay, currentDayshifts) {
      const schedules = [];
      if (currentDayshifts) {
        currentDayshifts.forEach(shift => {
            schedules.push(this.createDateTimeObject(currentDay, shift));
        });
      }
      return schedules;
    }
    createDateTimeObject(clickedDay, shift) {
      const shiftDateTime = shift.source ? shift.startDate : moment(shift.startTime, this.dateFormats.TIME_24HOUR_SHORT) ;
      const startDate = clickedDay.clone().add(shiftDateTime.hour(), 'hours').add(shiftDateTime.minute(), 'minutes');
      const endDate = startDate.clone().add(shift.hours + (shift.source ? shift.lunchHours : shift.lunchHours), 'hours');
      return {
        startTime: startDate,
        endTime: endDate
      };
    }
    isThereOverlap(t1, t2) {
      return !((t1.startTime.isSameOrBefore(t2.startTime) && t1.endTime.isSameOrBefore(t2.startTime)) ||
             (t1.startTime.isSameOrAfter(t2.endTime) && t1.endTime.isSameOrAfter(t2.startTime)));
    }

  getSchedulesByDate(scheduleDate) {
    return {
      scheduleDate: scheduleDate,
      scheduleObserver: this.employeeScheduleSdkService.getSchedules(this.employeeCode, scheduleDate.format('YYYY-MM-DD'),
      scheduleDate.format('YYYY-MM-DD'), null, 'SelfScheduling')
    };
  }
}
