import { SchedulePeriod } from '../shared/calendar/schedule-period';
import { IStaffCommitments } from './IStaffCommitments';
import { Moment } from 'moment';

export class StaffCommitmentSchedulePeriod {
    staffConfigurationId: number;
    startDate: Moment;
    endDate: Moment;
    staffCommitments: IStaffCommitments[];
    }
