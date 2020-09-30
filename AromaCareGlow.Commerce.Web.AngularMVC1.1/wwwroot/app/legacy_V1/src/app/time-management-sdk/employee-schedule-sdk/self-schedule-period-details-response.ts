

import { Moment } from 'moment';

export class SelfSchedulePeriodDetailsResponse {
    accessPeriodStartDate: Moment;
    accessPeriodEndDate: Moment;
    canSelfSchedule: boolean;
}
