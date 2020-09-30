import { ILocation } from './location';

export enum OrganizationLevel {
    Organization = 0,
    Facility = 1,
    Department = 2,
    Unit = 3,
    Custom = 4
  }

export interface IOrganizationEntity {
    id: string;
    number: string;
    code: string;
    name: string;
    type: OrganizationLevel;
    location: ILocation;
}
