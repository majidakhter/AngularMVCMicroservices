

import { NavigationService } from './navigation.service';
import { of } from 'rxjs';
import { ISection } from 'src/app/time-management-domain/section';
import { NavigationServiceConfig } from './navigationService.config';

describe('Navigation Service', () => {
  let component: NavigationService;
  let httpClient: any;
  let navigationServiceConfig: NavigationServiceConfig;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    navigationServiceConfig = new NavigationServiceConfig();
    component = new NavigationService(httpClient, navigationServiceConfig);
  });

  describe('#getNavigationSections', () => {
    let returnValue: Array<ISection>;
    beforeEach(() => {
      returnValue = new Array<ISection>();
    });

    it('Should return response which is true', done => {
      httpClient.get.and.returnValue(of(returnValue));

      component.getNavigationSections().subscribe(result => {
        expect(result).toBeTruthy();
      });
      done();
    });
  });

  describe('#getSelfScheduleNavigationUrl', () => {
    let returnValue: Array<ISection>;
    let rootPath: string;
    beforeEach(() => {
      returnValue = [{
        name: 'sections.myScheduleMain',
        pageUrl: 'mySchedule',
        sortOrder: 2,
        subMenu: [
          {
            name: 'sections.mySchedule.monthlyView',
            pageUrl: 'EmployeeLoad.aspx?redirect=EmployeeMonthlyView2.aspx',
            sortOrder: 3,
            subMenu: null
          },
          {
            name: 'sections.mySchedule.selfSchedule',
            pageUrl: 'EmployeeLoad.aspx?redirect=EmployeeSelfSchedule2.aspx',
            sortOrder: 4,
            subMenu: null
          }
        ]
      }];
      rootPath = top.location.href.substr(
        0,
        top.location.href.lastIndexOf('/') + 1
      );
    });

    it('Should return response which is the path', done => {
      httpClient.get.and.returnValue(of(returnValue));

      component.getSelfScheduleNavigationUrl().subscribe(result => {
        expect(result).toEqual(rootPath + 'EmployeeLoad.aspx?redirect=EmployeeSelfSchedule2.aspx');
      });
      done();
    });
  });
});
