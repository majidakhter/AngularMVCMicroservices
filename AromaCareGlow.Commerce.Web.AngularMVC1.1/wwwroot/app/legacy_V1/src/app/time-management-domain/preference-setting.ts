export class PreferenceSetting {
  public organizationEntityId: string;
  public profiles: Array<SelfSchedulePreferenceProfile>;
  public viewedSelfSchedulePeriods: Array<SelfSchedulePeriod>;
  constructor() {
    this.viewedSelfSchedulePeriods = new Array<SelfSchedulePeriod>();
    this.profiles = new Array<SelfSchedulePreferenceProfile>();
  }
}

export class SelfSchedulePeriod {
  startDate: string;
  endDate: string;
  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class SelfSchedulePreferenceProfile {
  id: number;
  activities: Array<SelfSchedulePreferenceActivity>;
  constructor(id: number, activities: Array<SelfSchedulePreferenceActivity>) {
    this.id = id;
    this.activities = activities;
  }
}

export class SelfSchedulePreferenceActivity {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}
