
import { Observable } from 'rxjs';
import { OrganizationSdkService } from './organization-sdk.service';
import { OrganizationSdkConfig } from './organization-sdk.config';
import { MockEnvService } from '../../shared/test-fakes/mock-env';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import * as moment from 'moment';
import { ICoverage } from 'src/app/time-management-domain/coverage';

describe('OrganizationSdkService', () => {
  let httpClient;
  let organizationService: OrganizationSdkService;
  let configService: OrganizationSdkConfig;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;

  beforeEach(() => {
    configService = new OrganizationSdkConfig();
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'expectOne']);
    organizationService = new OrganizationSdkService(httpClient, MockEnvService, mockDateFormatter);
    mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toUrlDate']);
  });

  describe('#getOrgLevels', () => {

    const levels = [
      {
        number: 1,
        code: 'COM',
        name: 'Company',
        type: 'Organization',
        links: [
          'CalculationRuleHierarchy'
        ]
      },
      {
        number: 2,
        code: 'GROUP',
        name: 'Group',
        type: 'Custom',
        links: []
      },
      {
        number: 3,
        code: 'FAC',
        name: 'Facility',
        type: 'Facility',
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
      },
      {
        number: 4,
        code: 'DIV',
        name: 'Division',
        type: 'Custom',
        links: []
      },
      {
        number: 5,
        code: 'DPT',
        name: 'Department',
        type: 'Department',
        links: [
          'Position',
          'Productivity',
          'Transaction'
        ]
      },
      {
        number: 6,
        code: 'UNT',
        name: 'Unit',
        type: 'Unit',
        links: []
      }
    ];

    beforeEach(() => {
      httpClient.get.and.returnValue(Observable.of({ levels: levels }));
    });

    it('should return org levels', (done) => {
      organizationService.getOrgLevels().subscribe((response: any) => {
        expect(response).toBeDefined();
        expect(response.trunk).toBeDefined();
        expect(response.trunk.name).toEqual('Facility');
        expect(response.branch).toBeDefined();
        expect(response.branch.name).toEqual('Department');
        expect(response.leaf).toBeDefined();
        expect(response.leaf.name).toEqual('Unit');
        done();
      });

      const uri = (MockEnvService.baseApiPath + configService.GET_ORG_LEVEL);
      httpClient.expectOne(uri);

    });

  });

  describe('#getActivityStaffingCoverage', () => {
    const expectedCoverage: ICoverage = {
      organizationEntityId: 34,
      activityStaffingPlanCoverages: [{
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
      }
      ]
    };
    beforeEach(() => {
      httpClient.get.and.returnValue(Observable.of(expectedCoverage));
    });
    describe('When profileGroupId does not have value', () => {
      it('should return ActivityStaffingCoverage', (done) => {
        organizationService.getActivityStaffingCoverage('34', moment('06-08-2019'), moment('07-08-2019'), '54').subscribe((response: ICoverage) => {
          expect(response).toBeDefined();
          expect(response.organizationEntityId).toEqual(34);
          expect(response.activityStaffingPlanCoverages[0].profileGroup.id).toEqual('23');
          expect(response.activityStaffingPlanCoverages[0].profile.id).toEqual('76');
          expect(response.activityStaffingPlanCoverages[0].activity.startTime).toEqual('13:45');
          expect(response.activityStaffingPlanCoverages[0].days[0].needDate).toEqual('05-08-2019');
          done();
        });
        const uri = (MockEnvService.baseApiPath + configService.GET_ACTIVITY_STAFFING_COVERAGE_URL);
        httpClient.expectOne(uri);
      });
    });

    describe('When profileGroupId does not have value', () => {
      it('should return ActivityStaffingCoverage', (done) => {
        organizationService.getActivityStaffingCoverage('34', moment('06-08-2019'), moment('07-08-2019')).subscribe((response: ICoverage) => {
          expect(response).toBeDefined();
          expect(response.organizationEntityId).toEqual(34);
          expect(response.activityStaffingPlanCoverages[0].profileGroup.id).toEqual('23');
          expect(response.activityStaffingPlanCoverages[0].profile.id).toEqual('76');
          expect(response.activityStaffingPlanCoverages[0].activity.startTime).toEqual('13:45');
          expect(response.activityStaffingPlanCoverages[0].days[0].needDate).toEqual('05-08-2019');
          done();
        });
        const uri = (MockEnvService.baseApiPath + configService.GET_ACTIVITY_STAFFING_COVERAGE_URL);
        httpClient.expectOne(uri);
      });
    });
  });
});
