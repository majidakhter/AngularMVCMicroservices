
import { WfmPopoverComponent } from './popover.component';
import { ElementRef, ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { WindowRef } from '../window-ref/window-ref.service';
import { Subject } from 'rxjs/Subject';
import { DocumentRef } from '../document-ref/document-ref.service';
import { IPopoverConfig, IPopoverContext } from './popover.directive';

describe('WfmPopoverComponent', () => {
  @Component({})
  class TestComponent { }
  let mockWindowRef: jasmine.SpyObj<WindowRef>;
  let mockDocumentRef: jasmine.SpyObj<DocumentRef>;
  let mockElementRef: jasmine.SpyObj<ElementRef>;
  let mockResolver: jasmine.SpyObj<ComponentFactoryResolver>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  const scrollSubject: Subject<number> = new Subject<number>();
  const hostGetBoundClientRectSpy = jasmine.createSpy('getBoundingClientRect').and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202 });
  const contentConfig = {
    content: 'contentConfig'
  } as IPopoverContext<any>;

  const mockConfig = {
    contentType: TestComponent,
    contentConfig: contentConfig,
    cssClass: 'rainbow',
    alignment: 'center',
    topPadding: 5,
    scrollListener: scrollSubject.asObservable(),
    host: {
      getBoundingClientRect: hostGetBoundClientRectSpy
    }
  } as IPopoverConfig;

  const buildComponent = (mockNativeElement: any): WfmPopoverComponent => {
    mockElementRef = new ElementRef(mockNativeElement);
    mockResolver = jasmine.createSpyObj<ComponentFactoryResolver>('ComponentFactoryResolver', ['resolveComponentFactory']);
    mockWindowRef = jasmine.createSpyObj<WindowRef>('WindowRef', ['getWindow']);
    mockDocumentRef = jasmine.createSpyObj<DocumentRef>('DocumentRef', ['getDocument']);
    mockRenderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setStyle']);
    return new WfmPopoverComponent(mockConfig, mockElementRef, mockResolver, mockWindowRef, mockDocumentRef, mockRenderer);
  };

  beforeAll(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2018, 3, 2, 8, 20, 33));
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  describe('#ngOnInit', () => {
    let component: WfmPopoverComponent, componentFactory, injector, createComponentSpy;
    let setLocationSpy;

    beforeEach(() => {
      setLocationSpy = spyOn((WfmPopoverComponent as any).prototype, 'setLocation');
      component = buildComponent({});
      componentFactory = { content: 'this is the component factory' };
      injector = { content: 'this is the injector' };
      mockResolver.resolveComponentFactory.and.returnValue(componentFactory);
      createComponentSpy = jasmine.createSpy('createComponent');
      (component as any).popoverContainer = {
        createComponent: createComponentSpy
      };
      component.ngOnInit();
    });

    it('should create the component that should be put in the popover', () => {
      expect(component.cssClass).toEqual('rainbow');
    });

    describe('when page is scrolled', () => {
      beforeEach(() => {
        scrollSubject.next(3);
      });

      it('should call setLocation', () => {
        expect(setLocationSpy).toHaveBeenCalled();
      });
    });
  });

  describe('#ngAfterViewInit', () => {
    let component: WfmPopoverComponent, setLocationSpy;
    beforeEach(() => {
      component = buildComponent({});
      setLocationSpy = spyOn((component as any), 'setLocation');
      component.ngAfterViewInit();
    });

    it('should set location after timeout', () => {
      expect(setLocationSpy).not.toHaveBeenCalled();
      jasmine.clock().tick(1);
      expect(setLocationSpy).toHaveBeenCalled();
    });

    it('should set loading to false after timeout', () => {
      expect((component as any).loading).toEqual(true);
      jasmine.clock().tick(50);
      expect((component as any).loading).toEqual(true);
      jasmine.clock().tick(100);
      expect((component as any).loading).toEqual(false);
    });

    it('should not change loading', () => {
      expect((component as any).loading).toEqual(true);
    });
  });

  describe('#ngDoCheck', () => {
    describe('when the height of the popover has not changed', () => {
      let component: WfmPopoverComponent;
      let setPositionSpy;

      beforeEach(() => {
        const nativeElement = {
          children: [
            {
              getBoundingClientRect: () => new DOMRect(3, 3, 30, 20)
            }
          ]
        };

        component = buildComponent(nativeElement);
        setPositionSpy = spyOn((component as any), 'setPosition');
        (component as any).previousHeight = 20;
        component.ngDoCheck();
      });

      it('should do nothing', () => {
        expect(setPositionSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the height of the popover has changed', () => {
      let component: WfmPopoverComponent;
      let setPositionSpy;

      beforeEach(() => {
        const nativeElement = {
          children: [
            {
              getBoundingClientRect: () => new DOMRect(3, 3, 30, 44)
            }
          ]
        };

        component = buildComponent(nativeElement);
        setPositionSpy = spyOn((component as any), 'setPosition');
        mockWindowRef.getWindow.and.returnValue({ pageYOffset: 50 });
        mockDocumentRef.getDocument.and.returnValue({
          documentElement: {
            clientTop: 40
          }
        });

        (component as any).previousHeight = 20;
        component.ngDoCheck();
      });

      it('should do nothing', () => {
        expect(setPositionSpy).toHaveBeenCalledWith(new DOMRect(3, 3, 30, 44), 10, 0, 0, 0);
      });
    });
  });

  describe('#onResize', () => {
    let component: WfmPopoverComponent, setLocationSpy;
    beforeEach(() => {
      component = buildComponent({});
      setLocationSpy = spyOn((component as any), 'setLocation');
      component.onResize();
    });

    it('should set location', () => {
      expect(setLocationSpy).toHaveBeenCalled();
    });
  });

  describe('#setLocation', () => {
    let elementGetBoundClientRectSpy, component: WfmPopoverComponent, alignSpy;
    let setPositionSpy;

    const setupTest = (): void => {
      elementGetBoundClientRectSpy = jasmine.createSpy('getBoundingClientRect').and.returnValue(new DOMRect(3, 3, 33, 44));
      component = buildComponent(
        {
          children: [
            { getBoundingClientRect: elementGetBoundClientRectSpy }
          ]
        }
      );

      setPositionSpy = spyOn((component as any), 'setPosition');
      mockWindowRef.getWindow.and.returnValue({ pageYOffset: 0 });
      mockDocumentRef.getDocument.and.returnValue({ documentElement: { clientTop: 50 } });
    };

    describe('when alignment is right', () => {
      beforeEach(() => {
        setupTest();
        alignSpy = spyOn((component as any), 'doRightAlignment');
        (component as any).config.alignment = 'right';
        (component as any).setLocation();
      });

      it('should call doRightAlignment', () => {
        expect(alignSpy).toHaveBeenCalledWith(33, 0);
      });

      it('should set top', () => {
        expect(setPositionSpy).toHaveBeenCalledWith(new DOMRect(3, 3, 33, 44), -50, 0, 0, 0);
      });
    });

    describe('when alignment is full-width', () => {
      beforeEach(() => {
        setupTest();
        alignSpy = spyOn((component as any), 'doFullWidthAlignment');
        (component as any).config.alignment = 'full-width';
        (component as any).setLocation();
      });

      it('should call doRightAlignment', () => {
        expect(alignSpy).toHaveBeenCalledWith(0, 0);
      });

      it('should set top', () => {
        expect(setPositionSpy).toHaveBeenCalledWith(new DOMRect(3, 3, 33, 44), -50, 0, 0, 0);
      });
    });

    describe('when alignment is center', () => {
      beforeEach(() => {
        setupTest();
        alignSpy = spyOn((component as any), 'doCenterAlignment');
        (component as any).config.alignment = 'center';
        (component as any).setLocation();
      });

      it('should call doCenterAlignment', () => {
        expect(alignSpy).toHaveBeenCalledWith(33, 0, 0);
      });

      it('should set top', () => {
        expect(setPositionSpy).toHaveBeenCalledWith(new DOMRect(3, 3, 33, 44), -50, 0, 0, 0);
      });
    });

    describe('when alignment is left', () => {
      describe('and leftPadding is undefined', () => {
        beforeEach(() => {
          setupTest();
          alignSpy = spyOn((component as any), 'doLeftAlignment');
          (component as any).config.alignment = 'left';
          (component as any).setLocation();
        });

        it('should call doLeftAlignment', () => {
          expect(alignSpy).toHaveBeenCalledWith(0, 0);
        });

        it('should set top', () => {
          expect(setPositionSpy).toHaveBeenCalledWith(new DOMRect(3, 3, 33, 44), -50, 0, 0, 0);
        });
      });

      describe('and leftPadding is defined', () => {
        beforeEach(() => {
          setupTest();
          alignSpy = spyOn((component as any), 'doLeftAlignment');
          (component as any).config.alignment = 'left';
          (component as any).config.leftPadding = 5;
          (component as any).setLocation();
        });

        it('should call doLeftAlignment', () => {
          expect(alignSpy).toHaveBeenCalledWith(0, 5);
        });

        it('should set top', () => {
          expect(setPositionSpy).toHaveBeenCalledWith(new DOMRect(3, 3, 33, 44), -50, 0, 0, 0);
        });
      });
    });
  });

  describe('#doCenterAlignment', () => {
    let component: WfmPopoverComponent;
    const runTest = (popoverWidth: number, hostLeft: number, hostWidth: number): void => {
      component = buildComponent({});
      mockWindowRef.getWindow.and.returnValue({ innerWidth: 111 });
      (component as any).doCenterAlignment(popoverWidth, hostLeft, hostWidth);
    };

    describe('when popover will go off the screen to the right', () => {
      beforeEach(() => {
        runTest(20, 100, 1);
      });

      it('should set left position so popover remains on screen', () => {
        expect(component.left).toEqual('106px');
      });
    });

    describe('when the popover will fit', () => {
      beforeEach(() => {
        runTest(20, 0, 50);
      });

      it('should set left position so popover is centered on host element', () => {
        expect(component.left).toEqual('50px');
      });
    });
  });

  describe('#doFullWidthAlignment', () => {
    let component: WfmPopoverComponent;

    const runTest = (hostLeft: number, hostWidth: number, children: Array<any> = []): void => {
      component = buildComponent({ children: children });
      (component as any).doFullWidthAlignment(hostWidth, hostLeft);
    };

    describe('when the component has no child comopnents', () => {
      beforeEach(() => {
        runTest(10, 400);
      });

      it('should set the left to equal the host element\'s left', () => {
        expect(component.left).toEqual('45px');
      });

      it('should not set the width', () => {
        expect(mockRenderer.setStyle).not.toHaveBeenCalled();
      });
    });

    describe('when there is a child component', () => {
      let childElement: any;

      beforeEach(() => {
        childElement = { name: 'child component' };
        runTest(10, 400, [childElement]);
      });

      it('should set the left to equal the host element\'s left', () => {
        expect(component.left).toEqual('45px');
      });

      it('should set the width', () => {
        expect(mockRenderer.setStyle).toHaveBeenCalledWith(childElement, 'width', '400px');
      });
    });
  });

  describe('#doRightAlignment', () => {
    let component: WfmPopoverComponent;
    const runTest = (popoverWidth: number, hostRight: number): void => {
      component = buildComponent({});
      mockWindowRef.getWindow.and.returnValue({ innerWidth: 111 });
      (component as any).doRightAlignment(popoverWidth, hostRight);
    };

    describe('when popover will go off the screen to the left', () => {
      beforeEach(() => {
        runTest(50, 20);
      });

      it('should set left position so popover remains on screen', () => {
        expect(component.left).toEqual('35px');
      });
    });

    describe('when the popover will fit', () => {
      beforeEach(() => {
        runTest(20, 50);
      });

      it('should set left position so right edge of popover is aligned with right edge of host', () => {
        expect(component.left).toEqual('65px');
      });
    });
  });

  describe('doLeftAlignment', () => {
    let component: WfmPopoverComponent;

    describe('when leftPadding argument is not passed', () => {
      beforeEach(() => {
        component = buildComponent({});
        (component as any).doLeftAlignment(34);
      });

      it('should set left position', () => {
        expect(component.left).toEqual('69px');
      });
    });

    describe('when leftPadding is defined', () => {
      beforeEach(() => {
        component = buildComponent({});
        (component as any).doLeftAlignment(34, 4);
      });

      it('should set left position accounting for leftPadding', () => {
        expect(component.left).toEqual('73px');
      });
    });
  });
  describe('#setPosition', () => {
    let component: WfmPopoverComponent;
    let domRect = new DOMRect();
    let topOffset: number;
    let hostHeight: number;
    let left: number;
    let right: number;
    let expectedTop: number;
    let expectedArrowLeft: number;
    let expectedLeft: number;
    const el = document.createElement('button');
    el.classList.add('button-clear');
    el.classList.add('secondary-button');
    el.classList.add('wf-icon-button');
    el.innerHTML = `<i class="icon-ge-filter icon-container left-button ng-star-inserted"></i>
    <span>Filter Applied: (1)</span>
    <i class="icon-ge-dropdown ng-star-inserted"></i>`;
    mockConfig.host = el;

    describe('when there is not enough room below and above the host element', () => {
      beforeEach(() => {
        component = buildComponent({});
        mockWindowRef.getWindow.and.returnValue({ innerHeight: 754 });
        topOffset = 306;
        hostHeight = 16;
        left = 1300;
        right = 1476;
        component.left = '1044px';
        domRect = new DOMRect(868, 17, 432, 460);
        spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(
          jasmine.createSpy('getBoundingClientRect').and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202 })
        );
      });
      describe('and there is room on the lefts side of the host element', () => {
        beforeEach(() => {
          (component as any).setPosition(domRect, topOffset, hostHeight, left, right);
          const tentativeTop = topOffset + hostHeight + mockConfig.topPadding;
          expectedTop = tentativeTop / (tentativeTop + domRect.height) + hostHeight;
          expectedLeft = left - domRect.width;
        });
        it('should position the popover on the left side of the host element', () => {
          expect(component.above).toEqual(false);
          expect(component.below).toEqual(false);
          expect(component.besideLeft).toEqual(true);
          expect(component.besideRight).toEqual(false);
          expect(component.top).toEqual(`${expectedTop}px`);
          expect(component.left).toEqual(`${expectedLeft}px`);
          expect(component.arrowTop).toEqual(`${topOffset - hostHeight}px`);
        });
      });
    });

    describe('when there is enough room above the host element', () => {
      beforeEach(() => {
        component = buildComponent({});
        mockWindowRef.getWindow.and.returnValue({ innerHeight: 707 });
        topOffset = 386;
        hostHeight = 16;
        left = 1291;
        right = 1448;
        component.left = '1036px';
        domRect = new DOMRect(868, 17, 432, 302);
        spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(
          jasmine.createSpy('getBoundingClientRect').and.returnValue({ top: 386, height: 15, left: 1448, width: 20, right: 1468 })
        );
        (component as any).setPosition(domRect, topOffset, hostHeight, left, right);
        expectedTop = topOffset - mockConfig.topPadding - domRect.height;
        const hostPosition = { top: 386, height: 15, left: 1448, width: 20, right: 1468 };
        const leftArea = parseFloat(component.left.replace('px', ''));
        const popoverArrowFixedOffset = 18;
        expectedArrowLeft = hostPosition.right - (leftArea) - popoverArrowFixedOffset;
      });
      it('should position the popover on the above of the host element', () => {
        expect(component.above).toEqual(true);
        expect(component.below).toEqual(false);
        expect(component.besideLeft).toEqual(false);
        expect(component.besideRight).toEqual(false);
        expect(component.top).toEqual(`${expectedTop}px`);
        expect(component.arrowLeft).toEqual(`${expectedArrowLeft}px`);
      });
    });
    describe('when there is not enough room above the host element but has enough room below', () => {
      beforeEach(() => {
        component = buildComponent({});
        mockWindowRef.getWindow.and.returnValue({ innerHeight: 754 });
        topOffset = 237;
        hostHeight = 16;
        left = 1300;
        right = 1476;
        component.left = '1044px';
        domRect = new DOMRect(868, 17, 432, 302);
        spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(
          jasmine.createSpy('getBoundingClientRect').and.returnValue({ top: 238, height: 15, left: 1456, width: 20, right: 1476 })
        );
        (component as any).setPosition(domRect, topOffset, hostHeight, left, right);
        expectedTop = topOffset + mockConfig.topPadding + hostHeight;
        const hostPosition = { top: 238, height: 15, left: 1456, width: 20, right: 1476 };
        const leftArea = parseFloat(component.left.replace('px', ''));
        const popoverArrowFixedOffset = 18;
        expectedArrowLeft = hostPosition.right - (leftArea) - popoverArrowFixedOffset;
      });
      it('should position the popover on the above of the host element', () => {
        expect(component.above).toEqual(false);
        expect(component.below).toEqual(true);
        expect(component.besideLeft).toEqual(false);
        expect(component.besideRight).toEqual(false);
        expect(component.top).toEqual(`${expectedTop}px`);
        expect(component.arrowLeft).toEqual(`${expectedArrowLeft}px`);
      });
    });
    describe('when there is not enough room above, below and left side the host element but has enough room on the right', () => {
      beforeEach(() => {
        component = buildComponent({});
        mockWindowRef.getWindow.and.returnValue({ innerHeight: 754 });
        topOffset = 306;
        hostHeight = 16;
        left = 36;
        right = 212;
        component.left = '0px';
        domRect = new DOMRect(868, 17, 432, 460);
        spyOn(Element.prototype, 'getBoundingClientRect').and.callFake(
          jasmine.createSpy('getBoundingClientRect').and.returnValue({ top: 306, height: 15, left: 192, width: 20, right: 212 })
        );
        (component as any).setPosition(domRect, topOffset, hostHeight, left, right);
        const tentativeTop = topOffset + hostHeight + mockConfig.topPadding;
        expectedTop = tentativeTop / (tentativeTop + domRect.height) + hostHeight;
        const popoverArrowFixedOffset = 8;
        expectedLeft = right + popoverArrowFixedOffset;
      });
      it('should position the popover on the above of the host element', () => {
        expect(component.above).toEqual(false);
        expect(component.below).toEqual(false);
        expect(component.besideLeft).toEqual(false);
        expect(component.besideRight).toEqual(true);
        expect(component.top).toEqual(`${expectedTop}px`);
        expect(component.left).toEqual(`${expectedLeft}px`);
        expect(component.arrowTop).toEqual(`${topOffset - hostHeight}px`);
      });
    });
  });
});
