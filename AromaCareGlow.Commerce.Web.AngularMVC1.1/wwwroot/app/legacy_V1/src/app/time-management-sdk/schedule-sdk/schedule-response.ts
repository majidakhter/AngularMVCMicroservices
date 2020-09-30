

import { IJobClass } from '../../time-management-domain/job-class';
import { IActivity } from '../../time-management-domain/activity';
import { IProfile } from '../../time-management-domain/profile';
import { IPosition } from '../../time-management-domain/position';
import { IEmployee } from '../../time-management-domain/employee';
import { ILocation } from '../../time-management-domain/org-unit';
import { IPayCode } from '../../time-management-domain/pay-code';

export interface IScheduleResponse {
    isScheduledHours: boolean;
    startDate: string;
    requestedDate: string;
    hasStartTime: boolean;
    status: string;
    hours: number;
    amount: number;
    jobClass: IJobClass;
    payCode: IPayCode;
    lunchHours: number;
    activity: IActivity;
    profile: IProfile;
    position: IPosition;
    isExtraShift: boolean;
    guid: string;
    person: IEmployee;
    location: ILocation;
}
