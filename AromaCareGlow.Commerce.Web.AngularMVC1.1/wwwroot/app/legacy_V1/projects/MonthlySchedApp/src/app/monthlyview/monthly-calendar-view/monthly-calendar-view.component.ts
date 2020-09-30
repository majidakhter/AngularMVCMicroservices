import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DateFormatter } from '../../../../../../src/app/shared/date-formats/date-formatter';
import { CommonService } from '../../../../../../src/app/common-service/common.service';
import { ISelectedDay } from '../../../../../../src/app/common-service/model/ISelectedDay';
import * as _ from 'lodash';
import { ModalButton, ModalComponent } from '@wfm/modal';
import { DailyFormMode, IDailyScheduleMode } from '../../../../../../src/app/common-service/model/IDailyScheduleMode';
import { ISchedule } from '../../../../../../src/app/time-management-domain/schedule';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent, CalendarMonthViewComponent, CalendarMonthViewDay } from 'angular-calendar';
import { IOpenShift } from 'src/app/time-management-sdk/employee-schedule-sdk/open-shift-response';
import { EventTypes } from 'src/app/time-management-domain/event-types';
import { ViewPeriod } from 'calendar-utils';
import { IEventData } from './event-data';
import { EventDisplayType, MapEventFn } from '@api-wfm/ng-sympl-ux';
import { Select, Store } from '@ngxs/store';
import { SetSelectedDate } from '../../store/schedule/actions/schedule.actions';
import { ScheduleState } from 'projects/MonthlyViewApp/src/app/store/schedule/states/schedule.state';
import { CalendarEventsState } from '../../store/calendar-events/state/calendar-events.state';
import { RefreshCalendarData } from '../../store/calendar-events/actions/calendar-events.actions';
import { EventDetailsSetup } from '../event-details-setup.service';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { IToastOptions, ToastOptions } from 'src/app/shared/toast/models/wfm-toast-options.model';
import { MessageSeverity } from 'src/app/shared/toast/models/wfm-message-severity';
import { ToastService } from 'src/app/shared/toast/toast';
import { ToastEvents } from 'src/app/shared/toast/models/wfm-toast-events';
import { map, mergeMap } from 'rxjs/operators';
import { SelfSchedulePeriodDetailsResponse } from 'src/app/time-management-sdk/employee-schedule-sdk/self-schedule-period-details-response';
import { NavigationService } from 'src/app/time-management-sdk/navigationServices/navigation.service';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';

@Component({
  selector: 'wf-monthly-calendar-view',
  templateUrl: './monthly-calendar-view.component.html',
  styleUrls: ['./monthly-calendar-view.component.scss']
})

@AutoUnsubscribe()
export class MonthlyCalendarViewComponent implements OnInit, OnDestroy {
  @ViewChild(CalendarMonthViewComponent) calendar: CalendarMonthViewComponent;
  @ViewChild(ModalComponent) modal: ModalComponent;
  @ViewChild('openSelfScheduleModal') openSelfScheduleModal: ModalComponent;

  public title: string;
  public view = 'month';
  public viewDate: Moment = moment();
  public calendarEvents: CalendarEvent<IEventData>[] = [];
  public openShifts: IOpenShift[] = [];
  public selectedDate: CalendarMonthViewDay;
  private tempSelectedDay: CalendarMonthViewDay;
  public monthLoaded = false;
  public eTag: string;
  public showOpenShifts = false;
  public canViewShifts = false;
  public subscribeToSchedulesAndOpenShifts: Subscription;
  public summaryDisplay: EventDisplayType = EventDisplayType.Summary;
  public mapEvent: MapEventFn<IEventData>;
  public schedulePeriodSubscription: Subscription;
  public employeeSubscription: Subscription;
  public buttons: ModalButton[];
  organizationUnitId: string;
  schedulePeriods: Array<SchedulePeriod>;
  monthsCount = 18;
  selfScheduleRange: string[];

  employeeCode: string;
  organizationDetail: any;

  urlToSelfSchedule: string;
  selfSchedulePreferenceSubcription: Subscription;
  selectedPreferenceSetting: PreferenceSetting;
  @Select(CalendarEventsState.getOpenShifts) openShifts$: Observable<IOpenShift[]>;
  @Select(CalendarEventsState.getSchedules) scheduleEvents$: Observable<IEventData[]>;

  constructor(
    private dateFormatter: DateFormatter,
    private commonService: CommonService,
    private translate: TranslateService,
    private store: Store,
    private eventDetailsSetup: EventDetailsSetup,
    private employeeScheduleSdkService: EmployeeScheduleSdkService,
    private toastService: ToastService,
    private employeeSdkService: EmployeeSdkService,
    private navigationService: NavigationService
  ) {
    this.mapEvent = this.eventDetailsSetup.mapEvent;
  }

  public ngOnInit(): void {
    this.openShifts$.subscribe(openShifts => {
      this.canViewShifts = true;
      this.openShifts = openShifts;
    });

    this.scheduleEvents$.subscribe(events => {
      this.onSelectedDateChanged(this.selectedDate);
      this.calendarEvents = events.map(event =>
        ({
          title: event.schedule.activity ? event.schedule.activity.code : event.schedule.payCode.code,
          start: moment(this.dateFormatter.toIsoDate(event.schedule.startDate)).toDate(),
          meta: event
        })
      );
      if (events.length !== 0) {
        this.eTag = events[0].schedule.etag;
      }
    });

    this.commonService.getUnsavedOption().subscribe((unsaved: boolean) => {
      if (unsaved) {
        this.onSelectedDateChanged(this.tempSelectedDay);
      } else {
        this.onSelectedDateChanged(this.selectedDate);
      }
    });

    const start = moment().startOf('day');
    const end = moment().add(this.monthsCount, 'months').endOf('day');
    this.employeeCode = this.store.selectSnapshot<string>(AuthState.getEmployeeCode);

    this.employeeSdkService.getEmployee(this.employeeCode).pipe(map(res => {
      this.organizationDetail = res.employment.location.unit || res.employment.location.department || res.employment.location.facility;
      this.organizationUnitId = this.organizationDetail.id;
    }), mergeMap(a => this.employeeScheduleSdkService.getSchedulePeriods(this.organizationUnitId, start, end))).subscribe(schedulePeriodsResult => {
      this.showOpenSelfSchedulesNotification(schedulePeriodsResult);
    });
  }

  public onDayClicked(day: CalendarMonthViewDay): void {
    const mode = this.store.selectSnapshot<IDailyScheduleMode>(ScheduleState.getDailyScheduleMode).currentMode;
    const view = DailyFormMode.View;
    if (mode !== view) {
      this.tempSelectedDay = day;
      this.modal.open();
    } else {
      this.onSelectedDateChanged(day);
    }
  }

  public getAvailableOpenShifts(date: Date): IOpenShift[] {
    return this.store.selectSnapshot(CalendarEventsState.getAvailableOpenShifts)(moment(date));
  }

  public onSelectedDateChanged(selectedDate: CalendarMonthViewDay): void {
    if (!selectedDate) {
      return;
    }

    const selectedDay: ISelectedDay = {
      date: moment(selectedDate.date),
      etag: this.eTag,
      showOpenShifts: this.showOpenShifts
    };

    this.store.dispatch(new SetSelectedDate(selectedDay));

    if (this.selectedDate) {
      delete this.selectedDate.cssClass;
    }
    selectedDate.cssClass = 'selected-day';
    this.selectedDate = selectedDate;
  }

  public beforeMonthViewRender({ body, period }: { body: CalendarMonthViewDay[], period: ViewPeriod }): void {
    if (this.selectedDate) {
      const selectedDay = body.find(day => moment(day.date).isSame(this.selectedDate.date, 'day'));
      if (selectedDay) {
        this.onSelectedDateChanged(selectedDay);
      }
    } else {
      const today = body.find(day => day.isToday);
      if (today) {
        this.onSelectedDateChanged(today);
      }
    }
    if (!this.monthLoaded) {
      this.openShifts = [];
      this.monthLoaded = true;
      this.store.dispatch(new RefreshCalendarData({ dates: [moment(period.start), moment(period.end)], refreshShifts: true }));
    }
  }

  public showOpenShiftChange(event): void {
    const selectedDay: ISelectedDay = {
      date: moment(this.selectedDate.date),
      etag: this.eTag,
      showOpenShifts: event.currentTarget.checked
    };
    this.store.dispatch(new SetSelectedDate(selectedDay));
  }

  public getTooltipContent(event: CalendarEvent<IEventData>): string {
    let empContent = '';
    const toolTipContent = [];
    const scheduleData = (event.meta.schedule) as ISchedule;
    const totalHours = scheduleData.hours;
    const range = this.translate.instant('calendar-page.event-time-span', {
      start: this.dateFormatter.to24HourTime(scheduleData.startDate),
      end: this.dateFormatter.to24HourTime(scheduleData.endDate),
      hours: totalHours ? totalHours : 0
    });

    if (event.meta.eventType === EventTypes.PAYCODE) {
      toolTipContent.push(scheduleData.payCode.name);
      toolTipContent.push(range);
    } else {
      toolTipContent.push(scheduleData.profile.name);
      toolTipContent.push(range);
      toolTipContent.push(scheduleData.facility.code);
      toolTipContent.push(scheduleData.department.code);
    }
    toolTipContent.forEach((str) => {
      empContent += '<span>' + str + '</span><br>';
    });
    return '<div>' + empContent + '</div>';
  }

  public openPopup() {
    this.title = this.translate.instant('monthly-calendar-view.openSelfSchedule-title');
    this.openSelfScheduleModal.quickClose = true;
    this.buttons = [
      new ModalButton(
        () => this.translate.instant('button.later'),
        close => {
          close();
        },
        () => true,
        'secondary-button'
      ),
      new ModalButton(
        () => this.translate.instant('button.self-schedule-now'),
        navigate => {
          top['Root']().NavigateTo(this.urlToSelfSchedule);
        },
        () => true,
        'priority-button'
      )
    ];
    this.openSelfScheduleModal.title = this.title;
    this.openSelfScheduleModal.buttons = this.buttons;
    this.openSelfScheduleModal.open();
  }

  private showOpenSelfSchedulesNotification(schedulePeriods: Array<SchedulePeriod>) {
    if (schedulePeriods && schedulePeriods.length > 0) {
      this.schedulePeriods = schedulePeriods.filter(schedulePeriod => schedulePeriod.status === 'Self Scheduling');
      this.employeeSdkService.getAuthorization(this.employeeCode).subscribe((result) => {
        if (this.schedulePeriods.length > 0 && result.selfScheduleAccess.canRead) {
          this.navigationService.getSelfScheduleNavigationUrl().subscribe(selfScheduleUrl => {
            this.urlToSelfSchedule = selfScheduleUrl;
            const schedulePeriodDetailCalls = [];
            _.map(this.schedulePeriods, (schedulePeriod) => {
              schedulePeriodDetailCalls.push(this.employeeScheduleSdkService.getSelfSchedulePeriodDetails(this.employeeCode, this.organizationUnitId, schedulePeriod.start));
            });
            forkJoin(schedulePeriodDetailCalls).subscribe((selfSchedulePeriodDetails: SelfSchedulePeriodDetailsResponse[]) => {
              let showModal = false;
              let selfScheduleRange = _.map(selfSchedulePeriodDetails, (selfSchedulePeriodDetail, index) => {
                if (selfSchedulePeriodDetail.canSelfSchedule && (selfSchedulePeriodDetail.accessPeriodStartDate === null ||
                  selfSchedulePeriodDetail.accessPeriodStartDate <= moment().format('YYYY-MM-DD'))) {
                  showModal = true;
                  const schedulePeriod = this.schedulePeriods[index];
                  schedulePeriod.selfScheduleStart = selfSchedulePeriodDetail.accessPeriodStartDate == null ? schedulePeriod.selfScheduleStart : moment(selfSchedulePeriodDetail.accessPeriodStartDate);
                  schedulePeriod.selfScheduleEnd = selfSchedulePeriodDetail.accessPeriodEndDate == null ? schedulePeriod.selfScheduleEnd : moment(selfSchedulePeriodDetail.accessPeriodEndDate);

                  return this.translate.instant('monthly-calendar-view.self-schedule-period', {
                    start: this.dateFormatter.toMonthDay(schedulePeriod.start),
                    end: this.dateFormatter.toMonthDay(schedulePeriod.end),
                    remaining: schedulePeriod.selfScheduleEnd.diff(moment().startOf('day'), 'days'),
                    orgDetails: this.organizationDetail.name
                  });
                }
              });
              if (showModal) {
                this.showModal();
              }
              selfScheduleRange = _.remove(selfScheduleRange, undefined);
              this.selfScheduleRange = selfScheduleRange;
              if (selfScheduleRange.length > 0) {
                const selfScheduleMessage = new ToastOptions(
                  MessageSeverity.INFORMATION,
                  this.translate.instant('monthly-calendar-view.openSelfSchedule'),
                  selfScheduleRange
                );
                this.showToast(selfScheduleMessage);
              }
            });
          });
        }
      });
    }
  }

  private showToast(selfScheduleMessage: IToastOptions) {
    this.toastService.activate(ToastEvents.SHOW_DISMISSIBLE_TOAST, selfScheduleMessage, null, true, this.urlToSelfSchedule);
  }

  private showModal() {
    this.selfSchedulePreferenceSubcription = this.employeeSdkService.getSelfSchedulePreference(this.employeeCode).subscribe((res: PreferenceSetting) => {
      const selectedPreferenceSetting = new PreferenceSetting();
      selectedPreferenceSetting.organizationEntityId = res.organizationEntityId;
      const profiles = [];
      if (res.profiles.length > 0) {
        const profile = {
          id: res.profiles[0].id,
          activities: res.profiles[0].activities
        };
        profiles.push(profile);
      }
      selectedPreferenceSetting.profiles = profiles;
      selectedPreferenceSetting.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      res.viewedSelfSchedulePeriods.forEach((x) => {
        selectedPreferenceSetting.viewedSelfSchedulePeriods.push(new SelfSchedulePeriod(x.startDate, x.endDate));
      });
      const openSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      this.schedulePeriods.forEach((schedulePeriod) => {
        openSelfSchedulePeriods.push(new SelfSchedulePeriod(this.dateFormatter.toUrlDate(schedulePeriod.start), this.dateFormatter.toUrlDate(schedulePeriod.end)));
      });
      const newlyOpenedSelfSchedulePeriods = _.differenceWith(openSelfSchedulePeriods, selectedPreferenceSetting.viewedSelfSchedulePeriods, _.isEqual);
      if (newlyOpenedSelfSchedulePeriods.length > 0) {
        this.openPopup();
        selectedPreferenceSetting.viewedSelfSchedulePeriods = openSelfSchedulePeriods;
        this.employeeSdkService.updatePreferenceSetting(this.employeeCode, selectedPreferenceSetting);
      }
    });
  }

  /* istanbul ignore next */
  ngOnDestroy(): void {
    this.employeeSubscription.unsubscribe();
    this.schedulePeriodSubscription.unsubscribe();
  }
}
