

import { DateInputService } from './date-input.service';
import { DocumentRef } from '../document-ref/document-ref.service';

describe('DateInput', () => {
  let service: DateInputService;
  const mockDocumentRef = jasmine.createSpyObj<DocumentRef>('DocumentRef', ['getDocument']);

  function buildService(): void {
    service = new DateInputService(mockDocumentRef);
  }

  beforeAll(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  describe('#setNavigationIcons', () => {

    describe('when icons are found', () => {
      let selectorSpy, classListSpy1, classListSpy2, mockDocument, leftElement, rightElement;
      beforeEach(() => {
        classListSpy1 = jasmine.createSpyObj('classList', ['add']);
        classListSpy1.add.and.callThrough();

        classListSpy2 = jasmine.createSpyObj('classList', ['add']);
        classListSpy2.add.and.callThrough();

        leftElement = { classList: classListSpy1 };
        rightElement = { classList: classListSpy2 };

        selectorSpy = jasmine.createSpy('querySelector').and.callFake((className) => {
          if (className === '.pi-chevron-left') {
            return leftElement;
          } else if (className === '.pi-chevron-right') {
            return rightElement;
          } else {
            return null;
          }
        });

        mockDocument = {
          querySelector: selectorSpy
        };
        mockDocumentRef.getDocument.and.returnValue(mockDocument);

        buildService();
        service.setNavigationIcons();
        jasmine.clock().tick(1);
      });

      it('should get the icons', () => {
        expect(mockDocumentRef.getDocument).toHaveBeenCalled();
        expect(mockDocument.querySelector).toHaveBeenCalledWith('.pi-chevron-left');
        expect(mockDocument.querySelector).toHaveBeenCalledWith('.pi-chevron-right');
      });

      it('should add the previous icon classes to the left button class lists', () => {
        expect(leftElement.classList.add).toHaveBeenCalledWith('icon-ge');
        expect(leftElement.classList.add).toHaveBeenCalledWith('icon-ge-chevron_left');
      });

      it('should add the next icon class to the right button class list', () => {
        expect(rightElement.classList.add).toHaveBeenCalledWith('icon-ge');
        expect(rightElement.classList.add).toHaveBeenCalledWith('icon-ge-chevron_right');
      });
    });

    describe('when icons are not found', () => {
      let selectorSpy, mockDocument;
      beforeEach(() => {

        selectorSpy = jasmine.createSpy('querySelector').and.returnValue(undefined);

        mockDocument = {
          querySelector: selectorSpy
        };
        mockDocumentRef.getDocument.and.returnValue(mockDocument);

        buildService();
        service.setNavigationIcons();
        jasmine.clock().tick(1);
      });

      it('should get the icons', () => {
        expect(mockDocumentRef.getDocument).toHaveBeenCalled();
        expect(mockDocument.querySelector).toHaveBeenCalledWith('.pi-chevron-left');
        expect(mockDocument.querySelector).toHaveBeenCalledWith('.pi-chevron-right');
      });
    });

  });

});
