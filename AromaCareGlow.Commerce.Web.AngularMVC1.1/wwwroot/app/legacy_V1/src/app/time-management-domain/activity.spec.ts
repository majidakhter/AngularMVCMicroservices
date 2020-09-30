import { Activity } from './activity';
import { IIdentifier } from './identifier';
import * as moment from 'moment';
import { Moment } from 'moment';

describe('Activity', () => {
  describe('#getters', () => {
    let activity: Activity;
    let startTime: Moment;
    let expectedEndTime: Moment;

    beforeAll(() => {
      startTime = moment('2018-07-24 07:00:00', 'YYYY-MM-DD HH:mm:ss');
      activity = new Activity('1234', '0700-8', '0700-8', '1234', '07:00:00', 8, 1, { id: '333', code: 'paycode1', name: 'paycode 1', number: null } as IIdentifier,startTime);
      expectedEndTime = startTime.clone().add(activity.hours + activity.lunchHours, 'hours');
    });

    describe('#start', () => {
      it('should return startTime', () => {
        expect(activity.start).toEqual(startTime);
      });
    });

    describe('#end', () => {
      it('should return startTime plus hours plus lunchHours', () => {
        expect(activity.end).toEqual(expectedEndTime);
      });
    });
  });
});
