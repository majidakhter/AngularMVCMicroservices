

import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { KeyValue } from '@angular/common';
import { IScheduleCalendarDay } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarDay';
import { GroupSelfScheduledPeriodMode, SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { EmployeeCalendarDisplayService } from 'src/app/shared/calendar/employee-calendar-display.service';
import { CalendarWeek } from 'src/app/shared/schedule-calendar/models/calendar-week.model';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Employee, IEmployeeScheduleExceptionResponse, IEmployeeSchedulException } from 'src/app/time-management-domain/employee';
import { Select, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { SetActivityStaffingPlanCoverages, SetDisplayShiftNeeds, SetSelectedDate, SetSelfSchedulePeriod, SetShift, SetSelectedActivity, SetQualifiedProfiles, SetQualifiedCoverage, SetPreferenceModal } from '../../store/self-schedule/actions/self-schedule.actions';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { IShift, SelfScheduleState } from '../../store/self-schedule/states/self-schedule.state';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { IActivityStaffingPlanCoverage, ICoverage, IDayNeeds } from 'src/app/time-management-domain/coverage';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import * as moment from 'moment-timezone';
import { IScheduleCalendarWeek } from 'src/app/shared/schedule-calendar/models/IScheduleCalendarWeek';
import { ScheduleSdkService } from 'src/app/time-management-sdk/schedule-sdk/schedule-sdk.service';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { SelfScheduleAdd, IActivityStaffingPlanCoverages } from '../../store/self-schedule/states/self-schedule-add.state';
import { IActivity } from 'src/app/time-management-domain/activity';
import { ModalComponent } from '@wfm/modal';
import { TransactionRequestSdkService } from 'src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.service';
import { RetractSelfScheduleMessageService } from 'src/app/time-management-sdk/transaction-request-sdk/retract-self-schedule-message.service';
import { ErrorValidationWarnings } from 'src/app/shared/validation-warnings/models/error-validation-warnings';
import { ScheduleValidationMessage } from 'src/app/shared/validation-warnings/models/schedule-validation-message';
import { IScheduleValidationWarning } from 'src/app/shared/schedule-override-validation/model/schedule-validation-warning';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { SignalrService } from 'src/app/time-management-sdk/signalr/signalr.service';
import { SignalrConfig } from 'src/app/time-management-sdk/signalr/signalr.config';
import { IProfile } from 'src/app/time-management-domain/profile';

export interface IPDropDown {
  label: string;
  value: number;
  selfScheduleStatus: GroupSelfScheduledPeriodMode;
}

export enum scheduleType {
  SELFSCHEDULE = 'SelfScheduled'
}

@Component({
  selector: 'wf-self-schedule-period',
  templateUrl: './self-schedule-period.component.html',
  styleUrls: ['./self-schedule-period.component.scss']
})

export class SelfSchedulePeriodComponent implements OnInit, OnDestroy {
  @Input() day: IScheduleCalendarDay;
  schedulePeriod: SchedulePeriod;
  schedulePeriods: Array<SchedulePeriod> = [];
  calendarWeeks: Array<IScheduleCalendarWeek> = [];
  selectedDay: IScheduleCalendarDay;
  monthsCount = 18;
  subscribeToScheduleService: Subscription;
  employee: Employee;
  employeeCode: string;
  organizationUnitId: string;
  range: string;
  coverage: ICoverage;
  remainingDays: number;
  preferenceActivityId: Array<number>;
  loggedInEmployee: Employee;
  startDate: moment;
  defaultActivity;
  isLoading = false;
  showModal = false;
  isSelfScheduleExist: boolean;
  toggleExceptionFlag = false;
  formModel;
  scheduleValidationWarnings: IScheduleValidationWarning;
  employeeScheduleExceptions = {};
  employeeScheduleExceptionCount = -1;
  failedToLoadData = false;
  addShiftCoverage: IActivityStaffingPlanCoverage;
  @ViewChild('validationModal') validationModal: ModalComponent;
  groupSelfScheduleStatus: number;
  groupSelfScheduledPeriodMode = GroupSelfScheduledPeriodMode;
  selfScheduleOpens: string;
  @ViewChild('successModal') successModal: ModalComponent;
  @ViewChild('needsModal') needsModal: ModalComponent;
  @Select(SelfScheduleState.getPreferenceSetting) preferenceSetting$: Observable<PreferenceSetting>;
  @Select(SelfScheduleState.getSelectedActivity) selectedActivity$: Observable<IActivity>;
  @Select(SelfScheduleAdd.getActivityStaffingPlanCoverages) activityStaffingPlanCoverage$: Observable<IActivityStaffingPlanCoverage[]>;
  @Select(SelfScheduleState.getDisplayShiftNeeds) setDisplayShiftNeeds$: Observable<number>;
  @Select(SelfScheduleState.getShift) currentShift$: Observable<IShift>;
  @Select(SelfScheduleState.getCommitmentsRefreshStatus) commitmentsRefreshStatus$: Observable<boolean>;
  @Output() IsSelectedSelfScheduleExits = new EventEmitter<boolean>();
  preferenceProfileId: number;
  getSchedulePeriods: SchedulePeriod[];
  multipleSchedulePeriods: SchedulePeriod[];
  selfSchedulePeriods: IPDropDown[] = [];
  selfSchedulePeriodsList: Array<SchedulePeriod> = [];
  selectedDropDownValue: IPDropDown;
  CommitmentShifts: Array<IScheduleCalendarWeek> = [];
  allAvailableShiftsFlag: number;
  schedulePeriodsIndex = 0;
  loadingIssuesSpinner = true;
  signalrSubscription: Subscription;
  qualifiedProfiles: Array<IProfile> = [];

  constructor(
    private employeeCalendarDisplayService: EmployeeCalendarDisplayService,
    private store: Store,
    private translateService: TranslateService,
    public dateFormatter: DateFormatter,
    public employeeOrganizationSdkService: EmployeeOrganizationSdkService,
    private organizationSdkService: OrganizationSdkService,
    private employeeSdkService: EmployeeSdkService,
    private scheduleSdkService: ScheduleSdkService,
    public transactionRequestSdkService: TransactionRequestSdkService,
    public retractSelfScheduleMessageService: RetractSelfScheduleMessageService,
    public employeeScheduleSdkService: EmployeeScheduleSdkService,
    private changeDetectorRef: ChangeDetectorRef,
    private signalrService: SignalrService,
    private signalrConfig: SignalrConfig
  ) { }

  ngOnInit() {
    this.loggedInEmployee = this.store.selectSnapshot<Employee>(SelfScheduleState.getEmployee);
    this.populateSchedulePeriodDropdown();
    // Filter the coverage based on the selected profile and activity in the schedule preference modal
    this.preferenceSetting$.subscribe((preferenceSetting: PreferenceSetting) => {
      if (preferenceSetting && preferenceSetting.profiles.length) {
        this.preferenceActivityId = preferenceSetting.profiles[0].activities.map(activity => activity['id']);
        this.preferenceProfileId = preferenceSetting.profiles[0].id;
        this.employeeCode = this.store.selectSnapshot<string>(AuthState.getEmployeeCode);
        this.organizationUnitId = preferenceSetting.organizationEntityId;
        this.store.dispatch(new SetDisplayShiftNeeds(0));
        this.allAvailableShiftsFlag = this.store.selectSnapshot<number>(SelfScheduleState.getDisplayShiftNeeds);
        if (this.schedulePeriods.length > 0) {
          this.getCoverageSchedulesAndQualifiedProfiles();
        }
      }
    });

    this.setDisplayShiftNeeds$.subscribe((resp => {
      if (this.preferenceActivityId && ((resp === 1) || (resp === 0))) {
        this.allAvailableShiftsFlag = resp;
        this.loadCalenderWeeks();
      }
    }));

    this.selectedActivity$.subscribe((selectedActivity: IActivity) => {
      if (selectedActivity) {
        this.loadCalenderWeeks();
      }
    });

    this.retractSelfScheduleMessageService.getMessage().subscribe(() => {
      this.getCoverageSchedules();
    });

    this.currentShift$.subscribe((currentShift) => {
      this.addShift(currentShift);
    });

    this.commitmentsRefreshStatus$.subscribe((status) => {
      if (status) {
        this.loadingIssuesSpinner = true;
        this.getEmployeeScheduleExceptions();
      } else {
        this.loadingIssuesSpinner = false;
      }
    });

    this.registerSignalr();
    this.subscribeToSignalrUpdates();
  }

  private registerSignalr() {
    const selectedUnits = new Array<Number>();
    selectedUnits.push(Number(this.organizationUnitId));
    this.signalrService.connectionCompleted.subscribe((connected) => {
      if (connected) {
        const scheduleStartDate = moment.tz(this.dateFormatter.format(this.schedulePeriod.start, 'YYYY-MM-DDT12:00:00'), this.loggedInEmployee.employment.location.timeZoneId);
        const scheduleEndDate = moment.tz(this.dateFormatter.format(this.schedulePeriod.end, 'YYYY-MM-DDT12:00:00'), this.loggedInEmployee.employment.location.timeZoneId);
        const args = [selectedUnits, scheduleStartDate, scheduleEndDate];
        this.signalrService.triggerEvent(this.signalrConfig.REGISTER_ORG_AND_DATE, args);
      }
    });
  }

  private deregisterSignalrListener() {
    this.signalrService.connectionChanged.subscribe((connected) => {
      if (connected) {
        this.signalrService.triggerEvent(this.signalrConfig.DEREGISTER_LISTENER, []);
      }
    });
  }

  private subscribeToSignalrUpdates() {
    this.signalrSubscription = this.signalrService.onEvent(this.signalrConfig.SELF_SCHEDULE_DATA_CHANGED_EVENT).subscribe((data) => {
      this.organizationSdkService.getActivityStaffingCoverage(this.organizationUnitId, moment(data.TargetDate),
        moment(data.TargetDate), null, 'SelfSchedule').subscribe((coverage: ICoverage) => {
          const defaultActivity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
          const preferences = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
          let preferedCoverage: IActivityStaffingPlanCoverage[] = [];
          if (this.allAvailableShiftsFlag) {
            preferedCoverage = coverage.activityStaffingPlanCoverages.filter(c => c.profile.id.toString() === preferences.profiles[0].id.toString()
              && preferences.profiles[0].activities.some(activity => activity.id.toString() === c.activity.id.toString()));
          } else {
            preferedCoverage = coverage.activityStaffingPlanCoverages.filter(c => c.profile.id.toString() === preferences.profiles[0].id.toString() &&
              c.activity.id.toString() === defaultActivity.id.toString());
          }
          _.forEach(this.calendarWeeks, (calendarWeek: CalendarWeek) => {   // each week
            _.forEach(calendarWeek.days, (scheduleCalendarDay: IScheduleCalendarDay) => {  // each day
              if (scheduleCalendarDay.date && scheduleCalendarDay.date.format('YYYY-MM-DD') === moment(data.TargetDate).format('YYYY-MM-DD')) {
                scheduleCalendarDay.needCount = 0;
                let dayNeeds = 0;
                preferedCoverage.forEach(c => {
                  const day = c.days.find(d => d.needDate === scheduleCalendarDay.date.format('YYYY-MM-DD'));
                  if (day) {
                    const needCount = day.need - day.coverage;
                    dayNeeds += needCount > 0 ? needCount : 0;
                  }
                });
                scheduleCalendarDay.needCount = dayNeeds;
              }
            });
          });
          this.updateCoverageForDate(coverage, data.TargetDate);
        });
    });
  }

  private updateCoverageForDate(coverage, targetDate) {
    targetDate = moment(targetDate).format('YYYY-MM-DD');
    const storeActivityStaffingPlanCoverage: IActivityStaffingPlanCoverage[] = this.store.selectSnapshot<IActivityStaffingPlanCoverage[]>(SelfScheduleAdd.getActivityStaffingPlanCoverages);
    _.forEach(coverage.activityStaffingPlanCoverages, (activityStaffingPlanCoverage: IActivityStaffingPlanCoverage) => {
      const updatedCoverage = activityStaffingPlanCoverage.days.find(day => day.needDate === targetDate);
      const filterCoverageWithProfileandActivity = storeActivityStaffingPlanCoverage.find(p => p.profile.id.toString() === activityStaffingPlanCoverage.profile.id.toString()
        && p.activity.id.toString() === activityStaffingPlanCoverage.activity.id.toString());
      if (filterCoverageWithProfileandActivity) {
        const actualCoverage = filterCoverageWithProfileandActivity.days.find(day => day.needDate === targetDate);
        actualCoverage.need = updatedCoverage.need;
        actualCoverage.coverage = updatedCoverage.coverage;
      }
    });
    this.store.dispatch(new SetActivityStaffingPlanCoverages(storeActivityStaffingPlanCoverage));
    this.store.dispatch(new SetQualifiedCoverage(storeActivityStaffingPlanCoverage));
  }

  populateSchedulePeriodDropdown() {
    this.schedulePeriods = this.store.selectSnapshot<Array<SchedulePeriod>>(SelfScheduleState.getSchedulePeriods);
    if (this.schedulePeriods.length > 0) {
      const employeeSchedulePeriod = this.schedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling');
      this.selfSchedulePeriods = [];
      employeeSchedulePeriod.map((item, index) => {
        const formattedDate = this.dateFormatter.toMonthDay(item.start)
          + ' - ' + this.dateFormatter.toMonthDay(item.end);
        const selfScheduledropDownItem = {
          label: formattedDate,
          value: index,
          selfScheduleStatus: item.selfScheduleStatus
        };
        this.selfSchedulePeriods.push(selfScheduledropDownItem);
      });
      if (!this.schedulePeriodsIndex) {
        this.selectedDropDownValue = this.selfSchedulePeriods.find(item => item.selfScheduleStatus === GroupSelfScheduledPeriodMode.Exist);
        if (!this.selectedDropDownValue) {
          this.selectedDropDownValue = this.selfSchedulePeriods.find(item => item.selfScheduleStatus === GroupSelfScheduledPeriodMode.Opens);
        }
        this.schedulePeriodsIndex = this.selectedDropDownValue.value;
      }
      this.groupSelfScheduleStatus = this.schedulePeriods[this.schedulePeriodsIndex].selfScheduleStatus;
      this.schedulePeriod = this.schedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling')[this.schedulePeriodsIndex];
      this.store.dispatch(new SetSelfSchedulePeriod(this.schedulePeriod));
    }
  }

  onChangeSchedulePeriod(event) {
    this.qualifiedProfiles = undefined;
    this.coverage = undefined;
    this.schedulePeriodsIndex = event.value;
    this.schedulePeriod = this.schedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling')[this.schedulePeriodsIndex];
    this.store.dispatch(new SetSelfSchedulePeriod(this.schedulePeriod));
    this.deregisterSignalrListener();
    this.registerSignalr();
    this.groupSelfScheduleStatus = this.schedulePeriods[this.schedulePeriodsIndex].selfScheduleStatus;
    if (this.groupSelfScheduleStatus === GroupSelfScheduledPeriodMode.Exist) {
      this.IsSelectedSelfScheduleExits.emit(true);
      this.getCoverageSchedulesAndQualifiedProfiles();
    } else {
      this.IsSelectedSelfScheduleExits.emit(false);
    }
  }

  showHideExceptions() {
    this.toggleExceptionFlag = !this.toggleExceptionFlag;
  }

  getEmployeeScheduleExceptions() {
    this.employeeSdkService.getEmployeeScheduleExceptions(this.employeeCode, this.schedulePeriod.start, this.schedulePeriod.end).subscribe(
      (response: IEmployeeScheduleExceptionResponse) => {
        this.employeeScheduleExceptions = response.issueTypeExceptions;
        this.employeeScheduleExceptionCount = response.totalCount;
        this.changeDetectorRef.detectChanges();
      },
      (error: Error) => {
        this.failedToLoadData = true;
      }
    );
  }
  getIssueTypeCount(issueType) {
    return issueType.key + ' (' + issueType.value.count + ')';
  }
  isNewLineRequired(key, value, i) {
    return key !== 'count' ? i < Object.keys(value).length - 2 ? true : false : false;
  }
  getFormattedMonths(key: string, value: IEmployeeSchedulException[]) {
    const dateRange: string[] = [];
    const dates: string[] = [];
    let previousString = '';
    if (key !== 'count') {
      value.forEach((exception: any, index: number) => {
        const startDateMonthDay = this.dateFormatter.toMonthDay(moment(exception.startDate));
        const endDateMonthDay = this.dateFormatter.toMonthDay(moment(exception.endDate));
        const startDateShortMonth = this.dateFormatter.toShortMonth(moment(exception.startDate));
        const startDateDayOfMonth = this.dateFormatter.toDayOfMonth(moment(exception.startDate));
        const str = moment(exception.startDate).diff(moment(exception.endDate), 'days')
          ? this.addDateRanges(dateRange, previousString, startDateMonthDay, endDateMonthDay)
          : this.addDates(dates, previousString, startDateShortMonth, startDateDayOfMonth, index);
        previousString = str;
      }
      );
    }
    return dateRange.join('').concat(dates.join(', ')).toString();
  }
  addDateRanges(dateRange: string[], previousString: string, startDateMonthDay: string, endDateMonthDay: string) {
    const formattedDateRange = previousString.split('-').length > 1
      ? `<span class='date-range'>${startDateMonthDay} - ${endDateMonthDay}</span>`
      : `<span class='date-range'>${startDateMonthDay} - ${endDateMonthDay}</span>`;
    dateRange.push(formattedDateRange);
    return formattedDateRange;
  }
  defaultOrder(a: KeyValue<string, []>, b: KeyValue<string, []>) {
    return 0;
  }
  addDates(dates: string[], previousString: string, startDateShortMonth: string, startDateDayOfMonth: string, index: number) {
    const formattedDates = previousString.split('-').length > 1 || index === 0
      ? `${startDateShortMonth} ${startDateDayOfMonth}`
      : startDateDayOfMonth;
    dates.push(formattedDates);
    return formattedDates;
  }

  loadCalenderWeeks(): void {
    this.schedulePeriod = this.schedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling')[this.schedulePeriodsIndex];
    this.groupSelfScheduleStatus = this.schedulePeriods[this.schedulePeriodsIndex].selfScheduleStatus;
    if (this.schedulePeriod) {
      this.getEmployeeScheduleExceptions();
      this.updateOnlyNeeds();
    }
  }

  getCoverageSchedulesAndQualifiedProfiles() {
    const initialWeeks = this.employeeCalendarDisplayService.initWeeks(this.schedulePeriod);
    const activityStaffingCoverage = this.organizationSdkService.getActivityStaffingCoverage(this.organizationUnitId,
      this.schedulePeriod.start, this.schedulePeriod.end, null, 'SelfSchedule'); // To get the Activity Staffing Coverage
    const schedulesByCode = this.employeeCalendarDisplayService.getSchedulesByCode(this.employeeCode, initialWeeks, 'SelfScheduling'); // To get the schedules
    const qualifiedProfiles = this.employeeOrganizationSdkService.getSelfScheduleEmployeeProfiles(this.employeeCode, this.organizationUnitId, this.schedulePeriod.start, this.schedulePeriod.end);
    const join = forkJoin([activityStaffingCoverage, schedulesByCode, qualifiedProfiles]);
    join.subscribe(result => this.processData(result));
  }

  getCoverageSchedules() {
    const initialWeeks = this.employeeCalendarDisplayService.initWeeks(this.schedulePeriod);
    const activityStaffingCoverage = this.organizationSdkService.getActivityStaffingCoverage(this.organizationUnitId,
      this.schedulePeriod.start, this.schedulePeriod.end, null, 'SelfSchedule'); // To get the Activity Staffing Coverage
    const schedulesByCode = this.employeeCalendarDisplayService.getSchedulesByCode(this.employeeCode, initialWeeks, 'SelfScheduling'); // To get the schedules
    const join = forkJoin([activityStaffingCoverage, schedulesByCode]);
    join.subscribe(result => this.processData(result));
  }

  processData(result) {
    if (result[2]) {
      this.qualifiedProfiles = result[2];
      this.store.dispatch(new SetQualifiedProfiles(this.qualifiedProfiles));
    }
    this.calendarWeeks = result[1];
    this.CommitmentShifts = result[1];
    this.coverage = result[0];
    const qualifiedCoverage = this.coverage.activityStaffingPlanCoverages.filter(c => this.qualifiedProfiles.some(profile => profile.id === c.profile.id));

    if (!this.isSelfScheduleExist) {
      this.calendarWeeks.forEach(c => {
        c.days.forEach(day => {
          if (day.events && day.events.length > 0 && day.events.some(event => event.source === 'SelfScheduled')) {
            this.isSelfScheduleExist = true;
            return;
          }
        });
      });
    }
    const preferences = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
    const selectedActvity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
    this.coverage.activityStaffingPlanCoverages = qualifiedCoverage;
    this.store.dispatch(new SetQualifiedCoverage(qualifiedCoverage));
    this.store.dispatch(new SetActivityStaffingPlanCoverages(qualifiedCoverage));
    this.store.dispatch(new SetSelectedDate(this.calendarWeeks[0].days[0]));
    const isPreferenceMatched = this.isPreferenceMatched();
    if (isPreferenceMatched) {
      if (!selectedActvity) {
        const defaultActivity = this.coverage.activityStaffingPlanCoverages.find(c => c.profile.id.toString() === preferences.profiles[0].id.toString() &&
          c.activity.id.toString() === preferences.profiles[0].activities[0].id.toString());
        this.store.dispatch(new SetSelectedActivity(defaultActivity.activity));
      }
    } else {
      this.store.dispatch(new SetPreferenceModal(!isPreferenceMatched));
    }
    this.loadCalenderWeeks();
  }

  selectDay = (day: IScheduleCalendarDay, flag: boolean = true) => {
    this.defaultActivity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);
    this.selectedDay = day;
    this.store.dispatch(new SetSelectedDate(this.selectedDay));
    if (flag) {
      if (day && day.needCount !== 0) {
        const isSelfSchedule = _.some(day.events, (event) => {
          return event.source === 'SelfScheduled' || (event.activity && event.activity.id.toString() === this.defaultActivity.id.toString());
        });
        if (!isSelfSchedule) {
          this.isLoading = true;
          const activityStaffingPlanCoverages = this.store.selectSnapshot<IActivityStaffingPlanCoverage[]>(SelfScheduleAdd.getActivityStaffingPlanCoverages);
          const preferredActivity = _.filter(activityStaffingPlanCoverages, (r) => r.profile.id.toString() === this.preferenceProfileId.toString() &&
            r.activity.id.toString() === this.defaultActivity.id.toString());
          this.setTime(preferredActivity[0].activity.startTime);
          this.formModel = {
            startDate: this.startDate,  // selected date
            hasStartTime: true, // activty start time
            hours: preferredActivity[0].activity.hours, // acitivity hours
            amount: 0,
            payCode: null,
            jobClass: this.loggedInEmployee.employment.profession.jobClass,
            facility: this.loggedInEmployee.employment.location.facility,
            department: this.loggedInEmployee.employment.location.department,
            unit: this.loggedInEmployee.employment.location.unit ? this.loggedInEmployee.employment.location.unit : null,
            lunchHours: preferredActivity[0].activity.lunchHours, // activity lunch hours
            activity: preferredActivity[0].activity, // activity id
            profile: preferredActivity[0].profile,   // profile id
            position: this.loggedInEmployee.employment.profession.position,
            etag: this.selectedDay.etag,
            source: 9
          };
          this.saveActivity();
        }
      }
    }
  }

  saveActivity(overrideValidation: boolean = false): void {
    this.scheduleSdkService.saveSchedule(this.employeeCode, this.formModel, overrideValidation).subscribe(
      r => {
        this.getCoverageSchedules();
        this.isLoading = false;
        if (!this.isSelfScheduleExist) {
          this.successModal.open();
        }
      },
      error => {
        this.isLoading = false;
        if (error.error.errorCode === 'INSUFFICIENT_NEEDS') {
          this.addShiftCoverage =  this.coverage.activityStaffingPlanCoverages.find(c => c.profile.id.toString() === this.formModel.profile.id.toString()
            && c.activity.id.toString() === this.formModel.activity.id.toString());
          this.needsModal.open();
        } else {
          this.handleError(error);
        }
      });
  }

  addShift(currentShift) {
    if (currentShift && currentShift.shift && currentShift.profile) {
      const activity = currentShift.shift;
      this.selectedDay = currentShift.currentDate;
      this.isLoading = true;
      const activityStaffingPlanCoverages = this.store.selectSnapshot<IActivityStaffingPlanCoverage[]>(SelfScheduleAdd.getActivityStaffingPlanCoverages);
      const preferredProfile = _.filter(activityStaffingPlanCoverages, (r) => r.profile.id.toString() === this.preferenceProfileId.toString());
      this.setTime(activity.startTime);

      const formModel = {
        startDate: this.startDate,  // selected date
        hasStartTime: true, // activty start time
        hours: activity.hours, // acitivity hours
        amount: 0,
        payCode: null,
        jobClass: this.loggedInEmployee.employment.profession.jobClass,
        facility: this.loggedInEmployee.employment.location.facility,
        department: this.loggedInEmployee.employment.location.department,
        unit: this.loggedInEmployee.employment.location.unit ? this.loggedInEmployee.employment.location.unit : null,
        lunchHours: activity.lunchHours, // activity lunch hours
        activity: activity, // activity id
        profile: currentShift.profile,   // profile id
        position: this.loggedInEmployee.employment.profession.position,
        etag: this.selectedDay.etag,
        source: 9
      };

      this.formModel = formModel;
      this.saveActivity();
      const shift: IShift = {
        shift: null,
        currentDate: null,
        profile: null
      };
      this.store.dispatch(new SetShift(shift));
    }
  }

  public openApprovalModal(): void {
    this.validationModal.open();
  }

  setTime(newValue: string): void {
    if (newValue) {
      const timeArray = newValue.split(':');
      let hours;
      let minutes;
      if (timeArray.length === 1) {
        if (timeArray[0].length > 2) {
          hours = timeArray[0].substr(0, timeArray[0].length - 2);
          minutes = timeArray[0].substr(timeArray[0].length - 2, 2);
        } else {
          hours = timeArray[0];
          minutes = 0;
        }
      } else {
        hours = timeArray[0];
        minutes = timeArray[1];
      }
      this.startDate = moment.tz(this.dateFormatter.format(this.selectedDay.date, 'YYYY-MM-DDT12:00:00'), this.loggedInEmployee.employment.location.timeZoneId);
      this.startDate.hours(hours);
      this.startDate.minutes(minutes);
    }
  }

  close() {
    this.addShiftCoverage = undefined;
    this.successModal.close();
    this.needsModal.close();
  }

  private handleValidationErrors(errorInfo): IScheduleValidationWarning {
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

  private handleError(error: any): void {
    this.scheduleValidationWarnings = this.handleValidationErrors(error.error);
    this.openApprovalModal();
  }

  isPreferenceMatched(): boolean {
    const preferences = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
    const filteredCoverage = this.coverage.activityStaffingPlanCoverages.filter(c => c.profile.id.toString() === preferences.profiles[0].id.toString() &&
      preferences.profiles[0].activities.some(activity => activity.id.toString() === c.activity.id.toString()));

    return Math.abs(filteredCoverage.length - preferences.profiles[0].activities.length) > 0 ? false : true;
  }

  updateOnlyNeeds() {
    const calendarWeeks = this.calendarWeeks;
    const preferences = this.store.selectSnapshot<PreferenceSetting>(SelfScheduleState.getPreferenceSetting);
    const defaultActivity = this.store.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity);

    // Update each day's need based on the coverage need if both (calendarWeeks & coverage) date matched
    if (this.coverage && this.coverage.activityStaffingPlanCoverages.length > 0 && defaultActivity) {
      let coverage: IActivityStaffingPlanCoverage[] = [];
      if (this.allAvailableShiftsFlag) {
        coverage = this.coverage.activityStaffingPlanCoverages.filter(c => c.profile.id.toString() === preferences.profiles[0].id.toString()
          && preferences.profiles[0].activities.some(activity => activity.id.toString() === c.activity.id.toString()));
      } else {
        coverage = this.coverage.activityStaffingPlanCoverages.filter(c => c.profile.id.toString() === preferences.profiles[0].id.toString() &&
          c.activity.id.toString() === defaultActivity.id.toString());
      }
      _.forEach(calendarWeeks, (calendarWeek: CalendarWeek) => {   // each week
        _.forEach(calendarWeek.days, (scheduleCalendarDay: IScheduleCalendarDay) => {  // each day
          scheduleCalendarDay.needCount = 0;
          let dayNeeds = 0;
          coverage.forEach(c => {
            const day = c.days.find(d => d.needDate === scheduleCalendarDay.date.format('YYYY-MM-DD'));
            if (day) {
              const needCount = day.need - day.coverage;
              dayNeeds += needCount > 0 ? needCount : 0;
            }
          });
          scheduleCalendarDay.needCount = dayNeeds;
          if (this.selectedDay) {
            if ((scheduleCalendarDay.date).isSame(this.selectedDay.date) || (scheduleCalendarDay.date).isSame(this.schedulePeriod.start)) {
              this.store.dispatch(new SetSelectedDate(scheduleCalendarDay));
            }
          }
        });
      });
    } else {
      _.forEach(calendarWeeks, (calendarWeek: CalendarWeek) => {   // each week
        _.forEach(calendarWeek.days, (scheduleCalendarDay: IScheduleCalendarDay) => { // each day
          scheduleCalendarDay.needCount = 0;
          if (scheduleCalendarDay.date.isSame(this.schedulePeriod.start)) {
            this.store.dispatch(new SetSelectedDate(scheduleCalendarDay));
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.deregisterSignalrListener();
  }
}