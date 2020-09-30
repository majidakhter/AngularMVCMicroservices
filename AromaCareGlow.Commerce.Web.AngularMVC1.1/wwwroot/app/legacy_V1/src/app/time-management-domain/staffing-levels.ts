export interface IStaffingLevels {
  needs: number;
  coverage: number;
  overstaffed?: number;
  understaffed?: number;

}

export class StaffingLevels implements IStaffingLevels {
  constructor(
    public needs: number,
    public coverage: number
  ) { }

  public get overstaffed(): number {
    const result = this.coverage - this.needs;
    return result > 0 ? result : null;
  }

  public get understaffed(): number {
    const result = this.needs - this.coverage;
    return result > 0 ? result : null;
  }

}
