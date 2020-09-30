import * as moment from 'moment';
import { IJobClass } from './job-class';
import { IPosition } from './position';
import { IEmployment } from './employment';
import { IProfession } from './profession';
import { ILocation } from './location';
import { IScheduleException } from './schedule-exception';
import { Dictionary } from '../../app/helpers/dictionary.model';

export interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  preferredName?: string;
  code: string;
  canEdit?: boolean;
  middleName?: string;
  applyFloatTag?: boolean;
  canSchedule?: boolean;
}

export interface IFullEmployee extends IEmployee {
  employment: IEmployment;
}

export interface IPerson extends IEmployee {
  jobClass: IJobClass;
}

export class Employee implements IFullEmployee {
  public id: number;
  public firstName: string;
  public lastName: string;
  public preferredName?: string;
  public code: string;
  public employment: IEmployment;
  public canEdit?: boolean;
  public middleName?: string;
}

export function mapEmployee(employee: any): IFullEmployee {
  return {
    id: employee.id,
    code: employee.code,
    firstName: employee.firstName,
    lastName: employee.lastName,
    preferredName: employee.preferredName,
    employment: {
      effectiveDate: employee.employment.effectiveDate,
      profession: {
        jobClass: employee.employment.profession.jobClass,
        shift: employee.employment.profession.shift,
        fte: employee.employment.profession.fte,
        classification: employee.employment.profession.classification,
        approvedHours: employee.employment.profession.approvedHours,
        position: employee.employment.profession && employee.employment.profession.position ? {
          jobClasses: [employee.employment.profession.position.jobClass],
          jobClass: employee.employment.profession.position.jobClass,
          id: employee.employment.profession.position.id,
          code: employee.employment.profession.position.code,
          number: employee.employment.profession.position.number,
          name: employee.employment.profession.position.name
        } as IPosition : null,
        hireDate: employee.employment.profession.hireDate ? moment.parseZone(employee.employment.profession.hireDate) : null,
        seniorityDate: employee.employment.profession.seniorityDate ? moment.parseZone(employee.employment.profession.seniorityDate) : null
      } as IProfession,
      location: {
        facility: employee.employment.location.facility,
        department: employee.employment.location.department,
        unit: employee.employment.location.unit,
        timeZoneId: employee.employment.location.timeZoneId
      } as ILocation
    } as IEmployment
  } as IFullEmployee;
}

export interface IEmployeeSchedulException extends IScheduleException {
  person: IPerson;
}
export interface IEmployeeScheduleExceptionResponse {
 issueTypeExceptions: Dictionary<string[]>;
 totalCount: number;
}
