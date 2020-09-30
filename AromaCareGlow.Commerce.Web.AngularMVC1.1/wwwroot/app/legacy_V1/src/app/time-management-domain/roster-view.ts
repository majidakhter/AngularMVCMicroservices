import { Moment } from 'moment';
import { IPerson } from '../time-management-domain/employee';
import { IIdentifier } from 'src/app/time-management-domain/identifier';
import { IEmployeeAuthorizationRaw, IAuthorizationAccess } from './authorization-access';

export interface IProfileGroupItem {
    employeeCount: number;
    group: IIdentifier;
    isSourceScheduleGroup: boolean;
    profileType?: string;
}

export interface IScheduleProfile {
    id: number;
    organizationUnitId: number;
    code: string;
    name: string;
    isActive: boolean;
}

export interface IScheduleRoster {
    endDate: Moment;
    startDate: Moment;
    hourValue: number;
    lunchHourValue: number;
    profile: IScheduleProfile;
}

export interface IRosterEmployeeResponse {
    employee: IPerson;
    schedule: IScheduleRoster;
}

export interface IRosterEmployeeList {
    employeeList: IRosterEmployeeResponse[];
    index?: number;
}

export interface IRosterSpinner {
    isSpinnerFlag: boolean;
    index?: number;
}

export interface IRosterAccessResponse extends IEmployeeAuthorizationRaw {
    rosterAccess: IAuthorizationAccess;
}

export interface IRosterDetailsData {
    guid: string;
    profileType: string;
    profileId: string;
}
