import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { IPayCodeWithPermissionConfiguration } from 'src/app/time-management-domain/pay-code';
import { MockEnvService } from '../../shared/test-fakes/mock-env';
import { IPosition } from '../../time-management-domain/position';
import { EmployeeOrganizationSdkConfig } from './employee-organization-sdk.config';
import { EmployeeOrganizationSdkService } from './employee-organization-sdk.service';
describe('EmployeeOrganizationService', () => {
  let httpClient;
  let employeeOrganizationService: EmployeeOrganizationSdkService;
  let config: EmployeeOrganizationSdkConfig;
  let response: any;

  beforeEach(() => {
    config = new EmployeeOrganizationSdkConfig();
    let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
    mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toShortDate', 'format', 'toIsoDate', 'toUrlDate']);
    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'expectOne']);
    employeeOrganizationService = new EmployeeOrganizationSdkService(httpClient, MockEnvService, mockDateFormatter);

  });

  describe('#getEmployeePositions', () => {
    beforeEach(() => {
      response = {
        positions: [{
          id: '1',
          code: 'P1',
          name: 'First Position',
          number: 11
        }, {
          id: '2',
          code: 'P2',
          name: 'Second Position',
          number: 22
        }]
      };
      httpClient.get.and.returnValue(Observable.of(response));
    });

    describe('when employee code and organization ID are passed in', () => {
      it('should return the positions', (done) => {
        employeeOrganizationService.getEmployeePositions('smith', 'abc123', true).subscribe((res) => {
          expect(res.length).toBe(2);
          done();
        });

        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });

    describe('when employee code, organization ID and profile is passed in', () => {
      it('should return the positions', (done) => {
        employeeOrganizationService.getEmployeePositions('smith', 'abc123', true, 'XYZ987').subscribe((res) => {
          expect(res.length).toBe(2);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });

    describe('when no employee code and organization ID are passed in', () => {
      it('should not return the positions', (done) => {
        const emptyResponse = {
          positions: []
        };
        httpClient.get.and.returnValue(Observable.of(emptyResponse));
        employeeOrganizationService.getEmployeePositions(null, null, false).subscribe((res) => {
          expect(res.length).toBe(0);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });

    describe('when no employee code, organization and  IDforActivities is passed in', () => {
      it('should not return the positions', (done) => {
        const emptyResponse = {
          positions: []
        };
        httpClient.get.and.returnValue(Observable.of(emptyResponse));
        employeeOrganizationService.getEmployeePositions(null, null).subscribe((res) => {
          expect(res.length).toBe(0);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_POSITIONS_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });
  });

  describe('#getEmployeeActivities', () => {
    beforeEach(() => {
      response = {
        activities: [{
          id: '1',
          code: 'A1',
          name: 'First Activity',
          number: 11
        }, {
          id: '2',
          code: 'A2',
          name: 'Second Activity',
          number: 22
        }]
      };
      httpClient.get.and.returnValue(Observable.of(response));
    });

    describe('when employee code and organization ID are passed in', () => {
      it('should return the activities', (done) => {
        employeeOrganizationService.getEmployeeActivities('smith', 'abc123').subscribe((res) => {
          expect(res.length).toBe(2);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_ACTIVITIES_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });

    describe('when no employee code and organization ID are passed in', () => {
      it('should not return the activities', (done) => {
        const emptyResponse = {
          activities: []
        };
        httpClient.get.and.returnValue(Observable.of(emptyResponse));
        employeeOrganizationService.getEmployeeActivities(null, null).subscribe((res) => {
          expect(res.length).toBe(0);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_ACTIVITIES_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });
  });

  describe('#getEmployeePayCodes', () => {
    let serviceResponse: IPayCodeWithPermissionConfiguration[];
    let uri: string;

    beforeEach(() => {
      response = {
        payCodes: [{
          id: '1',
          code: 'PC1',
          name: 'Pay Code 1',
          number: 1,
          configuration: {
            scheduleStartTimeRequired: true,
            scheduleValueValidation: 'x'
          }
        }, {
          id: '2',
          code: 'PC2',
          name: 'Pay Code 2',
          number: 2,
          configuration: {
            scheduleStartTimeRequired: true,
            scheduleValueValidation: 'x'
          }
        }]
      };
      httpClient.get.and.returnValue(Observable.of(response));
    });

    describe('when the employee code and organization id are provided', () => {
      beforeEach(async (done: DoneFn) => {
        employeeOrganizationService.getEmployeePayCodes('smith', 'orgUnitId').subscribe((res) => {
          serviceResponse = res;
          done();
        });

        uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_PAY_CODES_URL).replace('{employeeCode}', 'smith').replace('{organizationEntityId}', 'orgUnitId');
      });

      it('should return the paycodes', () => {
        httpClient.expectOne(uri);
        expect(serviceResponse.length).toEqual(2);
      });
    });

    describe('when nulls are passed in', () => {
      beforeEach(async (done: DoneFn) => {
        const emptyResponse = {
          payCodes: []
        };

        httpClient.get.and.returnValue(Observable.of(emptyResponse));
        employeeOrganizationService.getEmployeePayCodes(null, null).subscribe((res) => {
          serviceResponse = res;
          done();
        });

        uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_PAY_CODES_URL).replace('{employeeCode}', '').replace('{organizationEntityId}', '');
      });

      it('should not return the pay codes', () => {
        httpClient.expectOne(uri);
        expect(serviceResponse.length).toEqual(0);
      });
    });
  });

  describe('#getEmployeeJobClasses', () => {
    beforeEach(() => {
      response = {
        jobClasses: [{
          id: '1',
          code: 'JC1',
          name: 'First Job Class',
          number: 11
        }, {
          id: '2',
          code: 'JC2',
          name: 'Second Job Class',
          number: 22
        }]
      };
      httpClient.get.and.returnValue(Observable.of(response));
    });

    describe('when employee code and organization ID are passed in', () => {
      it('should return the job classes', (done) => {
        employeeOrganizationService.getEmployeeJobClasses('smith', 'abc123').subscribe((res) => {
          expect(res.length).toBe(2);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_JOB_CLASSES_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });

    describe('when employee code and organization ID are passed in', () => {
      it('should not return the job classes', (done) => {
        const emptyResponse = {
          jobClasses: []
        };
        httpClient.get.and.returnValue(Observable.of(emptyResponse));
        employeeOrganizationService.getEmployeeJobClasses(null, null).subscribe((res) => {
          expect(res.length).toBe(0);
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_JOB_CLASSES_URL).replace('{employeeCode}', '73');
        httpClient.expectOne(uri);
      });
    });
  });

  describe('#getEmployeeProfiles', () => {
    beforeEach(() => {
      response = {
        profiles: [{
          id: '1',
          code: 'P1',
          name: 'First Profile',
          number: 11
        }, {
          id: '2',
          code: 'P2',
          name: 'Second Profile',
          number: 22
        }]
      };
      httpClient.get.and.returnValue(Observable.of(response));
    });

    describe('#getSelfScheduleEmployeeProfiles', () => {
      beforeEach(() => {
        response = {
          profiles: [{
            id: '1',
            code: 'P1',
            name: 'First Profile',
            number: 11
          }, {
            id: '2',
            code: 'P2',
            name: 'Second Profile',
            number: 22
          }]
        };
        httpClient.get.and.returnValue(Observable.of(response));
      });

      describe('when there is no employee code retrieved and when start date and end dates are not passed in', () => {
        it('should not return the profiles', (done) => {
          const emptyResponse = {
            profiles: []
          };
          httpClient.get.and.returnValue(Observable.of(emptyResponse));
          employeeOrganizationService.getSelfScheduleEmployeeProfiles(null, null, null, null).subscribe((res) => {
            expect(res.length).toBe(0);
            done();
          });
        });
      });

      describe('when there is employee code available, organization ID and position are passed in', () => {
        it('should return the profiles', (done) => {
          const position: IPosition = { id: '999' } as IPosition;
          employeeOrganizationService.getEmployeeProfiles('smith', 'abc123', position).subscribe((res) => {
            expect(res.length).toBe(2);
            done();
          });
        });
      });

      describe('when there is no employee code, organization ID and position are passed in', () => {
        it('should not return the profiles', (done) => {
          const emptyResponse = {
            profiles: []
          };
          httpClient.get.and.returnValue(Observable.of(emptyResponse));
          employeeOrganizationService.getEmployeeProfiles(null, null, null).subscribe((res) => {
            expect(res.length).toBe(0);
            done();
          });
        });
      });
    });

    describe('#getOrganizationEntities', () => {
      let responseMock;
      beforeEach(() => {
        responseMock = {
          entities: [{
            id: 265,
            number: 41110,
            code: 'CPP Dep1',
            name: 'CPP Dep1',
            type: 'Department',
            location: [
              {
                department: {
                  code: 'CPP Dep1',
                  id: 265,
                  name: 'CPP Dep1',
                  number: 41110
                },
                facility: {
                  code: 'PayPeriodClose',
                  id: 209,
                  name: 'PayPeriodClose',
                  number: 41000
                },
                timeZoneId: 'America/Chicago',
                unit: null,
                lunchHours: 0
              }
            ]
          }]
        };

        httpClient.get.and.returnValue(Observable.of(responseMock));
      });

      describe('when there is employee code retrieved, effectiveDate are passed in', () => {
        it('should return the entities', (done) => {
          employeeOrganizationService.getOrganizationEntities('smith', moment('2019-05-10')).subscribe((res) => {
            expect(res.length).toBe(1);
            expect(res[0].id).toEqual(responseMock.entities[0].id);
            expect(res[0].number).toEqual(responseMock.entities[0].number);
            expect(res[0].code).toEqual(responseMock.entities[0].code);
            expect(res[0].name).toEqual(responseMock.entities[0].name);
            expect(res[0].type).toEqual(responseMock.entities[0].type);
            expect(res[0].type).toEqual(responseMock.entities[0].type);
            expect(res[0].location[0].department.code).toEqual(responseMock.entities[0].location[0].department.code);
            expect(res[0].location[0].facility.code).toEqual(responseMock.entities[0].location[0].facility.code);
            expect(res[0].location[0].timeZoneId).toEqual(responseMock.entities[0].location[0].timeZoneId);
            done();
          });
          const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_ORGANIZATION_ENTITIES_URL).replace('{employeeCode}', '73').replace('{date}', '2017-04-06');
          httpClient.expectOne(uri);
        });
      });

      describe('when there is no employee code available and when effectiveDate are passed in', () => {
        it('should not return the entities', (done) => {
          const emptyResponse = {
            entities: []
          };
          httpClient.get.and.returnValue(Observable.of(emptyResponse));
          employeeOrganizationService.getOrganizationEntities(null, null).subscribe((res) => {
            expect(res.length).toBe(0);
            done();
          });
        });
      });
    });
  });
});
