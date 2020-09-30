import { TransactionSummary } from './transaction-summary';
import * as moment from 'moment';
import { IFacility, IDepartment, IUnit } from './org-unit';

describe('TransactionSummary', () => {
  const rawEmployeeData = {
    id: 1,
    code: 'Doroteya',
    firstName: 'Phil',
    lastName: 'Aspinell',
    middleName: 'Christabel',
    transactionSummaries: [
      {
        guid: 'guid1',
        startDate: '2007-05-12T20:45:52-05:00',
        hours: 8.5,
        lunchHours: 0.3,
        requestedDate: '2007-04-12T20:45:52-05:00',
        activity: {
          id: '1',
          code: '5J6TF2H51FL030214',
          number: '1',
          name: 'JTDJTUD37DD792251'
        },
        payCode: {
          id: '1',
          code: 'WVWAP7AN7DE411603',
          name: '21695-103',
          number: '1'
        },
        profile: {
          id: '1',
          code: '4USBT33473L748158',
          name: '42627-208',
          number: '15'
        },
        location: {
          facility: {
            id: '1',
            name: 'Training',
            code: 'Accounting',
            number: '1'
          },
          department: {
            id: '1',
            name: 'Business Development',
            code: 'Human Resources',
            number: '1'
          },
          unit: {
            id: '63',
            name: 'Business Development',
            code: 'Support',
            number: '63'
          },
          timeZoneId: 'Europe/Moscow'
        },
        requestClassification: null,
        isTradeRequested: false
      },
      {
        guid: 'guid2',
        hours: 8.5,
        lunchHours: 0.3,
        requestedDate: '2007-04-12T20:45:52-05:00',
        activity: {
          id: '1',
          code: '5J6TF2H51FL030214',
          number: '1',
          name: 'JTDJTUD37DD792251'
        },
        payCode: {
          id: '1',
          code: 'WVWAP7AN7DE411603',
          name: '21695-103',
          number: '1'
        },
        profile: {
          id: '2',
          code: '4USBT33473L748158',
          name: '42627-208',
          number: '15'
        },
        requestClassification: 'Calendar',
        isTradeRequested: false
      },
      {
        guid: 'df977196-51e7-4bad-b3f8-6e7abc3ecc1e',
        startDate: '2018-10-16T07:00:00.000-05:00',
        endDate: '2018-10-16T15:00:00.000-05:00',
        hours: 8,
        lunchHours: 0,
        activity: {
          id: '6',
          code: '0700-8',
          name: '0700-8',
          number: null
        },
        payCode: null,
        profile: {
          id: '121',
          code: 'SURG-S',
          name: 'Surgical Technician',
          number: null
        },
        location: {
          facility: {
            id: '85',
            code: 'AS Scheduling',
            name: 'AS Scheduling',
            number: '15000'
          },
          department: {
            id: '150',
            code: 'PedsS',
            name: 'PedsS',
            number: '15150'
          },
          unit: null,
          timeZoneId: 'America/Chicago'
        },
        requestClassification: null,
        isTradeRequested: true
      }
    ]
  };

  describe('TransactionSummary', () => {
    describe('#fromJson', () => {
      describe('when location is null', () => {
        let result: TransactionSummary, resultTransactionSummary: TransactionSummary;

        beforeEach(() => {
          resultTransactionSummary = new TransactionSummary();
          resultTransactionSummary.guid = 'guid2';
          resultTransactionSummary.startDate = null;
          resultTransactionSummary.hours = 8.5;
          resultTransactionSummary.lunchHours = 0.3;
          resultTransactionSummary.requestedDate = moment.parseZone('2007-04-12T20:45:52-05:00');
          resultTransactionSummary.activity = {
            id: '1',
            code: '5J6TF2H51FL030214',
            number: '1',
            name: 'JTDJTUD37DD792251'
          };
          resultTransactionSummary.payCode = {
            id: '1',
            code: 'WVWAP7AN7DE411603',
            name: '21695-103',
            number: '1'
          };
          resultTransactionSummary.profile = {
            id: '2',
            code: '4USBT33473L748158',
            name: '42627-208',
            number: '15'
          };
          resultTransactionSummary.location = null;
          resultTransactionSummary.requestClassification = 'Calendar';
          resultTransactionSummary.isTradeRequested = false;
          result = TransactionSummary.fromJson(rawEmployeeData.transactionSummaries[1]);
        });

        it('should create a TransactionSummary object from the json with location set to null', () => {
          expect(result).toEqual(resultTransactionSummary);
        });
      });

      describe('when location is defined', () => {
        let result: TransactionSummary, resultTransactionSummary: TransactionSummary;

        beforeEach(() => {
          resultTransactionSummary = new TransactionSummary();
          resultTransactionSummary.guid = 'guid1';
          resultTransactionSummary.startDate = moment.parseZone('2007-05-12T20:45:52-05:00');
          resultTransactionSummary.hours = 8.5;
          resultTransactionSummary.lunchHours = 0.3;
          resultTransactionSummary.requestedDate = moment.parseZone('2007-04-12T20:45:52-05:00');
          resultTransactionSummary.activity = {
            id: '1',
            code: '5J6TF2H51FL030214',
            number: '1',
            name: 'JTDJTUD37DD792251'
          };
          resultTransactionSummary.payCode = {
            id: '1',
            code: 'WVWAP7AN7DE411603',
            name: '21695-103',
            number: '1'
          };
          resultTransactionSummary.profile = {
            id: '1',
            code: '4USBT33473L748158',
            name: '42627-208',
            number: '15'
          };
          resultTransactionSummary.location = {
            facility: {
              id: '1',
              name: 'Training',
              code: 'Accounting',
              number: '1'
            } as IFacility,
            department: {
              id: '1',
              name: 'Business Development',
              code: 'Human Resources',
              number: '1'
            } as IDepartment,
            unit: {
              id: '63',
              name: 'Business Development',
              code: 'Support',
              number: '63'
            } as IUnit,
            timeZoneId: 'Europe/Moscow'
          };
          resultTransactionSummary.requestClassification = null;
          resultTransactionSummary.isTradeRequested = false;
          result = TransactionSummary.fromJson(rawEmployeeData.transactionSummaries[0]);
        });

        it('should create a TransactionSummary object from the json', () => {
          expect(result).toEqual(resultTransactionSummary);
        });
      });

      describe('when requestedDate is null', () => {
        let result: TransactionSummary, resultTransactionSummary: TransactionSummary;

        beforeEach(() => {
          resultTransactionSummary = new TransactionSummary();
          resultTransactionSummary.guid = 'df977196-51e7-4bad-b3f8-6e7abc3ecc1e';
          resultTransactionSummary.startDate = moment.parseZone('2018-10-16T07:00:00.000-05:00');
          resultTransactionSummary.hours = 8;
          resultTransactionSummary.lunchHours = 0;
          resultTransactionSummary.requestedDate = null;
          resultTransactionSummary.activity = {
            id: '6',
            code: '0700-8',
            number: null,
            name: '0700-8'
          };
          resultTransactionSummary.payCode = null;
          resultTransactionSummary.profile = {
            id: '121',
            code: 'SURG-S',
            name: 'Surgical Technician',
            number: null
          };
          resultTransactionSummary.location = {
            facility: {
              id: '85',
              code: 'AS Scheduling',
              name: 'AS Scheduling',
              number: '15000'
            } as IFacility,
            department: {
              id: '150',
              code: 'PedsS',
              name: 'PedsS',
              number: '15150'
            } as IDepartment,
            unit: null,
            timeZoneId: 'America/Chicago'
          };
          resultTransactionSummary.requestClassification = null;
          resultTransactionSummary.isTradeRequested = true;
          result = TransactionSummary.fromJson(rawEmployeeData.transactionSummaries[2]);
        });

        it('should create a TransactionSummary object from the json with requestedDate equal to null', () => {
          expect(result).toEqual(resultTransactionSummary);
        });
      });
    });

    describe('#endDate', () => {
      describe('when startDate is not defined', () => {
        let resultEndDate;
        beforeEach(() => {
          const transactionSummary = new TransactionSummary();
          resultEndDate = transactionSummary.endDate;
        });

        it('should return null', () => {
          expect(resultEndDate).toEqual(null);
        });
      });

      describe('when startDate is defined', () => {
        let resultEndDate: moment.Moment;
        beforeEach(() => {
          const transactionSummary = new TransactionSummary();
          transactionSummary.startDate = moment('2007-05-12T07:45:52-00:00');
          transactionSummary.hours = 7;
          transactionSummary.lunchHours = 1;
          resultEndDate = transactionSummary.endDate;
        });

        it('should return start date plus hours and lunch hours', () => {
          expect(resultEndDate.toISOString()).toEqual('2007-05-12T15:45:52.000Z');
        });
      });
    });
  });
});
