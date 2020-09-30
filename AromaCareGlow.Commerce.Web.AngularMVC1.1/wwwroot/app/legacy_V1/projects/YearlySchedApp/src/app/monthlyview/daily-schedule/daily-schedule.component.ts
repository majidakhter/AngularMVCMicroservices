
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { ModalComponent, ModalButton } from '@wfm/modal';
import { CalendarEvent } from 'angular-calendar';
import * as _ from 'lodash';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ScheduleState } from 'projects/MonthlyViewApp/src/app/store/schedule/states/schedule.state';
import { forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { IActivity } from 'src/app/time-management-domain/activity';
import { ILocation } from 'src/app/time-management-domain/location';
import { IProfile } from 'src/app/time-management-domain/profile';
import { IScheduleDetailed, ScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { CommonService } from '../../../../../../src/app/common-service/common.service';
import { DailyFormMode, IDailyScheduleMode } from '../../../../../../src/app/common-service/model/IDailyScheduleMode';
import { ISelectedDay } from '../../../../../../src/app/common-service/model/ISelectedDay';
import { SearchListComponent } from '../../../../../../src/app/shared/auto-complete/search-list.component';
import { DateFormats } from '../../../../../../src/app/shared/date-formats/date-formats';
import { DateFormatter } from '../../../../../../src/app/shared/date-formats/date-formatter';
import { MessageSeverity } from '../../../../../../src/app/shared/toast/models/wfm-message-severity';
import { ToastEvents } from '../../../../../../src/app/shared/toast/models/wfm-toast-events';
import { ToastOptions } from '../../../../../../src/app/shared/toast/models/wfm-toast-options.model';
import { ToastService } from '../../../../../../src/app/shared/toast/toast.service';
import { ErrorValidationWarnings } from '../../../../../../src/app/shared/validation-warnings/models/error-validation-warnings';
import { ScheduleValidationMessage } from '../../../../../../src/app/shared/validation-warnings/models/schedule-validation-message';
import { IEmployeeAuthorization } from '../../../../../../src/app/time-management-domain/authorization-access';
import { Employee } from '../../../../../../src/app/time-management-domain/employee';
import { EventTypes } from '../../../../../../src/app/time-management-domain/event-types';
import { IIdentifier } from '../../../../../../src/app/time-management-domain/identifier';
import { LevelHierarchy, OrganizationLevel } from '../../../../../../src/app/time-management-domain/level-hierarchy';
import { IDepartment, IFacility } from '../../../../../../src/app/time-management-domain/org-unit';
import { IPayCode, IPayCodeWithPermissionConfiguration, IPayCodeConfiguration } from '../../../../../../src/app/time-management-domain/pay-code';
import { PayPeriod } from '../../../../../../src/app/time-management-domain/pay-period';
import { IPosition } from '../../../../../../src/app/time-management-domain/position';
import { EmployeeOrganizationSdkService } from '../../../../../../src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { IOpenShift } from '../../../../../../src/app/time-management-sdk/employee-schedule-sdk/open-shift-response';
import { EmployeeSdkService, ScheduleValueValidationMessages } from '../../../../../../src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { OrganizationSdkService } from '../../../../../../src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { ScheduleSdkService } from '../../../../../../src/app/time-management-sdk/schedule-sdk/schedule-sdk.service';
import { RefreshCalendarData, DeleteCalendarData } from '../../store/calendar-events/actions/calendar-events.actions';
import { CalendarEventsState, IDeleteData } from '../../store/calendar-events/state/calendar-events.state';
import { SetDailyScheduleMode } from '../../store/schedule/actions/schedule.actions';
import { SetEmployee, SetSelectedDate } from '../../store/trade/actions/trade.actions';
import { TradeState } from '../../store/trade/states/trade.state';
import { IEventData } from '../monthly-calendar-view/event-data';
import { ISchedule, Schedule } from '../../../../../../src/app/time-management-domain/schedule';
import { AppSdkService } from 'src/app/time-management-sdk/app-sdk/app-sdk.service';
import { AppFeatures } from 'src/app/time-management-sdk/app-sdk/app.features';
import { IQuickCode } from 'src/app/time-management-domain/quick-code';
import { IScheduleValidationWarning } from 'src/app/shared/schedule-override-validation/model/schedule-validation-warning';
import { ScheduleTradeParticipant } from 'src/app/time-management-domain/schedule-trade/schedule-trade-participant.enum';

@Component({
  selector: 'wf-daily-schedule-details',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
@AutoUnsubscribe()
export class DailyScheduleComponent implements OnInit, OnDestroy {

  @ViewChild('facilityComponent') facilityComponent: SearchListComponent;
  @ViewChild('departmentComponent') departmentComponent: SearchListComponent;
  @ViewChild('unitComponent') unitComponent: SearchListComponent;
  @ViewChild('positionComponent') positionComponent: SearchListComponent;
  @ViewChild('activityComponent') activityComponent: SearchListComponent;
  @ViewChild('jobClassComponent') jobClassComponent: SearchListComponent;
  @ViewChild('profileComponent') profileComponent: SearchListComponent;
  @ViewChild('quickcodeComponent') quickcodeComponent: SearchListComponent;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild('deleteModal') deleteModal: ModalComponent;
  scheduleValidationWarnings: IScheduleValidationWarning;

  @Input() dateFormat: string;
  @Input() dateValue: Date = new Date();
  @Input() minDateValue: Date = new Date(0);
  @Input() maxDateValue: Date;
  @Output() dateChanged: EventEmitter<any> = new EventEmitter<Date>();

  public inputPattern = '^((0*)(?:[0-9]|1[0-9]|2[0-3])?(?:\.\d{1,})?|0*24(?:\.0+)?)$';

  public buttons: ModalButton[];
  public title: string;
  public employeeCode: string;
  dateFormatDisplay: string;
  employee: Employee;
  showAddActivityForm = false;
  showAddActivityBtn = false;
  showPayCodeBtn = false;
  selectedDate: any; /* this variable can take single date or array of date,
  Singal date for activity and Array of date for Add paycode  */
  isActivitySelected: boolean;
  selectedTime = new Date();
  currentMode: DailyFormMode = DailyFormMode.View;
  levelHierarchy: LevelHierarchy;
  formModel: IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
  dailyFormMode = DailyFormMode;
  positionDisabled: boolean;
  activityDisabled: boolean;
  jobclassDisabled: boolean;
  hourFormat = '24';
  timeFormat = 'HH:mm';
  submitting = false;
  selectedDay: ISelectedDay;
  selectedFacility: IFacility;
  selectedDepartment: IDepartment;
  schedules: IEventData[];
  selectedSchedule: CalendarEvent<IEventData>;
  openShifts: IOpenShift[] = [];
  selectedDayForSummary: Moment;
  openShiftCount: number;
  scheduledActivityCount: number;
  requestedActivityCount: number;
  requestorTradeCount: number;
  acceptorTradeCount: number;
  payCodeCount: number;
  authorization: IEmployeeAuthorization;
  hoursInputDisabled = false;
  amountInputDisabled = false;
  submitPaycode = '';
  showRequestedReason = false;
  selectedMultipleDates: Array<Date>;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  startDates: Array<Moment> = [];
  currentPayPeriodSubscription: Subscription;
  scrollDisplay = false;
  selectedActivity: IActivity;
  isExtraShift: boolean;
  showQuickCode = false;
  selectedDaySubscription: Subscription;
  selectedQuickCode: string;
  effectiveDate: Moment;
  effectiveEndDate: Moment;
  @Select(ScheduleState.getSelectedDay) selectedDay$: Observable<ISelectedDay>;
  dailySelectedModeSubscription: Subscription;
  @Select(ScheduleState.getDailyScheduleMode) dailySelectedMode$: Observable<IDailyScheduleMode>;
  // fetches selected schedule from store (Edit Activity / Edit Paycode)
  @Select(ScheduleState.getSelectedSchedule) selectedSchedule$: Observable<IEventData>;
  selectedPayCodeIndicatorConfig: IPayCodeConfiguration;
  constructor(
    public organizationSdkService: OrganizationSdkService,
    public employeeSdkService: EmployeeSdkService,
    public employeeOrganizationSdkService: EmployeeOrganizationSdkService,
    private dateFormatter: DateFormatter,
    private scheduleSdkService: ScheduleSdkService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private appSdkService: AppSdkService,
    private dateFormats: DateFormats,
    private dsRef: ChangeDetectorRef,
    private store: Store) {
  }

  ngOnInit() {
    this.employeeCode = this.store.selectSnapshot<string>(AuthState.getEmployeeCode);
    this.store.dispatch(new SetDailyScheduleMode({ currentMode: this.currentMode }));
    this.dailySelectedModeSubscription = this.dailySelectedMode$.subscribe((dailyScheduleMode: IDailyScheduleMode) => {
      this.currentMode = dailyScheduleMode.currentMode;
    });

    this.appSdkService.getFeatures().subscribe((res: AppFeatures) => {
      this.isExtraShift = res.isExtraShiftEnabled;
    });
    if (this.employeeCode) {
      this.getEmployeeAccess();
      this.organizationSdkService.getOrgLevels().subscribe((res) => {
        this.levelHierarchy = new LevelHierarchy();
        this.levelHierarchy.trunk = res.trunk;
        this.levelHierarchy.leaf = res.leaf;
        this.levelHierarchy.branch = res.branch;
      });
    }

    this.employeeSdkService.getEmployee(this.employeeCode)
      .subscribe(res => {
        this.employee = res;
        this.store.dispatch(new SetEmployee(res)); // To store the Employee information
      });

    if (!this.dateFormat) {
      this.dateFormat = moment.localeData().longDateFormat(this.dateFormats.DATE_SHORT);
    }
    this.dateFormatDisplay = this.dateFormat.toLowerCase().replace('yyyy', 'yy');
    this.selectedDaySubscription = this.selectedDay$.subscribe((day: ISelectedDay) => {
      if (day) {
        this.selectedDay = day;
        this.schedules = this.store.selectSnapshot(CalendarEventsState.getSchedulesByDate)(moment(day.date));
        this.openShifts = day.showOpenShifts ? this.store.selectSnapshot(CalendarEventsState.getAvailableOpenShifts)(moment(day.date)) : null;
        this.openShiftCount = day.showOpenShifts ? this.openShifts.length : null;
        this.selectedDayForSummary = day.date;
        this.scheduledActivityCount = this.schedules.filter(schedule => schedule.eventType === EventTypes.ACTIVITY && schedule.schedule.status !== 'Requested'
          && !(schedule.schedule.isTradeRequested)).length;
        this.requestedActivityCount = this.schedules.filter(schedule => schedule.eventType === EventTypes.ACTIVITY && schedule.schedule.status === ('Requested')).length;
        this.requestorTradeCount = this.schedules.filter(schedule => schedule.eventType === EventTypes.ACTIVITY
          && schedule.schedule.scheduleTradeParticipant === ScheduleTradeParticipant.REQUESTOR).length;
        this.acceptorTradeCount = this.schedules.filter(schedule => schedule.eventType === EventTypes.ACTIVITY
          && schedule.schedule.scheduleTradeParticipant === ScheduleTradeParticipant.ACCEPTOR).length;
        this.payCodeCount = this.schedules.filter(schedule => schedule.eventType === EventTypes.PAYCODE).length;
        if (day.date < moment(this.minDateValue)) {
          this.showAddActivityBtn = false;
          this.showPayCodeBtn = false;
        } else if (this.authorization) {
          this.showAddActivityBtn = this.authorization.activity.canCreate;
          this.showPayCodeBtn = this.authorization.payCode.canCreate;
        }
      }
      const dailyScheduleMode = this.store.selectSnapshot<IDailyScheduleMode>(ScheduleState.getDailyScheduleMode);
      const navigatedDate = this.store.selectSnapshot<Moment>(TradeState.getNavigatedDate);
      if (this.selectedDay && !(navigatedDate || dailyScheduleMode.currentMode === DailyFormMode.ViewTradeDetails)) {
        this.store.dispatch(new SetSelectedDate(moment(this.dateFormatter.toShortDate(moment(this.selectedDay.date)))));
      }
    });

    this.commonService.getUnsavedOption().subscribe((unsaved: boolean) => {
      if (unsaved && this.currentMode !== DailyFormMode.View) {
        this.closeForm();
      }
    });

    this.currentPayPeriodSubscription = this.getCurrentPayPeriod().subscribe((payPeriod: PayPeriod) => {
      if (payPeriod) {
        this.minDateValue = moment(payPeriod.beginDate).add(-1, 'd').startOf('day').toDate();
      }
    });
  }

  public openApprovalModal(): void {
    this.modal.open();
  }

  private getEmployeeAccess() {
    this.showAddActivityBtn = false;
    this.showPayCodeBtn = false;
    this.employeeSdkService.getAuthorization(this.employeeCode).subscribe((result) => {
      this.authorization = result;
      if (result.activity.canCreate) {
        this.showAddActivityBtn = true;
      }
      if (result.payCode.canCreate) {
        this.showPayCodeBtn = true;
      }
    },
      () => {
        this.showAddActivityBtn = false;
      });
  }

  closeForm() {
    // Replacing permission config with indicator config from temp variable while closing.
    this.selectedSchedule$.subscribe((selectedSchedule: IEventData) => {
      if (selectedSchedule && selectedSchedule.schedule && selectedSchedule.schedule.payCode && this.selectedPayCodeIndicatorConfig) {
        selectedSchedule.schedule.payCode.configuration = this.selectedPayCodeIndicatorConfig;
      }
    });
    this.ngUnsubscribe.next();
    this.formModel = null;
    this.showAddActivityForm = false;
    this.showAddActivityBtn = this.authorization.activity.canCreate;
    this.showPayCodeBtn = this.authorization.payCode.canCreate;
    this.switchMode(DailyFormMode.View);
  }

  private switchMode(mode: DailyFormMode): void {
    this.currentMode = mode;
    const dailyScheduleMode = { currentMode: this.currentMode };
    this.store.dispatch(new SetDailyScheduleMode(dailyScheduleMode));
  }

  addEvent(isActivity: boolean): void {
    this.showAddActivityBtn = false;
    this.isActivitySelected = isActivity;
    this.currentMode = isActivity ? DailyFormMode.EditActivity : DailyFormMode.EditPaycode;
    const dailyScheduleMode = { currentMode: this.currentMode };
    this.store.dispatch(new SetDailyScheduleMode(dailyScheduleMode));
    if (isActivity) {
      this.showAddActivityForm = true;
    }
    this.formModel = new ScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>();
    this.formModel.hasStartTime = true;
    this.formModel.isExtraShift = false;
    this.formModel.etag = this.store.selectSnapshot<string>(CalendarEventsState.getEtagForSchedules);
    this.formModel.facility = {
      id: this.employee.employment.location.facility.id.toString(),
      code: this.employee.employment.location.facility.code,
      number: this.employee.employment.location.facility.number.toString(),
      name: this.employee.employment.location.facility.name,
      timeZoneId: this.employee.employment.location.timeZoneId,
      status: null
    };
    this.formModel.department = {
      id: this.employee.employment.location.department.id.toString(),
      code: this.employee.employment.location.department.code,
      number: this.employee.employment.location.department.number.toString(),
      name: this.employee.employment.location.department.name,
      status: null
    };
    this.formModel.unit =
      this.employee.employment.location.unit ?
        {
          id: this.employee.employment.location.unit.id.toString(),
          code: this.employee.employment.location.unit.code,
          number: this.employee.employment.location.unit.number.toString(),
          name: this.employee.employment.location.unit.name,
          status: null
        } : null;
    this.formModel.jobClass = {
      id: this.employee.employment.profession.jobClass.id.toString(),
      code: this.employee.employment.profession.jobClass.code,
      number: this.employee.employment.profession.jobClass.number ? this.employee.employment.profession.jobClass.number.toString() : null,
      name: this.employee.employment.profession.jobClass.name,
      status: null
    };
    this.formModel.startDate = moment.tz(this.dateFormatter.format(this.selectedDay.date, 'YYYY-MM-DDT12:00:00'), this.formModel.facility.timeZoneId);
    this.selectedDate = new Date(this.selectedDay.date.year(), this.selectedDay.date.month(), this.selectedDay.date.date(), 12, 0);
    this.setDate(this.formModel.startDate);
    this.selectedFacility = this.formModel.facility;
    this.selectedDepartment = this.formModel.department;
    this.formModel.position = this.employee.employment.profession.position ? this.employee.employment.profession.position : null;
    if (isActivity) {
      this.getProfiles().subscribe((profiles) => {
        this.formModel.profile = _.first(profiles);
      });
      this.getActivities().subscribe((activities) => {
        this.activityDisabled = !activities.length;
      });
    }

    if ((this.currentMode === DailyFormMode.EditPaycode) && (this.employee.code) && (this.formModel.startDate)) {
      this.getPayCodes().subscribe((payCodes) => {
        const canCreate = _.find(payCodes, payCode => payCode.configuration.canCreate === true);
        const canCreateRequest = _.find(payCodes, payCode => payCode.configuration.canCreateRequest === true);
        if (canCreate) {
          this.submitPaycode = this.translateService.instant('button.save');
        } else if (canCreateRequest) {
          this.submitPaycode = this.translateService.instant('button.submit');
        }
      });
    }
    if (!isActivity) {
      this.checkIfQuickCodeExits();
    }
  }

  togglePosAndActivityState = (): void => {
    this.positionDisabled = !this.formModel.position && !this.getOrgFromLevel(this.levelHierarchy.positionLevel);
    this.activityDisabled = !this.formModel.activity && !this.getOrgFromLevel(this.levelHierarchy.activityLevel);
    if (this.jobClassComponent) {
      this.jobclassDisabled = !this.formModel.jobClass && !this.getOrgFromLevel(this.levelHierarchy.positionLevel);
    }
  }

  getOrgFromLevel = (level: OrganizationLevel): IIdentifier => {
    switch (level) {
      case (OrganizationLevel.Facility):
        return this.formModel.facility;
      case (OrganizationLevel.Department):
        return this.formModel.department;
      case (OrganizationLevel.Unit):
        return this.formModel.unit;
      default:
        return undefined;
    }
  }

  hasAuthorizedPayCode(activity: IActivity, payCodes: IPayCode[]): boolean {
    if (!activity.payCode) {
      return true;
    }
    return _.find(payCodes, (payCode: IPayCode) => payCode.code === activity.payCode.code);
  }

  getFacilities = (): Observable<any> => {
    return this.employeeSdkService.getFacilities(
      this.employee.code,
      this.currentMode === DailyFormMode.EditActivity ? EmployeeSdkService.Constraints.ForActivity : EmployeeSdkService.Constraints.ForCalendar
    ).map((facilities) => {
      return facilities.facilities;
    });
  }

  getDepartments = (): Observable<any> => {
    return this.employeeSdkService.getDepartments(
      this.employee.code,
      this.formModel.facility,
      this.currentMode === DailyFormMode.EditActivity ? EmployeeSdkService.Constraints.ForActivity : EmployeeSdkService.Constraints.ForCalendar
    );
  }

  getUnits = (): Observable<any> => {
    return this.employeeSdkService.getUnits(
      this.employee.code,
      this.formModel.department,
      this.currentMode === DailyFormMode.EditActivity ? EmployeeSdkService.Constraints.ForActivity : EmployeeSdkService.Constraints.ForCalendar
    );
  }

  getPositions = (): Observable<any> => {
    const baseUnit = this.getOrgFromLevel(this.levelHierarchy.positionLevel);
    if (baseUnit) {
      return this.employeeOrganizationSdkService.getEmployeePositions(
        this.employee.code,
        baseUnit.id,
        this.currentMode === DailyFormMode.EditActivity
      );
    }
  }

  getJobClass = (): Observable<any> => {
    const baseUnit = this.getOrgFromLevel(this.levelHierarchy.positionLevel);
    if (baseUnit) {
      return this.employeeOrganizationSdkService.getEmployeeJobClasses(
        this.employee.code,
        baseUnit.id
      );
    }
  }

  getProfiles = (): Observable<IProfile[]> => {
    const baseUnit = this.getOrgFromLevel(this.levelHierarchy.positionLevel); // Profiles are based on Positions
    if (baseUnit) {
      return this.employeeOrganizationSdkService.getEmployeeProfiles(
        this.employee.code,
        baseUnit.id,
        this.formModel.position as IPosition
      ).pipe(takeUntil(this.ngUnsubscribe));
    }
  }

  getActivities = (): Observable<IActivity[]> => {
    const baseUnit = this.getOrgFromLevel(this.levelHierarchy.activityLevel);
    if (baseUnit != null) {
      return this.getOrganizationActivities(baseUnit.id);
    }
    return of([]);
  }

  getAuthorizedActivityPayCodes = (): Observable<IPayCodeWithPermissionConfiguration[]> => {
    const baseUnit = this.getOrgFromLevel(this.levelHierarchy.payCodeLevel);
    if (baseUnit != null) {
      return this.employeeOrganizationSdkService.getEmployeePayCodes(
        this.employee.code,
        baseUnit.id
      );
    }
    return of([]);
  }

  getOrganizationActivities = (orgUnitId: string): Observable<IActivity[]> => {
    return forkJoin(this.getAuthorizedActivityPayCodes(), this.employeeOrganizationSdkService.getEmployeeActivities(this.employee.code, orgUnitId))
      .map((arr: [IPayCode[], IActivity[]]) => {
        const payCodes: IPayCode[] = arr[0];
        const activities: IActivity[] = arr[1];
        const result = _.filter(activities, (activity: IActivity) => this.hasAuthorizedPayCode(activity, payCodes));
        return result;
      });
  }
  getPayCodes = (): Observable<IPayCodeWithPermissionConfiguration[]> => {
    return this.employeeSdkService.getPayCodes(
      this.employee.code,
      this.formModel.startDate
    ).map((payCodes) => {
      return _.filter(payCodes, (payCode: IPayCodeWithPermissionConfiguration) => payCode.configuration.canCreate || payCode.configuration.canCreateRequest);
    });
  }

  getCurrentPayPeriod = (): Observable<PayPeriod> => {
    return this.employeeSdkService.getCurrentPayPeriod(
      this.employeeCode
    ).map((payPeriod) => {
      return payPeriod;
    });
  }

  onFacilityChanged(fac): void {
    if ((fac != null && this.selectedFacility !== null) && (fac.name === this.selectedFacility.name)) {
      this.togglePosAndActivityState();
      return;
    }
    this.formModel.department = null;
    this.departmentComponent.unfilteredItems = undefined;
    this.formModel.unit = null;
    this.unitComponent.unfilteredItems = undefined;
    this.formModel.position = null;
    this.positionComponent.unfilteredItems = undefined;
    this.formModel.jobClass = null;
    if (this.jobClassComponent) {
      this.jobClassComponent.unfilteredItems = undefined;
    }
    this.formModel.profile = null;
    this.formModel.activity = null;
    if (this.currentMode === DailyFormMode.EditActivity) {
      this.activityComponent.unfilteredItems = undefined;
    }
    this.togglePosAndActivityState();
  }

  onDepartmentChanged(dept): void {
    if ((dept != null && this.selectedDepartment !== null) && (dept.name === this.selectedDepartment.name)) {
      this.togglePosAndActivityState();
      return;
    }
    this.formModel.unit = null;
    this.unitComponent.unfilteredItems = undefined;

    if (this.levelHierarchy.positionLevel >= OrganizationLevel.Department) {
      this.formModel.position = null;
      this.positionComponent.unfilteredItems = undefined;
    }
    if (this.levelHierarchy.activityLevel >= OrganizationLevel.Department) {
      this.formModel.activity = null;
      if (this.currentMode === DailyFormMode.EditActivity) {
        this.activityComponent.unfilteredItems = undefined;
      }
    }
    this.formModel.profile = null;
    this.formModel.jobClass = null;
    this.togglePosAndActivityState();
  }

  onUnitChanged(): void {
    if (this.levelHierarchy.activityLevel >= OrganizationLevel.Unit) {
      this.formModel.activity = null;
      if (this.currentMode === DailyFormMode.EditActivity) {
        this.activityComponent.unfilteredItems = undefined;
      }
    }

    if (this.levelHierarchy.positionLevel >= OrganizationLevel.Unit) {
      this.formModel.position = null;
      this.formModel.profile = null;
      this.formModel.jobClass = null;
      this.positionComponent.unfilteredItems = undefined;
    }

    this.togglePosAndActivityState();
  }

  onPositionChanged(pos): void {
    if (this.formModel.department === null) {
      return;
    }
    this.formModel.jobClass = null;
    this.formModel.profile = null;
    if (this.formModel.position && this.currentMode === DailyFormMode.EditActivity) {
      this.profileComponent.unfilteredItems = undefined;
      this.getProfiles().subscribe((profiles) => {
        this.assignProfileValues(profiles);
      });
    }
    if (pos && this.currentMode === DailyFormMode.EditPaycode) {
      this.formModel.jobClass = pos.jobClass;
    }
  }
  onJobClassChanged(): void {
    this.formModel.position = null;
  }

  assignProfileValues(profiles) {
    this.formModel.profile = this.formModel.profile == null ? _.first(profiles) : this.formModel.profile;
  }

  onActivityChanged(): void {
    if ((!this.formModel.guid && (this.formModel.activity != null)) || ((this.formModel.activity != null) && this.selectedActivity !== this.formModel.activity)) {
      this.setTime(this.formModel.activity.startTime);
      this.formModel.hours = this.formModel.activity.hours;
      this.formModel.lunchHours = this.formModel.activity.lunchHours;
    } else if (!this.formModel.activity) {
      this.setTimes(12, 0);
      this.formModel.hours = null;
      this.formModel.lunchHours = null;
    }
  }

  setTimes(hours: number, minutes: number): void {
    const d = this.formModel.startDate;
    d.hours(hours);
    d.minutes(minutes);
    this.selectedDate = new Date(d.year(), d.month(), d.date(), d.hours(), d.minutes());
    this.formModel.hasStartTime = true;
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
      this.setTimes(hours, minutes);
    }
  }

  onTimeChange(newValue: Date): void {
    const time = moment.parseZone(newValue);
    this.setTimes(time.hours(), time.minutes());
    this.updateDates();
  }

  setDate(newValue: any): void {
    this.startDates = [];
    if (!Array.isArray(newValue)) { /*An array is for paycode */
      if (newValue) {
        const date = moment.tz(this.dateFormatter.toIsoDate(moment(newValue)), this.formModel.facility.timeZoneId);
        this.formModel.startDate.year(date.year());
        this.formModel.startDate.month(date.month());
        this.formModel.startDate.date(date.date());
        this.effectiveDate = date;
        this.effectiveEndDate = null;
        if (this.quickcodeComponent !== undefined && this.formModel.startDate !== newValue) {
          this.quickcodeComponent.unfilteredItems = undefined;
        }
      } else {
        this.selectedDate = new Date(this.selectedDay.date.year(), this.selectedDay.date.month(), this.selectedDay.date.date(), 12, 0);
      }
      this.startDates.push(newValue);
    } else {
      const dates = _.map(newValue, (date) => {
        date = moment(date);
        return moment.tz(this.dateFormatter.format(date, 'YYYY-MM-DDT12:00:00'), this.formModel.facility.timeZoneId);
      });
      this.startDates = dates;
      this.getMutipleDatesSort();
      if (this.quickcodeComponent !== undefined) {
        this.quickcodeComponent.unfilteredItems = undefined;
      }
      this.updateDates();
    }
  }

  getMutipleDatesSort() {
    const groupDatesByMonth = _.groupBy(_.sortBy(this.startDates, (e) => {
      return e;
    }), (el: any) => {
      return moment.tz(this.dateFormatter.format(el, 'MMM'), this.formModel.facility.timeZoneId);
    });
    const selectedDates = _.map(groupDatesByMonth, (dates: Array<string>) => {
      const selectedDate = _.map(dates, (date) => {
        date = moment(date);
        return moment.tz(this.dateFormatter.format(date, 'YYYY-MM-DDT12:00:00'), this.formModel.facility.timeZoneId);
      });
      return selectedDate;
    });
    const multipleSelect = selectedDates[0];
    if (this.startDates.length !== 0) {
      this.effectiveDate = multipleSelect[0];
      this.effectiveEndDate = multipleSelect[multipleSelect.length - 1];
    }
  }

  private updateDates(): void {
    const time = moment.parseZone(moment(this.selectedDate));
    this.startDates.forEach(eachDate => {
      eachDate.hours(time.hours());
      eachDate.minutes(time.minutes());
    });
  }

  private handleValidationErrors(errorInfo): IScheduleValidationWarning {
    if (errorInfo && (errorInfo.errorCode === 'VALIDATION_MESSAGES_EXIST')) {
      const exceptions = new ErrorValidationWarnings(
        errorInfo.content.validationMessages,
        errorInfo.content.overridable
      );

      return { errorCode: errorInfo.errorCode, validationException: exceptions, override: errorInfo.content.overridable, otherExceptions: false } as IScheduleValidationWarning;
    } else {
      const msg = new ScheduleValidationMessage('', this.translateService.instant(`errors.${errorInfo.errorCode}`), '0');
      const exceptions = new ErrorValidationWarnings(
        [msg],
        false);
      return { errorCode: errorInfo.errorCode, validationException: exceptions, override: false, otherExceptions: true };
    }
  }

  onSubmit(overrideValidation: boolean = false): void {

    if ((this.currentMode === DailyFormMode.EditActivity) ||
      (this.currentMode === DailyFormMode.EditPaycode && this.formModel.guid)
    ) {
      this.saveSchedule(overrideValidation);
    } else {
      this.savePayCode();
    }
  }

  private saveSchedule(overrideValidation: boolean = false): void {
    // Changing start date according to facility's time zone
    this.formModel.startDate = moment(this.formModel.startDate).tz(this.formModel.facility.timeZoneId, true);
    this.scheduleSdkService.saveSchedule(this.employee.code, this.formModel, overrideValidation).subscribe(
      r => {
        const refreshData = {
          dates: [moment(this.formModel.startDate).tz(this.formModel.facility.timeZoneId, true)],
          refreshShifts: false
        };
        this.store.dispatch(new RefreshCalendarData(refreshData));
        const successMessage = new ToastOptions(
          MessageSeverity.SUCCESS,
          this.translateService.instant('dailySchedule.successTitle'),
          this.translateService.instant('dailySchedule.successMessage')
        );
        this.toastService.activate(ToastEvents.SHOW_AUTO_DISMISS_TOAST, successMessage);
        this.closeForm();
      },
      error => {
        this.handleError(error);
      });
  }

  private savePayCode(): void {
    // Changing startDates corresponding to timezone Id to record shifts time on UI.
    this.startDates = this.startDates.map(startDate => moment(startDate).tz(this.formModel.facility.timeZoneId, true));
    this.scheduleSdkService.savePayCode(this.employee.code, this.formModel, this.startDates).subscribe(
      r => {
        const refreshData = {
          dates: this.startDates,
          refreshShifts: false
        };
        this.store.dispatch(new RefreshCalendarData(refreshData));
        const successMessage = new ToastOptions(
          MessageSeverity.SUCCESS,
          this.translateService.instant('dailySchedule.successTitle'),
          this.translateService.instant('dailySchedule.successMessage')
        );
        this.toastService.activate(ToastEvents.SHOW_AUTO_DISMISS_TOAST, successMessage);
        this.closeForm();
      },
      error => {
        this.handleError(error);
      });
  }

  private handleError(error: any): void {
    this.scheduleValidationWarnings = this.handleValidationErrors(error.error);
    this.openApprovalModal();
  }

  public onTradeSummaryClose() {
    this.selectedSchedule = null;
  }

  onPayCodeChanged(selectedPaycode): void {
    this.setInputAccessibilityForHoursAndAmount();
    this.dsRef.detectChanges();
    this.showRequestedReason = false;
    if (selectedPaycode != null && selectedPaycode.configuration != null) {
      if ((selectedPaycode.configuration.canCreate && !this.formModel.guid) ||
        (selectedPaycode.configuration.canEdit && this.formModel.guid)) {
        this.submitPaycode = this.translateService.instant('button.save');
        this.showRequestedReason = false;
      } else {
        this.submitPaycode = this.translateService.instant('button.submit');
        this.showRequestedReason = true;
      }
    }
  }

  setInputAccessibilityForHoursAndAmount(): void {
    if (this.formModel.payCode && this.formModel.payCode.configuration) {
      const disable = this.formModel.payCode.configuration.scheduleValueValidation;
      this.hoursInputDisabled = disable === ScheduleValueValidationMessages.Amount;
      this.amountInputDisabled = disable === ScheduleValueValidationMessages.Hours;
    }
  }

  popoverScroll(status: boolean): void {
    this.scrollDisplay = status;
  }

  // Prepopulates selected activity or paycode details in the form
  editEvent(): void {
    this.selectedSchedule$.subscribe((selectedSchedule: any) => {
      // Storing indicator config on temp variable before change into permission config
      this.selectedPayCodeIndicatorConfig = null;
      if (selectedSchedule && selectedSchedule.schedule && selectedSchedule.schedule.payCode && selectedSchedule.schedule.payCode.configuration) {
        this.selectedPayCodeIndicatorConfig = selectedSchedule.schedule.payCode.configuration;
      }
      const schedule = ScheduleDetailed.fromJsonWithIndicatorConfigruation(selectedSchedule.schedule);
      this.formModel = Object.assign(new ScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>(), schedule);
      this.formModel.startDate = this.formModel.startDate.clone();
      const mode = this.formModel.isActivity ? this.dailyFormMode.EditActivity : this.dailyFormMode.EditPaycode;
      this.setTimes(this.formModel.startDate.hours(), this.formModel.startDate.minutes());
      this.selectedFacility = this.formModel.facility;
      this.selectedDepartment = this.formModel.department;
      this.selectedActivity = this.formModel.activity;
      this.isActivitySelected = true;
      this.switchMode(mode);
      this.displayScheduleActions();
      this.getPaycodeActions();
      this.effectiveDate = this.formModel.startDate;
      this.effectiveEndDate = null;
      this.checkIfQuickCodeExits();
    });
  }
  displayScheduleActions() {
    if (this.formModel.activity) {
      this.formModel.payCode = null;
      this.getActivities().subscribe((activities) => {
        this.activityDisabled = !activities.length;
      });
      this.showPayCodeBtn = false;
      this.showAddActivityBtn = true;
      this.showAddActivityForm = true;
    } else {
      this.showPayCodeBtn = true;
      this.showAddActivityBtn = false;
    }

  }
  getPaycodeActions() {
    if ((this.currentMode === DailyFormMode.EditPaycode) && (this.employee.code) && (this.formModel.startDate)) {
      this.getPayCodes().subscribe((payCodes) => {
        const paycode = payCodes.find((paycodeObj: any) => paycodeObj.id === this.formModel.payCode.id);
        if (paycode) {
          this.formModel.payCode.configuration = paycode.configuration;
        }
        this.onPayCodeChanged(this.formModel.payCode);
      });
    }

  }
  convertToPayCode(guid: string): void {
    const tempDate = this.formModel.startDate;
    const tempHours = this.formModel.hours;
    this.addEvent(false);
    this.setTimes(tempDate.hours(), tempDate.minutes());
    this.formModel.guid = guid;
    this.formModel.hours = tempHours;
    this.isActivitySelected = true;

  }

  // function to call delete confirmation pop-up
  confirmDelete() {
    this.title = this.translateService.instant('dailySchedule.confirm-delete-title');
    this.buttons = [
      new ModalButton(
        () => this.translateService.instant('button.cancel'),
        close => {
          close();
        },
        () => true,
        'secondary-button'
      ),
      new ModalButton(
        () => this.translateService.instant('button.delete'),
        close => {
          this.deleteSchedule();
          close();
        },
        () => true,
        'priority-button'
      )
    ];
    this.deleteModal.title = this.title;
    this.deleteModal.buttons = this.buttons;
    this.deleteModal.open();
  }

  // function to delete selected Schedule
  private deleteSchedule(): void {
    this.scheduleSdkService.deleteSchedule(this.formModel).subscribe((res) => {
      const deleteSchedule: IDeleteData = {
        guid: this.formModel.guid
      };
      this.store.dispatch(new DeleteCalendarData(deleteSchedule));
      this.closeForm();
    },
      error => {
        this.handleError(error);
      });
  }

  getQuickCodes = (): Observable<any> => {
    return this.employeeSdkService.getQuickCode(
      this.employeeCode,
      this.effectiveDate,
      this.effectiveEndDate
    ).map((quickCodes) => {
      return quickCodes;
    });
  }

  onQuickcodeChanged(event) {
    if ((event != null && this.selectedQuickCode !== null) && (event.code !== this.selectedQuickCode)) {
      if (event.location != null) {
        this.formModel.department = {
          id: event.location.department.id.toString(),
          code: event.location.department.code,
          number: event.location.department.number.toString(),
          name: event.location.department.name,
          status: null
        };
        this.formModel.facility = {
          id: event.location.facility.id.toString(),
          code: event.location.facility.code,
          number: event.location.facility.number.toString(),
          name: event.location.facility.name,
          timeZoneId: event.location.timeZoneId,
          status: null
        };
        this.formModel.unit =
          event.location.unit ?
            {
              id: event.location.unit.id.toString(),
              code: event.location.unit.code,
              number: event.location.unit.number.toString(),
              name: event.location.unit.name,
              status: null
            } : null;
      }

      if (event.positionID) {
        this.formModel.position = this.formModel.position;
        this.formModel.jobClass = this.formModel.jobClass;
      } else {
        this.formModel.position = event.position ? event.position : null;
        this.formModel.jobClass = event.jobClass ? event.jobClass : null;
      }
    }
  }

  checkIfQuickCodeExits() {
    this.getQuickCodes().subscribe((quickCodes: IQuickCode[]) => {
      this.showQuickCode = quickCodes.length === 0 ? false : true;
    });
  }

  /* istanbul ignore next */
  ngOnDestroy(): void { }
}
