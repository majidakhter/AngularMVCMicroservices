
export interface IScheduleValidationMessage {
  scheduleId: string;
  description: string;
  severityLevel: string;
}

export class ScheduleValidationMessage implements IScheduleValidationMessage {
  constructor(
    public scheduleId: string,
    public description: string,
    public severityLevel: string
  ) { }
}
