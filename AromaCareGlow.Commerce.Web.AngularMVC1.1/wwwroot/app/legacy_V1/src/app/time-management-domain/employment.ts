import { IProfession } from './profession';
import { ILocation } from './location';
import { Moment } from 'moment';

export interface IEmployment {
  profession: IProfession;
  location: ILocation;
  effectiveDate: Moment;
}
