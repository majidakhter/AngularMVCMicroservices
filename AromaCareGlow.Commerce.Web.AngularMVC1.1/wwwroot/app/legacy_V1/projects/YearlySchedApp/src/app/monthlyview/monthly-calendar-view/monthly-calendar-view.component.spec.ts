import { MonthlyCalendarViewComponent } from './monthly-calendar-view.component';
import * as moment from 'moment';
import { DateFormatter } from '../../../../../../src/app/shared/date-formats/date-formatter';
import { DateFormats } from '../../../../../../src/app/shared/date-formats/date-formats';
import { EventEmitter } from '@angular/core';
import { DailyFormMode } from '../../../../../../src/app/common-service/model/IDailyScheduleMode';
import { CommonService } from '../../../../../../src/app/common-service/common.service';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { ModalButton, ModalComponent } from '@wfm/modal';
import { fakeAsync, tick } from '@angular/core/testing';
import { IOpenShift } from 'src/app/time-management-sdk/employee-schedule-sdk/open-shift-response';
import { IEventData } from './event-data';
import { EventTypes } from 'src/app/time-management-domain/event-types';
import { Store } from '@ngxs/store';
import { RefreshCalendarData } from '../../store/calendar-events/actions/calendar-events.actions';
import { ViewPeriod } from 'calendar-utils';
import { CalendarEventsState } from 'projects/MonthlyViewApp/src/app/store/calendar-events/state/calendar-events.state';
import { SetSelectedDate } from '../../store/schedule/actions/schedule.actions';
import { EventDetailsSetup } from '../event-details-setup.service';
import { IScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { IActivityWithConfig } from 'src/app/time-management-domain/activity';
import { IPayCodeWithIndicatorConfiguration } from 'src/app/time-management-domain/pay-code';
import { ILocationWithConfig } from 'src/app/time-management-domain/location';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { ToastService } from 'src/app/shared/toast/toast';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { Employee } from 'src/app/time-management-domain/employee';
import { IEmployment } from 'src/app/time-management-domain/employment';
import { of } from 'rxjs';
import { NavigationService } from 'src/app/time-management-sdk/navigationServices/navigation.service';
import { IEmployeeAuthorization } from 'src/app/time-management-domain/authorization-access';
import { SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';

describe('MonthlyCalendarViewComponent', () => {
  let component: MonthlyCalendarViewComponent;

  const baseEvents: IEventData[] = [
    {
      eventType: EventTypes.ACTIVITY,
      isTradeable: false,
      schedule: {
        startDate: moment('12-12-2019'),
        endDate: moment('12-12-2019'),
        guid: '123',
        activity: { code: 'activity1' },
        etag: '1337'
      } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>
    },
    {
      eventType: EventTypes.PAYCODE,
      isTradeable: false,
      schedule: {
        startDate: moment('12-12-2019'),
        endDate: moment('12-12-2019'),
        guid: '234',
        payCode: { code: 'paycode1' },
        etag: '1337'
      } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>
    },
    {
      eventType: EventTypes.ACTIVITY,
      isTradeable: false,
      schedule: {
        startDate: moment('12-12-2019'),
        endDate: moment('12-12-2019'),
        guid: '345',
        activity: { code: 'activity2' },
        etag: '1337'
      } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>
    }
  ];

  const events: CalendarEvent<IEventData>[] = [
    {
      title: 'one',
      start: moment('12-12-2019').toDate(),
      meta: baseEvents[0]
    },
    {
      title: 'two',
      start: moment('12-12-2019').toDate(),
      meta: baseEvents[1]
    },
    {
      title: 'three',
      start: moment('12-12-2019').toDate(),
      meta: baseEvents[2]
    }
  ];

  const openShifts: IOpenShift[] = [
    {
      start: moment('12-12-2019'),
      end: moment('12-12-2019')
    } as IOpenShift,
    {
      start: moment('12-13-2019'),
      end: moment('12-13-2019')
    } as IOpenShift,
    {
      start: moment('12-13-2019'),
      end: moment('12-13-2019')
    } as IOpenShift,
    {
      start: moment('12-14-2019'),
      end: moment('12-14-2019')
    } as IOpenShift
  ];

  const days = [
    {
      date: moment('12-12-2019').toDate(),
      isToday: true
    } as CalendarMonthViewDay,
    {
      date: moment('12-13-2019').toDate(),
      isToday: false
    } as CalendarMonthViewDay
  ];

  const expectedSelfScheduleUrl = 'https://test/EmployeeLoad.aspx?redirect=EmployeeSelfSchedule2.aspx';

  const expectedResultAuthorization: IEmployeeAuthorization = {
    payCode: {
      canCreate: true,
      canRead: false,
      canUpdate: false,
      canDelete: false
    },
    activity: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true
    },
    selfScheduleAccess: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true
    }
  };

  function getSchedulePeriods() {
    const startDate = moment().startOf('day');
    const endDate = moment(startDate).add(2, 'weeks').endOf('day');

    const schedulePeriods = [
      { start: moment(startDate).add(2, 'weeks').endOf('day'), end: moment(startDate).add(4, 'weeks').endOf('day'), selfScheduleStart: startDate, selfScheduleEnd: endDate, status: 'Self Scheduling' },
      { start: moment(startDate).add(4, 'weeks').endOf('day'), end: moment(startDate).add(6, 'weeks').endOf('day'), selfScheduleStart: startDate, selfScheduleEnd: endDate, status: 'Self Scheduling' },
      { start: moment(startDate).add(8, 'weeks').endOf('day'), end: moment(startDate).add(10, 'weeks').endOf('day'), selfScheduleStart: startDate, selfScheduleEnd: endDate, status: 'Manual' }
    ];
    return schedulePeriods;
  }

  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockModal: jasmine.SpyObj<ModalComponent>;
  let invokeGetOpenShifts: EventEmitter<IOpenShift[]>;
  let invokeGetSchedules: EventEmitter<IEventData[]>;
  let onUnsavedOption: EventEmitter<boolean>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockEventSetup: jasmine.SpyObj<EventDetailsSetup>;
  let mockEmployeeScheduleSdk: jasmine.SpyObj<EmployeeScheduleSdkService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockEmployeeSdkService: jasmine.SpyObj<EmployeeSdkService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(() => {
    mockCommonService = jasmine.createSpyObj('CommonService', ['setUnsavedOption', 'getUnsavedOption']);
    onUnsavedOption = new EventEmitter<boolean>();
    mockCommonService.getUnsavedOption.and.returnValue(onUnsavedOption);
    invokeGetOpenShifts = new EventEmitter<IOpenShift[]>();
    invokeGetSchedules = new EventEmitter<IEventData[]>();

    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch', 'selectSnapshot']);

    mockModal = jasmine.createSpyObj('modal', ['open']);
    mockModal.open.and.callFake(() => { });
    mockEmployeeScheduleSdk = jasmine.createSpyObj('EmployeeScheduleSdkService', ['getSchedulePeriods', 'getSelfSchedulePeriodDetails']);
    mockEventSetup = jasmine.createSpyObj('OpenShiftEventDetailsSetup', ['mapEvent']);
    mockToastService = jasmine.createSpyObj('ToastService', ['activate']);
    mockEmployeeSdkService = jasmine.createSpyObj('EmployeeSdkService', ['getEmployee', 'getAuthorization', 'getSelfSchedulePreference', 'updatePreferenceSetting']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['getNavigationSections', 'getSelfScheduleNavigationUrl']);
  });

  function createComponent(): MonthlyCalendarViewComponent {
    const componentMock = new MonthlyCalendarViewComponent(
      new DateFormatter(new DateFormats()),
      mockCommonService,
      mockTranslateService,
      mockStore,
      mockEventSetup,
      mockEmployeeScheduleSdk,
      mockToastService,
      mockEmployeeSdkService,
      mockNavigationService
    );

    componentMock.modal = mockModal;
    Object.defineProperty(componentMock, 'openShifts$', { writable: true });
    componentMock.openShifts$ = invokeGetOpenShifts.asObservable();
    Object.defineProperty(componentMock, 'scheduleEvents$', { writable: true });
    componentMock.scheduleEvents$ = invokeGetSchedules.asObservable();

    return componentMock;
  }

  describe('#beforeMonthViewRender', () => {

    beforeEach(() => {
      mockStore.dispatch.and.stub();
    });

    describe('when event is today', () => {
      beforeEach(() => {
        component = createComponent();
        component.calendarEvents = events;
        component.monthLoaded = true;
        component.selectedDate = undefined;
        component.beforeMonthViewRender({
          body: days,
          period: null
        });
      });

      it('should set selectedDate and call getSchedules', () => {
        expect(component.selectedDate).toBeDefined();
      });
    });

    describe('when event is not today', () => {
      beforeEach(() => {
        component = createComponent();
        component.calendarEvents = events;
        component.monthLoaded = true;
        component.selectedDate = undefined;
        days[0].isToday = false;
        component.beforeMonthViewRender({
          body: days,
          period: null
        });
      });

      it('should not set selectedDate and call getSchedules', () => {
        expect(component.selectedDate).toBeUndefined();
      });
    });

    describe('when selectedDay is set', () => {
      beforeEach(() => {
        component = createComponent();
        component.calendarEvents = events;
        component.monthLoaded = true;
        component.selectedDate = days[1];
        component.beforeMonthViewRender({
          body: days,
          period: null
        });
      });

      it('should retain selected day', () => {
        expect(component.selectedDate.date).toEqual(days[1].date);
      });
    });

    describe('when selectedDay is set but does not exist', () => {
      beforeEach(() => {
        component = createComponent();
        component.calendarEvents = events;
        component.monthLoaded = true;
        component.selectedDate = days[1];
        component.beforeMonthViewRender({
          body: [],
          period: null
        });
      });

      it('should retain selected day', () => {
        expect(component.selectedDate.date).toEqual(days[1].date);
      });
    });

    describe('when monthLoaded is false', () => {
      let period: ViewPeriod;
      beforeEach(() => {
        component = createComponent();
        component.calendarEvents = [];
        component.monthLoaded = false;
        component.selectedDate = days[1];
        component.openShifts = openShifts;
        period = {
          start: moment('12-12-2019').toDate(),
          end: moment('12-12-2019').toDate(),
          events: []
        };
        component.beforeMonthViewRender({
          body: [],
          period: period
        });
      });

      it('should dispatch a refresh action', () => {
        expect(mockStore.dispatch).toHaveBeenCalled();
        const refreshAction: RefreshCalendarData = mockStore.dispatch.calls.first().args[0];
        expect(refreshAction.payload).toBeDefined();
        expect(refreshAction.payload.refreshShifts).toEqual(true);
        expect(refreshAction.payload.dates.findIndex(a => a.isSame(moment(period.start)))).not.toBe(-1);
        expect(refreshAction.payload.dates.findIndex(a => a.isSame(moment(period.end)))).not.toBe(-1);
      });

      it('should clear the open shifts array', () => {
        expect(component.openShifts.length).toBe(0);
      });
    });
  });

  describe('when schedule periods with no self scheduling phase are available', () => {
    beforeEach(() => {
      component = createComponent();
      const employee: Employee = {
        id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
        employment: {
          profession: {},
          location: {
            facility: { id: '102' },
            timeZoneId: 'CST'
          }
        } as IEmployment
      };
      mockEmployeeSdkService.getEmployee.and.returnValue(of(employee));
      const startDate = moment().startOf('day');
      const endDate = moment(startDate).add(2, 'weeks').endOf('day');
      const schedulePeriodsNoSelfSchedule = [
        { start: startDate, end: endDate, dateRange: { begin: startDate, end: endDate }, status: 'Manual' },
        { start: moment(startDate).add(8, 'weeks').endOf('day'), end: moment(startDate).add(10, 'weeks').endOf('day'), status: 'Manual' }
      ];
      const selfSchedulePeriodDetails = { accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: false };
      mockEmployeeScheduleSdk.getSchedulePeriods.and.returnValue(of(schedulePeriodsNoSelfSchedule));
      mockEmployeeScheduleSdk.getSelfSchedulePeriodDetails.and.returnValue(of(selfSchedulePeriodDetails));
      mockNavigationService.getSelfScheduleNavigationUrl.and.returnValue(of(expectedSelfScheduleUrl));
      mockEmployeeSdkService.getAuthorization.and.returnValue(of(expectedResultAuthorization));
      spyOn(component, 'openPopup');
      component.ngOnInit();
    });

    it('Self schedule periods will not be available', () => {
      expect(component.schedulePeriods.length).toEqual(0);
    });
  });

  describe('Right Panel Event Subscriptions', () => {
    beforeEach(() => {
      component = createComponent();
      const employee: Employee = {
        id: 3, firstName: 'test first name', lastName: 'test last name', code: 'test code',
        employment: {
          profession: {},
          location: {
            facility: { id: '102' },
            timeZoneId: 'CST'
          }
        } as IEmployment
      };
      mockEmployeeSdkService.getEmployee.and.returnValue(of(employee));
      const schedulePeriods = getSchedulePeriods();
      const selfSchedulePeriodDetails = { accessPeriodStartDate: '2019-12-19', accessPeriodEndDate: '2019-12-14', canSelfSchedule: true };
      const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
      const viewedSelfSchedulePeriodStart = moment().startOf('day').subtract(4, 'weeks').format('YYYY-MM-DD');
      const viewedSelfSchedulePeriodEnd = moment().startOf('day').subtract(2, 'weeks').format('YYYY-MM-DD');
      viewedSelfSchedulePeriods.push(new SelfSchedulePeriod(viewedSelfSchedulePeriodStart, viewedSelfSchedulePeriodEnd));
      const schedulePreference = { organizationEntityId: '102', profiles: [], viewedSelfSchedulePeriods: viewedSelfSchedulePeriods };
      mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(schedulePreference));
      mockEmployeeScheduleSdk.getSchedulePeriods.and.returnValue(of(schedulePeriods));
      mockEmployeeScheduleSdk.getSelfSchedulePeriodDetails.and.returnValue(of(selfSchedulePeriodDetails));
      spyOn(component, 'onSelectedDateChanged').and.stub();
      mockNavigationService.getSelfScheduleNavigationUrl.and.returnValue(of(expectedSelfScheduleUrl));
      mockEmployeeSdkService.getAuthorization.and.returnValue(of(expectedResultAuthorization));
      mockTranslateService.instant.and.returnValue('Feb 16 - Mar 14 (6 days remaining) for AS03 Dpt01');
      spyOn(component, 'openPopup');
      component.ngOnInit();
      component.selectedDate = days[0];
    });

    it('total self Schedule periods will be 2', () => {
      expect(component.schedulePeriods.length).toEqual(2);
    });

    it('should call the updatePreferenceSetting service', () => {
      expect(mockEmployeeSdkService.updatePreferenceSetting).toHaveBeenCalled();
    });

    describe('when canSelfSchedule is true with access period as null', () => {
      beforeEach(() => {
        const schedulePeriod = getSchedulePeriods();
        mockEmployeeScheduleSdk.getSchedulePeriods.and.returnValue(of(schedulePeriod));
        const selfSchedulePeriodDetails = { accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: true };
        mockEmployeeScheduleSdk.getSelfSchedulePeriodDetails.and.returnValue(of(selfSchedulePeriodDetails));
        mockNavigationService.getSelfScheduleNavigationUrl.and.returnValue(of(expectedSelfScheduleUrl));
        mockEmployeeSdkService.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
        viewedSelfSchedulePeriods.push(new SelfSchedulePeriod(schedulePeriod[0].start.format('YYYY-MM-DD'), schedulePeriod[0].end.format('YYYY-MM-DD')));
        viewedSelfSchedulePeriods.push(new SelfSchedulePeriod(schedulePeriod[1].start.format('YYYY-MM-DD'), schedulePeriod[1].end.format('YYYY-MM-DD')));
        const schedulePreference = { organizationEntityId: '102', profiles: [{id: 25, activities: [{id: 10}]}], viewedSelfSchedulePeriods: viewedSelfSchedulePeriods };
        mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(schedulePreference));
        component.ngOnInit();
      });

      it('total self Schedule periods will be 2 and their status will be - Self Scheduling', () => {
        expect(component.schedulePeriods.length).toEqual(2);
        expect(component.schedulePeriods[0].status).toEqual('Self Scheduling');
      });
    });

    describe('when canSelfSchedule is false with access period as null', () => {
      beforeEach(() => {
        const schedulePeriod = getSchedulePeriods();
        mockEmployeeScheduleSdk.getSchedulePeriods.and.returnValue(of(schedulePeriod));
        const selfSchedulePeriodDetails = { accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: false };
        mockEmployeeScheduleSdk.getSelfSchedulePeriodDetails.and.returnValue(of(selfSchedulePeriodDetails));
        mockNavigationService.getSelfScheduleNavigationUrl.and.returnValue(of(expectedSelfScheduleUrl));
        mockEmployeeSdkService.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        component.ngOnInit();
      });

      it('organizationUnitId will have the data', () => {
        expect(component.schedulePeriods.length).toEqual(2);
      });
    });

    describe('when no schedule periods are available', () => {
      beforeEach(() => {
        const schedulePeriod = null;
        mockEmployeeScheduleSdk.getSchedulePeriods.and.returnValue(of(schedulePeriod));
        const selfSchedulePeriodDetails = { accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: true };
        mockEmployeeScheduleSdk.getSelfSchedulePeriodDetails.and.returnValue(of(selfSchedulePeriodDetails));
        mockNavigationService.getSelfScheduleNavigationUrl.and.returnValue(of(expectedSelfScheduleUrl));
        mockEmployeeSdkService.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        component.ngOnInit();
      });

      it('organizationUnitId will have the data', () => {
        expect(component.organizationUnitId).toEqual('102');
      });
    });

    describe('when open shifts are updated', () => {
      beforeEach(fakeAsync(() => {
        invokeGetOpenShifts.emit(openShifts);
        tick(2000);
      }));

      it('should set the open shifts array', () => {
        expect(component.openShifts).toEqual(openShifts);
      });
    });

    describe('when schedules are updated', () => {
      beforeEach(fakeAsync(() => {
        invokeGetSchedules.emit(baseEvents);
        tick(2000);
      }));

      it('should map the events to calendar events', () => {
        expect(component.calendarEvents[0].title).toEqual(baseEvents[0].schedule.activity.code);
        expect(component.calendarEvents[0].meta).toEqual(baseEvents[0]);
        expect(component.calendarEvents[1].title).toEqual(baseEvents[1].schedule.payCode.code);
        expect(component.calendarEvents[1].meta).toEqual(baseEvents[1]);
        expect(component.calendarEvents[2].title).toEqual(baseEvents[2].schedule.activity.code);
        expect(component.calendarEvents[2].meta).toEqual(baseEvents[2]);
      });

      it('should set the eTag', () => {
        expect(component.eTag).toEqual(baseEvents[0].schedule.etag);
      });

      it('should call into onSelectedDateChanged', () => {
        expect(component.onSelectedDateChanged).toHaveBeenCalledWith(component.selectedDate);
      });
    });

    describe('when schedules are updated with an empty list', () => {
      beforeEach(fakeAsync(() => {
        component.eTag = 'does not overwrite';
        invokeGetSchedules.emit([]);
        tick(2000);
      }));

      it('should not set the eTag', () => {
        expect(component.eTag).toBe('does not overwrite');
      });
    });

    describe('#getOnUnSavedNoOption', () => {
      beforeEach(() => {
        onUnsavedOption.emit(false);
      });

      it('should call #onSelectedDateChanged', fakeAsync(() => {
        tick(2000);
        expect(component.onSelectedDateChanged).toHaveBeenCalled();
      }));
    });

    describe('#getOnUnSavedYesOption', () => {
      beforeEach(() => {
        onUnsavedOption.emit(true);
      });

      it('should call #onSelectedDateChanged', fakeAsync(() => {
        tick(2000);
        expect(component.onSelectedDateChanged).toHaveBeenCalled();
      }));
    });
  });

  describe('#onSelectedDateChanged', () => {
    describe('when there is a selected day', () => {
      let singleDayOpenShifts: IOpenShift[];
      beforeEach(() => {
        component = createComponent();
        component.calendarEvents = events;
        component.showOpenShifts = true;
        singleDayOpenShifts = [openShifts[1], openShifts[2]];
        mockStore.selectSnapshot.and.callFake(x => {
          if (x === CalendarEventsState.getAvailableOpenShifts) {
            return day => singleDayOpenShifts;
          }
        });
        component.onSelectedDateChanged(days[0]);
      });

      it('should set the selected day on the component', () => {
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch.calls.mostRecent().args[0].payload.date).toEqual(moment(days[0].date));
        expect(component.selectedDate.date).toEqual(days[0].date);
      });

      it('should dispatch a SetSelectedDay action with open shifts', () => {
        expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
        const action: SetSelectedDate = mockStore.dispatch.calls.mostRecent().args[0];
        expect(action.payload.showOpenShifts).toEqual(true);

      });
    });
  });

  describe('#onDayClick', () => {
    beforeEach(() => {
      component = createComponent();
      spyOn(component, 'onSelectedDateChanged');
      component.selectedDate = days[1];
    });

    describe('when mode is View', () => {
      beforeEach(() => {
        mockStore.selectSnapshot.and.returnValue({ currentMode: DailyFormMode.View });
        component.onDayClicked(days[0]);
      });

      it('should call #onSelectedDateChanged', () => {
        expect(component.onSelectedDateChanged).toHaveBeenCalled();
      });
    });

    describe('when mode is EditActivity', () => {
      beforeEach(() => {
        mockStore.selectSnapshot.and.returnValue({ currentMode: DailyFormMode.EditActivity });
        component.onDayClicked(days[0]);
      });

      it('should open modal', () => {
        expect(component.modal.open).toHaveBeenCalled();
      });
    });
  });

  describe('#onSelectedDateChanged', () => {
    describe('when passed undefined', () => {
      beforeEach(() => {
        component.selectedDate = days[0];
        component.onSelectedDateChanged(undefined);
      });

      it('should not change selected day', () => {
        expect(component.selectedDate).toEqual(days[0]);
      });
    });
  });

  describe('#getAvailableOpenShifts', () => {
    let dateUsed: moment.Moment;
    let openShiftList: IOpenShift[];
    let returnValue: IOpenShift[];
    beforeEach(() => {
      component = createComponent();
      openShiftList = openShifts;
      mockStore.selectSnapshot.and.returnValue(
        date => {
          dateUsed = date;
          return openShiftList;
        }
      );
      returnValue = component.getAvailableOpenShifts(moment('12-20-2019').toDate());
    });

    it('should pass the date through', () => {
      expect(dateUsed.isSame(moment('12-20-2019'))).toBeTruthy();
    });

    it('should return the open shifts', () => {
      expect(returnValue).toBe(openShiftList);
    });
  });

  describe('#showOpenShiftChange', () => {
    beforeEach(() => {
      component = createComponent();
      component.selectedDate = days[0];
      component.calendarEvents = events;
      mockStore.selectSnapshot.and.returnValue(() => [openShifts[0]]);
    });
    describe('when the open shift checkbox is checked', () => {
      beforeEach(() => {
        component.showOpenShiftChange({ currentTarget: { checked: true } });
      });

      it('should dispatch a SetSelectedDay action with openShifts', () => {
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch.calls.mostRecent().args[0].payload.showOpenShifts).toEqual(true);
      });
    });

    describe('when the open shift checkbox is not checked', () => {
      beforeEach(() => {
        component.showOpenShiftChange({ currentTarget: { checked: false } });
      });

      it('should dispatch a SetSelectedDay action with no openShifts', () => {
        expect(mockStore.dispatch).toHaveBeenCalled();
        expect(mockStore.dispatch.calls.mostRecent().args[0].payload.showOpenShifts).toEqual(false);
      });
    });
  });

  describe('#getTooltipContent', () => {
    let templateString;
    beforeEach(() => {
      mockTranslateService.instant.and.returnValue('12:00 - 8:00');
    });

    describe('when event is paycode', () => {
      beforeEach(() => {
        const event: CalendarEvent<IEventData> = {
          start: moment('12-12-2019').toDate(),
          title: 'title',
          meta: {
            eventType: EventTypes.PAYCODE,
            schedule: {
              startDate: moment('12-12-2019'),
              endDate: moment('12-12-2019'),
              hours: 8,
              lunchHours: .5,
              payCode: {
                name: 'testPayCodeName'
              },
              profile: {
                name: 'testProfileName'
              },
              facility: {
                code: 'testFacilityCode'
              },
              department: {
                code: 'testDepartmentCode'
              }
            }
          } as IEventData
        };
        component = createComponent();
        templateString = component.getTooltipContent(event);
      });

      it('should create template string for tooltip', () => {
        expect(templateString).toEqual('<div><span>testPayCodeName</span><br><span>12:00 - 8:00</span><br></div>');
      });
    });

    describe('when event is not paycode', () => {
      beforeEach(() => {
        const event: CalendarEvent<IEventData> = {
          start: moment('12-12-2019').toDate(),
          title: 'title',
          meta: {
            eventType: 'activity',
            schedule: {
              startDate: moment('12-12-2019'),
              endDate: moment('12-12-2019'),
              hours: 8,
              lunchHours: .5,
              payCode: {
                name: 'testPayCodeName'
              },
              profile: {
                name: 'testProfileName'
              },
              facility: {
                code: 'testFacilityCode'
              },
              department: {
                code: 'testDepartmentCode'
              }
            }
          } as IEventData
        };
        component = createComponent();
        templateString = component.getTooltipContent(event);
      });

      it('should create template string for tooltip', () => {
        expect(templateString).toEqual('<div><span>testProfileName</span><br><span>12:00 - 8:00</span><br><span>testFacilityCode</span><br><span>testDepartmentCode</span><br></div>');
      });
    });

    describe('when event hours are 0', () => {
      beforeEach(() => {
        const event: CalendarEvent<IEventData> = {
          start: moment('12-12-2019').toDate(),
          title: 'title',
          meta: {
            eventType: 'activity',
            schedule: {
              startDate: moment('12-12-2019'),
              endDate: moment('12-12-2019'),
              hours: 0,
              lunchHours: 0,
              payCode: {
                name: 'testPayCodeName'
              },
              profile: {
                name: 'testProfileName'
              },
              facility: {
                code: 'testFacilityCode'
              },
              department: {
                code: 'testDepartmentCode'
              }
            }
          } as IEventData
        };
        component = createComponent();
        templateString = component.getTooltipContent(event);
      });

      it('should create template string for tooltip', () => {
        expect(templateString).toEqual('<div><span>testProfileName</span><br><span>12:00 - 8:00</span><br><span>testFacilityCode</span><br><span>testDepartmentCode</span><br></div>');
      });
    });
  });

  describe('#openPopup', () => {
    const getActiveButtons = (): ModalButton[] => {
      return component.buttons.filter(button => button.condition());
    };
    beforeEach(() => {
      component = createComponent();
      component.openSelfScheduleModal = mockModal;
      component.openPopup();
      mockTranslateService.instant.and.callFake((value: any, params) => {
        switch (value) {
          case 'button.later':
            return 'Later';
          case 'button.self-schedule-now':
            return 'Self Schedule';
          case 'monthly-calendar-view.openSelfSchedule-title':
            return 'Self scheduling is now open';
          default:
            return `translated: ${value}`;
        }
      });
    });
    it('should display quick close', () => {
      expect(component.openSelfScheduleModal.quickClose).toBeTruthy();
    });

    describe('Later Button', () => {
      let laterButton: ModalButton;
      beforeEach(() => {
        laterButton = getActiveButtons().filter(button => button.styleClass === 'secondary-button')[0];
      });

      it('should show the later button', () => {
        expect(laterButton).toBeDefined();
      });
      it('later button title', () => {
        expect((laterButton.text as () => string)()).toEqual('Later');
      });

      describe('When clicked', () => {
        let closeSpy: jasmine.Spy;

        beforeEach(() => {
          closeSpy = jasmine.createSpy('close');
          laterButton.onClick(closeSpy);
        });
        it('should close when clicked', () => {
          expect(closeSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('Self schedule Button', () => {
      let selfschedulenow: ModalButton;
      beforeEach(() => {
        selfschedulenow = getActiveButtons().filter(button => button.styleClass === 'priority-button')[0];
      });

      it('should show the self schedule button', () => {
        expect(selfschedulenow).toBeDefined();
      });
      it(' button title as Self Schedule', () => {
        expect((selfschedulenow.text as () => string)()).toEqual('Self Schedule');
      });

      describe('When clicked', () => {
        let navigationSpy: jasmine.Spy;
        beforeEach(() => {
          navigationSpy = jasmine.createSpy('NavigateTo');
          const topReference = window.top;
          (topReference as any).Root = () => ({ NavigateTo: navigationSpy });
          selfschedulenow.onClick(navigationSpy);
        });
        it('should Navigate when clicked', () => {
          expect(navigationSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
