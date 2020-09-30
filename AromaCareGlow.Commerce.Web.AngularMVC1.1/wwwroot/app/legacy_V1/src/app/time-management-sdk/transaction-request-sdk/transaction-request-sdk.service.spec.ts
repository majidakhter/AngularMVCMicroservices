

import { MockEnvService } from '../../shared/test-fakes/mock-env';
import { Observable } from 'rxjs';
import { TransactionRequestSdkService } from './transaction-request-sdk.service';
import { TransactionRequestSdkConfig } from './transaction-request-sdk.config';

describe('EmployeeScheduleSdkService', () => {
  let component: TransactionRequestSdkService;
  let httpClientMock;
  const config = new TransactionRequestSdkConfig();

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'expectOne']);
  });

  function CreateComponent() {
    return new TransactionRequestSdkService(httpClientMock, config, MockEnvService);
  }

  describe('#retractTransactionRequest', () => {
    let expectedResult;
    let schedule;
    beforeEach(() => {
      expectedResult = null;
      schedule = { guid: 'c65c5459-c10b-462a-9249-a66d17c17ce2' };
      component = CreateComponent();
      httpClientMock.post.and.returnValue(Observable.of(expectedResult));
    });

    it('should get payCode request retracted and when constraint is selfscheduled', () => {
      component.retractTransactionRequest(schedule.guid, 'SelfScheduled').subscribe((result) => {
        expect(result).toBeNull();
      });
      const uri = (MockEnvService.baseApiPath + config.RETRACT_TRANSACTION_REQUEST_URL).replace('{guid}', 'c65c5459-c10b-462a-9249-a66d17c17ce2');
      httpClientMock.expectOne(uri);
    });

    it('should get payCode request retracted and when constraint is not self scheduled', () => {
      component.retractTransactionRequest(schedule.guid, 'MonthlyView').subscribe((result) => {
        expect(result).toBeNull();
      });
      const uri = (MockEnvService.baseApiPath + config.RETRACT_TRANSACTION_REQUEST_URL).replace('{guid}', 'c65c5459-c10b-462a-9249-a66d17c17ce2');
      httpClientMock.expectOne(uri);
    });
  });

  describe('#retractTradeRequest', () => {
    let expectedResult;
    let schedule;
    let employeeCode;
    beforeEach(() => {
      expectedResult = null;
      employeeCode = 'ARA01';
      schedule = { guid: 'c65c5459-c10b-462a-9249-a66d17c17ce2' };
      component = CreateComponent();
      httpClientMock.post.and.returnValue(Observable.of(expectedResult));
    });

    it('should get trade request retracted', () => {
      component.retractTradeRequest(employeeCode, schedule.guid).subscribe((result) => {
        expect(result).toBeNull();
      });
      const uri = (MockEnvService.baseApiPath + config.RETRACT_SCHEDULE_TRADE_URL)
      .replace('{employeeCode}', 'ARA01')
      .replace('{guid}', 'c65c5459-c10b-462a-9249-a66d17c17ce2');
      httpClientMock.expectOne(uri);
    });
  });
});
