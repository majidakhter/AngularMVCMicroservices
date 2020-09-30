

import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { IActivityStaffingPlanCoverage } from 'src/app/time-management-domain/coverage';
import { SetActivityStaffingPlanCoverages } from '../actions/self-schedule.actions';
import { SelfScheduleAdd } from './self-schedule-add.state';
import * as moment from 'moment';

describe('SelfScheduleAdd', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([
          SelfScheduleAdd
        ])
      ]
    });
  });
  describe('#SetActivityStaffingPlanCoverages', () => {
    describe('when setting activityStaffingPlanCoverages', () => {
      let activityStaffingPlanCoverages: IActivityStaffingPlanCoverage[];
      beforeEach(() => {
        activityStaffingPlanCoverages =
          [{
            profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5' , displayOrder: 88 },
            profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
            activity: {
              startTime: '13:45',
              hours: 8,
              lunchHours: 1,
              payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
              start: moment('05-08-2019'),
              end: moment('05-08-2019'),
              id: '44', code: 'test code', name: 'test name', number: '16'
            },
            days: [ { needDate: '05-08-2019', need: 4, coverage: 1 } ]
          }];
        store = TestBed.get(Store);
        store.dispatch(new SetActivityStaffingPlanCoverages(activityStaffingPlanCoverages));
      });

      it('should update store', (done) => {
        store.selectOnce(state => state.ActivityStaffingPlanCoverages.activityStaffingPlanCoverages).subscribe((day: IActivityStaffingPlanCoverage) => {
          expect(day[0]).toEqual(activityStaffingPlanCoverages[0]);
          done();
        });
      });
    });
  });

  describe('#getactivityStaffingPlanCoverages', () => {
    describe('when there is a selectedDay', () => {
      let activityStaffingPlanCoverages: IActivityStaffingPlanCoverage[];
      let mockDay: IActivityStaffingPlanCoverage[];
      beforeEach(() => {
        mockDay =  [
          {
            profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5' , displayOrder: 88 },
            profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
            activity: {
              startTime: '13:45',
              hours: 8,
              lunchHours: 1,
              payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
              start: moment('05-08-2019'),
              end: moment('05-08-2019'),
              id: '44', code: 'test code', name: 'test name', number: '16'
            },
            days: [ { needDate: '05-08-2019', need: 4, coverage: 1 } ]
          }];
        activityStaffingPlanCoverages = SelfScheduleAdd.getActivityStaffingPlanCoverages({
          activityStaffingPlanCoverages: mockDay
        });
      });

      it('should get activityStaffingPlanCoverages from store', () => {
        expect(activityStaffingPlanCoverages).toEqual(mockDay);
      });
    });

    describe('when there is no activityStaffingPlanCoverages', () => {
      let activityStaffingPlanCoverages: IActivityStaffingPlanCoverage[];
      beforeEach(() => {
        activityStaffingPlanCoverages = SelfScheduleAdd.getActivityStaffingPlanCoverages({
          activityStaffingPlanCoverages: null
        });
      });
      it('should get null from store', () => {
        expect(activityStaffingPlanCoverages).toBeNull();
      });
    });
  });
});
