import { IFacility, IDepartment, IUnit } from './org-unit';

export interface ILocation {
  facility: IFacility;
  department: IDepartment;
  unit: IUnit;
  timeZoneId: string;
}

export interface ILocationConfig {
  isExtraShift: boolean;
}

export interface ILocationWithConfig extends ILocation {
  configuration: ILocationConfig;
}

export class Location implements ILocation {
  constructor(
    public facility: IFacility,
    public department: IDepartment,
    public unit: IUnit,
    public timeZoneId: string
  ) { }
}

export class LocationWithConfig extends Location implements ILocationWithConfig {
  constructor(
    public facility: IFacility,
    public department: IDepartment,
    public unit: IUnit,
    public timeZoneId: string,
    public configuration: ILocationConfig
  ) {
    super(facility, department, unit, timeZoneId);
  }

  public static fromJson(json: any): LocationWithConfig {
    if (!json) return undefined;
    return new LocationWithConfig(
      json.facility,
      json.department,
      json.unit,
      json.timeZoneId,
      json.configuration
    );
  }
}
