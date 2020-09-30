

import { MockEnvService } from '../../shared/test-fakes/mock-env';
import { EmployeeSdkService } from './employee-sdk.service';
import { EmployeeSdkConfig } from './employee-sdk.config';
import { IDepartment } from '../../time-management-domain/org-unit';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DateFormatter } from '../../shared/date-formats/date-formatter';
import { PayPeriod } from '../../time-management-domain/pay-period';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { IEmployeeSchedulException, IEmployeeScheduleExceptionResponse } from 'src/app/time-management-domain/employee';

describe('EmployeeSdkService', () => {
  let component: EmployeeSdkService;
  const httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'expectOne', 'expectNone', 'put', 'subscribe', 'verify']);
  let config = new EmployeeSdkConfig();
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  mockDateFormatter = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toShortDate', 'format', 'toIsoDate', 'toUrlDate', 'toMonthDay', 'toShortMonth']);

  function CreateComponent() {
    return new EmployeeSdkService(httpClientMock, config, MockEnvService, mockDateFormatter);
  }

  describe('getAuthorization', () => {
    let expectedResult;
    let employee;
    beforeEach(() => {
      expectedResult = {
        clockingAccess: {
          canCreate: false,
          canRead: false,
          canUpdate: false,
          canDelete: false,
          canApprove: false,
          canDeny: false
        },
        scheduleAccess: {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
          canApprove: false,
          canDeny: false
        },
        publishedScheduleAccess: {
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
          canApprove: false,
          canDeny: false
        }
      };
      employee = { code: 73 };
      component = CreateComponent();
      httpClientMock.get.and.returnValue(Observable.of(expectedResult));
    });

    it('should get payCode authorization', (done) => {
      component.getAuthorization(employee.code).subscribe((result) => {
        expect(result.payCode.canCreate).toBeTruthy();
        expect(result.payCode.canRead).toBeTruthy();
        expect(result.payCode.canUpdate).toBeTruthy();
        expect(result.payCode.canDelete).toBeTruthy();
        done();
      });
      const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_AUTHORIZATION_URL).replace('{code}', '73');
      httpClientMock.expectOne(uri);
    });

  });

  describe('getFacilities', () => {
    let employee;
    const expectedFacilitys = {
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
          id: 160,
          code: 'ADMINS',
          name: 'ADMINS',
          number: 99991,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        },
        {
          id: 99,
          code: 'AS CPP',
          name: 'AS CPP',
          number: 13000,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        },
        {
          id: 353,
          code: 'AS Performance01',
          name: 'AS Performance01',
          number: 6613651,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        }
      ]
    };

    beforeEach(() => {
      employee = { code: 77 };
      component = CreateComponent();
      config = new EmployeeSdkConfig();
      httpClientMock.get.and.returnValue(Observable.of(expectedFacilitys));
    });

    it('should get facility for employee code and default constraint', (done) => {
      component.getFacilities(employee.code).subscribe((facilities) => {
        expect(facilities).toBeDefined();
        expect(facilities.facilities.length).toEqual(expectedFacilitys.facilities.length);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_FACILITIES_URL.replace('{employeeCode}', employee.code);
      httpClientMock.expectOne(uri);
    });

    it('should get facility for employee code and mapped constraint', (done) => {
      component.getFacilities(employee.code, EmployeeSdkService.Constraints.ForActivity).subscribe((facilities) => {
        expect(facilities).toBeDefined();
        expect(facilities.facilities.length).toEqual(expectedFacilitys.facilities.length);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_FACILITIES_URL.replace('{employeeCode}', employee.code).replace('{constraint}', EmployeeSdkService.Constraints.ForActivity);
      httpClientMock.expectOne(uri);
    });

  });

  describe('getDepartments', () => {
    let employee;
    let facility;
    const expectedDepartments = {
      departments: [
        {
          id: 337,
          code: 'DEPTA',
          name: 'DEPARTMENT a',
          number: 55101,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        },
        {
          id: 338,
          code: 'DEPTB',
          name: 'DEPARTMENT b',
          number: 55101,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        },
        {
          id: 339,
          code: 'DEPTC',
          name: 'DEPARTMENT c',
          number: 55102,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        },
        {
          id: 340,
          code: 'DEPTD',
          name: 'DEPARTMENT d',
          number: 55103,
          status: 'Active',
          timeZoneId: 'America/Chicago'
        }
      ]
    };

    beforeEach(() => {
      employee = { code: 77 };
      facility = { id: 337, code: 'ACB', name: 'Adam\'s Extra Org Units', number: 55100, status: 'Active', timeZoneId: 'America/Chicago' };
      component = CreateComponent();
      config = new EmployeeSdkConfig();
      httpClientMock.get.and.returnValue(Observable.of(expectedDepartments));
    });

    it('should get departments for employee code, facility and default constraint', (done) => {
      component.getDepartments(employee.code, facility).subscribe((departments) => {
        expect(departments).toBeDefined();
        expect(departments.length).toEqual(expectedDepartments.departments.length);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_DEPARTMENTS_URL.replace('{employeeCode}', employee.code).replace('{facilityId}', facility.id);
      httpClientMock.expectOne(uri);
    });

    it('should get departments for employee code, facility and mapped constraint', (done) => {
      component.getDepartments(employee.code, facility, EmployeeSdkService.Constraints.ForActivity).subscribe((departments) => {
        expect(departments).toBeDefined();
        expect(departments.length).toEqual(expectedDepartments.departments.length);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_DEPARTMENTS_URL.replace('{employeeCode}', employee.code).replace('{facilityId}', facility.id)
        .replace('{constraint}', EmployeeSdkService.Constraints.ForActivity);
      httpClientMock.expectOne(uri);
    });

    it('should not get departments when faility is not available', (done) => {
      const nullFacility = null;
      const emptyDepartments = {
        departments: []
      };
      httpClientMock.get.and.returnValue(Observable.of(emptyDepartments));
      component.getDepartments(employee.code, nullFacility).subscribe((departments) => {
        expect(departments).toBeDefined();
        expect(departments.length).toEqual(0);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_DEPARTMENTS_URL.replace('{employeeCode}', employee.code).replace('{facilityId}', null)
        .replace('{constraint}', EmployeeSdkService.Constraints.ForActivity);
      httpClientMock.expectOne(uri);
    });

  });

  describe('getUnits', () => {
    let employee;
    const department = {} as IDepartment;
    const expectedUnits = {
      units: [
        {
          id: 29,
          name: 'Unit A',
          code: 'Unit A',
          number: 10,
          status: 'Active'
        },
        {
          id: 32,
          name: 'Unit B',
          code: 'Unit B',
          number: 11,
          status: 'Active'
        },
        {
          id: 33,
          name: 'Unit C',
          code: 'Unit C',
          number: 12,
          status: 'Inactive'
        }
      ]
    };

    beforeEach(() => {
      employee = { code: 77 };
      department.id = '45';
      department.code = 'PICU';
      department.name = 'Pediatrics ICU';
      department.number = '1002';
      component = CreateComponent();
      config = new EmployeeSdkConfig();
      httpClientMock.get.and.returnValue(Observable.of(expectedUnits));
    });

    it('should get units for employee code, department and default constraint', (done) => {
      component.getUnits(employee.code, department).subscribe((units) => {
        expect(units).toBeDefined();
        expect(units.length).toEqual(expectedUnits.units.length);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_UNITS_URL.replace('{employeeCode}', employee.code).replace('{departmentId}', department.id);
      httpClientMock.expectOne(uri);
    });

    it('should get units for employee code, department and mapped constraint', (done) => {
      component.getUnits(employee.code, department, EmployeeSdkService.Constraints.ForActivity).subscribe((units) => {
        expect(units).toBeDefined();
        expect(units.length).toEqual(expectedUnits.units.length);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_UNITS_URL.replace('{employeeCode}', employee.code).replace('{departmentId}', department.id)
        .replace('{constraint}', EmployeeSdkService.Constraints.ForActivity);
      httpClientMock.expectOne(uri);
    });

    it('should not get units when department is not available', (done) => {
      const nullDepartment = null;
      const emptyUnits = {
        units: []
      };
      httpClientMock.get.and.returnValue(Observable.of(emptyUnits));
      component.getUnits(employee.code, nullDepartment).subscribe((units) => {
        expect(units).toBeDefined();
        expect(units.length).toEqual(0);

        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_UNITS_URL.replace('{employeeCode}', employee.code).replace('{departmentId}', null)
        .replace('{constraint}', EmployeeSdkService.Constraints.ForActivity);
      httpClientMock.expectOne(uri);
    });
  });

  describe('getEmployee', () => {
    let employee;
    let expectedResult;

    beforeEach(() => {
      employee = { code: 77 };
      expectedResult = {
        id: 1245,
        code: 'ARA01',
        firstName: 'ARA01',
        lastName: 'ARA01',
        employment: {
          profession: {
            jobClass: {
              id: 131,
              code: 'AR1',
              name: 'AR1',
              number: 11100
            },
            shift: null,
            fte: 0,
            classification: {
              id: 1,
              code: 'FT',
              name: 'Full-Time Hourly',
              number: null
            },
            approvedHours: 0,
            weeklyOvertimeHours: 0,
            position: {
              jobClass: {
                id: 131,
                code: 'AR1',
                name: 'AR1',
                number: 11100
              },
              id: 294,
              code: 'ARA01',
              name: 'ARA01',
              number: 11111
            },
            hireDate: '2000-01-01',
            seniorityDate: null
          },
          location: {
            facility: {
              id: 134,
              code: 'AR',
              name: 'AR-fac01',
              number: 11000
            },
            department: {
              id: 135,
              code: 'AR Department A',
              name: 'AR Department A',
              number: 11110
            },
            unit: null,
            timeZoneId: 'America/Chicago'
          },
          effectiveDate: '2008-08-10',
          expireDate: null,
          classification: 'PrimaryHome'
        }
      };
      component = CreateComponent();
      config = new EmployeeSdkConfig();
    });

    it('should get employee details for employee code', (done) => {
      httpClientMock.get.and.returnValue(Observable.of(expectedResult));
      component.getEmployee(employee.code).subscribe((result) => {
        expect(result.id).toEqual(expectedResult.id);
        expect(result.code).toEqual(expectedResult.code);
        expect(result.firstName).toEqual(expectedResult.firstName);
        expect(result.lastName).toEqual(expectedResult.lastName);
        done();
      });
      const uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_DETAILS_URL.replace('{code}', employee.code);
      httpClientMock.expectOne(uri);
    });
  });

  describe('getPaycode', () => {
    let employee;
    let expectedResult;
    let date;

    beforeEach(() => {
      date = moment('2018-05-07');
      employee = { code: 77 };
      expectedResult = {
        payCodes: [{
          id: '123',
          code: '123abc',
          name: 'First Pay Code',
          number: 456,
          configuration: { scheduleValueValidation: 'All' }
        }, {
          id: '456',
          code: '456def',
          name: 'Second Pay Code',
          number: 789,
          configuration: { scheduleValueValidation: 'Amount' }
        }]
      };
      component = CreateComponent();
      config = new EmployeeSdkConfig();
    });

    it('should get the pay codes', (done) => {
      httpClientMock.get.and.returnValue(Observable.of(expectedResult));
      component.getPayCodes(employee.code, date).subscribe((result) => {
        expect(result.length).toBe(2);
        expect(result[1].id).toBe(expectedResult.payCodes[1].id);
        expect(result[1].code).toBe(expectedResult.payCodes[1].code);
        expect(result[1].name).toBe(expectedResult.payCodes[1].name);
        expect(result[1].number).toBe(expectedResult.payCodes[1].number);
        done();
      });
      const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_PAY_CODES_URL).replace('{employeeCode}', '73').replace('{date}', '2017-04-06');
      httpClientMock.expectOne(uri);
    });

    describe('when employee code is not defined', () => {
      it('should replace {code} with empty string in url', (done) => {
        component.getPayCodes(null, date).subscribe(() => {
          done();
        });
        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_PAY_CODES_URL).replace('{employeeCode}', ' ').replace('{date}', '2017-04-06');
        httpClientMock.expectOne(uri);
      });
    });

  });

  describe('#getCurrentPayPeriod', () => {
    let employee;
    let expectedCurrentPaycodeResult;
    beforeEach(() => {
      employee = { code: 73 };

      expectedCurrentPaycodeResult = {
        body: {
          payPeriods: [{
            id: 102,
            beginDate: '2018-01-21',
            endDate: '2018-02-04',
            type: 'Current'
          }]
        }
      };
      component = CreateComponent();
      config = new EmployeeSdkConfig();
    });

    it('should get the current pay period', (done) => {
      httpClientMock.get.and.returnValue(Observable.of(expectedCurrentPaycodeResult));
      component.getCurrentPayPeriod(employee.code).subscribe((result) => {
        expect(result).toEqual(jasmine.any(PayPeriod));
        expect(result.id).toBe(expectedCurrentPaycodeResult.body.payPeriods[0].id);
        expect(result.beginDate).toBe(expectedCurrentPaycodeResult.body.payPeriods[0].beginDate);
        expect(result.endDate).toBe(expectedCurrentPaycodeResult.body.payPeriods[0].endDate);
        expect(result.type).toBe(expectedCurrentPaycodeResult.body.payPeriods[0].type);
        done();
      });

      const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_CURRENT_PAY_PERIOD_URL).replace('{code}', '73');
      httpClientMock.expectOne(uri);
    });

    describe('and no pay period is returned', () => {
      beforeEach(() => {
        expectedCurrentPaycodeResult = {
          body: {
            payPeriods: []
          }
        };
      });

      it('should return null', (done) => {
        httpClientMock.get.and.returnValue(Observable.of(expectedCurrentPaycodeResult));
        component.getCurrentPayPeriod(employee.code).subscribe((result) => {
          expect(result).toBeNull();
          done();
        });

        const uri = (MockEnvService.baseApiPath + config.GET_EMPLOYEE_CURRENT_PAY_PERIOD_URL).replace('{code}', employee.code);
        httpClientMock.expectOne(uri);
      });
    });
  });

  describe('#getSelfSchedulePreference', () => {
    let employee;
    let expectedResult: PreferenceSetting;
    let actualResult: PreferenceSetting;
    let uri: string;

    beforeEach(() => {
      employee = { code: 77 };
      expectedResult = {
        organizationEntityId: '224',
        profiles: [{
          id: 129,
          activities: [{id: 21}]
        }]
      } as PreferenceSetting;
      component = CreateComponent();
      uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL.replace('{employeeCode}', employee.code);
      httpClientMock.get.and.returnValue(Observable.of(expectedResult));
      component.getSelfSchedulePreference(employee.code).subscribe((result: PreferenceSetting) => {
        actualResult = result;
      });
    });

    it('should get employee preference Setting details for employee code', () => {
      expect(actualResult.profiles[0].activities[0].id).toEqual(expectedResult.profiles[0].activities[0].id);
      expect(actualResult.organizationEntityId).toEqual(expectedResult.organizationEntityId);
      expect(actualResult.profiles[0].id).toEqual(expectedResult.profiles[0].id);
      expect(httpClientMock.get).toHaveBeenCalledWith(uri);
    });
  });

  describe('#updatePreferenceSetting', () => {
    let employee;
    let uri: string;

    beforeEach(() => {
      employee = { code: 77 };
      uri = MockEnvService.baseApiPath + config.PUT_EMPLOYEE_SELF_SCHEDULE_PREFERENCE_URL.replace('{employeeCode}', '77');
      httpClientMock.put.and.returnValue(Observable.of({}));
      component = CreateComponent();
    });

    describe('when there is a preference setting applied', () => {
      let recentPreferenceSetting;
      beforeEach(() => {
        recentPreferenceSetting = {
          organizationEntityId: '224',
          profiles: [{
            id: 129,
            activities: [{id: 21}]
          }]
        } as PreferenceSetting;
        component.updatePreferenceSetting(employee.code, recentPreferenceSetting);
      });

      it('should call put method with parameters', () => {
        expect(httpClientMock.put).toHaveBeenCalledWith(uri, recentPreferenceSetting, { responseType: 'text' });
      });
    });

    describe('when there is no recent preference setting', () => {
      const recentPreferenceSetting = null;
      beforeEach(() => {
        component = CreateComponent();
        component.updatePreferenceSetting(employee.code, recentPreferenceSetting);
      });

      it('should do nothing', () => {
        httpClientMock.expectNone(uri);
      });
    });

    describe('getQuickCode', () => {
      let expectedResult;
      let expectQuickCodeEmpty;
      beforeEach(() => {
        employee = { quickCode: '77', effectiveDate: new Date('12 - 06 - 1994') };
        expectedResult = {
          quickCodes: [{
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
          }]
        };
        expectQuickCodeEmpty = {
          quickCodes: null
        };
        component = CreateComponent();
        config = new EmployeeSdkConfig();
      });

      it('should get quick code details for effective dates', (done) => {
        httpClientMock.get.and.returnValue(Observable.of(expectedResult));
        component.getQuickCode(employee.quickCode, employee.effectiveDate, employee.effectiveEndDate).subscribe((response) => {
          expect(response.length).toBe(1);
          done();
        });
        uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_QUICKCODE_URL.replace('{code}', employee.quickCode).replace('{effectiveDate}', employee.effectiveDate);
        httpClientMock.expectOne(uri);
      });

      it('should return null', (done) => {
        httpClientMock.get.and.returnValue(Observable.of(expectQuickCodeEmpty));
        component.getQuickCode(employee.quickCode, employee.effectiveDate, employee.effectiveEndDate).subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
        uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_DETAILS_URL.replace('{code}', employee.quickCode).replace('{effectiveDate}', employee.effectiveDate);
        httpClientMock.expectOne(uri);
      });
    });
    describe('getEmployeeScheduleExceptions', () => {

      let expectedEmployeeSchedulExceptionResult;
      beforeEach(() => {
        employee = { code: 73 };
        expectedEmployeeSchedulExceptionResult = {
          exceptions: [
          {
          guid: 'thisis-a-fake-guid-122349586',
          description: 'Overtime was exceeded for Schedule Period',
          issueType: 'Employee Commitment',
          startDate: moment('2019-08-29'),
          endDate: moment('2019-09-15'),
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        },
        {
          guid: 'thisis-a-fake-guid-122349586',
          description: 'Overtime was exceeded for Schedule Period',
          issueType: 'Employee Commitment',
          startDate: moment('2019-09-01'),
          endDate: moment('2019-09-15'),
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        },
        {
          guid: 'thisis-a-fake-guid-122349586',
          description: 'Employee Commitment was exceeded for Schedule Period',
          issueType: 'Employee Commitment',
          startDate: '2019-08-29',
          endDate: '2019-08-29',
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        },
        {
          guid: 'thisis-a-fake-guid-122349555',
          description: 'Overtime was exceeded weekends for Schedule Period',
          issueType: 'Weekends Committment',
          startDate: '2019-08-29',
          endDate: '2019-09-15',
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        },
        {
          guid: 'thisis-a-fake-guid-122349599',
          description: 'Overtime was exceeded overtime for Schedule Period',
          issueType: 'Overtime',
          startDate: '2019-08-29',
          endDate: '2019-09-15',
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        },
        {
          guid: 'thisis-a-fake-guid-122349599',
          description: 'Weekend was exceeded overtime for Schedule Period',
          issueType: 'Weekends',
          startDate: '2019-07-29',
          endDate: '2019-08-15',
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        },
        {
          guid: 'thisis-a-fake-guid-122349599',
          description: 'Weekend was exceeded overtime for Schedule Period',
          issueType: 'Weekends',
          startDate: '2019-07-29',
          endDate: '2019-08-15',
          canDismiss: true,
          person: {
            id: 6924,
            code: 'blue01',
            firstName: 'Boberson',
            lastName: 'Jeph',
            jobClass: {
              id: 437,
              code: 'JOB107',
              name: 'Lab tech',
              number: 749
            }
          }
        }
      ]
      };
        employee = { code: 'blue01' };
        component = CreateComponent();
        config = new EmployeeSdkConfig();
      });
      it('should get employee schedule exceptions for employee code', () => {
        const startDate = moment('2019-08-29');
        const endDate = moment('2019-09-15');
        httpClientMock.get.and.returnValue(Observable.of(expectedEmployeeSchedulExceptionResult));
        component.getEmployeeScheduleExceptions(employee.code, startDate, endDate).subscribe((result: IEmployeeScheduleExceptionResponse) => {
          expect(result.totalCount).toBe(6);
        });
        uri = MockEnvService.baseApiPath + config.GET_EMPLOYEE_SCHEDULE_EXCEPTION_URL.replace('{employeeCode}', 'blue01')
        .replace('{startDate}', '2019-08-29')
        .replace('{endDate}', '2019-09-15');

        httpClientMock.expectOne(uri);
      });
    });
  });
});
