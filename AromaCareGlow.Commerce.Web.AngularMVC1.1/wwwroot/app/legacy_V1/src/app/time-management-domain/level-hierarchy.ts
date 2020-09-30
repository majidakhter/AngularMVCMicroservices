import * as _ from 'lodash';
import { Level } from './level';

export interface ILevelHierarchy {
  trunk: Level;
  branch: Level;
  leaf: Level;
}

export enum OrganizationLevel {
  Facility = 0,
  Department = 1,
  Unit = 2,
  Unknown = 3
}

export class LevelHierarchy implements ILevelHierarchy {
  public trunk: Level;
  public branch: Level;
  public leaf: Level;
  get positionLevel(): OrganizationLevel {
    return this.determineLevel('Position');
  }

  get activityLevel(): OrganizationLevel {
    return this.determineLevel('Activity');
  }

  get payCodeLevel(): OrganizationLevel {
    return this.determineLevel('PayConfiguration');
  }

  private determineLevel(item: string) {
    if (_.includes(this.trunk.links, item)) {
      return OrganizationLevel.Facility;
    }
    if (_.includes(this.branch.links, item)) {
      return OrganizationLevel.Department;
    }
    if (_.includes(this.leaf.links, item)) {
      return OrganizationLevel.Unit;
    }
    return OrganizationLevel.Unknown;
  }
}
