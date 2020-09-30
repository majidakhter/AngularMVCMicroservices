

import { DateInputComponent } from './date-input.component';
import { DateFormatter } from '../date-formats/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { DateInputService } from './date-input.service';
import { Moment } from 'moment';

describe('DateInput', () => {
  let component: DateInputComponent;
  let mockDateInputService: jasmine.SpyObj<DateInputService>;
  let translateServiceSdkMock: jasmine.SpyObj<TranslateService>;
  let calendarMock: jasmine.SpyObj<any>;
  let dateFormatterMock: jasmine.SpyObj<DateFormatter>;

  function createComponent(): DateInputComponent {
    return new DateInputComponent(
      mockDateInputService,
      translateServiceSdkMock,
      dateFormatterMock);
  }

  beforeEach(() => {
    mockDateInputService = jasmine.createSpyObj('DateInputService', ['setNavigationIcons']);
    translateServiceSdkMock = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    calendarMock = jasmine.createSpyObj('Calendar', ['']);
    dateFormatterMock = jasmine.createSpyObj<DateFormatter>('DateFormatter', ['toShortMonth', 'toDayOfMonth']);
  });

  describe('#ngAfterViewInit', () => {
    beforeEach(() => {
      component = createComponent();
      component.ngAfterViewInit();
    });

    it('should set up the navigation icons', () => {
      expect(mockDateInputService.setNavigationIcons).toHaveBeenCalled();
    });
  });

  describe('#onDateChanged', () => {
    beforeEach(() => {
      component = createComponent();
      component.multiDateSelect = true;
      dateFormatterMock.toShortMonth.and.callFake((date: Moment) => {
        return date.format('MMM');
      });
      dateFormatterMock.toDayOfMonth.and.callFake((date: Moment) => {
        return date.format('D');
      });
    });
    describe('when there is a list of dates', () => {
      beforeEach(() => {
        translateServiceSdkMock.instant.and.returnValue('Selected:May 15,16');
        component.selectedDateList = [new Date('05/15/2019'), new Date('05/16/2019')];
        component.onDateChanged();
      });
      it('should have list of dates', () => {
        expect(component.viewDates).toBe('Selected:May 15,16');
        expect(translateServiceSdkMock.instant).toHaveBeenCalledWith('quick-view-schedule.selected', {
          selectedDays: 'May 15,16'
        });
      });
    });
    describe('when there is no data', () => {
      beforeEach(() => {
        translateServiceSdkMock.instant.and.returnValue('');
        component.selectedDateList = [];
        component.onDateChanged();
      });
      it('should not have list of dates ', () => {
        expect(component.viewDates).toBe('');
        expect(translateServiceSdkMock.instant).toHaveBeenCalledWith('quick-view-schedule.selected', {
          selectedDays: ''
        });
      });
    });
  });

  describe('#onInputBlur', () => {
    let touched;
    beforeEach(() => {
      component.onModelTouched();
      component.registerOnTouched(() => {
        touched = true;
      });

      component.dateValue = new Date(2018, 4, 15);
    });

    it('should broadcast the change', (done) => {
      component.dateChanged.subscribe((date) => {
        expect(date).toEqual([]);
        done();
      });

      component.onInputBlur();
      expect(touched).toBeTruthy();
    });
  });

  describe('#onInputFocus', () => {
    beforeEach(() => {
      component = createComponent();
      component.onInputFocus();
    });

    it('should set up the navigation icons', () => {
      expect(mockDateInputService.setNavigationIcons).toHaveBeenCalled();
    });
  });

  describe('#writeValue', () => {
    it('should propagate the change', (done) => {
      component['propagateChange']();
      component.registerOnChange((date) => {
        expect(date).toEqual(new Date(2018, 4, 15));
        done();
      });
      component.writeValue(new Date(2018, 4, 15));
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component = createComponent();
      component.dateFormat = '05/15/2019';
      component.multiDateSelect = false;
      component.dateValue = new Date('05/15/2019');
      component.ngOnInit();
    });

    it('when select date type is activity, shoud take only single value', () => {
      expect(component.selectedDateList).toBeUndefined();
      expect(component.selectedSingleDate).toEqual(new Date('05/15/2019'));
    });

    describe('#select multiple date', () => {
      beforeEach(() => {
        component = createComponent();
        component.multiDateSelect = true;
        component.dateValue = new Date('05/15/2019');
        component.ngOnInit();
      });
      it('when select date type is paycode, shoud take only multiple value', () => {
        expect(component.selectedDateList).toEqual([new Date('05/15/2019')]);
        expect(component.selectedSingleDate).toBeUndefined();
      });
    });
  });

  describe('#cancel', () => {
    beforeEach(() => {
      component = createComponent();
      component.calendar = calendarMock;
      component.calendar.overlayVisible = true;
    });
    describe('when set up to select multiple days', () => {
      let previousList: Date[];
      beforeEach(() => {
        component.multiDateSelect = true;
        previousList = [new Date(), new Date(3)];
        component['prevSelectedDateList'] = previousList;
        component.cancel();
      });
      it('when the cancel button is clicked in the datepicker', () => {
        expect(component.selectedDateList).toEqual(previousList);
        expect(component.calendar.overlayVisible).toEqual(false);
      });
    });
    describe('when set up to select a single day', () => {
      beforeEach(() => {
        component.multiDateSelect = false;
        component.cancel();
      });
      it('when the cancel button is clicked in the datepicker', () => {
        expect(component.calendar.overlayVisible).toEqual(false);
      });
    });
  });

  describe('#done', () => {
    beforeEach(() => {
      component = createComponent();
      component.calendar = calendarMock;
      component.done();
    });
    it('when the done button is clicked in the datepicker', () => {
      expect(component.calendar).toBeDefined();
      expect(component.calendar.overlayVisible).toEqual(false);
    });
  });
});
