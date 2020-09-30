import { Observable } from 'rxjs';
import { AppSdkService } from './app-sdk.service';
import { AppSdkConfig } from './app-sdk.config';
import { MockEnvService } from 'src/app/shared/test-fakes/mock-env';
import { AppFeatures } from './app.features';

describe('AppSdkService', () => {
  let component: AppSdkService;
  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'expectOne']);
  let config = new AppSdkConfig();
  function CreateComponent() {
    return new AppSdkService(MockEnvService, httpClientMock);
  }
  describe('#getFeatures', () => {
    let expectedResult ;
    beforeEach(() => {
      expectedResult = {
        features: [
          { name: 'ScheduleTrade'},
          { name: 'ExtraShiftsEnabled'},
          { name: 'MSMShiftTrades'},
          { name: 'QualifiedStaff'},
          { name: 'WeeklyView'},
          { name: 'WeeklyView:DemographicsPopover'}
        ]
      };
      component = CreateComponent();
      config = new AppSdkConfig();
    });
    it('should get the features response', () => {
      httpClientMock.get.and.returnValue(Observable.of(expectedResult));
      component.getFeatures().subscribe((res: AppFeatures) => {
        expect(res.isExtraShiftEnabled).toBe(true);
      });
      const uri = MockEnvService.baseApiPath + config.GET_FEATURES_URL;
      httpClientMock.expectOne(uri);
    });
  });
});
