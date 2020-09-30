
import { QuickViewScheduleComponent } from './quick-view-schedule.component';
import { TransactionRequestSdkService } from 'src/app/time-management-sdk/transaction-request-sdk/transaction-request-sdk.service';
import { ISchedule } from 'src/app/time-management-domain/schedule';
import { EventTypes } from 'src/app/time-management-domain/event-types';
import { of, Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import { EventDetailsSetup } from '../event-details-setup.service';

export class RetractSelfScheduleMessageServiceMock {
  public subject = new Subject<any>();

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

describe('#QuickViewScheduleComponent', () => {
  let transactionRequestSdkServiceMock: jasmine.SpyObj<TransactionRequestSdkService>;
  let retractSelfScheduleMessageServiceMock: RetractSelfScheduleMessageServiceMock;
  let mockScheduleEvent: ISchedule = null;
  let mockEventDetailsSetup: jasmine.SpyObj<EventDetailsSetup>;
  let component: QuickViewScheduleComponent;

  const retractResponse = [];

  function createComponent(): QuickViewScheduleComponent {
    return new QuickViewScheduleComponent(
      transactionRequestSdkServiceMock, retractSelfScheduleMessageServiceMock, mockEventDetailsSetup);
  }

  beforeEach(() => {
    transactionRequestSdkServiceMock = jasmine.createSpyObj('TransactionRequestSdkService', ['retractTransactionRequest']);
    retractSelfScheduleMessageServiceMock = jasmine.createSpyObj('RetractSelfScheduleMessageService', ['']);
    mockEventDetailsSetup = jasmine.createSpyObj('EventDetailsSetup', ['mapEvent']);
    component = createComponent();

    mockScheduleEvent = {
      eventType: EventTypes.PAYCODE,
      schedule: {
        isScheduledHours: true,
        startDate: moment('2019-04-13T12:00:00.000Z'),
        endDate: moment('2019-04-16T12:00:00.000Z'),
        isActivity: null,
        requestedDate: null,
        hasStartTime: true,
        status: 'Uncalculated',
        hours: 8,
        amount: null,
        jobClass: {
          id: '131',
          code: 'AR1',
          name: 'AR1',
          number: '11100',
          status: null
        },
        payCode: null,
        lunchHours: 0,
        profile: {
          id: '89',
          code: 'ARA01',
          name: 'ARA01',
          number: null
        },
        position: {
          jobClasses: null,
          id: '294',
          code: 'ARA01',
          name: 'ARA01',
          number: '11111'
        },
        isExtraShift: false,
        guid: '7ea8f281-9a9c-4c70-8786-9dcee3e51ee3',
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
        timeZone: 'America/Chicago',
        etag: '\'636903010023780000\'',
        isTradeRequested: false,
        isScheduleTradable: true,
        isScheduleRetractable: false,
        activity: {
          id: '36',
          code: 'DAY8',
          name: 'DAY8',
          startTime: '07:00:00',
          hours: 8,
          lunchHours: 0,
          payCode: null,
          end: null,
          number: null,
          start: null
        },
        employee: {
          id: 1245,
          code: 'ARA01',
          firstName: 'ARA01',
          lastName: 'ARA01',
          middleName: null
        }
      } as ISchedule,
      isTradeable: false
    } as any;

    transactionRequestSdkServiceMock.retractTransactionRequest.calls.reset();
  });

  it('default value for isClicked to be false', () => {
    expect(component.isClicked).toEqual(false);
  });

  describe('#retractTransactionRequest', () => {
    beforeEach(() => {
      component = createComponent();
      component.event = mockScheduleEvent;
    });

    describe('Should retract self schedule', () => {
      beforeEach(() => {
        component.retractSelfScheduleMessageService = new RetractSelfScheduleMessageServiceMock();
        transactionRequestSdkServiceMock.retractTransactionRequest.and.returnValue(of(retractResponse));
        component.retractSelfSchedule();
      });
      it('should call the transaction request-retract services', () => {
        expect(transactionRequestSdkServiceMock.retractTransactionRequest).toHaveBeenCalledWith(mockScheduleEvent.guid, 'SelfScheduled');
      });
    });
  });
});
