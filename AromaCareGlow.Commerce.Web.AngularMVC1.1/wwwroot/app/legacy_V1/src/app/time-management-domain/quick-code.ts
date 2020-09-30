import { IJobClass } from './job-class';
export class IQuickCodeResponse {
    public quickCodes: IQuickCode[];
}

export class IQuickCode {
    public id: number;
    public number: number;
    public code: string;
    public name: string;
    public jobClass: IJobClass;
    public location: ILocation;
    public position: IPosition;
}

export interface IPosition {
    jobClass: IJobClass;
}

export class ILocation {
    public facility: IFacility;
    public department: IDepartment;
    public unit: Iunit;
    public timeZoneId: string;
}

export class IFacility {
    public id: number;
    public code: string;
    public name: string;
    public number: number;
}

export class IDepartment {
    public id: number;
    public code: string;
    public name: string;
    public number: number;
}

export class Iunit {
    public code: string;
    public id: number;
    public name: string;
    public number: number;
}

export class IEmployment {
    classification: string;
    classifications: [];
    code: string;
    description: string;
    employeeCategoryID: number;
    employeeClassID: number;
    employeeID: number;
    gradeID: number;
    grantCodeID: number;
    id: number;
    jobClassID: number;
    number: number;
    organizationUnitID: number;
    payGroupID: number;
    positionID: number;
    projectCodeID: number;
    seniorityID: number;
    shiftID: number;
    skillID: number;
    statusCodeID: number;
    unionCodeID: number;
    whenEffective: string;
    whenExpire: string;
}
