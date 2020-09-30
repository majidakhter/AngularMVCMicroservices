
import 'rxjs/add/observable/of';
import { DomHelper } from './dom-helper';

describe('DomHelper', () => {
  let domHelper: DomHelper;

  beforeEach(() => {
    domHelper = new DomHelper();
  });

  describe('always', () => {
    it('should be created', () => {
      expect(domHelper).toBeTruthy();
    });
  });

  describe('#anchorToTarget', () => {
    let element: any;
    let target: any;

    describe('when the element has an offsetParent', () => {
      beforeEach(() => {
        element = {
          offsetParent: true,
          offsetHeight: 25,
          style: {}
        };
        target = {
          offsetHeight: 200,
          offsetParent: {
            offsetTop: 10
          }
        };
      });

      describe('the element fits in the viewport', () => {
        beforeEach(() => {
          spyOn(domHelper, 'getWindowScrollTop').and.returnValue(80);
          spyOn(domHelper, 'getViewportHeight').and.returnValue(1000);
          domHelper.anchorToTarget(element, target);
        });

        it('element top is set to the target height + window scroll top', () => {
          expect(element.style.top).toBe('280px');
        });
      });

      describe('the element does not fit in the viewport', () => {
        beforeEach(() => {
          spyOn(domHelper, 'getViewportHeight').and.returnValue(200);
        });

        describe('and the calculated top is > 0', () => {
          beforeEach(() => {
            spyOn(domHelper, 'getWindowScrollTop').and.returnValue(80);
            domHelper.anchorToTarget(element, target);
          });

          it('element top is set to the window scroll top - element height', () => {
            expect(element.style.top).toBe('55px');
          });
        });

        describe('and the calculated top is < 0', () => {
          beforeEach(() => {
            spyOn(domHelper, 'getWindowScrollTop').and.returnValue(0);
          });

          describe('and the element has no top or bottom margins', () => {
            beforeEach(() => {
              spyOn(domHelper, 'getStyle').and.returnValue({});
              domHelper.anchorToTarget(element, target);
            });

            it('element top is set to the window scroll top - element height', () => {
              expect(element.style.top).toBe('-25px');
            });
          });

          describe('and the element has top and bottom margins', () => {
            beforeEach(() => {
              spyOn(domHelper, 'getStyle').and.returnValue({
                marginTop: '5',
                marginBottom: '5'
              });
              domHelper.anchorToTarget(element, target);
            });

            it('element top is set to the window scroll top - element height - margins', () => {
              expect(element.style.top).toBe('-35px');
            });
          });
        });
      });
    });

    describe('when the element does not have an offsetParent', () => {
      beforeEach(() => {
        element = {
          offsetParent: false,
          offsetHeight: 0,
          style: {}
        };
        target = {
          offsetHeight: 200,
          offsetParent: {
            offsetTop: 10
          }
        };
      });

      describe('the element fits in the viewport', () => {
        beforeEach(() => {
          spyOn(domHelper, 'getHiddenElementHeight').and.returnValue(25);
          spyOn(domHelper, 'getWindowScrollTop').and.returnValue(80);
          spyOn(domHelper, 'getViewportHeight').and.returnValue(1000);
          domHelper.anchorToTarget(element, target);
        });

        it('element top is set to the target height + window scroll top', () => {
          expect(element.style.top).toBe('280px');
        });
      });
    });
  });

  describe('#getDocument', () => {
    let result: any;

    beforeEach(() => {
      result = domHelper.getDocument();
    });

    it('returns the document', () => {
      expect(result).toBeDefined();
    });
  });

  describe('#getViewportHeight', () => {
    let result: number;

    describe('when modal is present', () => {
      let modal: any;

      beforeEach(() => {
        modal = { clientHeight: 42 };
        spyOn(document, 'getElementsByClassName').and.returnValue([modal]);
        result = domHelper.getViewportHeight();
      });

      it('returns the modal height', () => {
        expect(result).toBe(modal.clientHeight);
      });
    });

    describe('when modal is not present', () => {
      let body: any;

      beforeEach(() => {
        body = { clientHeight: 100 };
        spyOn(document, 'getElementsByTagName').and.returnValue([body]);
        result = domHelper.getViewportHeight();
      });

      it('returns the body height', () => {
        expect(result).toBe(body.clientHeight);
      });
    });
  });

  describe('#getHiddenElementHeight', () => {
    let element: any;
    let result: number;

    beforeEach(() => {
      element = { offsetHeight: 100, style: {} };
      result = domHelper.getHiddenElementHeight(element);
    });

    it('returns the element offsetHeight', () => {
      expect(result).toBe(element.offsetHeight);
    });
  });

  describe('#scrollInView', () => {
    let container: any;
    let item: any;

    beforeEach(() => {
      spyOn(domHelper, 'getDocument').and.returnValue({
        body: {
          scrollTop: 0
        }
      });
    });

    describe('when offset < 0', () => {
      beforeEach(() => {
        container = {
          clientHeight: 200,
          scrollTop: 0,
          getBoundingClientRect: () => {
            return {
              top: 200
            };
          }
        };
        item = {
          offsetHeight: 20,
          getBoundingClientRect: () => {
            return {
              top: 20
            };
          }
        };
        spyOn(domHelper, 'getStyle').and.returnValue({
          borderTopWidth: '0',
          paddingTop: '0'
        });
        domHelper.scrollInView(container, item);
      });

      it('sets the container.scrollTop', () => {
        expect(container.scrollTop).toBe(-180);
      });
    });

    describe('when offset + itemHeight > elementHeight', () => {
      beforeEach(() => {
        container = {
          clientHeight: 30,
          scrollTop: 0,
          getBoundingClientRect: () => {
            return {
              top: 0
            };
          }
        };
        item = {
          offsetHeight: 20,
          getBoundingClientRect: () => {
            return {
              top: 20
            };
          }
        };
        spyOn(domHelper, 'getStyle').and.returnValue({});
        domHelper.scrollInView(container, item);
      });

      it('sets the container.scrollTop', () => {
        expect(container.scrollTop).toBe(10);
      });
    });

    describe('when offset + itemHeight < elementHeight', () => {
      beforeEach(() => {
        container = {
          clientHeight: 200,
          scrollTop: 0,
          getBoundingClientRect: () => {
            return {
              top: 0
            };
          }
        };
        item = {
          offsetHeight: 20,
          getBoundingClientRect: () => {
            return {
              top: 20
            };
          }
        };
        spyOn(domHelper, 'getStyle').and.returnValue({});
        domHelper.scrollInView(container, item);
      });

      it('container.scrollTop is unchanged', () => {
        expect(container.scrollTop).toBe(0);
      });
    });
  });
});
