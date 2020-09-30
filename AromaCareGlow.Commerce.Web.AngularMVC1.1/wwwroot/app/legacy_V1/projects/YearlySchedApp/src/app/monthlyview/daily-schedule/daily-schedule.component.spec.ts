import { ChangeDetectorRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { SetDailyScheduleMode } from 'projects/MonthlyViewApp/src/app/store/schedule/actions/schedule.actions';
import { ScheduleState } from 'projects/MonthlyViewApp/src/app/store/schedule/states/schedule.state';
import { TradeState } from 'projects/MonthlyViewApp/src/app/store/trade/states/trade.state';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { CommonService } from 'src/app/common-service/common.service';
import { ISelectedDay } from 'src/app/common-service/model/ISelectedDay';
import { SearchListComponent } from 'src/app/shared/auto-complete/search-list.component';
import { DateFormats } from 'src/app/shared/date-formats/date-formats';
import { ToastService } from 'src/app/shared/toast/toast';
import { ScheduleValidationMessage } from 'src/app/shared/validation-warnings/models/schedule-validation-message';
import { AuthState } from 'src/app/store/auth/states/auth.state';
import { IEmployeeAuthorization } from 'src/app/time-management-domain/authorization-access';
import { Employee, IFullEmployee } from 'src/app/time-management-domain/employee';
import { EventTypes } from 'src/app/time-management-domain/event-types';
import { IIdentifier } from 'src/app/time-management-domain/identifier';
import { ILocation, ILocationConfig , ILocationWithConfig } from 'src/app/time-management-domain/location';
import { IScheduleDetailed } from 'src/app/time-management-domain/schedule-with-details';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';
import { IOpenShift } from 'src/app/time-management-sdk/employee-schedule-sdk/open-shift-response';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { ScheduleSdkService } from 'src/app/time-management-sdk/schedule-sdk/schedule-sdk.service';
import { DailyFormMode, IDailyScheduleMode } from '../../../../../../src/app/common-service/model/IDailyScheduleMode';
import { Identifier } from '../../../../../../src/app/identifier.model';
import { DateFormatter } from '../../../../../../src/app/shared/date-formats/date-formatter';
import { IActivity, IActivityWithConfig } from '../../../../../../src/app/time-management-domain/activity';
import { IJobClass } from '../../../../../../src/app/time-management-domain/job-class';
import { ILevelHierarchy, LevelHierarchy } from '../../../../../../src/app/time-management-domain/level-hierarchy';
import { IDepartment, IFacility, IUnit } from '../../../../../../src/app/time-management-domain/org-unit';
import { IPayCode, IPayCodeWithPermissionConfiguration, IPayCodeWithIndicatorConfiguration, IPayCodeConfiguration } from '../../../../../../src/app/time-management-domain/pay-code';
import { PayPeriod } from '../../../../../../src/app/time-management-domain/pay-period';
import { IPosition } from '../../../../../../src/app/time-management-domain/position';
import { IProfile } from '../../../../../../src/app/time-management-domain/profile';
import { ISchedule, Schedule } from '../../../../../../src/app/time-management-domain/schedule';
import { EmployeeSdkService } from '../../../../../../src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { CalendarEventsState } from '../../store/calendar-events/state/calendar-events.state';
import { IEventData } from '../monthly-calendar-view/event-data';
import { DailyScheduleComponent } from './daily-schedule.component';
import { ModalButton, ModalComponent } from '@wfm/modal';
import { AppSdkService } from 'src/app/time-management-sdk/app-sdk/app-sdk.service';
import { IEmployment , IQuickCode } from 'src/app/time-management-domain/quick-code';
import { ScheduleTradeParticipant } from 'src/app/time-management-domain/schedule-trade/schedule-trade-participant.enum';

describe('DailyScheduleComponent', () => {
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  let organizationSdkServiceMock: jasmine.SpyObj<OrganizationSdkService>;
  let employeeSdkServiceMock: jasmine.SpyObj<EmployeeSdkService>;
  let empOrgServiceMock: jasmine.SpyObj<EmployeeOrganizationSdkService>;
  let unitComponentMock: jasmine.SpyObj<SearchListComponent>;
  let facilityComponentMock: jasmine.SpyObj<SearchListComponent>;
  let departmentComponentMock: jasmine.SpyObj<SearchListComponent>;
  let activityComponentMock: jasmine.SpyObj<SearchListComponent>;
  let positionComponentMock: jasmine.SpyObj<SearchListComponent>;
  let jobClassComponentMock: jasmine.SpyObj<SearchListComponent>;
  let profileComponentMock: jasmine.SpyObj<SearchListComponent>;
  let commonServiceMock: jasmine.SpyObj<CommonService>;
  let scheduleServiceSdkMock: jasmine.SpyObj<ScheduleSdkService>;
  let translateServiceSdkMock: jasmine.SpyObj<TranslateService>;
  let toastServiceSdkMock: jasmine.SpyObj<ToastService>;
  let appSdkServiceMock: jasmine.SpyObj<AppSdkService>;
  let dateFormats: DateFormats;
  let mockChangeDetection: jasmine.SpyObj<ChangeDetectorRef>;
  let storeMock: jasmine.SpyObj<Store>;
  let employeeCode: string;
  let navigatedDate: moment.Moment;
  let scheduleMode: IDailyScheduleMode;
  let schedules: IEventData[];
  let openShifts: IOpenShift[];
  let component: DailyScheduleComponent;
  let expectedResultAuthorization: IEmployeeAuthorization;
  let expectedResultNoAuthorization: IEmployeeAuthorization;
  let expectResultOrgLevel: ILevelHierarchy;
  let employees: IFullEmployee[];
  let expectResultPaycode: IPayCodeWithPermissionConfiguration[];
  let expectResultCurrentPayCode: PayPeriod;
  let expectedResultSelectedDay: ISelectedDay;
  let mockModal: jasmine.SpyObj<ModalComponent>;
  let expectedResultQuickCode: IQuickCode[];
  let expectedEmployment: IEmployment;
  let quickcodeComponentMock: jasmine.SpyObj<SearchListComponent>;

  beforeEach(() => {
    mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toShortDate', 'format', 'toIsoDate']);
    organizationSdkServiceMock = jasmine.createSpyObj('OrganizationSdkService', ['getOrgLevels']);
    appSdkServiceMock = jasmine.createSpyObj('AppSdkService', ['getFeatures']);
    employeeSdkServiceMock = jasmine.createSpyObj('EmployeeSdkService', ['getFacilities', 'getAuthorization', 'getEmployee', 'getDepartments', 'getUnits', 'getPayCodes', 'getCurrentPayPeriod',
      'getQuickCode']);
    empOrgServiceMock = jasmine.createSpyObj('EmployeeOrganizationService', ['getEmployeePositions', 'getEmployeeActivities', 'getEmployeeJobClasses', 'getEmployeeProfiles', 'getEmployeePayCodes']);
    unitComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    facilityComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    departmentComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    activityComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    positionComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    jobClassComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    profileComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    commonServiceMock = jasmine.createSpyObj('CommonService', ['getUnsavedOption']);
    scheduleServiceSdkMock = jasmine.createSpyObj('ScheduleSdkService', ['saveSchedule', 'savePayCode', 'deleteSchedule']);
    toastServiceSdkMock = jasmine.createSpyObj('ToastService', ['activate']);
    dateFormats = { DATE_SHORT: 'L' } as DateFormats;
    mockChangeDetection = jasmine.createSpyObj('ChangeDetection', ['detectChanges']);
    mockModal = jasmine.createSpyObj('modal', ['open']);
    mockModal.open.and.callFake(() => { });
    translateServiceSdkMock = jasmine.createSpyObj('TranslateService', ['instant']);
    quickcodeComponentMock = jasmine.createSpyObj('SearchListComponent', ['clearSelected', 'getSelectedText']);
    translateServiceSdkMock.instant.and.callFake((stringValue) => {
      switch (stringValue) {
        case 'button.save':
          return 'Save';
        case 'button.submit':
          return 'Submit';
        default:
          return `translated: ${stringValue}`;
      }
    });

    schedules = [{
      eventType: EventTypes.ACTIVITY,
      schedule: {
        status: 'Requested',
        isTradeRequested: true
      } as any,
      isTradeable: false
    },
    {
      eventType: EventTypes.ACTIVITY,
      schedule: {
        status: null,
        scheduleTradeParticipant: ScheduleTradeParticipant.REQUESTOR,
        isTradeRequested: false
      } as any,
      isTradeable: false
    }];

    openShifts = [{
      start: moment('12-12-2019'),
      end: moment('12-12-2019'),
      activity: null,
      profile: null,
      location: null
    }];

    expectedResultSelectedDay = {
      date: moment('04-23-2018'),
      etag: '123',
      showOpenShifts: false
    };

    expectedResultAuthorization = {
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
      clearSchedule: {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      }
    };

    expectedResultNoAuthorization = {
      payCode: {
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false
      },
      activity: {
        canCreate: false,
        canRead: true,
        canUpdate: true,
        canDelete: true
      },
      clearSchedule: {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      }
    };

    expectResultOrgLevel = {
      trunk: {
        id: null,
        number: 1,
        code: 'COM',
        name: 'Company',
        links: [
          'CalculationRuleHierarchy'
        ]
      },
      branch: {
        id: null,
        number: 2,
        code: 'GROUP',
        name: 'Group',
        links: []
      },
      leaf: null
    };

    expectResultPaycode = [
      {
        id: '42',
        code: 'ARNM',
        name: 'ARNM',
        number: '2203',
        configuration: {
          scheduleStartTimeRequired: true,
          scheduleValueValidation: 'Hours',
          canCreate: false,
          canCreateRequest: false,
          canEdit: false,
          canEditRequest: false
        }
      }
    ];

    employees = [
      {
        id: 1245,
        code: 'ARA01',
        firstName: 'ARA01',
        lastName: 'ARA01',
        employment: {
          profession: {
            jobClass: {
              id: '132',
              code: 'AR2',
              name: 'AR2',
              number: '11200',
              status: null
            },
            shift: null,
            fte: 0,
            classification: {
              id: '1',
              code: 'FT',
              name: 'Full-Time Hourly',
              number: null
            },
            approvedHours: 0,
            position: {
              jobClasses: [
                {
                  id: '132',
                  code: 'AR2',
                  name: 'AR2',
                  number: '11200',
                  status: null
                }
              ],
              id: '295',
              code: 'ARA02',
              number: '11112',
              name: 'ARA02'
            },
            hireDate: moment('2000-01-01T00:00:00.000Z'),
            seniorityDate: null
          },
          location: {
            facility: {
              id: '134',
              code: 'ActiveRoster',
              name: 'ActiveRoster',
              number: '11000',
              timeZoneId: 'America/Chicago',
              status: null
            },
            department: {
              id: '135',
              code: 'AR Department A',
              name: 'AR Department A',
              number: '11110',
              status: null
            },
            unit: null,
            timeZoneId: 'America/Chicago'
          },
          effectiveDate: moment('2019-05-10')
        }
      },
      {
        id: 1245,
        code: 'ARA01',
        firstName: 'ARA01',
        lastName: 'ARA01',
        employment: {
          profession: {
            jobClass: {
              id: '132',
              code: 'AR2',
              name: 'AR2',
              number: null,
              status: null
            },
            shift: null,
            fte: 0,
            classification: {
              id: '1',
              code: 'FT',
              name: 'Full-Time Hourly',
              number: null
            },
            approvedHours: 0,
            position: null,
            hireDate: moment('2000-01-01T00:00:00.000Z'),
            seniorityDate: null
          },
          location: {
            facility: {
              id: '134',
              code: 'ActiveRoster',
              name: 'ActiveRoster',
              number: '11000',
              timeZoneId: 'America/Chicago',
              status: null
            },
            department: {
              id: '135',
              code: 'AR Department A',
              name: 'AR Department A',
              number: '11110',
              status: null
            },
            unit: null,
            timeZoneId: 'America/Chicago'
          },
          effectiveDate: moment('2019-05-10')
        }
      },
      {
        id: 1245,
        code: 'ARA01',
        firstName: 'ARA01',
        lastName: 'ARA01',
        employment: {
          profession: {
            jobClass: {
              id: '132',
              code: 'AR2',
              name: 'AR2',
              number: '11200',
              status: null
            },
            shift: null,
            fte: 0,
            classification: {
              id: '1',
              code: 'FT',
              name: 'Full-Time Hourly',
              number: null
            },
            approvedHours: 0,
            position: null,
            hireDate: moment('2000-01-01T00:00:00.000Z'),
            seniorityDate: null
          },
          location: {
            facility: {
              id: '134',
              code: 'ActiveRoster',
              name: 'ActiveRoster',
              number: '11000',
              timeZoneId: 'America/Chicago',
              status: null
            },
            department: {
              id: '135',
              code: 'AR Department A',
              name: 'AR Department A',
              number: '11110',
              status: null
            },
            unit: {
              id: '1',
              code: 'UnitA',
              number: '1122',
              name: 'Unit Arkansas',
              status: null
            },
            timeZoneId: 'America/Chicago'
          },
          effectiveDate: moment('2019-05-10')
        }
      }];

    expectResultCurrentPayCode = {
      id: 1784,
      beginDate: '2019-12-12',
      endDate: '2019-05-20',
      type: 'Current'
    };

    expectedResultQuickCode = [{
      id: 5180,
      number: 1985,
      code: 'ExpirationQC',
      name: 'Expiration code',
      jobClass: { id: '131', code: 'AR1', name: 'AR1', number: '11100', status: 'Active' },
      position: { jobClass: null },
      location: {
        department: { id: 135, code: 'AR Department A', name: 'AR Department A', number: 11110 },
        facility: { id: 135, code: 'ActiveRoster', name: 'ActiveRoster', number: 11000 },
        unit: null,
        timeZoneId: 'America/Chicago'
      }
    }];

    expectedEmployment = {
      classification: 'QuickCode',
      classifications: [],
      code: 'q1022',
      description: 'dummyy',
      employeeCategoryID: null,
      employeeClassID: null,
      employeeID: 1330,
      gradeID: null,
      grantCodeID: null,
      id: 5172,
      jobClassID: 187,
      number: 666,
      organizationUnitID: 161,
      payGroupID: null,
      positionID: 1198,
      projectCodeID: null,
      seniorityID: null,
      shiftID: null,
      skillID: null,
      statusCodeID: null,
      unionCodeID: null,
      whenEffective: '2019-08-16',
      whenExpire: null
    };
  });
  function getSelectedModelMock() {

    let data: ISchedule;

    data = new Schedule();
    data.amount = 73;

    data.startDate = moment('01/01/2018');
    data.hasStartTime = true;
    data.status = 'Test';
    data.hours = 14;
    data.lunchHours = 1.5;
    data.facility = { id: '1', name: 'facility' } as IFacility;
    data.department = { id: '2', name: 'department' } as IDepartment;
    data.unit = { id: '3', name: 'unit' } as IUnit;
    data.profile = { id: '4', name: 'profile' } as IIdentifier;
    data.position = { id: '5', name: 'position' } as IPosition;
    data.isScheduledHours = true;
    data.payCode = {
      isAmountRequired: false,
      areHoursRequired: false,
      id: '49', code: 'PTO', name: 'Paid Time Off', number: '12'
    };

    const paycodeEvent: IEventData = {
      isTradeable: false,
      eventType: EventTypes.PAYCODE,
      schedule: {
        payCode: {
          id: '49',
          name: 'PTO',
          code: 'Paid Time Off',
          configuration: {
            isDisplayedOnMonthlyView: true,
            isOnCall: true,
            isTimeOff: false
          }
        } as IPayCodeWithIndicatorConfiguration,
        startDate: moment('01/01/2018'),
        endDate: moment('01/01/2018'),
        hours: 14,
        guid: '123',
        status: 'Test'
      } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>
    };

    return paycodeEvent;

  }

  function CreateComponent(): DailyScheduleComponent {
    employeeCode = 'ARA01';
    navigatedDate = moment('04-23-2018');
    scheduleMode = { currentMode: DailyFormMode.View };
    storeMock = jasmine.createSpyObj<Store>('Store', ['dispatch', 'selectSnapshot']);
    mockDateFormatter.toShortDate.and.callFake((date: moment.Moment) => {
      return date.format('YYYY-MM-DD');
    });
    const componentMock = new DailyScheduleComponent(
      organizationSdkServiceMock,
      employeeSdkServiceMock,
      empOrgServiceMock,
      mockDateFormatter,
      scheduleServiceSdkMock,
      commonServiceMock,
      translateServiceSdkMock,
      toastServiceSdkMock,
      appSdkServiceMock,
      null,
      mockChangeDetection,
      storeMock);

    componentMock.modal = mockModal;
    Object.defineProperty(componentMock, 'selectedDay$', { writable: true });
    componentMock.selectedDay$ = of(expectedResultSelectedDay);
    Object.defineProperty(componentMock, 'dailySelectedMode$', { writable: true });
    componentMock.dailySelectedMode$ = of(scheduleMode);
    Object.defineProperty(componentMock, 'selectedSchedule$', { writable: true });
    componentMock.selectedSchedule$ = of(getSelectedModelMock());

    storeMock.selectSnapshot.and.callFake(x => {
      if (x === AuthState.getEmployeeCode) {
        return employeeCode;
      }
      if (x === ScheduleState.getDailyScheduleMode) {
        return scheduleMode;
      }
      if (x === TradeState.getNavigatedDate) {
        return navigatedDate;
      }
      if (x === CalendarEventsState.getSchedulesByDate) {
        return () => schedules;
      }
      if (x === CalendarEventsState.getAvailableOpenShifts) {
        return () => openShifts;
      }
    });
    return componentMock;
  }

  describe('ngOnInit', () => {
    let getUnsavedOptionSubject: BehaviorSubject<boolean>;
    beforeEach(() => {
      getUnsavedOptionSubject = new BehaviorSubject(true);

      component = CreateComponent();
      (component as any).dateFormats = dateFormats;
      organizationSdkServiceMock.getOrgLevels.and.returnValue(of(expectResultOrgLevel));
      employeeSdkServiceMock.getEmployee.and.returnValue(of(employees));
      employeeSdkServiceMock.getAuthorization.and.returnValue(of(expectedResultAuthorization));
      employeeSdkServiceMock.getCurrentPayPeriod.and.returnValue(of(expectResultCurrentPayCode));
      commonServiceMock.getUnsavedOption.and.returnValue(getUnsavedOptionSubject.asObservable());
      appSdkServiceMock.getFeatures.and.returnValue(of(true));
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
    });

    describe('#CheckTradeCount', () => {
      beforeEach(() => {
        schedules = [{
          eventType: EventTypes.ACTIVITY,
          schedule: {
            status: 'Requested',
            scheduleTradeParticipant: ScheduleTradeParticipant.REQUESTOR,
            isTradeRequested: true
          } as any,
          isTradeable: false
        },
        {
          eventType: EventTypes.ACTIVITY,
          schedule: {
            status: 'Requested',
            scheduleTradeParticipant: ScheduleTradeParticipant.ACCEPTOR,
            isTradeRequested: true
          } as any,
          isTradeable: false
        }
        ];
        component.selectedDay$ = of(expectedResultSelectedDay);
        component.schedules = schedules;
        component.ngOnInit();
      });

      it('requestor trade count should be 1', () => {
        expect(component.requestorTradeCount).toEqual(1);
      });

      it('acceptor trade count should be 1', () => {
        expect(component.acceptorTradeCount).toEqual(1);
        expect(component.scheduledActivityCount).toEqual(0);
      });
    });

    describe('when employee code is defined', () => {
      beforeEach(() => {
        employeeCode = 'Test Code 01982437193784785';
        component.ngOnInit();
      });
      it('should set levelHierarchy', () => {
        expect(component.showAddActivityBtn).toBeTruthy();
        expect(component.levelHierarchy).toBeTruthy();
      });
      it('should set the employeeCode', () => {
        expect((component as any).employeeCode).toBe('Test Code 01982437193784785');
      });
    });

    describe('when employee code is not defined', () => {
      beforeEach(() => {
        employeeCode = undefined;
        employeeSdkServiceMock.getEmployee.and.returnValue(of(null));
        component.ngOnInit();
      });
      it('should set the employee details', () => {
        expect(component.employee).toBeFalsy();
      });
      it('should set the employeeCode', () => {
        expect((component as any).employeeCode).toBeUndefined();
      });
    });

    describe('when the selected date is lesser than begindate of current payperiod', () => {
      beforeEach(() => {
        component = CreateComponent();
        (component as any).dateFormats = dateFormats;
        component.selectedDay$ = of(expectedResultSelectedDay);
        component.minDateValue = new Date('2019-05-01');
        component.ngOnInit();
      });
      it('should not show the Add Paycode and Add Activity buttons', () => {
        expect(component.showAddActivityBtn).toBeFalsy();
        expect(component.showPayCodeBtn).toBeFalsy();
      });
    });

    describe('when date format is defined', () => {
      let dateFormat: string;
      beforeEach(() => {
        dateFormat = moment.localeData().longDateFormat('L');
        component.dateFormat = dateFormat;
        component.ngOnInit();
      });
      it('should not set the date format again', () => {
        expect(component.dateFormat).toEqual(dateFormat);
      });
    });
    describe('when date format is not defined', () => {
      beforeEach(() => {
        component.dateFormat = undefined;
        component.ngOnInit();
      });
      it('should set the date format', () => {
        expect(component.dateFormat).toEqual(moment.localeData().longDateFormat('L'));
      });
    });

    describe('When user does not have CanCreate Permission', () => {
      beforeEach(() => {
        navigatedDate = null;
        expectedResultAuthorization.activity.canCreate = false;
        employeeSdkServiceMock.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        component.ngOnInit();
      });
      it('Activity Button will not come', () => {
        expect(component.showAddActivityBtn).toBe(false);
      });
    });

    describe('When user does not have CanCreate paycode Permission', () => {
      beforeEach(() => {
        expectedResultAuthorization.payCode.canCreate = false;
        employeeSdkServiceMock.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        component.ngOnInit();
      });
      it('Paycode Button will not come', () => {
        expect(component.showPayCodeBtn).toBe(false);
      });
    });

    describe('When showopenshifts is false', () => {
      beforeEach(() => {
        expectedResultSelectedDay.showOpenShifts = false;
        component.selectedDay$ = of(expectedResultSelectedDay);
        component.ngOnInit();
      });
      it('will set openShiftCount to null', () => {
        expect(component.openShiftCount).toBeNull();
      });
    });

    describe('When showopenshifts is true', () => {
      beforeEach(() => {
        expectedResultSelectedDay.showOpenShifts = true;
        component.selectedDay$ = of(expectedResultSelectedDay);
        component.ngOnInit();
      });
      it('will set openShiftCount to be 1', () => {
        expect(component.openShiftCount).toEqual(1);
      });
    });

    describe('When Authorization returns error', () => {
      beforeEach(() => {
        employeeSdkServiceMock.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        employeeSdkServiceMock.getAuthorization.and.returnValue(throwError({ status: 416 }));
        component.ngOnInit();
      });
      it('Http Error', () => {
        expect(component.showAddActivityBtn).toBe(false);
      });
    });

    describe('When employee code is undefined', () => {
      beforeEach(() => {
        component = CreateComponent();
        (component as any).dateFormats = dateFormats;
        employeeSdkServiceMock.getAuthorization.and.returnValue(of(expectedResultAuthorization));
        employeeCode = undefined;
        component.ngOnInit();
      });

      it('Get onint data', () => {
        expect(component.showAddActivityBtn).toBe(false);
        expect(component.levelHierarchy).toBeUndefined();
      });
    });

    describe('when getUnsavedOption updates with a false value and the currentMode is not View', () => {
      beforeEach(() => {
        component = CreateComponent();
        getUnsavedOptionSubject.next(true);
        component.currentMode = DailyFormMode.EditActivity;
        scheduleMode.currentMode = DailyFormMode.EditActivity;
        (component as any).dateFormats = dateFormats;
        component.showAddActivityBtn = false;
        component.ngOnInit();
      });

      it('should call into .close form and configure the buttons appropriately', () => {
        expect(component.showAddActivityForm).toBeFalsy();
        expect(component.showAddActivityBtn).toBeTruthy();
      });

      it('should set the current mode to View', () => {
        expect(component.currentMode).toBe(DailyFormMode.View);
      });

      it('should dispatch an action setting the daily schedule mode', () => {
        expect(storeMock.dispatch).toHaveBeenCalledWith(new SetDailyScheduleMode({ currentMode: DailyFormMode.View }));
      });
    });

    describe('when Current Payperiod returns null', () => {
      const expectedCurrentPayCode = null;
      beforeEach(() => {
        component = CreateComponent();
        employeeSdkServiceMock.getCurrentPayPeriod.and.returnValue(of(expectedCurrentPayCode));
        (component as any).dateFormats = dateFormats;
        component.ngOnInit();
      });
      it('Current Pay period should be null', () => {
        expect(expectedCurrentPayCode).toBeNull();
      });
    });

    describe('when the selected day is not set', () => {
      beforeEach(() => {
        employeeCode = undefined;
        component.selectedDay$ = of(null);

        component.ngOnInit();
      });

      it('selected day should be null', () => {
        expect(component.selectedDay).toBeUndefined();
      });
    });

  });

  describe('#setDate', () => {
    let originalDate: moment.Moment;
    beforeEach(() => {
      originalDate = moment(new Date('02/02/2019'));
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
    });

    describe('when a date is passed in', () => {
      beforeEach(() => {
        originalDate = moment(new Date('02/02/2019'));
        component.quickcodeComponent = quickcodeComponentMock;
      });

      it('should set the date without changing the time', () => {
        component.quickcodeComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
        component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.setDate(originalDate);
        const date = moment(component.dateValue);
        expect(date.format('M')).toBe(originalDate.format('M'));
        expect(date.format('YYYY')).toBe(originalDate.format('YYYY'));
      });

      it('should set the date without changing the time', () => {
        component.quickcodeComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
        component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.setDate(originalDate);
        component.setDate(moment(new Date('02/04/2019')));
        expect(component.quickcodeComponent.unfilteredItems).toBeUndefined();
      });

      it('should set unfiltered items to null', () => {
        component.quickcodeComponent = undefined;
        component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.setDate([]);
        expect(component.formModel.employment).toBe(undefined);
      });
    });

    describe('when null is passed in', () => {
      beforeEach(() => {
        originalDate = moment(new Date('02/02/2019'));
        component.selectedDay = expectedResultSelectedDay;
        component.quickcodeComponent = quickcodeComponentMock;
        component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.quickcodeComponent.unfilteredItems = undefined;
        component.setDate(null);
      });

      it('should not change the form date', () => {
        expect(component.formModel.startDate.format('M')).toBe(originalDate.format('M'));
      });
    });

    describe('when an array is passed in', () => {
      const expectedResultSelected = [moment()];
      beforeEach(() => {
        originalDate = moment(new Date('02/02/2019'));
        component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.quickcodeComponent = quickcodeComponentMock;
        component.quickcodeComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
        component.setDate(expectedResultSelected);
      });

      it('startDates will have the data', () => {
        expect(mockDateFormatter.toIsoDate(component.startDates[0])).toEqual(mockDateFormatter.toIsoDate(expectedResultSelected[0]));
      });
    });
  });

  describe('#addEvent', () => {
    let expectedActivities: IActivity[];
    beforeEach(() => {
      expectedActivities = [
        {
          id: '36',
          code: 'DAY8',
          name: 'DAY8',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '37',
          code: 'EVE8',
          name: 'EVE8',
          startTime: '15:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '38',
          code: 'NIGHT8',
          name: 'NIGHT8',
          startTime: '23:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '40',
          code: 'NP',
          name: 'Non Productive',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '41',
          code: 'NPNM',
          name: 'Non Productive Not Monitored',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity
      ];

      const expectedProfiles: IProfile[] = [
        {
          id: '89',
          code: 'ARA01',
          name: 'ARA01',
          number: null
        },
        {
          id: '90',
          code: 'ARA02',
          name: 'ARA02',
          number: null
        }
      ];

      component = CreateComponent();
      component.employee = employees[0];
      component.selectedDay = expectedResultSelectedDay;
      spyOn(component, 'getProfiles').and.returnValue(of(expectedProfiles));
      spyOn(component, 'getActivities').and.returnValue(of(expectedActivities));
      employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
      spyOn(component, 'checkIfQuickCodeExits').and.returnValue(of(expectedResultQuickCode));
    });

    describe('when isActivity', () => {
      beforeEach(() => {
        component.addEvent(true);
      });
      it('should set currentMode to EditActivity', () => {
        expect(component.currentMode).toBe(DailyFormMode.EditActivity);
      });
    });

    describe('when not isActivity', () => {
      beforeEach(() => {
        component.addEvent(false);
      });
      it('should set currentMode to EditPaycode', () => {
        expect(component.currentMode).toBe(DailyFormMode.EditPaycode);
      });
    });

    describe('when no position is found', () => {
      beforeEach(() => {
        component.employee = employees[1];
        component.addEvent(false);
      });
      it('should set position to null', () => {
        expect(component.formModel.position).toBeNull();
        expect(component.formModel.jobClass.number).toBeNull();
      });
    });

    describe('should initialize formModel', () => {
      beforeEach(() => {
        component.employee = employees[2];
        component.addEvent(false);
      });
      it('with a value', () => {
        expect(component.formModel).toBeDefined();
      });
      it('that has facility set to employee home labor value', () => {
        expect(component.formModel.facility.id).toEqual('134');
      });
      it('that has department set to employee home labor value', () => {
        expect(component.formModel.department.id).toEqual('135');
      });
      it('then the unit sets to employee home labor value', () => {
        expect(component.formModel.unit.id).toEqual('1');
      });
      it('that has unit set to null when employee home labor is null', () => {
        employees[2].employment.location.unit = null;
        component.addEvent(false);
        expect(component.formModel.unit).toBeNull();
      });
    });

    describe('when canCreate', () => {
      beforeEach(() => {
        expectResultPaycode[0].configuration.canCreate = true;
        expectResultPaycode[0].configuration.canCreateRequest = false;
        employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
        component.addEvent(false);
      });
      it('Submit button title', () => {
        expect(component.submitPaycode).toEqual('Save');
      });
    });

    describe('when canCreateRequest', () => {
      beforeEach(() => {
        expectResultPaycode[0].configuration.canCreate = false;
        expectResultPaycode[0].configuration.canCreateRequest = true;
        employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
        component.addEvent(false);
      });
      it('Save button title', () => {
        expect(component.submitPaycode).toBeDefined();
        expect(component.submitPaycode).toEqual('Submit');
      });
    });
  });

  describe('#getFacilities', () => {
    beforeEach(() => {
      const expectResultFacilities = {
        facilities: [
          {
            id: 337,
            code: 'ACB',
            name: 'Adam\'s Extra Org Units',
            number: 55100,
            status: 'Active',
            timeZoneId: 'America/Chicago'
          },
          {
            id: 134,
            code: 'ActiveRoster',
            name: 'ActiveRoster',
            number: 11000,
            status: 'Active',
            timeZoneId: 'America/Chicago'
          }
        ]
      };
      employeeSdkServiceMock.getFacilities.and.returnValue(of(expectResultFacilities));
      component = CreateComponent();
      component.employee = employees[0];
    });

    it('should return an array of Facilities', (done) => {
      component.getFacilities().subscribe((facilities: Array<IFacility>) => {
        expect(facilities.length).not.toBeNull();
        done();
      });
    });

    it('for Activities it calls organizationService.getFacilities with ForActivity constraint', () => {
      component.currentMode = DailyFormMode.EditActivity;
      component.getFacilities();
      expect(employeeSdkServiceMock.getFacilities).toHaveBeenCalledWith(component.employee.code, EmployeeSdkService.Constraints.ForActivity);
    });

    it('for Pay Codes it calls organizationService.getFacilities with ForCalendar constraint', () => {
      component.currentMode = DailyFormMode.EditPaycode;
      component.getFacilities();
      expect(employeeSdkServiceMock.getFacilities).toHaveBeenCalledWith(component.employee.code, EmployeeSdkService.Constraints.ForCalendar);
    });
  });

  describe('#onFacilityChanged', () => {
    beforeEach(() => {
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.department = {} as IDepartment;
      component.formModel.unit = {} as IUnit;
      component.formModel.profile = {} as IProfile;
      component.formModel.jobClass = {} as IJobClass;
      component.departmentComponent = departmentComponentMock;
      component.selectedFacility = {
        code: 'ActiveRoster',
        id: '134',
        name: 'ActiveRoster',
        number: '11000',
        timeZoneId: 'America/Chicago',
        status: ''
      };
      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: ['Position',
          'Productivity',
          'Transaction']
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };
      component.levelHierarchy = level;
      employeeSdkServiceMock.getEmployee.and.returnValue(of(employees));
      component.employee = employees[0];
      component.departmentComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
      component.unitComponent = unitComponentMock;
      component.unitComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
      component.positionComponent = positionComponentMock;
      component.positionComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
      component.jobClassComponent = jobClassComponentMock;
      component.jobClassComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
      component.activityComponent = activityComponentMock;
      component.activityComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];

    });

    describe('should clear', () => {
      // TODO: all of these are likely borked
      it('should return if equal', () => {
        expect(component.selectedFacility.name).toEqual('ActiveRoster');
      });
      it('selected department', () => {
        component.currentMode = DailyFormMode.EditActivity;
        component.onFacilityChanged(undefined);
        expect(component.formModel.department).toBeNull();
      });

      it('departments search list', () => {
        component.currentMode = DailyFormMode.EditActivity;
        component.onFacilityChanged(undefined);
        expect(component.departmentComponent.unfilteredItems).toBeUndefined();
      });

      it('selected unit', () => {
        component.currentMode = DailyFormMode.EditActivity;
        component.onFacilityChanged(undefined);
        expect(component.formModel.unit).toBeNull();
      });

      it('units search list', () => {
        component.currentMode = DailyFormMode.EditActivity;
        component.onFacilityChanged(undefined);
        expect(component.unitComponent.unfilteredItems).toBeUndefined();
      });

      it('job class is null', () => {
        component.jobClassComponent = null;
        component.onFacilityChanged(undefined);
        expect(component.unitComponent.unfilteredItems).toBeUndefined();
      });
    });
    describe('current mode is not edit mode', () => {
      it('it shoudl not set activityComponent to undefined', () => {
        component.currentMode = DailyFormMode.EditPaycode;
        component.onFacilityChanged(undefined);
        expect(component.activityComponent).toBeDefined();
      });
    });

    describe('#onFacilityChanged with same facility name ', () => {
      beforeEach(() => {
        const event1 = {
          code: 'ActiveRoster',
          id: 134,
          name: 'ActiveRoster',
          number: 11000,
          timeZoneId: 'America/Chicago'
        };

        component.onFacilityChanged(event1);
      });
      it('should return if equal', () => {
        expect(component.selectedFacility.name).toEqual('ActiveRoster');
      });
    });

  });

  describe('#getDepartments', () => {
    beforeEach(() => {
      const expectResultDepartments = [
        {
          id: 135,
          code: 'AR Department A',
          name: 'AR Department A',
          number: 11110,
          status: 'Active'
        },
        {
          id: 136,
          code: 'AR Department B',
          name: 'AR Department B',
          number: 11120,
          status: 'Active'
        }
      ];
      employeeSdkServiceMock.getDepartments.and.returnValue(of(expectResultDepartments));
      component = CreateComponent();
      component.employee = employees[0];
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.facility = {
        id: '12345',
        code: 'qwerty',
        name: 'RP',
        number: '3',
        timeZoneId: 'America/Chicago'
      } as IFacility;
    });

    it('should return an array of departments', () => {
      component.getDepartments().subscribe((departments: Array<IDepartment>) => {
        expect(departments.length).not.toBeNull();
      });
    });

    it('for Activities it calls organizationService.getDepartments with ForActivity constraint', () => {
      component.currentMode = DailyFormMode.EditActivity;
      component.getDepartments();
      expect(employeeSdkServiceMock.getDepartments).toHaveBeenCalledWith(component.employee.code, component.formModel.facility, EmployeeSdkService.Constraints.ForActivity);
    });

    it('for Pay Codes it calls organizationService.getDepartments with ForCalendar constraint', () => {
      component.currentMode = DailyFormMode.EditPaycode;
      component.getDepartments();
      expect(employeeSdkServiceMock.getDepartments).toHaveBeenCalledWith(component.employee.code, component.formModel.facility, EmployeeSdkService.Constraints.ForCalendar);
    });
  });

  describe('#onDepartmentChanged', () => {
    let level: LevelHierarchy;
    beforeEach(() => {
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.unit = {} as IUnit;
      component.formModel.profile = {} as IProfile;
      component.formModel.jobClass = {} as IJobClass;
      component.formModel.position = {} as IPosition;
      level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: []
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };
      component.levelHierarchy = level;
      component.employee = employees[0];
      component.unitComponent = unitComponentMock;
      component.unitComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
      component.positionComponent = positionComponentMock;
      component.positionComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
    });

    // TODO naming
    describe('when the selected department doesn\'t match the one passed in', () => {
      beforeEach(() => {
        component.onDepartmentChanged(undefined);
      });
      it('clears out the selected unit, profile, and job class', () => {
        expect(component.formModel.unit).toBeNull();
        expect(component.formModel.profile).toBeNull();
        expect(component.formModel.jobClass).toBeNull();
      });

      it('units search list', () => {
        expect(component.unitComponent.unfilteredItems).toBeUndefined();
      });
    });

    describe('when position level of level hierarchy is less than organizations department', () => {
      beforeEach(() => {
        level.trunk.links = ['Position'];
        level.branch.links = [];
        level.leaf.links = [];
        component.onDepartmentChanged(undefined);
      });
      it('should not set positions to null', () => {
        expect(component.formModel.position).toBeDefined();
      });
    });

    describe('when activityLevel is set to...', () => {
      beforeEach(() => {
        level.trunk.links = [];
        level.branch.links = [];
        level.leaf.links = [];
        component.formModel.activity = {} as IActivity;
        component.activityComponent = activityComponentMock;
        component.activityComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];
      });

      describe('a level higher than Department', () => {
        beforeEach(() => {
          level.trunk.links = ['Activity'];
          component.onDepartmentChanged(undefined);
        });

        it('should not clear activity', () => {
          expect(component.formModel.activity).not.toBeNull();
        });
      });

      describe('the Department level', () => {
        beforeEach(() => {
          level.branch.links = ['Activity'];
          component.onDepartmentChanged(undefined);
        });

        it('should clear activity', () => {
          expect(component.formModel.activity).toBeNull();
        });
      });

      describe('a level lower than Department', () => {
        beforeEach(() => {
          level.leaf.links = ['Activity'];
          component.onDepartmentChanged(undefined);
        });

        it('should clear activity', () => {
          expect(component.formModel.activity).toBeNull();
        });
      });

      describe('the Department level; and current mode set to edit', () => {
        beforeEach(() => {
          level.branch.links = ['Activity'];
          component.currentMode = 1;
          component.onDepartmentChanged(undefined);
        });

        it('should clear activity component', () => {
          expect(component.activityComponent.unfilteredItems).toBeUndefined();
        });
      });
    });

    describe('#onDepartmentChanged when both selectedDepartment name and event name are same', () => {
      beforeEach(() => {
        const event1 = component.selectedDepartment = {
          code: 'AR Department B',
          id: '136',
          name: 'AR Department B',
          number: '11120',
          status: 'Active'
        };
        component.onDepartmentChanged(event1);
      });

      it('should return early and not null out the formModel', () => {
        expect(component.formModel.unit).toBeDefined();
        expect(component.formModel.profile).toBeDefined();
        expect(component.formModel.jobClass).toBeDefined();
      });
    });
  });

  describe('#getUnits', () => {
    beforeEach(() => {
      const expectResultUnits = [
        {
          id: 136,
          code: 'Unit1',
          name: 'This is demo unit',
          number: 11120,
          status: 'Active'
        }
      ];
      employeeSdkServiceMock.getUnits.and.returnValue(of(expectResultUnits));
      component = CreateComponent();
      component.employee = employees[0];
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.department = {
        id: '12345',
        code: 'qwerty',
        name: 'RP',
        number: '3'
      } as IDepartment;
    });

    // TODO: move the calls to .getUnits and other setup code out of assert clauses
    it('should return an array of units', () => {
      component.getUnits().subscribe((units: Array<any>) => {
        expect(units.length).not.toBeNull();
      });
    });

    it('for Activities it calls organizationService.getUnits with ForActivity constraint', () => {
      component.currentMode = DailyFormMode.EditActivity;
      component.getUnits();
      expect(employeeSdkServiceMock.getUnits).toHaveBeenCalledWith(component.employee.code, component.formModel.department, EmployeeSdkService.Constraints.ForActivity);
    });

    it('for Pay Codes it calls organizationService.getUnits with ForCalendar constraint', () => {
      component.currentMode = DailyFormMode.EditPaycode;
      component.getUnits();
      expect(employeeSdkServiceMock.getUnits).toHaveBeenCalledWith(component.employee.code, component.formModel.department, EmployeeSdkService.Constraints.ForCalendar);
    });
  });

  describe('#getPositions', () => {
    beforeEach(() => {
      const expectResultPositions: IPosition[] = [
        {
          number: '11111',
          code: 'ARA01',
          name: 'ARA01',
          jobClasses: [],
          id: '294'
        },
        {
          number: '11112',
          code: 'ARA02',
          name: 'ARA02',
          jobClasses: [],
          id: '295'
        },
        {
          number: '11113',
          code: 'ARA03',
          name: 'ARA03',
          jobClasses: [],
          id: '296'
        }
      ];

      empOrgServiceMock.getEmployeePositions.calls.reset();
      component = CreateComponent();
      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: []
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };
      component.levelHierarchy = level;
      employeeSdkServiceMock.getEmployee.and.returnValue(of(employees));
      component.employee = employees[0];
      empOrgServiceMock.getEmployeePositions.and.returnValue(of(expectResultPositions));
    });

    // TODO: move the calls to methods under test and other setup code out of assert clauses
    it('should return an array of positions', () => {
      const orgUnit = { id: '123', code: '123', name: '123', number: '123' } as Identifier;
      spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
      component.getPositions().subscribe((pos: Array<IPosition>) => {
        expect(pos.length).not.toBeNull();
      });
    });

    it('should use the configured org entity based on level', () => {
      const orgUnit = { id: '456', code: '456', name: '456', number: '456' } as Identifier;
      spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
      component.getPositions().subscribe((pos: Array<IPosition>) => {
        expect(empOrgServiceMock.getEmployeePositions).toHaveBeenCalledWith(component.employee.code, orgUnit.id, component.currentMode === DailyFormMode.EditActivity);
      });
    });

    it('should do nothing', () => {
      spyOn(component, 'getOrgFromLevel').and.returnValue(null);
      component.getPositions();
    });
  });

  describe('#getJobClass', () => {
    beforeEach(() => {
      const expectResultJobClass: IJobClass[] = [
        {
          number: '11111',
          code: 'ARA01',
          name: 'ARA01',
          id: '294',
          status: null
        },
        {
          number: '11112',
          code: 'ARA02',
          name: 'ARA02',
          id: '295',
          status: null
        },
        {
          number: '11113',
          code: 'ARA03',
          name: 'ARA03',
          id: '296',
          status: null
        }
      ];

      empOrgServiceMock.getEmployeeJobClasses.calls.reset();
      component = CreateComponent();
      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: []
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };
      component.levelHierarchy = level;
      employeeSdkServiceMock.getEmployee.and.returnValue(of(employees));
      component.employee = employees[0];
      empOrgServiceMock.getEmployeeJobClasses.and.returnValue(of(expectResultJobClass));
    });

    it('should use the configured org entity based on level', () => {
      const orgUnit = { id: '456', code: '456', name: '456', number: '456' } as Identifier;
      spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
      component.getJobClass().subscribe((job: Array<IJobClass>) => {
        expect(empOrgServiceMock.getEmployeeJobClasses).toHaveBeenCalledWith(component.employee.code, orgUnit.id);
      });
    });

    it('should do nothing', () => {
      spyOn(component, 'getOrgFromLevel').and.returnValue(null);
      component.getJobClass();
    });
  });

  describe('#onPositionChanged', () => {
    let profile1: IProfile;
    let profile2: IProfile;
    let profile3: IProfile;
    let position1: IPosition;
    let jobClass1: IJobClass;
    let department1: IDepartment;

    let getProfilesSpy: jasmine.Spy;

    beforeEach(() => {
      profile1 = { id: '1' } as IProfile;
      profile3 = { id: '3' } as IProfile;
      profile2 = { id: '2' } as IProfile;
      position1 = { id: '1' } as IPosition;
      jobClass1 = { id: '1', code: '123' } as IJobClass;
      department1 = { id: '1' } as IDepartment;
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.profile = {} as IProfile;
      component.formModel.jobClass = {} as IJobClass;
      component.formModel.position = {} as IPosition;
      getProfilesSpy = spyOn(component, 'getProfiles');
      component.facilityComponent = facilityComponentMock;
      component.departmentComponent = departmentComponentMock;
      component.unitComponent = unitComponentMock;
      component.activityComponent = activityComponentMock;
      component.positionComponent = positionComponentMock;
      component.profileComponent = profileComponentMock;
    });

    // TODO: move the calls to methods under test and other setup code out of assert clauses
    describe('for activities', () => {
      beforeEach(() => {
        getProfilesSpy.and.returnValue(of([profile3]));
        component.currentMode = DailyFormMode.EditActivity;
      });
      describe('when editing', () => {
        beforeEach(() => {
          component.formModel.profile = profile1;
          component.formModel.position = position1;
          component.formModel.department = department1;
        });
        it('should not set jobclass reference', () => {
          component.onPositionChanged(jobClass1);
          expect(component.formModel.jobClass).toBeNull();
        });

        it('should get profiles based on the position while editing, instead of picking the first element from profiles.', () => {
          component.formModel.profile = profile1;
          component.assignProfileValues(profile2);
          expect(component.formModel.profile).toEqual(profile1);
        });
      });
    });

    describe('for pay codes', () => {
      beforeEach(() => {
        component.currentMode = DailyFormMode.EditPaycode;
      });
      describe('when editing', () => {
        beforeEach(() => {
          component.formModel.department = department1;
          component.formModel.profile = profile1;
          component.formModel.position = position1;
        });
        it('should not call getProfiles when a position is set', () => {
          component.currentMode = DailyFormMode.EditPaycode;
          component.formModel.position = position1;
          component.onPositionChanged(jobClass1);
          // TODO: what is being tested here??
        });
        it('when department is null', () => {
          component.formModel.department = null;
          component.currentMode = DailyFormMode.EditPaycode;
          component.formModel.position = position1;
          component.onPositionChanged(jobClass1);
          // TODO: what is being tested here??
        });
      });
    });

    describe('when position is null', () => {
      beforeEach(() => {
        component.formModel.department = department1;
        component.formModel.position = {} as IPosition;
        component.onPositionChanged(undefined);
      });
      it('should not set profiles', () => {
        expect(component.formModel.profile).toBeNull();
      });
    });
  });

  describe('#onJobClassChanged', () => {
    beforeEach(() => {
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.position = {} as IPosition;
      component.onJobClassChanged();
    });
    it('position should be null', () => {
      expect(component.formModel.position).toBeNull();
    });
  });

  describe('#onUnitChanged', () => {
    beforeEach(() => {
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.profile = {} as IProfile;
      component.formModel.jobClass = {} as IJobClass;

      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: [
          'Attendance',
          'Grant',
          'JobClass',
          'NoteValueList',
          'Override',
          'PayConfiguration',
          'PayrollGroup',
          'Project',
          'Seniority',
          'Status',
          'Union'
        ]
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };
      component.levelHierarchy = level;
      component.positionComponent = positionComponentMock;
      component.positionComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];

      component.activityComponent = activityComponentMock;
      component.activityComponent.unfilteredItems = [{ id: 1, code: 'abc', name: 'guy', description: 'cool' }];

      component.onUnitChanged();
    });

    describe('should clear', () => {
      it('selected profile', () => {
        expect(component.formModel.profile).toBeNull();
      });

      it('selected jobClass', () => {
        expect(component.formModel.jobClass).toBeNull();
      });
    });

    describe('when activityLevel', () => {
      beforeEach(() => {
        component.formModel.activity = {} as IActivity;
      });

      describe('is set to level lower than Unit', () => {
        beforeEach(() => {
          const level = new LevelHierarchy();
          level.trunk = {
            id: 1,
            number: 3,
            code: 'FAC',
            name: 'Facility',
            links: [
              'Attendance',
              'Grant',
              'JobClass',
              'NoteValueList',
              'Override',
              'PayConfiguration',
              'PayrollGroup',
              'Project',
              'Seniority',
              'Status',
              'Union'
            ]
          };
          level.branch = {
            id: 2,
            number: 5,
            code: 'DPT',
            name: 'Department',
            links: [
              'Productivity',
              'Transaction'
            ]
          };
          level.leaf = {
            id: 2,
            number: 6,
            code: 'UNT',
            name: 'Unit',
            links: [
              'Activity']
          };
          component.levelHierarchy = level;
          component.onUnitChanged();
        });

        it('should clear activity', () => {
          expect(component.formModel.activity).toBeNull();
        });
      });

      describe('is set to level higher than Unit', () => {
        beforeEach(() => {
          const level = new LevelHierarchy();
          level.trunk = {
            id: 1,
            number: 3,
            code: 'FAC',
            name: 'Facility',
            links: [
              'Activity',
              'Attendance',
              'Grant',
              'JobClass',
              'NoteValueList',
              'Override',
              'PayConfiguration',
              'PayrollGroup',
              'Project',
              'Seniority',
              'Status',
              'Union'
            ]
          };
          level.branch = {
            id: 2,
            number: 5,
            code: 'DPT',
            name: 'Department',
            links: [
              'Productivity',
              'Transaction'
            ]
          };
          level.leaf = {
            id: 2,
            number: 6,
            code: 'UNT',
            name: 'Unit',
            links: []
          };
          component.levelHierarchy = level;
          component.onUnitChanged();
        });

        it('should clear activity', () => {
          expect(component.formModel.activity).not.toBeNull();
        });
      });

      describe('is set to Unit', () => {
        beforeEach(() => {
          component.onUnitChanged();
        });

        it('should clear activity', () => {
          expect(component.formModel.activity).toBeNull();
        });

        describe('and current mode is EditActivity', () => {
          beforeEach(() => {
            component.currentMode = DailyFormMode.EditActivity;
            component.activityComponent.unfilteredItems = [];
            component.onUnitChanged();
          });

          it('activity search list is cleared', () => {
            expect(component.activityComponent.unfilteredItems).toBeUndefined();
          });
        });

        describe('and current mode is EditPayCode', () => {
          beforeEach(() => {
            component.currentMode = DailyFormMode.EditPaycode;
            component.activityComponent.unfilteredItems = [];
            component.onUnitChanged();
          });

          it('activity search list is not cleared', () => {
            expect(component.activityComponent.unfilteredItems).toBeDefined();
          });
        });
      });

      describe('is set to level lower than Unit', () => {
        beforeEach(() => {
          component.onUnitChanged();
        });

        it('should clear position', () => {
          expect(component.formModel.activity).toBeNull();
        });
      });

    });

    describe('when positionLevel', () => {
      beforeEach(() => {
        component.formModel.position = {} as IPosition;
      });

      describe('is set to level higher than Unit', () => {
        beforeEach(() => {
          const level = new LevelHierarchy();
          level.trunk = {
            id: 1,
            number: 3,
            code: 'FAC',
            name: 'Facility',
            links: [
              'Position',
              'Attendance',
              'Grant',
              'JobClass',
              'NoteValueList',
              'Override',
              'PayConfiguration',
              'PayrollGroup',
              'Project',
              'Seniority',
              'Status',
              'Union'
            ]
          };
          level.branch = {
            id: 2,
            number: 5,
            code: 'DPT',
            name: 'Department',
            links: [
              'Productivity',
              'Transaction'
            ]
          };
          level.leaf = {
            id: 2,
            number: 6,
            code: 'UNT',
            name: 'Unit',
            links: []
          };
          component.levelHierarchy = level;
          component.onUnitChanged();
        });

        it('should not clear position', () => {
          expect(component.formModel.position).not.toBeNull();
        });
      });

      describe('is set to Unit', () => {
        beforeEach(() => {
          component.onUnitChanged();
        });

        it('should clear position', () => {
          expect(component.formModel.position).toBeNull();
        });

        describe('and current mode is EditActivity', () => {
          beforeEach(() => {
            component.currentMode = DailyFormMode.EditActivity;
            component.activityComponent.unfilteredItems = [];
            component.onUnitChanged();
          });

          it('activity search list is cleared', () => {
            expect(component.activityComponent.unfilteredItems).toBeUndefined();
          });
        });

        describe('and current mode is EditPayCode', () => {
          beforeEach(() => {
            component.currentMode = DailyFormMode.EditPaycode;
            component.activityComponent.unfilteredItems = [];
            component.onUnitChanged();
          });

          it('activity search list is not cleared', () => {
            expect(component.activityComponent.unfilteredItems).toBeDefined();
          });
        });
      });

      describe('is set to level lower than Unit', () => {
        beforeEach(() => {
          component.onUnitChanged();
        });

        it('should clear position', () => {
          expect(component.formModel.position).toBeNull();
        });
      });
    });
  });

  describe('#getProfiles', () => {

    beforeEach(() => {
      const expectResultProfiles = [
        {
          code: 'ARA01',
          name: 'ARA01',
          id: 89,
          number: null
        },
        {
          code: 'ARA02',
          name: 'ARA02',
          id: 90,
          number: null
        }
      ];

      empOrgServiceMock.getEmployeePositions.calls.reset();
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.position = {} as IPosition;
      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: [
          'Activity',
          'Attendance',
          'Grant',
          'JobClass',
          'NoteValueList',
          'Override',
          'PayConfiguration',
          'PayrollGroup',
          'Project',
          'Seniority',
          'Status',
          'Union'
        ]
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };

      component.levelHierarchy = level;
      employeeSdkServiceMock.getEmployee.and.returnValue(of(employees));
      component.employee = employees[0];
      empOrgServiceMock.getEmployeeProfiles.and.returnValue(of(expectResultProfiles));
    });

    // TODO: move the calls to the method under test and data setup out of it() clause
    it('should return an array of profiles', () => {
      const orgUnit = { id: '123', code: '123', name: '123', number: '123' } as Identifier;
      spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
      component.getProfiles().subscribe((pro: Array<IProfile>) => {
        expect(pro.length).not.toBeNull();
      });
    });

    it('should use the configured org entity based on level', () => {
      const orgUnit = { id: '456', code: '456', name: '456', number: '456' } as Identifier;
      spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
      component.getProfiles().subscribe((pos: Array<IProfile>) => {
        expect(empOrgServiceMock.getEmployeeProfiles).toHaveBeenCalledWith(component.employee.code, orgUnit.id, component.formModel.position);
      });
    });

    it('should do nothing', () => {
      spyOn(component, 'getOrgFromLevel').and.returnValue(null);
      component.getProfiles();
    });
  });

  describe('#getActivities', () => {
    beforeEach(() => {

      const expectResultActivities: IActivity[] = [
        {
          code: 'DAY8',
          name: 'DAY8',
          id: '36',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          code: 'EVE8',
          name: 'EVE8',
          id: '37',
          startTime: '15:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          code: 'NIGHT8',
          name: 'NIGHT8',
          id: '38',
          startTime: '23:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '40',
          code: 'NP',
          name: 'Non Productive',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '41',
          code: 'NPNM',
          name: 'Non Productive Not Monitored',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity
      ];

      empOrgServiceMock.getEmployeeActivities.calls.reset();
      component = CreateComponent();
      spyOn(component, 'hasAuthorizedPayCode').and.returnValue(true);
      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 3,
        code: 'FAC',
        name: 'Facility',
        links: [
          'Activity',
          'Attendance',
          'Grant',
          'JobClass',
          'NoteValueList',
          'Override',
          'PayConfiguration',
          'PayrollGroup',
          'Project',
          'Seniority',
          'Status',
          'Union'
        ]
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };

      component.levelHierarchy = level;
      employeeSdkServiceMock.getEmployee.and.returnValue(of(employees));
      component.employee = employees[0];
      empOrgServiceMock.getEmployeeActivities.and.returnValue(of(expectResultActivities));
    });

    describe('when there is an org unit at the level', () => {
      let activityResult: IActivity[];
      let orgUnit: IIdentifier;
      beforeEach((done) => {
        orgUnit = { id: '123', code: '123', name: '123', number: '123' };
        empOrgServiceMock.getEmployeePayCodes.and.returnValue(of(expectResultPaycode));
        spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
        component.getActivities().subscribe((a) => {
          activityResult = a;
          done();
        });
      });

      it('should return an array of activities', () => {
        expect(activityResult.length).not.toBeNull();
        expect(component.hasAuthorizedPayCode).toHaveBeenCalledTimes(5); // 5 activity return from the mock
      });
      it('should use the configured org entity based on level', () => {
        expect(empOrgServiceMock.getEmployeeActivities).toHaveBeenCalledWith(component.employee.code, orgUnit.id);
      });
    });

    describe('when there is no org unit at the level', () => {
      let activityObservable: Observable<IActivity[]>;
      beforeEach(() => {
        spyOn(component, 'getOrgFromLevel').and.returnValue(null);
        activityObservable = component.getActivities();
      });
      it('should do nothing', () => {
        expect(component.hasAuthorizedPayCode).not.toHaveBeenCalled();
      });
      it('should still return a valid observable', (done) => {
        expect(activityObservable).toBeDefined();
        activityObservable.subscribe(() => null, () => null, () => {
          done();
        });
      });
    });
  });
  describe('#getAuthorizedActivityPayCodes', () => {
    beforeEach(() => {
      const level = new LevelHierarchy();
      level.trunk = {
        id: 1,
        number: 1,
        code: 'FAC',
        name: 'Facility',
        links: ['Pay Code']
      };
      level.branch = {
        id: 2,
        number: 5,
        code: 'DPT',
        name: 'Department',
        links: [
          'Position']
      };
      level.leaf = {
        id: 2,
        number: 6,
        code: 'UNT',
        name: 'Unit',
        links: []
      };

      component = CreateComponent();
      component.levelHierarchy = level;
      component.employee = {} as Employee;
    });

    describe('when the base unit is null', () => {
      beforeEach(() => {
        spyOn(component, 'getOrgFromLevel').and.returnValue(null);
        component.getAuthorizedActivityPayCodes();
      });

      it('should do nothing', () => {
        expect(empOrgServiceMock.getEmployeePayCodes).not.toHaveBeenCalled();
      });
    });

    describe('when the base unit is not null', () => {
      const orgUnit = { id: '123', code: '123', name: '123', number: '123' };

      beforeEach(() => {
        spyOn(component, 'getOrgFromLevel').and.returnValue(orgUnit);
        component.employee.code = 'empCode';
        empOrgServiceMock.getEmployeePayCodes.and.returnValue(of(expectResultPaycode));
        component.getAuthorizedActivityPayCodes();
      });

      it('should call the service to get the employee pay codes', () => {
        expect(empOrgServiceMock.getEmployeePayCodes).toHaveBeenCalledWith(component.employee.code, orgUnit.id);
      });
    });
  });

  describe('#onActivityChanged', () => {
    beforeEach(() => {
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.hours = 13;
      component.formModel.lunchHours = 13;
      component.formModel.amount = 100;
      component.formModel.guid = 'd9e1fc3f-a536-41d5-9290-bf3bd13dc4d7';
      spyOn(component, 'setTime').and.returnValue(null);
      spyOn(component, 'setTimes').and.returnValue(null);
    });
    // TODO: move the calls to the method under test and data setup out of it() clause
    describe('when changed to a value not set', () => {
      it('should not change the other values', () => {
        component.onActivityChanged();
        expect(component.setTime).not.toHaveBeenCalled();
        expect(component.formModel.hours).toBeNull();
        expect(component.formModel.lunchHours).toBeNull();
        expect(component.setTimes).toHaveBeenCalled();
      });
    });

    describe('when there is no activity', () => {
      beforeEach(() => {
        component.formModel.activity = {} as IActivity;
        component.formModel.activity.startTime = '7';
        component.formModel.activity.lunchHours = 7;
        component.selectedActivity = component.formModel.activity;
      });
      it('should not change the other values', () => {
        component.onActivityChanged();
        expect(component.setTime).not.toHaveBeenCalled();
        expect(component.setTimes).not.toHaveBeenCalled();
      });
    });

    describe('when changed to a value that is set', () => {
      let startTime: string;
      beforeEach(() => {
        startTime = '07:13:00';
        component.formModel.activity = {} as IActivity;
        component.formModel.activity.startTime = startTime;
        component.formModel.activity.hours = 7;
        component.formModel.activity.lunchHours = 7;
        component.formModel.guid = null;
        component.selectedActivity = component.formModel.activity;
        component.onActivityChanged();
      });

      it('should change the other properties to default values', () => {
        expect(component.setTime).toHaveBeenCalledWith(startTime);
        expect(component.formModel.hours).toBe(7);
        expect(component.formModel.lunchHours).toBe(7);
        expect(component.formModel.amount).toBe(100);
      });
    });

  });

  describe('#setTime', () => {
    beforeEach(() => {
      const originalDate = moment('04-23-2018');
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
    });

    describe('when the input has a colon and is four characters', () => {
      it('should set the correct time', () => {
        component.setTime('16:20'); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(component.formModel.startDate.month()).toBe(3);
        expect(component.formModel.startDate.date()).toBe(23);
        expect(component.formModel.startDate.year()).toBe(2018);
        expect(component.formModel.startDate.hour()).toBe(16);
        expect(component.formModel.startDate.minute()).toBe(20);
      });
    });

    describe('when the input has a colon and is three characters', () => {
      it('should set the correct time', () => {
        component.setTime('8:20'); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(component.formModel.startDate.month()).toBe(3);
        expect(component.formModel.startDate.date()).toBe(23);
        expect(component.formModel.startDate.year()).toBe(2018);
        expect(component.formModel.startDate.hour()).toBe(8);
        expect(component.formModel.startDate.minute()).toBe(20);
      });
    });

    describe('when the input does not have a colon and is two characters', () => {
      it('should set the correct time', () => {
        component.setTime('08'); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(component.formModel.startDate.month()).toBe(3);
        expect(component.formModel.startDate.date()).toBe(23);
        expect(component.formModel.startDate.year()).toBe(2018);
        expect(component.formModel.startDate.hour()).toBe(8);
        expect(component.formModel.startDate.minute()).toBe(0);
      });
    });

    describe('when the input does not have a colon and is three characters', () => {
      it('should set the correct time', () => {
        component.setTime('820'); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(component.formModel.startDate.month()).toBe(3);
        expect(component.formModel.startDate.date()).toBe(23);
        expect(component.formModel.startDate.year()).toBe(2018);
        expect(component.formModel.startDate.hour()).toBe(8);
        expect(component.formModel.startDate.minute()).toBe(20);
      });
    });

    describe('when the input does not have a colon and is four characters', () => {
      it('should set the correct time', () => {
        component.setTime('0820'); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(component.formModel.startDate.month()).toBe(3);
        expect(component.formModel.startDate.date()).toBe(23);
        expect(component.formModel.startDate.year()).toBe(2018);
        expect(component.formModel.startDate.hour()).toBe(8);
        expect(component.formModel.startDate.minute()).toBe(20);
      });
    });

    describe('when the input is null', () => {
      it('should not change the time', () => {
        component.setTime(null); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(component.formModel.startDate.hours()).toBe(9);
      });
    });
  });

  describe('#hasAuthorizedPayCode', () => {
    let activity: IActivity;
    let payCodes: IPayCode[];
    let result: boolean;

    beforeEach(() => {
      component = CreateComponent();
    });

    describe('when there is not a pay code attached to an activity', () => {
      beforeEach(() => {
        activity = { id: '1', code: 'ac1', name: 'payCode1', payCode: null } as IActivity;
        payCodes = [];
        result = component.hasAuthorizedPayCode(activity, payCodes);
      });

      it('should return true', () => {
        expect(result).toEqual(true);
      });
    });

    describe('when the activities pay code is in the authorized pay code list', () => {
      beforeEach(() => {
        activity = { id: '1', code: 'ac1', name: 'payCode1', payCode: { code: 'sched' } } as IActivity;
        payCodes = [{ id: '1', code: 'sched' }, { id: '2', code: 'ovt' }] as IPayCode[];
        result = component.hasAuthorizedPayCode(activity, payCodes);
      });

      it('should return true', () => {
        expect(result).toBeTruthy();
      });

      describe('when the activities pay code is not in the authorized pay code list', () => {
        beforeEach(() => {
          activity = { id: '1', code: 'ac1', name: 'payCode1', payCode: { code: 'not-a-match' } } as IActivity;
          result = component.hasAuthorizedPayCode(activity, payCodes);
        });

        it('should return false', () => {
          expect(result).toBeFalsy();
        });
      });
    });
  });

  describe('#getOrganizationActivities', () => {
    const orgUnitId = '1';
    const empCode = 'empCode';
    const payCode1 = { code: 'pc1' } as IIdentifier;
    const payCode2 = { code: 'pc2' } as IIdentifier;
    const payCodes = [payCode1];
    const activity1 = { code: 'ac1', payCode: null } as IActivity;
    const activity2 = { code: 'ac2', payCode: payCode1 } as IActivity;
    const activity3 = { code: 'ac3', payCode: payCode2 } as IActivity;
    const activities = [activity1, activity2, activity3];
    let result: IActivity[];

    beforeEach(async (done: DoneFn) => {
      empOrgServiceMock.getEmployeeActivities.and.returnValue(of(activities));
      component = CreateComponent();
      component.employee = {} as Employee;
      component.employee.code = empCode;
      spyOn(component, 'getAuthorizedActivityPayCodes').and.returnValue(of(payCodes));
      component.getOrganizationActivities(orgUnitId).subscribe((response) => {
        result = response;
        done();
      });
    });

    it('should retrieve authorized activity paycodes and join them with employee activities', () => {
      expect(component.getAuthorizedActivityPayCodes).toHaveBeenCalled();
      expect(empOrgServiceMock.getEmployeeActivities).toHaveBeenCalledWith(empCode, orgUnitId);
    });

    it('should return activities with no paycodes or matching paycodes only', () => {
      expect(result.length).toBe(2);
      expect(result).toEqual([activity1, activity2]);
    });
  });

  describe('#onTimeChange', () => {
    beforeEach(() => {
      const originalDate = moment('04-23-2018');
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      const newDate = new Date(2017, 5, 22, 10, 34);
      component.onTimeChange(newDate);
    });

    it('will change the time only', () => {
      expect(component.formModel.startDate.year()).toBe(2018);
      expect(component.formModel.startDate.month()).toBe(3);
      expect(component.formModel.startDate.date()).toBe(23);
      expect(component.formModel.startDate.hour()).toBe(10);
      expect(component.formModel.startDate.minute()).toBe(34);
    });
  });

  describe('#closeForm', () => {
    describe('when user not authorized', () => {
      beforeEach(() => {
        component = CreateComponent();
        component.authorization = expectedResultNoAuthorization;
        component.closeForm();
      });
  
      it('add activity button and show pay code button will not come', () => {
        expect(component.showAddActivityBtn).toBe(false);
        expect(component.showPayCodeBtn).toBe(false);  
      });
    });

    describe('when selected schedules pay code is avaliable', () => {
      beforeEach(() => {       
        component = CreateComponent();
        component.authorization = expectedResultNoAuthorization;       
        const payCodeIndicatorConfig : IPayCodeConfiguration = {
          isDisplayedOnMonthlyView: true,
          isOnCall: true,
          isTimeOff: false           
        };        
        component.selectedSchedule$ = of(getSelectedModelMock());
        component.selectedPayCodeIndicatorConfig = payCodeIndicatorConfig;
        component.closeForm();
      });
    
      it('selected schedules pay code should have the indicator configuration insted of permission configuration', () => {
        component.selectedSchedule$.subscribe((selectedSchedule: IEventData) => {              
        expect(selectedSchedule.schedule.payCode.configuration.isDisplayedOnMonthlyView).toBe(true);
        expect(selectedSchedule.schedule.payCode.configuration.isOnCall).toBe(true);
        expect(selectedSchedule.schedule.payCode.configuration.isTimeOff).toBe(false);
        });
      });
    });
  });

  const httpErrorWithAuthentication = {
    error: {
      httpStatusCode: 'Unauthorized',
      errorCode: 'USER_SESSION_EXPIRED',
      message: 'The user session for \'API Support apiadmin\' has expired.',
      content: {
        overridable: 'true',
        validationMessages: [
          { scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' }
        ]
      }
    }
  };

  const validationError = {
    error: {
      httpStatusCode: '400', errorCode: 'VALIDATION_MESSAGES_EXIST', message: 'validation error\' has expired.',
      content: {
        overridable: 'true',
        validationMessages: [
          { scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' },
          { scheduleId: '2', description: 'Validation Warning 2', severityLevel: 'Warning' }
        ]
      }
    }
  };

  describe('#onSubmit', () => {
    let scheduleResult: ISchedule;
    beforeEach(() => {
      scheduleResult = {} as ISchedule;
      component = CreateComponent();
      component.employee = employees[0]; // TODO: was setting to employee array??
    });

    describe('#Calls saveSchedule', () => {
      let saveScheduleSpy: jasmine.Spy;
      beforeEach(() => {
        saveScheduleSpy = spyOn(component as any, 'saveSchedule');
        scheduleServiceSdkMock.saveSchedule.and.returnValue(of(scheduleResult));
        component.currentMode = DailyFormMode.EditActivity;
        component.onSubmit(false);
      });

      it('saveSchedule should get call', () => {
        expect(saveScheduleSpy).toHaveBeenCalled();
        expect(saveScheduleSpy).toHaveBeenCalledWith(false);
      });
    });

    describe('#Calls savePayCode', () => {
      let savePaycodeSpy: jasmine.Spy;
      beforeEach(() => {
        savePaycodeSpy = spyOn(component as any, 'savePayCode');
        scheduleServiceSdkMock.savePayCode.and.returnValue(of(scheduleResult));
        component.currentMode = DailyFormMode.EditPaycode;
        component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.onSubmit();
      });

      it('savePayCode should get call', () => {
        expect(savePaycodeSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#saveSchedule', () => {
    let scheduleResult: ISchedule;
    let originalDate: moment.Moment;
    beforeEach(() => {
      scheduleResult = {} as ISchedule;
      component = CreateComponent();
      component.employee = employees[0]; // TODO was setting to employee array. is it even needed?
      component.authorization = expectedResultAuthorization;
      originalDate = moment('04-23-2018');
      originalDate.hour(9);
      originalDate.minute(33);
      component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.facility = {} as IFacility;
    });

    describe('when overrider is true', () => {
      beforeEach(() => {
        scheduleServiceSdkMock.saveSchedule.and.returnValue(of(scheduleResult));
        component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.formModel.facility = {} as IFacility;
      });

      it('on Success when override is true', () => {
        (component as any).saveSchedule(true);
        expect(component.formModel).toBeNull();
      });
      describe('when overrider is true', () => {
        beforeEach(() => {
          scheduleServiceSdkMock.saveSchedule.and.returnValue(of(scheduleResult));
          component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
          component.formModel.facility = {} as IFacility;
        });

        it('on Success when override is true', fakeAsync(() => {
          (component as any).saveSchedule(true);
          tick(1000);
          expect(component.formModel).toBeNull();
        }));
      });
    });

    describe('when overrider is null', () => {
      beforeEach(() => {
        scheduleServiceSdkMock.saveSchedule.and.returnValue(of(scheduleResult));
        component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.formModel.facility = {} as IFacility;
      });
      it('on Success when override is null', fakeAsync(() => {
        (component as any).saveSchedule();
        tick(1000);
        expect(component.formModel).toBeNull();
      }));
    });

    describe('When exception comes', () => {
      beforeEach(() => {
        const modalMock = jasmine.createSpyObj('modal', ['open']);
        component.modal = modalMock;
        // TODO: was doing this before: component.modal.open.call();
      });

      describe('When http error comes', () => {
        beforeEach(() => {
          translateServiceSdkMock.instant.and.returnValue('Validation Warning 1');
          scheduleServiceSdkMock.saveSchedule.and.returnValue(throwError(httpErrorWithAuthentication));
          (component as any).saveSchedule();
        });

        it('show authenticated error', () => {
          expect(component.scheduleValidationWarnings).toBeDefined();
          expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(1);
          expect(component.scheduleValidationWarnings.validationException.validationMessages[0]).toEqual(new ScheduleValidationMessage('', 'Validation Warning 1', '0'));
        });
      });

      describe('When validation error comes', () => {
        beforeEach(() => {
          scheduleServiceSdkMock.saveSchedule.and.returnValue(throwError(validationError));
          (component as any).saveSchedule();
        });

        it('show authenticated error', () => {
          expect(component.scheduleValidationWarnings).toBeDefined();
          expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(2);
          expect(component.scheduleValidationWarnings.validationException.validationMessages[0]).toEqual({ scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' });
          expect(component.scheduleValidationWarnings.validationException.validationMessages[1]).toEqual({ scheduleId: '2', description: 'Validation Warning 2', severityLevel: 'Warning' });
        });
      });
    });

    describe('#savePaycode', () => {
      beforeEach(() => {
        scheduleResult = {} as ISchedule;
        component = CreateComponent();
        component.employee = employees[0]; // TODO: was '= employees;'
        component.authorization = expectedResultAuthorization;
        originalDate = moment('04-23-2018');
        originalDate.hour(9);
        originalDate.minute(33);
        component.formModel = { startDate : originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.startDates.push(originalDate);
        component.formModel.facility = {
          id: '12345',
          code: 'qwerty',
          name: 'RP',
          number: '3',
          timeZoneId: 'America/Chicago'
        } as IFacility;
      });

      describe('On success of savePaycode', () => {
        beforeEach(() => {
          scheduleServiceSdkMock.savePayCode.and.returnValue(of(scheduleResult));
          // TODO toastServiceSdkMock.activate.call();
          (component as any).savePayCode();
        });

        it('formModel should be as null', () => {
          expect(component.formModel).toBeNull();
        });
      });

      describe('When exception comes', () => {
        beforeEach(() => {
          const modalMock = jasmine.createSpyObj('modal', ['open']);
          component.modal = modalMock;
        });

        describe('When http error comes', () => {
          beforeEach(() => {
            translateServiceSdkMock.instant.and.returnValue('Validation Warning 1');
            scheduleServiceSdkMock.savePayCode.and.returnValue(throwError(httpErrorWithAuthentication));
            (component as any).savePayCode();
          });

          it('show authenticated error', () => {
            expect(component.scheduleValidationWarnings).toBeDefined();
            expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(1);
            expect(component.scheduleValidationWarnings.validationException.validationMessages[0]).toEqual(new ScheduleValidationMessage('', 'Validation Warning 1', '0'));
          });
        });

        describe('When validation error comes', () => {
          beforeEach(() => {
            scheduleServiceSdkMock.savePayCode.and.returnValue(throwError(validationError));
            (component as any).savePayCode();
          });

          it('show authenticated error', () => {
            expect(component.scheduleValidationWarnings).toBeDefined();
            expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(2);
            expect(component.scheduleValidationWarnings.validationException.validationMessages[0]).toEqual({ scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' });
            expect(component.scheduleValidationWarnings.validationException.validationMessages[1]).toEqual({ scheduleId: '2', description: 'Validation Warning 2', severityLevel: 'Warning' });
          });
        });
      });
    });

    describe('#onTradeSummaryClose', () => {
      beforeEach(() => {
        component.onTradeSummaryClose();
      });

      it('should set selectedSchedule to null', () => {
        expect(component.selectedSchedule).toBeNull();
      });
    });

    describe('#getPaycodes', () => {
      beforeEach(() => {
        originalDate = moment(new Date('02/02/2019'));
        employeeSdkServiceMock.getPayCodes.calls.reset();
        employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
        component = CreateComponent();
        component.employee = employees[0];
        component.formModel = { startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      });

      it('should return an array of paycodes', () => {
        component.getPayCodes().subscribe((paycodes: Array<IPayCode>) => {// TODO: move the calls to the method under test and data setup out of it() clause
          expect(paycodes.length).not.toBeNull();
        });
      });
    });

    describe('#onPayCodeChanged', () => {
      beforeEach(() => {
        expectResultPaycode[0].configuration.canCreate = true;
        expectResultPaycode[0].configuration.canCreateRequest = false;
        component = CreateComponent();
        component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        spyOn(component, 'setInputAccessibilityForHoursAndAmount');
        employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
        component.onPayCodeChanged(expectResultPaycode[0]);
      });

      it('should detect changes when a new pay code is selected', () => {
        expect(component.setInputAccessibilityForHoursAndAmount).toHaveBeenCalled();
      });

      describe('when can Create Request', () => {
        beforeEach(() => {
          expectResultPaycode[0].configuration.canCreate = false;
          expectResultPaycode[0].configuration.canCreateRequest = true;
          component = CreateComponent();
          component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
          spyOn(component, 'setInputAccessibilityForHoursAndAmount');
          employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
          component.onPayCodeChanged(expectResultPaycode[0]);
        });

        it('should detect changes when a new pay code is selected', () => {
          expect(component.setInputAccessibilityForHoursAndAmount).toHaveBeenCalled();
        });
      });

      describe('when can Create Request', () => {
        const expectResultPaycodeCanCreateRequest = null;
        beforeEach(() => {
          component = CreateComponent();
          component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
          spyOn(component, 'setInputAccessibilityForHoursAndAmount');
          employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycodeCanCreateRequest));
          component.onPayCodeChanged(expectResultPaycodeCanCreateRequest);
        });

        it('Save button title', () => {
          expect(component.submitPaycode).toBeDefined();
        });
      });
      describe('when can Edit Request', () => {
        beforeEach(() => {
          expectResultPaycode[0].configuration.canEdit = true;
          expectResultPaycode[0].configuration.canEditRequest = false;
          component = CreateComponent();
          component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
          component.formModel.guid = 'd9e1fc3f-a536-41d5-9290-bf3bd13dc4d7';
          spyOn(component, 'setInputAccessibilityForHoursAndAmount');
          employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
          component.onPayCodeChanged(expectResultPaycode[0]);
        });

        it('should detect changes when a new pay code is selected', () => {
          expect(component.setInputAccessibilityForHoursAndAmount).toHaveBeenCalled();
        });
        it('should return false for showRequestedReason', () => {
          expect(component.showRequestedReason).toBe(false);
        });
        it('should detect changes when a new pay code is selected', () => {
          expect(mockChangeDetection.detectChanges).toHaveBeenCalled();
        });
      });
    });

    describe('#detectChanges', () => {
      beforeEach(() => {
        component = CreateComponent();
        component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      });

      it('should detect changes when a new pay code is selected', () => {
        component.onPayCodeChanged(undefined); // TODO: move the calls to the method under test and data setup out of it() clause
        expect(mockChangeDetection.detectChanges).toHaveBeenCalled();
      });
    });

    describe('#setInputAccessibilityForHoursAndAmount', () => {
      beforeEach(() => {
        component = CreateComponent();
        component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.formModel.payCode = { id: '1', code: 'abc', configuration: { scheduleValueValidation: '' } } as IPayCodeWithPermissionConfiguration;
      });

      describe('when the schedule value validation is amount', () => {
        beforeEach(() => {
          component.formModel.payCode.configuration.scheduleValueValidation = 'Amount';
          component.setInputAccessibilityForHoursAndAmount();
        });

        it('should set the hours input to disabled', () => {
          expect(component.hoursInputDisabled).toEqual(true);
        });

        it('should not set the amount input to disabled', () => {
          expect(component.amountInputDisabled).toEqual(false);
        });
      });

      describe('when the schedule value validation is hours', () => {
        beforeEach(() => {
          component.formModel.payCode.configuration.scheduleValueValidation = 'Hours';
          component.setInputAccessibilityForHoursAndAmount();
        });

        it('should set the amount input to disabled', () => {
          expect(component.amountInputDisabled).toEqual(true);
        });

        it('should not set the hours input to disabled', () => {
          expect(component.hoursInputDisabled).toEqual(false);
        });
      });

      describe('when a pay code is not selected', () => {
        beforeEach(() => {
          component = CreateComponent();
          component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
          component.formModel.payCode = null;
          component.setInputAccessibilityForHoursAndAmount();
        });

        it('should not affect the hours input or the amount input', () => {
          expect(component.hoursInputDisabled).toEqual(false);
          expect(component.amountInputDisabled).toEqual(false);
        });
      });
    });

    describe('#getCurrentPayPeriod', () => {
      beforeEach(() => {
        employeeSdkServiceMock.getCurrentPayPeriod.calls.reset();
        employeeSdkServiceMock.getCurrentPayPeriod.and.returnValue(of(expectResultCurrentPayCode));

        component = CreateComponent();
        component.employee = employees[0];
      });

      it('should return the current pay period', () => {
        component.getCurrentPayPeriod().subscribe((payPeriod: PayPeriod) => {// TODO: move the calls to the method under test and data setup out of it() clause
          expect(payPeriod).not.toBeNull();
        });
      });
    });
  });

  describe('#popoverScroll', () => {
    beforeEach(() => {
      component = CreateComponent();
    });

    describe('when popover scroll show', () => {
      beforeEach(() => {
        component.popoverScroll(true);
      });
      it('should have popover scroll', () => {
        expect(component.scrollDisplay).toBe(true);
      });
    });
    describe('when popover scroll hide', () => {
      beforeEach(() => {
        component.popoverScroll(false);
      });
      it('should not have popover scroll', () => {
        expect(component.scrollDisplay).toBe(false);
      });
    });
  });
  describe('#editEvent', () => {
    beforeEach(() => {
      const expectedActivities = [
        {
          id: '36',
          code: 'DAY8',
          name: 'DAY8',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '37',
          code: 'EVE8',
          name: 'EVE8',
          startTime: '15:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '38',
          code: 'NIGHT8',
          name: 'NIGHT8',
          startTime: '23:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '40',
          code: 'NP',
          name: 'Non Productive',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity,
        {
          id: '41',
          code: 'NPNM',
          name: 'Non Productive Not Monitored',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null
        } as IActivity
      ];

      const expectedProfiles: IProfile[] = [
        {
          id: '89',
          code: 'ARA01',
          name: 'ARA01',
          number: null
        },
        {
          id: '90',
          code: 'ARA02',
          name: 'ARA02',
          number: null
        }
      ];
      spyOn(component, 'getProfiles').and.returnValue(of(expectedProfiles));
      spyOn(component, 'getActivities').and.returnValue(of(expectedActivities));
      employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
      spyOn(component, 'checkIfQuickCodeExits').and.returnValue(of(expectedResultQuickCode));
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
    });

    describe('when editEvent called', () => {
      beforeEach(() => {
        const payCode = {
          id: '49', code: 'PTO', name: 'Paid Time Off', number: '12',
          configuration: { scheduleStartTimeRequired: true, scheduleValueValidation: 'Hours', canCreate: true, canCreateRequest: false, canEdit: false, canEditRequest: false }
        };
        expectResultPaycode[0] = payCode;
        component = CreateComponent();
        component.employee = employees[0];
        component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.formModel.guid = null;
        employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
        component.editEvent();
      });
      it('Submit button title', () => {
        expect(component.submitPaycode).toEqual('Submit');
      });
    });

    it('Schedule with activity', () => {
      const activityEventNoConfig: IEventData = {

        isTradeable: true,
        eventType: EventTypes.ACTIVITY,
        schedule:  {
          startDate: moment('12-12-2019'),
          endDate: moment('12-12-2019'),
          guid: '123',
          activity: {
            code: 'activity',
            configuration: null
          } as IActivityWithConfig,
          location: {
            configuration: null as ILocationConfig
          },
          profile: { code: 'activityProfile' } as IProfile,
          hours: 8,
          status: null,
        } as IScheduleDetailed<IActivityWithConfig, IPayCodeWithIndicatorConfiguration, ILocationWithConfig>
      };
      component.selectedSchedule$ = of(activityEventNoConfig) as any;
      component.editEvent();
      expect(component.showPayCodeBtn).toBe(false);
    });

    describe('when canCreateRequest', () => {
      beforeEach(() => {
        const payCode = {
          id: '50', code: 'PTO', name: 'Paid Time Off', number: '12',
          configuration: { scheduleStartTimeRequired: true, scheduleValueValidation: 'Hours', canCreate: false, canCreateRequest: true, canEdit: false, canEditRequest: false }
        };
        expectResultPaycode[0] = payCode;
        component = CreateComponent();
        component.employee = employees[0];
        employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
        component.editEvent();

      });
      it('Save button title', () => {
        expect(component.submitPaycode).toEqual('Submit');
      });

      describe('when canCreateRequest false', () => {
        beforeEach(() => {
          const payCode = {
            id: '50', code: 'PTO', name: 'Paid Time Off', number: '12',
            configuration: { scheduleStartTimeRequired: true, scheduleValueValidation: 'Hours', canCreate: false, canCreateRequest: false, canEdit: false, canEditRequest: false }
          };
          expectResultPaycode[0] = payCode;
          component = CreateComponent();
          component.employee = employees[0];
          employeeSdkServiceMock.getPayCodes.and.returnValue(of(expectResultPaycode));
          component.editEvent();
        });
        it('Save button title', () => {
          expect(component.submitPaycode).toEqual('Submit');
        });
      });
    });
    describe('#convertToPayCode', () => {
      beforeEach(() => {
        const originalDate = moment(new Date('02/02/2019'));
        originalDate.hour(9);
        originalDate.minute(33);
        component = CreateComponent();
        component.formModel = { guid: 'd9e1fc3f-a536-41d5-9290-bf3bd13dc4d7', hours: 9, startDate: originalDate } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
        component.selectedDay = expectedResultSelectedDay;
        component.employee = employees[0];
        component.convertToPayCode('d9e1fc3f-a536-41d5-9290-bf3bd13dc4d7');
      });
      it('guid should not be null', () => {
        expect(component.formModel.guid).toEqual('d9e1fc3f-a536-41d5-9290-bf3bd13dc4d7');
      });
    });
  });
  describe('#confirmDelete', () => {
    let mockTranslate: jasmine.SpyObj<TranslateService>;
    const getActiveButtons = (): ModalButton[] => {
      return component.buttons.filter(button => button.condition());
    };

    beforeEach(() => {
      component = CreateComponent();
      component.deleteModal = mockModal;
      component.confirmDelete();
      mockTranslate = jasmine.createSpyObj<TranslateService>('Translate', ['instant']);
      mockTranslate.instant.and.callFake((value: any, params) => {
        switch (value) {
          case 'button.cancel':
            return 'Cancel';
          case 'button.delete':
            return 'Delete';
          default:
            return `translated: ${value}`;
        }
      });
    });

    it('should set title to translated string', () => {
      expect(component.deleteModal.title).toEqual('translated: dailySchedule.confirm-delete-title');
    });

    describe('Cancel button', () => {
      let cancelButton: ModalButton;
      beforeEach(() => {
        cancelButton = getActiveButtons().filter(button => button.styleClass === 'secondary-button')[0];
      });
      it('should show the cancel button', () => {
        expect(cancelButton).toBeDefined();
      });
      it('Cancel button title', () => {
        expect((cancelButton.text as () => string)()).toEqual('translated: button.cancel');
      });

      describe('When clicked', () => {
        let closeSpy: jasmine.Spy;

        beforeEach(() => {
          closeSpy = jasmine.createSpy('close');
          cancelButton.onClick(closeSpy);
        });
        it('should close when clicked', () => {
          expect(closeSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('Delete button', () => {
      let deleteButton: ModalButton;

      beforeEach(() => {
        deleteButton = getActiveButtons().filter(button => button.styleClass === 'priority-button')[0];
      });
      it('should show the delete button', () => {
        expect(deleteButton).toBeDefined();
      });
      it('delete button title', () => {
        expect((deleteButton.text as () => string)()).toEqual('translated: button.delete');
      });

      describe('When clicked', () => {

        let closeSpy: jasmine.Spy;
        let deleteScheduleSpy: jasmine.Spy;
        const status = '200';

        beforeEach(() => {
          closeSpy = jasmine.createSpy('close');
          deleteScheduleSpy = spyOn(component as any, 'deleteSchedule');
          component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
          scheduleServiceSdkMock.deleteSchedule.and.returnValue(of(status));
          deleteButton.onClick(closeSpy);
          component.confirmDelete();
        });

        it('should call deleteSchedule method when clicked', () => {
          expect(deleteScheduleSpy).toHaveBeenCalled();
        });

        it('should close when clicked', () => {
          expect(closeSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
  describe('#deleteSchedule', () => {
    beforeEach(() => {
      component = CreateComponent();
      component.formModel = {} as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.guid = 'd9e1fc3f-a536-41d5-9290-bf3bd13dc4d7';
      component.authorization = expectedResultAuthorization;
      scheduleServiceSdkMock.deleteSchedule.and.returnValue(of(200));
      (component as any).deleteSchedule(component.formModel.guid);
    });

    it('formModel should be as null', () => {
      expect(component.formModel).toBeNull();
    });

    describe('When exception comes', () => {
      beforeEach(() => {
        const modalMock = jasmine.createSpyObj('modal', ['open']);
        component.modal = modalMock;
      });

      describe('When http error comes', () => {
        beforeEach(() => {
          translateServiceSdkMock.instant.and.returnValue('Validation Warning 1');
          scheduleServiceSdkMock.deleteSchedule.and.returnValue(throwError(httpErrorWithAuthentication));
          (component as any).deleteSchedule();
        });
        it('show authenticated error', () => {
          expect(component.scheduleValidationWarnings).toBeDefined();
          expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(1);
          expect(component.scheduleValidationWarnings.validationException.validationMessages[0]).toEqual(new ScheduleValidationMessage('', 'Validation Warning 1', '0'));
        });
      });

      describe('When validation error comes', () => {
        beforeEach(() => {
          scheduleServiceSdkMock.deleteSchedule.and.returnValue(throwError(validationError));
          (component as any).deleteSchedule();
        });
        it('show authenticated error', () => {
          expect(component.scheduleValidationWarnings).toBeDefined();
          expect(component.scheduleValidationWarnings.validationException.validationMessages.length).toEqual(2);
          expect(component.scheduleValidationWarnings.validationException.validationMessages[0]).toEqual({ scheduleId: '1', description: 'Validation Warning 1', severityLevel: 'Warning' });
          expect(component.scheduleValidationWarnings.validationException.validationMessages[1]).toEqual({ scheduleId: '2', description: 'Validation Warning 2', severityLevel: 'Warning' });
        });
      });
    });
  });

  describe('#onQuickcodeChanged', () => {
    beforeEach(() => {
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
      component = CreateComponent();
      const originalDate = moment('04-23-2018');
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      component.formModel.department = {} as IDepartment;
      component.formModel.unit = {} as IUnit;
      component.formModel.profile = {} as IProfile;
      component.formModel.jobClass = {} as IJobClass;
      component.employee = employees[0];
      component.selectedQuickCode = 'testingQC';
      component.onQuickcodeChanged(undefined);
    });

    it('show auto populate values based on Quickcode', () => {
      const event = {
        id: 5180,
        number: 1985,
        code: 'ExpirationQC',
        name: 'Expiration code',
        jobClass: { id: '131', code: 'AR1', name: 'AR1', number: '11100', status: 'Active' },
        position: { jobClass: null },
        location: {
          department: { id: 135, code: 'AR Department A', name: 'AR Department A', number: 11110 },
          facility: { id: 135, code: 'ActiveRoster', name: 'ActiveRoster', number: 11000 },
          unit: null,
          timeZoneId: 'America/Chicago'
        }
      };
      component.onQuickcodeChanged(event);
      expect(component.formModel.facility.code).toBe('ActiveRoster');
    });

    it('show auto populate values based on Quickcode which holds position ID', () => {
      const event = {
        id: 5180,
        number: 1985,
        code: 'ExpirationQC',
        name: 'Expiration code',
        positionID: 12345,
        location: {
          department: { id: 135, code: 'AR Department A', name: 'AR Department A', number: 11110 },
          facility: { id: 135, code: 'ActiveRoster', name: 'ActiveRoster', number: 11000 },
          unit: null,
          timeZoneId: 'America/Chicago'
        }
      };
      component.onQuickcodeChanged(event);
      expect(component.formModel.facility.code).toBe('ActiveRoster');
    });

    it('show auto populate values based on Quickcode with unit', () => {
      const event = {
        id: 5180,
        number: 1985,
        code: 'ExpirationQC',
        name: 'Expiration code',
        jobClass: { id: '131', code: 'AR1', name: 'AR1', number: '11100', status: 'Active' },
        position: { jobClass: null },
        location: {
          department: { id: 135, code: 'AR Department A', name: 'AR Department A', number: 11110 },
          facility: { id: 135, code: 'ActiveRoster', name: 'ActiveRoster', number: 11000 },
          unit: {
            id: 143,
            code: 'ABC',
            number: 5656,
            name: 'DEPARTMENT C',
            status: 'Active'
          },
          timeZoneId: 'America/Chicago'
        }
      };
      component.onQuickcodeChanged(event);
      expect(component.formModel.unit.code).toBe('ABC');
    });

    it('when event is of null', () => {
      const event = null;
      component.onQuickcodeChanged(event);
    });

    it('when location is of null', () => {
      const event = {
        id: 5180,
        number: 1985,
        code: 'ExpirationQC',
        name: 'Expiration code',
        jobClass: { id: '131', code: 'AR1', name: 'AR1', number: '11100', status: 'Active' },
        position: { jobClass: null },
        location: null
      };
      component.onQuickcodeChanged(event);
    });

    it('when position, jobclass,location is of null', () => {
      const event = {
        id: 5180,
        number: 1985,
        code: 'ExpirationQC',
        name: 'Expiration code',
        jobClass: null,
        position: null,
        location: null
      };
      component.onQuickcodeChanged(event);
    });
  });

  describe('#checkIfQuickCodeExits', () => {
    const result = [];
    let originalDate: any;
    beforeEach(() => {
      originalDate = moment(new Date('02/02/2019'));
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
    });

    it('check if quickcodes does not exists', () => {
      spyOn(component, 'getQuickCodes').and.returnValue(of(result));
      component.checkIfQuickCodeExits();
      expect(component.showQuickCode).toBe(false);
    });

    it('check if quickcodes exists', () => {
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
      component.checkIfQuickCodeExits();
      expect(component.showQuickCode).toBe(true);
    });
  });

  describe('#getQuickCode', () => {
    let originalDate: any;
    beforeEach(() => {
      originalDate = moment(new Date('02/02/2019'));
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
      component.employeeCode = 'blue01';
    });

    it('should return an array of Facilities', (done) => {
      component.getQuickCodes().subscribe((quickCodes: Array<IQuickCode>) => {
        expect(quickCodes.length).not.toBeNull();
        done();
      });
    });
  });

  describe('#getMutipleDatesSort', () => {
    let originalDate: any;
    beforeEach(() => {
      originalDate = moment(new Date('02/02/2019'));
      originalDate.hour(9);
      originalDate.minute(33);
      component = CreateComponent();
      component.formModel = { startDate: originalDate, facility: { timeZoneId: 'America/Phoenix' } } as IScheduleDetailed<IActivity, IPayCodeWithPermissionConfiguration, ILocation>;
      employeeSdkServiceMock.getQuickCode.and.returnValue(of(expectedResultQuickCode));
      component.employeeCode = 'blue01';
    });

    it('should have the effective date as undefined when there is no start date', () => {
      component.getMutipleDatesSort();
      expect(component.effectiveDate).toBe(undefined);
    });
  });
});
