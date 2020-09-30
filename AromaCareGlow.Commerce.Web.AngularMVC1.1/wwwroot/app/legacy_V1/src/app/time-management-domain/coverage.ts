import { IActivity } from './activity';
import { IIdentifier } from './identifier';
import { IProfile } from './profile';

export interface ICoverage {
  organizationEntityId: number;
  activityStaffingPlanCoverages: IActivityStaffingPlanCoverage[];
}

export interface IActivityStaffingPlanCoverage {
  profileGroup: IProfileGroup;
  profile: IProfile;
  activity: IActivity;
  days: IDayNeeds[];
}

export interface IProfileGroup extends IIdentifier {
  displayOrder: number;
}

export interface IDayNeeds {
  needDate: string;
  need?: number;
  coverage?: number;
}

export class ActivityNeedCoverage {
  constructor(public activity: IActivity, public need: number, public coverage: number) { }
}

export class RoleCoverageByActivity implements IDayNeeds {
  get balanced(): boolean {
    return !!this.activityCoverages && this.activityCoverages.every((activityCoverage: ActivityNeedCoverage) => activityCoverage.need === activityCoverage.coverage);
  }

  public activityCoverages: Array<ActivityNeedCoverage> = new Array<ActivityNeedCoverage>();

  constructor(public needDate: string, public need: number, public coverage: number, public open: number) { }
}
