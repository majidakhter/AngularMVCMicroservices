

import { ISchedule } from '../../time-management-domain/schedule';

export interface IScheduleResult {
    etag: string;
    events: Array<ISchedule>;
}
