export interface IOrgUnit {
    id: string;
    code: string;
    name: string;
    number: string;
}

export class OrgUnit implements IOrgUnit {
    id: string;
    code: string;
    name: string;
    number: string;

    public static compareLaborDistribution(location1: IOrgUnit, location2: IOrgUnit): boolean {
        let areSame = false;
        if ((!location1 && !location2) || (location1 && location2 && location1.id === location2.id)) {
            areSame = true;
        }
        return areSame;
    }
}

export interface IFacility extends IOrgUnit {
    timeZoneId: string;
    status: string;
}

export interface IDepartment extends IOrgUnit {
    status: string;
}

export interface IUnit extends IOrgUnit {
    status: string;
}

export interface ILocation {
    facility: IFacility;
    department: IDepartment;
    unit: IUnit;
    timeZoneId: string;
}
