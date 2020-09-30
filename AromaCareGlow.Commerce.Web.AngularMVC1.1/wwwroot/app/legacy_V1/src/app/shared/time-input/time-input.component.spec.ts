

import { TimeInputComponent } from './time-input.component';
import { DocumentRef } from '../document-ref/document-ref.service';

describe('TimeInput', () => {
  let component: TimeInputComponent;
  const mockDocumentRef = jasmine.createSpyObj<DocumentRef>('DocumentRef', ['getDocument']);

  function buildComponent(): void {
    component = new TimeInputComponent(mockDocumentRef);
  }

  beforeAll(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  describe('#timeBlurEvent', () => {
    beforeEach(() => {
      buildComponent();
    });

    describe('when changed to a valid time', () => {
      it('broadcasts the time value', (done) => {
        component.timeValue = new Date();
        component.timeChanged.subscribe((time: Date) => {
          expect(time.getHours()).toEqual(14);
          expect(time.getMinutes()).toEqual(30);
          done();
        });
        component.timeBlurEvent('14:30');
      });
    });

    describe('when changed to an invalid time', () => {
      it('broadcasts current time', (done) => {
        const now = new Date();
        component.timeValue = new Date(2017, 6, 13, 14, 30);
        component.timeChanged.subscribe((time: Date) => {
          expect(time.getHours()).toEqual(now.getHours());
          expect(time.getMinutes()).toEqual(now.getMinutes());
          done();
        });
        component.timeBlurEvent('73');
      });
    });

    describe('when changed to an empty string', () => {
      it('broadcasts current time', (done) => {
        const now = new Date();
        component.timeValue = new Date(2017, 6, 13, 14, 30);
        component.timeChanged.subscribe((time: Date) => {
          expect(time.getHours()).toEqual(now.getHours());
          expect(time.getMinutes()).toEqual(now.getMinutes());
          done();
        });
        component.timeBlurEvent(null);
      });
    });
    describe('when changed to a valid trade time', () => {
      beforeEach(() => {
        component.tradeTimeValue = new Date(2019, 8, 30, 14, 30);
      });
      it('broadcasts the trade time value', () => {
        component.timeChanged.subscribe((time: Date) => {
          expect(time.getHours()).toEqual(14);
          expect(time.getMinutes()).toEqual(30);
        });
        component.timeBlurEvent('14:30');
      });
    });
  });

  describe('#timeFocusEvent', () => {

    describe('when arrow elements are found', () => {
      let selectorSpy, classListSpy1, classListSpy2, classListSpy3, mockDocument, upElement1, upElement2, downElement1;
      beforeEach(() => {
        classListSpy1 = jasmine.createSpyObj('classList', ['add']);
        classListSpy1.add.and.callThrough();

        classListSpy2 = jasmine.createSpyObj('classList', ['add']);
        classListSpy2.add.and.callThrough();

        classListSpy3 = jasmine.createSpyObj('classList', ['add']);
        classListSpy3.add.and.callThrough();

        upElement1 = { classList: classListSpy1 };
        upElement2 = { classList: classListSpy2 };
        downElement1 = { classList: classListSpy3 };

        selectorSpy = jasmine.createSpy('getElementsByClassName').and.callFake((className) => {
          if (className === 'fa-angle-up') {
            const els = new Array();
            els.push(upElement1);
            els.push(upElement2);
            return els;
          } else if (className === 'fa-angle-down') {
            const els = new Array();
            els.push(downElement1);
            return els;
          } else {
            return null;
          }
        });

        mockDocument = {
          getElementsByClassName: selectorSpy
        };
        mockDocumentRef.getDocument.and.returnValue(mockDocument);

        buildComponent();
        component.timeFocusEvent();
        jasmine.clock().tick(1);
      });

      it('should get the icons', () => {
        expect(mockDocumentRef.getDocument).toHaveBeenCalled();
        expect(mockDocument.getElementsByClassName).toHaveBeenCalledWith('fa-angle-up');
        expect(mockDocument.getElementsByClassName).toHaveBeenCalledWith('fa-angle-down');
      });

      it('should add the up icon classes to the up button class lists', () => {
        expect(upElement1.classList.add).toHaveBeenCalledWith('icon-ge');
        expect(upElement1.classList.add).toHaveBeenCalledWith('icon-ge-chevron_up');
        expect(upElement2.classList.add).toHaveBeenCalledWith('icon-ge');
        expect(upElement2.classList.add).toHaveBeenCalledWith('icon-ge-chevron_up');
      });

      it('should add the down icon class to the down button class list', () => {
        expect(downElement1.classList.add).toHaveBeenCalledWith('icon-ge');
        expect(downElement1.classList.add).toHaveBeenCalledWith('icon-ge-chevron_down');
      });
    });

    describe('when arrow elements are not found', () => {
      let selectorSpy, mockDocument;
      beforeEach(() => {

        selectorSpy = jasmine.createSpy('getElementsByClassName').and.returnValue(undefined);

        mockDocument = {
          getElementsByClassName: selectorSpy
        };
        mockDocumentRef.getDocument.and.returnValue(mockDocument);

        buildComponent();
        component.timeFocusEvent();
        jasmine.clock().tick(1);
      });

      it('should attempt to get the icons', () => {
        expect(mockDocumentRef.getDocument).toHaveBeenCalled();
        expect(mockDocument.getElementsByClassName).toHaveBeenCalledWith('fa-angle-up');
        expect(mockDocument.getElementsByClassName).toHaveBeenCalledWith('fa-angle-down');
      });
    });
  });
});
