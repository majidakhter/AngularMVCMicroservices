import { IPosition } from './position';
import { IJobClass } from './job-class';
import { IIdentifier } from './identifier';
import { Moment } from 'moment';

export interface IProfession {
  jobClass: IJobClass;
  shift: IIdentifier;
  fte: number;
  classification: IIdentifier;
  approvedHours: number;
  position: IPosition;
  hireDate: Moment;
  seniorityDate: Moment;
}
