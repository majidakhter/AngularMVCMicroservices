
import { NeedsValidationModalComponent } from './needs-validation-modal.component';
import { DateFormatter } from 'src/app/shared/date-formats/date-formatter';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { PreferenceSetting } from 'src/app/time-management-domain/preference-setting';
import { of } from 'rxjs';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('NeedsValidationModalComponent', () => {
  let component: NeedsValidationModalComponent;
  let mockDateFormatter: jasmine.SpyObj<DateFormatter>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const coverage =
    {
      profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
      profile: { id: '132', code: 'test code', name: 'test change', number: '4' },
      activity: {
        startTime: '13:45',
        hours: 8,
        lunchHours: 1,
        payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
        start: moment('01-04-2020'),
        end: moment('01-04-2020'),
        id: '21', code: 'test code', name: 'test name', number: '16'
      },
      days: [{ needDate: '2020-05-25', need: 4, coverage: 1 }]
    };

  
  function createComponent(): NeedsValidationModalComponent {
    const componentMock = new NeedsValidationModalComponent(mockStore, mockDateFormatter, mockTranslateService);
    Object.defineProperty(componentMock, 'activityStaffingPlanCoverage$', { writable: true });
    Object.defineProperty(componentMock, 'preferenceSetting$', { writable: true });
    return componentMock;
  }

  beforeEach(() => {
    mockDateFormatter = jasmine.createSpyObj('DateFormatter', ['toMonthDateYear', 'toShortDate', 'toMonthDay', 'format', 'to24HourTime']);
    mockStore = jasmine.createSpyObj('Store', ['selectSnapshot', 'dispatch', 'subscribe']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
  });

  describe('#ngOnInit', () => {

    beforeEach(() => {
      component = createComponent();
    });

    describe('When preferenceSetting has valid data', () => {
      let expectedSelectedRecentOrgGroup;
      let expectedActivityStaffingPlanCovergae;
      beforeEach(() => {
        expectedSelectedRecentOrgGroup = new PreferenceSetting();
        expectedSelectedRecentOrgGroup.organizationEntityId = '34';
        expectedSelectedRecentOrgGroup.profiles = [{
          id: 132,
          activities: [{id: 21}]
        }];

        expectedActivityStaffingPlanCovergae = [
          {
            profileGroup: { id: '23', code: 'test code', name: 'test name', number: '5', displayOrder: 88 },
            profile: { id: '76', code: 'test code', name: 'test name', number: '4' },
            activity: {
              startTime: '13:45',
              hours: 8,
              lunchHours: 1,
              payCode: { id: '97', code: 'test code', name: 'test name', number: '6' },
              start: moment('2019-09-03T07:00:00'),
              end: moment('05-08-2019'),
              id: 21, code: 'test code', name: 'test name', number: '16'
            },
            days: [{ needDate: '05-08-2019', need: 4, coverage: 1 }]
          },
          {
            profileGroup: null,
            activity: {
              code: 'DAY8',
              hours: 8,
              id: '36',
              lunchHours: 0,
              name: 'DAY8',
              payCode: null,
              start: moment('2019-09-03T07:00:00'),
              end: moment('05-08-2019'),
              startTime: '07:00:00',
              number: '10'
            },
            days: [{ needDate: '2019-09-16', need: 8, coverage: 0 }],
            profile: { id: '90', code: 'ARA02', name: 'ARA02', number: null }
          }];
        component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
        component.activityStaffingPlanCoverage$ = of(expectedActivityStaffingPlanCovergae);
        component.ngOnInit();
      });
      it('preferenceSetting will be defined', () => {
        expect(component.selectedPreferenceSetting).toEqual(expectedSelectedRecentOrgGroup);
      });
    });

    describe('When ActivityStaffingPlanCovergae has no data', () => {
      let expectedSelectedRecentOrgGroup;
      let expectedActivityStaffingPlanCovergae;
      beforeEach(() => {
        expectedSelectedRecentOrgGroup = new PreferenceSetting();
        expectedActivityStaffingPlanCovergae = [];
        component.preferenceSetting$ = of(expectedSelectedRecentOrgGroup);
        component.activityStaffingPlanCoverage$ = of(expectedActivityStaffingPlanCovergae);
        component.ngOnInit();
      });
      it('preferenceSetting will be defined and ActivityStaffingPlanCovergae will be empty', () => {
        expect(component.selectedPreferenceSetting).toEqual(expectedSelectedRecentOrgGroup);
      });
    });

    describe('When ActivityStaffingPlanCovergae and preferenceSetting has no valid data', () => {
      beforeEach(() => {
        const expectedPreferenceSetting = undefined;
        const expectedActivityStaffingPlanCovergae = undefined;
        component.preferenceSetting$ = of(expectedPreferenceSetting);
        component.activityStaffingPlanCoverage$ = of(expectedActivityStaffingPlanCovergae);
        component.ngOnInit();
      });
      it('preferenceSetting will be undefined', () => {
        expect(component.selectedPreferenceSetting).toEqual(undefined);
      });
    });
  });

  describe('#closeApprovalModal', () => {
    beforeEach(() => {
      spyOn(component, 'close');
      spyOn(component.close, 'emit');
      component.closeApprovalModal();
    });

    it('should call the close', () => {
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  describe('#ngOnChanges', () => {
    beforeEach(() => {
      const change = new SimpleChange([], coverage, true);
      const changes: SimpleChanges = { addShiftCoverage: change };
      component = createComponent();
      component.addShiftCoverage = coverage;
      component.ngOnChanges(changes);
    });

    it('should be profile name given in profile object in coverage', () => {
      expect(component.profileName).toEqual('test change');
      expect(coverage.days[0].need).toBe(4);
    });

  });

  describe('#ngOnChanges', () => {
    beforeEach(() => {
      let changecoverage: any;
      const change = new SimpleChange(coverage, changecoverage, true);
      const changes: SimpleChanges = { addShiftCoverage: change };
      component = createComponent();
      component.addShiftCoverage = changecoverage;
      component.ngOnChanges(changes);
    });

    it('should be undefined as coverage is empty', () => {
      expect(component.profileName).toBeUndefined();
    });
  });

});
