import * as _ from 'lodash';
import { ITransactionSummary } from './transaction-summary';
import { ISchedule } from '../time-management-domain/schedule';

export class Sorter {
  public static defaultTransactionSort(transactions: Array<ITransactionSummary>): Array<ITransactionSummary> {
    return this.transactionSortLogic(transactions);
  }

  public static defaultScheduleSort(schedules: Array<ISchedule>): Array<ISchedule> {
    return this.transactionSortLogic(schedules);
  }

  private static transactionSortLogic(transactions) {
    return _.sortBy(transactions, [
      'startDate', 'activity', 'payCode',
      (event: ISchedule | ITransactionSummary): string => {
        if (event.activity && event.activity.code) {
          return event.activity.code.toLocaleLowerCase();
        }
        return null;
      },
      (event: ISchedule | ITransactionSummary): string => {
        if (event.payCode && event.payCode.code) {
          return event.payCode.code.toLocaleLowerCase();
        }
        return null;
      }
    ]);
  }
}
