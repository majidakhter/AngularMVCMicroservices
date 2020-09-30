

import { SelfScheduleComponent, SelfScheduledPeriodMode } from './self-schedule.component';
import { EmployeeSdkService } from 'src/app/time-management-sdk/employee-sdk/employee-sdk.service';
import { Store } from '@ngxs/store';
import { EmployeeScheduleSdkService } from 'src/app/time-management-sdk/employee-schedule-sdk/employee-schedule-sdk.service';
import { of } from 'rxjs';
import { Employee } from 'src/app/time-management-domain/employee';
import { IEmployment } from 'src/app/time-management-domain/employment';
import { SetEmployee, SetSchedulePeriods } from '../store/self-schedule/actions/self-schedule.actions';
import * as moment from 'moment';
import { SchedulePeriod } from 'src/app/shared/calendar/schedule-period';
import { ModalComponent } from '@wfm/modal';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { PreferenceSetting, SelfSchedulePeriod } from 'src/app/time-management-domain/preference-setting';
import { SignalrConfig } from 'src/app/time-management-sdk/signalr/signalr.config';
import { SignalrService } from 'src/app/time-management-sdk/signalr/signalr.service';
import { SelfScheduleState } from '../store/self-schedule/states/self-schedule.state';
import { IActivity } from 'src/app/time-management-domain/activity';
import { OrganizationSdkService } from 'src/app/time-management-sdk/organization-sdk/organization-sdk.service';
import { ICoverage } from 'src/app/time-management-domain/coverage';
import { EmployeeOrganizationSdkService } from 'src/app/time-management-sdk/employee-organization-sdk/employee-organization-sdk.service';

describe('SelfScheduleComponent', () => {
  let component: SelfScheduleComponent;
  let mockEmployeeSdkService: jasmine.SpyObj<EmployeeSdkService>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockEmployeeScheduleSdkService: jasmine.SpyObj<EmployeeScheduleSdkService>;
  let mockModal: jasmine.SpyObj<ModalComponent>;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockOrganizationSdkService: jasmine.SpyObj<OrganizationSdkService>;
  let mockEmployeeOrganizationSdkService: jasmine.SpyObj<EmployeeOrganizationSdkService>;
  let mockSignalrService: jasmine.SpyObj<SignalrService>;
  const startDate = moment().startOf('day');
  const endDate = moment(startDate).add(2, 'weeks').endOf('day');
  const mockSignalRConfig = new SignalrConfig();

  const expectedCoverage: ICoverage = {
    organizationEntityId: 135,
    activityStaffingPlanCoverages: [
      {
        profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
        profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
        activity: {
          startTime: '13:45',
          hours: 8,
          lunchHours: 1,
          payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
          start: moment('05-08-2019'),
          end: moment('05-08-2019'),
          id: '44', code: 'test code', name: 'test name', number: '16'
        },
        days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
      },
      {
        profileGroup: { id: '24', code: 'test code 1', name: 'test name 1', number: '6', displayOrder: 89 },
        profile: { id: '77', code: 'test code 2', name: 'test name 2', number: '5' },
        activity: {
          startTime: '13:55',
          hours: 9,
          lunchHours: 1,
          payCode: { id: '98', code: 'test code 3', name: 'test name 3', number: '7' },
          start: moment('06-08-2019'),
          end: moment('06-08-2019'),
          id: '45', code: 'test code 4', name: 'test name 4', number: '17'
        },
        days: [{ needDate: '06-08-2019', need: 5, coverage: 2 }]
      }
    ]
  };

  const schedulePeriod = {
    organizationUnitId: 135,
    dateRange: {
      begin: '2020-05-17',
      end: '2020-05-30'
    },
    managerReviewPeriod: {
      begin: '2020-04-27',
      end: '2020-05-02'
    },
    status: 'Self Scheduling',
    selfSchedulePeriod: {
      begin: '2020-02-27',
      end: '2020-04-27'
    },
    start: moment('2020-05-16'),
    end: moment('2020-05-29'),
    selfScheduleStart: moment('2020-02-26'),
    selfScheduleEnd: moment('2020-04-26')
  };

  const selectedActivity = undefined;

  const expectedPreferenceSetting = new PreferenceSetting();
  expectedPreferenceSetting.organizationEntityId = '34';
  expectedPreferenceSetting.profiles = [{
    id: 76,
    activities: [{id: 44}]
  }];

  beforeEach(() => {
    mockEmployeeSdkService = jasmine.createSpyObj('EmployeeSdkService', ['getEmployee', 'subscribe', 'getSelfSchedulePreference']);
    mockStore = jasmine.createSpyObj<Store>('Store', ['selectSnapshot', 'dispatch']);
    mockEmployeeScheduleSdkService = jasmine.createSpyObj('EmployeeScheduleSdkService', ['getSchedulePeriods', 'subscribe', 'getSelfSchedulePeriodDetails']);
    mockModal = jasmine.createSpyObj('modal', ['open', 'close']);
    mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toMonthDateYear', 'to24HourTime']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockSignalrService = jasmine.createSpyObj('SignalrService', ['configure', 'registerEvent', 'startConnection', 'onEvent']);
    mockOrganizationSdkService = jasmine.createSpyObj('OrganizationSdkService', ['getActivityStaffingCoverage']);
    mockEmployeeOrganizationSdkService = jasmine.createSpyObj('EmployeeOrganizationSdkService', ['getSelfScheduleEmployeeProfiles']);
    mockModal.open.and.callFake(() => { });
    component = createComponent();
    mockStore.selectSnapshot.and.callFake(x => {
      if (x === SelfScheduleState.getSelfSchedulePeriod) {
        return schedulePeriod;
      }
      if (x === SelfScheduleState.getSelectedActivity) {
        return selectedActivity;
      }
    });
  });

  function createComponent(): SelfScheduleComponent {
    const comp = new SelfScheduleComponent(mockEmployeeSdkService, mockStore, mockEmployeeScheduleSdkService, mockDateFormatter, mockTranslateService, mockSignalrService, mockSignalRConfig, mockOrganizationSdkService, mockEmployeeOrganizationSdkService);
    comp.modal = mockModal;
    Object.defineProperty(comp, 'selectedDay$', { writable: true });
    Object.defineProperty(comp, 'preferenceSetting$', { writable: true });
    Object.defineProperty(comp, 'preferenceModal$', { writable: true });
    return comp;
  }

  function getSchedulePeriods(isSetupExist: boolean = false) {
    let schedulePeriods: Array<SchedulePeriod>;

    if (isSetupExist) {
      schedulePeriods = [
        { start: moment(startDate).add(12, 'weeks').endOf('day'), end: moment(startDate).add(12, 'weeks').endOf('day'), status: 'Setup' }
      ];
      return schedulePeriods;
    }

    schedulePeriods = [
      { start: startDate, end: endDate, status: 'Self Scheduling' },
      { start: moment(startDate).add(4, 'weeks').endOf('day'), end: moment(startDate).add(6, 'weeks').endOf('day'), status: 'Self Scheduling' },
      { start: moment(startDate).add(8, 'weeks').endOf('day'), end: moment(startDate).add(10, 'weeks').endOf('day'), status: 'Manual' }
    ];

    return schedulePeriods;
  }

  describe('#ngOnInit', () => {
    beforeEach(() => {
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
      mockStore.dispatch(new SetEmployee(employee));
      component.preferenceSetting$ = of(expectedPreferenceSetting);
      component.preferenceModal$ = of(true);
      spyOn(component, 'checkSchedule');
    });

    describe('When logged-in user has employee information, schedulePeriods & self schedulePeriod', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods();
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate, accessPeriodEndDate: endDate, canSelfSchedule: true }));
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('organizationUnitId will have the data', () => {
        expect(component.organizationUnitId).toEqual('102');
      });

      it('groupSelfScheduleStatus will have value equal to 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
      it('should open modal', () => {
        expect(component.modal.open).toHaveBeenCalled();
      });
    });

    describe('when all the selfschedule periods are closed for the user', () => {
      beforeEach(() => {
        const schedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleEnd: moment('02-06-2188'), selfScheduleStatus: 0, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleEnd: moment('02-06-2199'), selfScheduleStatus: 0, status: 'Self Scheduling'}];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: false }));
        mockTranslateService.instant.and.returnValue('6 days remaining');
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('should have groupSelfScheduleStatus value as 0', () => {
        expect(component.groupSelfScheduleStatus).toEqual(0);
      });
    });
    
    describe('When logged-in user already has the default activity present in the store', () => {
      const selectedActivity = {
        id: 38,
        code: 'NIGHT8',
        name: 'NIGHT8',
        startTime: '23:00:00',
        hours: 8,
        lunchHours: 0,
        payCode: null
      };
      beforeEach(() => {
        mockStore.selectSnapshot.and.returnValue(selectedActivity);
        component.ngOnInit();
      });
      it('getSelectedActivity store should return the default activity ', () => {
        expect(mockStore.selectSnapshot<IActivity>(SelfScheduleState.getSelectedActivity).code).toBe('NIGHT8');
      });
    });

    describe('When logged-in user has employee information, schedulePeriods & self schedulePeriod', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods();
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate, accessPeriodEndDate: endDate, canSelfSchedule: true }));

        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.preferenceModal$ = of(false);
        component.ngOnInit();
      });

      it('should open modal', () => {
        expect(component.modal.close).toHaveBeenCalled();
      });
    });

    describe('when all the selfschedule periods are closed for the user with remaining days are 0 and accessperiod is null', () => {
      beforeEach(() => {
        const schedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleEnd: moment().startOf('day'), selfScheduleStatus: 0, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleEnd: moment().startOf('day'), selfScheduleStatus: 0, status: 'Self Scheduling'}];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: true }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('should have groupSelfScheduleStatus value as 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
    });

    describe('when all the selfschedule periods are closed for the user with remaining days are 1 and accessperiod is null', () => {
      beforeEach(() => {
        const schedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleEnd: moment().startOf('day'), selfScheduleStatus: 0, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleEnd: moment().startOf('day').add(1, 'days'), selfScheduleStatus: 0, status: 'Self Scheduling'}];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: true }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('should have groupSelfScheduleStatus value as 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
    });

    describe('when all the selfschedule periods are closed for the user with remaining days are 1 and accessperiod has value', () => {
      beforeEach(() => {
        const schedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleEnd: moment().startOf('day').add(1, 'days'), selfScheduleStatus: 0, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleEnd: moment().startOf('day').add(1, 'days'), selfScheduleStatus: 0, status: 'Self Scheduling'}];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: moment('07-08-2019'), accessPeriodEndDate: moment().startOf('day'),
        canSelfSchedule: false }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('should have groupSelfScheduleStatus value as 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
    });

    describe('when all the selfschedule periods are closed for the user with remaining days is lesser than 1 and accessperiod has value', () => {
      beforeEach(() => {
        const schedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleEnd: moment().startOf('day').add(1, 'days'), selfScheduleStatus: 0, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleEnd: moment().startOf('day').add(1, 'days'), selfScheduleStatus: 0, status: 'Self Scheduling'}];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: moment('07-08-2019'), accessPeriodEndDate: moment('07-08-2019'),
        canSelfSchedule: false }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('should have groupSelfScheduleStatus value as 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods & self schedulePeriod', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods();
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate, accessPeriodEndDate: endDate, canSelfSchedule: false }));
        component.preferenceSetting$ = of(null);
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('groupSelfScheduleStatus will have value equal to 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods & self schedulePeriod', () => {
      beforeEach(() => {
        const startDate1 = moment().startOf('day');
        const endDate1 = moment(startDate1).add(2, 'weeks').endOf('day');
        const schedulePeriods = [
          { start: startDate1, end: endDate1, status: 'Self Scheduling' },
          { start: moment(startDate1).add(8, 'weeks').endOf('day'), end: moment(startDate1).add(10, 'weeks').endOf('day'), status: 'Manual' }
        ];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockTranslateService.instant.and.returnValue('6 days remaining');
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate1, accessPeriodEndDate: endDate1, canSelfSchedule: true }));
        component.preferenceSetting$ = of(expectedPreferenceSetting);
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('groupSelfScheduleStatus will have value equal to 2', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods & self schedulePeriod which exists', () => {
      beforeEach(() => {
        const startDate1 = moment().startOf('day');
        const endDate1 = moment(startDate1).add(2, 'weeks').endOf('day');
        const schedulePeriods = [
          { start: startDate1, end: endDate1, status: 'Self Scheduling', selfScheduleStart: startDate1, selfScheduleEnd: endDate1 },
          { start: moment(startDate1).add(8, 'weeks').endOf('day'), end: moment(startDate1).add(10, 'weeks').endOf('day'), status: 'Manual' }
        ];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockTranslateService.instant.and.returnValue('6 days remaining');

        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: true }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('GroupSelfScheduledPeriodMode will Exist', () => {
        expect(component.groupSelfScheduleStatus).toEqual(2);
      });
      it('isAccessPeriodStartInFuture will be false', () => {
        expect(component.isAccessPeriodStartInFuture).toEqual(false);
      });
    });

    describe('When logged-in user does not have the schedulePeriods', () => {
      beforeEach(() => {
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(undefined));
        component.ngOnInit();
      });
      it('checkSchedulePeriod should have been set to NotExist', () => {
        expect(component.checkSchedulePeriod).toEqual(SelfScheduledPeriodMode.NotExist);
      });
    });

    describe('When logged-in user have the schedulePeriods without "Self Scheduling" as status', () => {
      beforeEach(() => {
        const schedulePeriods = [{ start: moment, end: moment, status: 'Manual' }];
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        component.ngOnInit();
      });
      it('checkSchedulePeriod should have been set to NotExist', () => {
        expect(component.checkSchedulePeriod).toEqual(SelfScheduledPeriodMode.NotExist);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods with "Setup" as status and accessPeriodDates available', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods(true);
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate, accessPeriodEndDate: endDate, canSelfSchedule: true }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('checkSchedule should have been called', () => {
        expect(component.checkSchedule).toHaveBeenCalledWith(3);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods with "Setup" as status and accessPeriodDates available with canSelfSchedule as false', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods(true);
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: startDate, accessPeriodEndDate: endDate, canSelfSchedule: false }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('checkSchedule should have been called', () => {
        expect(component.checkSchedule).toHaveBeenCalledWith(3);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods with "Setup" as status and accessPeriodDates available for future with canSelfSchedule as false', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods(true);
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: moment(startDate).add(5, 'd'), accessPeriodEndDate: endDate, canSelfSchedule: true }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('checkSchedule should have been called', () => {
        expect(component.checkSchedule).toHaveBeenCalledTimes(0);
      });
      it('isAccessPeriodStartInFuture is true', () => {
        expect(component.isAccessPeriodStartInFuture).toEqual(true);
      });
    });

    describe('When logged-in user has employee information, schedulePeriods with "Setup" as status and accessPeriodDates available for future with canSelfSchedule as false', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods(true);
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: moment(startDate).add(5, 'd'), accessPeriodEndDate: endDate, canSelfSchedule: false }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('checkSchedule should have been called', () => {
        expect(component.checkSchedule).toHaveBeenCalledTimes(0);
      });
      it('isAccessPeriodStartInFuture is true', () => {
        expect(component.isAccessPeriodStartInFuture).toEqual(true);
      });
    });

    describe('When logged-in user has employee information, without "Self Scheduling" as status and with "Setup" as status" and accessPeriodDates are null with canSelfSchedule true', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods(true);
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: true }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('GroupSelfScheduledPeriodMode will be closed', () => {
        expect(component.groupSelfScheduleStatus).toEqual(0);
      });
    });

    describe('When logged-in user has employee information, without "Self Scheduling" as status and with "Setup" as status" and accessPeriodDates are null with canSelfSchedule false', () => {
      beforeEach(() => {
        const schedulePeriods = getSchedulePeriods(true);
        mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
        mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: null, accessPeriodEndDate: null, canSelfSchedule: false }));
        mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
        component.ngOnInit();
      });
      it('GroupSelfScheduledPeriodMode will be closed', () => {
        expect(component.groupSelfScheduleStatus).toEqual(0);
      });
    });

    describe('When logged-in user has employee information, with accessPeriodStartDate is in future', () => {
      describe('When logged-in user can SelfSchedule ', () => {
        beforeEach(() => {
          const schedulePeriods = getSchedulePeriods();
          const start = moment().add(2, 'days').endOf('day');
          const end = moment(startDate).add(2, 'weeks').endOf('day');
          mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
          mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: start, accessPeriodEndDate: end, canSelfSchedule: true }));
          mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
          component.ngOnInit();
        });
        it('isAccessPeriodStartInFuture will be true', () => {
          expect(component.isAccessPeriodStartInFuture).toEqual(false);
        });
      });
      describe('When logged-in user can not SelfSchedule ', () => {
        beforeEach(() => {
          const schedulePeriods = getSchedulePeriods();
          const start = moment().add(2, 'days').endOf('day');
          const end = moment(startDate).add(2, 'weeks').endOf('day');
          mockEmployeeScheduleSdkService.getSchedulePeriods.and.returnValue(of(schedulePeriods));
          mockEmployeeScheduleSdkService.getSelfSchedulePeriodDetails.and.returnValue(of({ accessPeriodStartDate: start, accessPeriodEndDate: end, canSelfSchedule: false }));
          mockStore.dispatch(new SetSchedulePeriods(schedulePeriods));
          component.ngOnInit();
        });
        it('isAccessPeriodStartInFuture will be true', () => {
          expect(component.isAccessPeriodStartInFuture).toEqual(false);
        });
      });
    });
  });

  describe('#checkSchedule', () => {
    describe('When logged-in user have SchedulePeriod', () => {
      beforeEach(() => {
        component.selfSchedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleStatus: 1, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleStatus: 2, status: 'Self Scheduling'}];
        const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
        viewedSelfSchedulePeriods.push(new SelfSchedulePeriod('2020-01-01', '2020-01-15'));
        const schedulePreference = { organizationEntityId: '102', profiles: [{id: 25, activities: [{id: 10}]}], viewedSelfSchedulePeriods: viewedSelfSchedulePeriods };
        mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(schedulePreference));
        component.checkSchedule(SelfScheduledPeriodMode.Exist);
      });
      it('self schedule period exists', () => {
        expect(component.checkSchedulePeriod).toEqual(SelfScheduledPeriodMode.Exist);
      });
      it('isPreferenceAvailable is true', () => {
        expect(component.isPreferenceAvailable).toEqual(true);
      });
    });

    describe('when no preference is selected', () => {
      beforeEach(() => {
        component.selfSchedulePeriods = [{start: moment('06-08-2019'), end: moment('07-08-2019'), selfScheduleStatus: 1, status: 'Self Scheduling'},
        {start: moment('06-08-2020'), end: moment('07-08-2020'), selfScheduleStatus: 2, status: 'Self Scheduling'}];
        const viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
        const schedulePreference = { organizationEntityId: 0, profiles: [], viewedSelfSchedulePeriods: viewedSelfSchedulePeriods };
        mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(schedulePreference));
        mockOrganizationSdkService.getActivityStaffingCoverage.and.returnValue(of(expectedCoverage));
        const expectedProfiles = [{ id: '76', code: 'test code', name: 'test name', number: '4' }];
        mockEmployeeOrganizationSdkService.getSelfScheduleEmployeeProfiles.and.returnValue(of(expectedProfiles));
        component.checkSchedule(SelfScheduledPeriodMode.Exist);
      });
      it('isPreferenceAvailable will be true', () => {
        expect(component.isPreferenceAvailable).toEqual(false);
      });
      it('modal pop up to set preference is not called', () => {
        expect(component.modal.open).toHaveBeenCalledTimes(1);
      });
    });

    describe('When logged-in user does not have SchedulePeriod', () => {
      beforeEach(() => {
        mockEmployeeSdkService.getSelfSchedulePreference.and.returnValue(of(null));
        component.checkSchedule(SelfScheduledPeriodMode.NotExist);
      });
      it('self schedule period does not exists', () => {
        expect(component.checkSchedulePeriod).toEqual(SelfScheduledPeriodMode.NotExist);
      });
    });
  });

  describe('#IsSelectedSelfScheduleExits', () => {
    beforeEach(() => {
      component.IsSelectedSelfScheduleExits(true);
    });
    it('isSelectedSelfScheduleExits is true', () => {
      expect(component.isSelectedSelfScheduleExits).toEqual(true);
    });
  });
});
