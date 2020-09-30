import { ISchedule } from './schedule';

export class ScheduleEvent {
  title: any;
  start: string;
  eventType: string;
  schedule?: ISchedule;
  isTradeable: boolean;
}
