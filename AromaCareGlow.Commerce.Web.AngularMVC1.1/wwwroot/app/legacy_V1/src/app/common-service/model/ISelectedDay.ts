
import { Moment } from 'moment';

export interface ISelectedDay {
  date: Moment;
  showOpenShifts: boolean;
  etag: string;
}
