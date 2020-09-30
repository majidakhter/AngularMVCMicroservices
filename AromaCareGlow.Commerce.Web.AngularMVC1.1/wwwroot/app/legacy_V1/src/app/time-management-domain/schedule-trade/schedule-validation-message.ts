
export interface IScheduleValidationMessage {
  scheduleId: string;
  description: string;
  severityLevel: string;
}

export class ScheduleValidationMessage implements IScheduleValidationMessage {
  scheduleId: string;
  description: string;
  severityLevel: string;
}
