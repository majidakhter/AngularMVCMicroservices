import { Moment } from 'moment';

export interface IScheduleException {
  guid: string;
  description: string;
  issueType: string;
  startDate: string;
  endDate: string;
  canDismiss: boolean;
}
