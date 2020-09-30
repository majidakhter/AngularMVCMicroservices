export interface IScheduleTradeRequest {
    requestingScheduleGuid: string;
    acceptingScheduleGuid: String;
    overrideValidation: boolean;
    comment: string;
    etag: string;
}
export class ScheduleTradeRequest implements IScheduleTradeRequest {
    requestingScheduleGuid: string;
    acceptingScheduleGuid: String;
    overrideValidation: boolean;
    comment: string;
    etag: string;
}
