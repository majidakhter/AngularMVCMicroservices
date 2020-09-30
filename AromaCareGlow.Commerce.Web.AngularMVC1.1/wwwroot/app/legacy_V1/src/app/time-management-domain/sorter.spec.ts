import * as moment from 'moment';
import { ITransactionSummary, TransactionSummary } from '../time-management-domain/transaction-summary';
import { Sorter } from './sorter';
import { Schedule, ISchedule } from './schedule';

describe('Sorter', () => {
  const transactionSummaries = [
    {
      guid: 'f8ccf834-1891-4c82-b23f-ec851b0c56ef',
      startDate: '2018-11-11 07:00',
      endDate: '2018-11-11 15:00',
      hours: 8,
      lunchHours: 0,
      activity: {
        id: 6,
        code: '0700-8',
        name: '0700-8',
        number: null
      },
      payCode: null,
      profile: {
        id: 120,
        code: 'PCA-S',
        name: 'Patient Care Associate',
        number: null
      },
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: 'de4f3efb-0500-423d-9eb5-6d06d1a6d409',
      startDate: '2018-11-11 07:00',
      endDate: '2018-11-11 15:00',
      hours: 8,
      lunchHours: null,
      activity: null,
      payCode: {
        id: 56,
        code: 'OVT',
        name: 'Overtime',
        number: null
      },
      profile: null,
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: '2f304f86-43af-407c-aff9-51394bd574ef',
      startDate: '2018-11-11 07:00',
      endDate: '2018-11-11 15:00',
      hours: 8,
      lunchHours: 0,
      activity: {
        id: 51,
        code: 'NP',
        name: 'NP',
        number: null
      },
      payCode: null,
      profile: {
        id: 120,
        code: 'PCA-S',
        name: 'Patient Care Associate',
        number: null
      },
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: '21ff7d8c-6da2-410d-b96e-d664a1a11592',
      startDate: '2018-11-11 06:30',
      endDate: '2018-11-11 14:30',
      hours: 8,
      lunchHours: 0,
      activity: {
        id: 6,
        code: '0700-8',
        name: '0700-8',
        number: null
      },
      payCode: {
        id: 54,
        code: 'SCHED',
        name: 'Scheduled to Work',
        number: null
      },
      profile: {
        id: 120,
        code: 'PCA-S',
        name: 'Patient Care Associate',
        number: null
      },
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: '582dd847-626f-4461-a8e6-ff1075964b2d',
      startDate: '2018-11-11 06:45',
      endDate: '2018-11-11 07:00',
      hours: 0.25,
      lunchHours: null,
      activity: null,
      payCode: {
        id: 49,
        code: 'PTO',
        name: 'Paid Time Off',
        number: 12
      },
      profile: null,
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: '21ff7d8c-6da2-410d-b96e-d6123r1a11592',
      startDate: '2018-11-21 06:30',
      endDate: '2018-11-21 14:30',
      hours: 8,
      lunchHours: 0,
      activity: {
        id: 6,
        code: '0700-8',
        name: '0700-8',
        number: null
      },
      payCode: {
        id: 54,
        code: 'SCHED',
        name: 'Scheduled to Work',
        number: null
      },
      profile: {
        id: 120,
        code: 'PCA-S',
        name: 'Patient Care Associate',
        number: null
      },
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: '582dd847-626f-4461-a8e6-ff1075934f2d',
      startDate: '2018-11-05 06:45',
      endDate: '2018-11-05 07:00',
      hours: 0.25,
      lunchHours: null,
      activity: null,
      payCode: {
        id: 49,
        code: 'PTO',
        name: 'Paid Time Off',
        number: 12
      },
      profile: null,
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    },
    {
      guid: '12404f86-43af-407c-aff9-51394bd575fe',
      startDate: '2018-11-11 07:00',
      endDate: '2018-11-11 15:00',
      hours: 8,
      lunchHours: 0,
      activity: {
        id: 52,
        code: 'ap',
        name: 'ap',
        number: null
      },
      payCode: null,
      profile: {
        id: 120,
        code: 'PCA-S',
        name: 'Patient Care Associate',
        number: null
      },
      location: {
        facility: {
          id: 85,
          code: 'AS Scheduling',
          name: 'AS Scheduling',
          number: 15000
        },
        department: {
          id: 150,
          code: 'PedsS',
          name: 'PedsS',
          number: 15150
        },
        unit: null,
        timeZoneId: 'America/Chicago'
      },
      requestClassification: null,
      requestedDate: null
    }
  ];

  const schedules = [
    {//  4
      startDate: '2018-01-02 07:00',
      activity: { code: 'nP' },
      payCode: { code: 'DTO' }
    },
    {//  1
      startDate: '2018-01-02 07:00',
      activity: { code: 'abc' },
      payCode: { code: 'abc' }
    },
    {//  5
      startDate: '2018-01-02 07:00',
      activity: 'nzp',
      payCode: { code: 'dTO' }
    },
    {//  2
      startDate: '2018-01-02 07:00',
      activity: { code: 'ABC' },
      payCode: { code: 'abd' }
    },
    {//  0
      startDate: '2018-01-01 07:00',
      activity: null,
      payCode: null
    },
    {//  3
      startDate: '2018-01-02 07:00',
      activity: { code: 'nP' },
      payCode: { code: 'DTa' }
    }
  ];

  const buildTransactionSummary = (rawTransaction: any): ITransactionSummary => {
    const transaction: TransactionSummary = new TransactionSummary();
    transaction.guid = rawTransaction.guid;
    transaction.startDate = moment(rawTransaction.startDate, 'YYYY-MM-DD HH:mm');
    transaction.hours = rawTransaction.hours;
    transaction.lunchHours = rawTransaction.lunchHours;
    transaction.activity = rawTransaction.activity;
    transaction.payCode = rawTransaction.payCode;
    transaction.profile = rawTransaction.profile;
    transaction.location = rawTransaction.location;
    transaction.requestClassification = rawTransaction.requestClassification;
    transaction.requestedDate = rawTransaction.requestedDate;

    return transaction;
  };

  const buildScheduleSummary = (rawSchedule: any): ISchedule => {
    const schedule: Schedule = new Schedule();
    schedule.startDate = moment(rawSchedule.startDate, 'YYYY-MM-DD HH:mm');
    schedule.activity = rawSchedule.activity;
    schedule.payCode = rawSchedule.payCode;

    return schedule;
  };

  describe('#defaultTransactionSort', () => {
    let transaction0: TransactionSummary;
    let transaction1: TransactionSummary;
    let transaction2: TransactionSummary;
    let transaction3: TransactionSummary;
    let transaction4: TransactionSummary;
    let transaction5: TransactionSummary;
    let transaction6: TransactionSummary;
    let transaction7: TransactionSummary;
    let transactionList: Array<ITransactionSummary>, resultTransactionList: Array<ITransactionSummary>;

    beforeEach(() => {
      transaction0 = buildTransactionSummary(transactionSummaries[0]);
      transaction1 = buildTransactionSummary(transactionSummaries[1]);
      transaction2 = buildTransactionSummary(transactionSummaries[2]);
      transaction3 = buildTransactionSummary(transactionSummaries[3]);
      transaction4 = buildTransactionSummary(transactionSummaries[4]);
      transaction5 = buildTransactionSummary(transactionSummaries[5]);
      transaction6 = buildTransactionSummary(transactionSummaries[6]);
      transaction7 = buildTransactionSummary(transactionSummaries[7]);
      transactionList = [transaction0, transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, transaction7];
      resultTransactionList = Sorter.defaultTransactionSort(transactionList);
    });

    //  Datetime -> activityCodeCode -> payCodeCode
    it('should return a list of sorted transactionSummaries', () => {
      expect(resultTransactionList).toEqual([transaction6, transaction3, transaction4, transaction0, transaction7, transaction2, transaction1, transaction5]);
    });
  });

  describe('#defaultScheduleSort', () => {
    let schedule0: Schedule;
    let schedule1: Schedule;
    let schedule2: Schedule;
    let schedule3: Schedule;
    let schedule4: Schedule;
    let schedule5: Schedule;

    let scheduleList: Array<ISchedule>, resultScheduleList: Array<ISchedule>;

    beforeEach(() => {
      schedule0 = buildScheduleSummary(schedules[0]);
      schedule1 = buildScheduleSummary(schedules[1]);
      schedule2 = buildScheduleSummary(schedules[2]);
      schedule3 = buildScheduleSummary(schedules[3]);
      schedule4 = buildScheduleSummary(schedules[4]);
      schedule5 = buildScheduleSummary(schedules[5]);
      scheduleList = [schedule0, schedule1, schedule2, schedule3, schedule4, schedule5];
      resultScheduleList = Sorter.defaultScheduleSort(scheduleList);
    });

    //  Datetime -> activityCodeCode -> payCodeCode
    it('should return a list of sorted scheduleSummaries', () => {
      expect(resultScheduleList).toEqual([schedule4, schedule1, schedule3, schedule5, schedule0, schedule2]);
    });
  });
});
