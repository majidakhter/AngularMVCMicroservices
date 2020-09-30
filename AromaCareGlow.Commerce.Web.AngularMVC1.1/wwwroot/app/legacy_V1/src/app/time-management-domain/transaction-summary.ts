import * as moment from 'moment';
import { ILocation } from './location';
import { IIdentifier } from './identifier';

export interface ITransactionSummary {
  guid: string;
  startDate: moment.Moment;
  hours: number;
  lunchHours: number;
  activity: IIdentifier;
  payCode: IIdentifier;
  profile: IIdentifier;
  location: ILocation;
  requestClassification: string;
  requestedDate: moment.Moment;
  isTradeRequested: boolean;

  readonly endDate: moment.Moment;
}

export class TransactionSummary implements ITransactionSummary {
  guid: string;
  startDate: moment.Moment;
  hours: number;
  lunchHours: number;
  activity: IIdentifier;
  payCode: IIdentifier;
  profile: IIdentifier;
  location: ILocation;
  requestClassification: string;
  requestedDate: moment.Moment;
  isTradeRequested: boolean;

  get endDate(): moment.Moment {
    return this.startDate ? this.startDate.clone().add(this.hours, 'hours').add(this.lunchHours, 'hours') : null;
  }

  public static fromJson(json): TransactionSummary {
    const newSummary = new TransactionSummary();
    newSummary.guid = json.guid;
    newSummary.startDate = json.startDate ? moment.parseZone(json.startDate) : null;
    newSummary.hours = json.hours;
    newSummary.lunchHours = json.lunchHours;
    newSummary.activity = json.activity;
    newSummary.payCode = json.payCode;
    newSummary.profile = json.profile;
    newSummary.requestClassification = json.requestClassification;
    newSummary.requestedDate = json.requestedDate ? moment.parseZone(json.requestedDate) : null;
    newSummary.isTradeRequested = json.isTradeRequested;

    if (json.location) {
      newSummary.location = {
        facility: json.location.facility,
        department: json.location.department,
        unit: json.location.unit,
        timeZoneId: json.location.timeZoneId
      };
    } else {
      newSummary.location = null;
    }

    return newSummary;
  }
}
