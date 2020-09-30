import { mapEmployee, IFullEmployee } from './employee';
import * as moment from 'moment';
import { IJobClass } from './job-class';
import { IFacility, IDepartment, IUnit } from './org-unit';

describe('Employee', () => {
  describe('mapEmployee', () => {
    const personData = {
      id: 1238,
      code: '1RTW02',
      firstName: '1RTW02',
      lastName: '1RTW02',
      employment: {
        profession: {
          jobClass: {
            id: '114',
            code: '9001',
            name: 'Patient Care Associate',
            number: '15100'
          },
          shift: null,
          fte: 0,
          classification: null,
          approvedHours: 0,
          position: {
            jobClass: {
              id: '114',
              code: '9001',
              name: 'Patient Care Associate',
              number: '15100'
            },
            id: '325',
            code: 'PCA-N',
            name: 'Patient Care Associate',
            number: '15111'
          },
          hireDate: null,
          seniorityDate: null
        },
        location: {
          facility: {
            id: '85',
            code: 'AS Scheduling',
            name: 'AS Scheduling',
            number: '15000'
          },
          department: {
            id: '149',
            code: 'PedsN',
            name: 'PedsN',
            number: '15110'
          },
          unit: null,
          timeZoneId: 'America/Chicago'
        }
      }
    };

    describe('when position is undefined', () => {
      let position;
      let result;
      beforeAll(() => {
        position = personData.employment.profession.position;
        personData.employment.profession.position = null;
        result = mapEmployee(personData);
      });

      afterAll(() => {
        personData.employment.profession.position = position;
      });

      it('should map attributes', () => {
        expect(result.id).toEqual(personData.id);
        expect(result.code).toEqual(personData.code);
        expect(result.firstName).toEqual(personData.firstName);
        expect(result.lastName).toEqual(personData.lastName);
        expect(result.employment.profession.position).toEqual(null);
        expect(result.employment.profession.jobClass).toEqual(personData.employment.profession.jobClass as IJobClass);
        expect(result.employment.profession.shift).toEqual(personData.employment.profession.shift);
        expect(result.employment.profession.fte).toEqual(personData.employment.profession.fte);
        expect(result.employment.profession.classification).toEqual(personData.employment.profession.classification);
        expect(result.employment.profession.approvedHours).toEqual(personData.employment.profession.approvedHours);
        expect(result.employment.location.facility).toEqual(personData.employment.location.facility as IFacility);
        expect(result.employment.location.department).toEqual(personData.employment.location.department as IDepartment);
        expect(result.employment.location.unit).toEqual(personData.employment.location.unit as IUnit);
        expect(result.employment.location.timeZoneId).toEqual(personData.employment.location.timeZoneId);
      });
    });

    describe('when seniority date and hire date are defined', () => {
      let result: IFullEmployee;

      beforeAll(() => {
        personData.employment.profession.hireDate = moment('2000-01-01', 'YYYY-MM-DD');
        personData.employment.profession.seniorityDate = moment('1995-01-01', 'YYYY-MM-DD');
        result = mapEmployee(personData);
      });

      it('should set hireDate and seniorityDate to moment objects', () => {
        expect(moment.isMoment(result.employment.profession.hireDate)).toEqual(true);
        expect(moment.isMoment(result.employment.profession.seniorityDate)).toEqual(true);
      });

      it('should map attributes', () => {
        expect(result.id).toEqual(personData.id);
        expect(result.code).toEqual(personData.code);
        expect(result.firstName).toEqual(personData.firstName);
        expect(result.lastName).toEqual(personData.lastName);
        expect(result.employment.profession.jobClass).toEqual(personData.employment.profession.jobClass as IJobClass);
        expect(result.employment.profession.shift).toEqual(personData.employment.profession.shift);
        expect(result.employment.profession.fte).toEqual(personData.employment.profession.fte);
        expect(result.employment.profession.classification).toEqual(personData.employment.profession.classification);
        expect(result.employment.profession.approvedHours).toEqual(personData.employment.profession.approvedHours);
        expect(result.employment.profession.position.jobClasses).toEqual([personData.employment.profession.position.jobClass as IJobClass]);
        expect(result.employment.location.facility).toEqual(personData.employment.location.facility as IFacility);
        expect(result.employment.location.department).toEqual(personData.employment.location.department as IDepartment);
        expect(result.employment.location.unit).toEqual(personData.employment.location.unit as IUnit);
        expect(result.employment.location.timeZoneId).toEqual(personData.employment.location.timeZoneId);
      });
    });

    describe('when seniority date and hire date are null', () => {
      let result: IFullEmployee;

      beforeAll(() => {
        personData.employment.profession.hireDate = null;
        personData.employment.profession.seniorityDate = null;
        result = mapEmployee(personData);
      });

      it('should map attributes', () => {
        expect(result.id).toEqual(personData.id);
        expect(result.code).toEqual(personData.code);
        expect(result.firstName).toEqual(personData.firstName);
        expect(result.lastName).toEqual(personData.lastName);
        expect(result.employment.profession.jobClass).toEqual(personData.employment.profession.jobClass as IJobClass);
        expect(result.employment.profession.shift).toEqual(personData.employment.profession.shift);
        expect(result.employment.profession.fte).toEqual(personData.employment.profession.fte);
        expect(result.employment.profession.classification).toEqual(personData.employment.profession.classification);
        expect(result.employment.profession.approvedHours).toEqual(personData.employment.profession.approvedHours);
        expect(result.employment.profession.position.jobClasses).toEqual([personData.employment.profession.position.jobClass as IJobClass]);
        expect(result.employment.location.facility).toEqual(personData.employment.location.facility as IFacility);
        expect(result.employment.location.department).toEqual(personData.employment.location.department as IDepartment);
        expect(result.employment.location.unit).toEqual(personData.employment.location.unit as IUnit);
        expect(result.employment.location.timeZoneId).toEqual(personData.employment.location.timeZoneId);
      });

      it('hireDate and seniorityDate should remain null', () => {
        expect(result.employment.profession.hireDate).toEqual(null);
        expect(result.employment.profession.seniorityDate).toEqual(null);
      });
    });
  });
});
