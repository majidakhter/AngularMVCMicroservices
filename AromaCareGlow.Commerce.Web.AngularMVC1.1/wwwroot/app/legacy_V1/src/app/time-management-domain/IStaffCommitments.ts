import { Moment } from 'moment';

export interface IStaffCommitments {
    startDate: Moment;
    endDate: Moment;
    type: string;
    actual: number;
    target: number;
    whenUpdated: Moment;
    unit: string;
    schedulePeriodStage: string;
}

export class StaffCommitments implements IStaffCommitments {
    startDate: Moment;
    endDate: Moment;
    type: string;
    actual: number;
    target: number;
    whenUpdated: Moment;
    unit: string;
    schedulePeriodStage: string;
}
