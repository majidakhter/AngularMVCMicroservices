import { Moment } from 'moment';

export interface IEmployeeRequest {
  requestGuid: string;
  employeeId: number;
  classification: string;
  status: string;
  requestedDate: Moment;
  startDate: Moment;
  isSuppressed: boolean;
  endDate: Moment;
  comment: string;
  reviewerName: string;
  reviewedDate: Moment;
  reviewerComments: string;
  payCodeId: number;
  activityId: number;
  action: string;
}

export class EmployeeRequest implements IEmployeeRequest {
  constructor(
    public requestGuid: string,
    public employeeId: number,
    public classification: string,
    public status: string,
    public requestedDate: Moment,
    public startDate: Moment,
    public isSuppressed: boolean,
    public endDate: Moment,
    public comment: string,
    public reviewerName: string,
    public reviewedDate: Moment,
    public reviewerComments: string,
    public payCodeId: number,
    public activityId: number,
    public action: string
  ) { }
}
