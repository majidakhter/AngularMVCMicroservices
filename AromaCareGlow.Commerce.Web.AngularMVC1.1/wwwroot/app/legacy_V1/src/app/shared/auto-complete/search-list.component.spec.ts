import { ChangeDetectorRef, Component, ElementRef, Renderer2, SimpleChange, SimpleChanges, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import 'rxjs/add/observable/of';
import { FormsModule } from '@angular/forms';

import { DomHelper } from '../helpers/dom-api/dom-helper';
import { ISearchListItem } from '../auto-complete/model/search-list-item';
import { SearchListComponent, TranslatePipe } from './search-list.component';
import { of, Observable } from 'rxjs';

@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('SearchListComponent', () => {
  let component: SearchListComponent;
  let fixture: ComponentFixture<SearchListComponent>;
  const rendererMock = jasmine.createSpyObj('Renderer2', ['setStyle']);
  const domHelperMock = jasmine.createSpyObj('DomHelper', ['scrollInView', 'anchorToTarget']);
  const changeDetectorMock = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges', 'detach']);

  //  Handle both name/description
  const expectedResult: ISearchListItem[] = [{
    id: 1,
    code: 'A',
    description: 'ABC'
  }, {
    id: 2,
    code: 'B',
    name: 'DEF'
  }, {
    id: 3,
    code: 'AB',
    description: 'ABC-1'
  }];

  function mockComponent(options: Component) {
    const metadata: Component = {
      selector: options.selector,
      template: options.template || '',
      inputs: options.inputs,
      outputs: options.outputs
    };

    return Component(metadata)(class {
    });
  }

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        MockPipe,
        SearchListComponent,
        mockComponent({ selector: 'wf-search-list' })
      ],
      providers: [
        { provide: Renderer2, useValue: rendererMock },
        { provide: DomHelper, useValue: domHelperMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorMock }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SearchListComponent);
      });
  }));

  beforeEach(() => {
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('always', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('#ngAfterViewInit', () => {
    beforeEach(() => {
      component.disabled = false;
    });

    describe('always', () => {
      beforeEach(() => {
        component.ngAfterViewInit();
      });

      it('sets isInitialized to true', () => {
        expect(component.isInitialized).toBeTruthy();
      });
    });

    describe('when disabled attribute is not set', () => {
      beforeEach(() => {
        component.disabledAttr = null;
        component.ngAfterViewInit();
      });

      it('disabled remains false', () => {
        expect(component.disabled).toBeFalsy();
      });
    });

    describe('when disabled attribute is set', () => {
      beforeEach(() => {
        component.disabledAttr = '';
        component.ngAfterViewInit();
      });

      it('disabled becomes true', () => {
        expect(component.disabled).toBeTruthy();
      });
    });
  });

  describe('#ngOnChanges', () => {
    beforeEach(() => {
      component.getItems = () => {
        return new Promise(resolve => resolve(expectedResult));
      };
      component.selectedItem = null;
    });

    it('should set the defaulted value if it exists the first time', () => {
      const change = new SimpleChange(null, { code: 'default code' }, true);

      const changes = {
        defaultValue: change
      } as SimpleChanges;

      component.originalItems = [];

      component.ngOnChanges(changes);

      expect(component.selectedItem).not.toBeUndefined();
      expect(component.selectedItem.code).toBe('default code');
    });

    it('should not set the defaulted value if it is not the first change', () => {
      component.selectedItem = {
        code: 'old code'
      } as ISearchListItem;

      const change = {
        previousValue: {
          code: 'old code'
        },
        currentValue: {
          code: 'new code'
        },
        isFirstChange: () => {
          return false;
        },
        firstChange: false
      };

      const changes = {
        defaultValue: change
      } as SimpleChanges;

      component.originalItems = [];

      component.ngOnChanges(changes);

      expect(component.selectedItem.code).toBe('old code');
    });
  });

  describe('#writeValue', () => {
    let selectedItem: ISearchListItem;

    beforeEach(() => {
      selectedItem = { id: 1, code: 'AL', name: 'Alabama' } as ISearchListItem;
      component.selectedItem = selectedItem;
    });

    describe('when the component is not initialized', () => {
      beforeEach(() => {
        spyOn(component, 'setSelected');
        spyOn(component, 'clearSelected');
        component.isInitialized = false;
        component.writeValue(null);
      });

      it('setSelected should not be called', () => {
        expect(component.setSelected).not.toHaveBeenCalled();
      });
    });

    describe('when value is null', () => {
      beforeEach(() => {
        spyOn(component, 'setSelected');
        component.selectedItem = null;
        component.writeValue(null);
      });

      it('setSelected should not be called and selectedItem', () => {
        expect(component.setSelected).not.toHaveBeenCalled();
      });
    });

    describe('when value is not null', () => {
      let newItem: ISearchListItem;
      let setSelectedSpy;
      beforeEach(() => {
        newItem = { id: 2, code: 'AK', name: 'Alaska' } as ISearchListItem;
        setSelectedSpy = spyOn(component, 'setSelected');
        component.writeValue(newItem);
      });

      it('select should be called', () => {
        expect(component.setSelected).toHaveBeenCalledWith(newItem);
      });

      describe('and there is a selectedItem', () => {
        beforeEach(() => {
          component.selectedItem = { id: 1, code: 'AL', name: 'Alabama' } as ISearchListItem;
          component.writeValue(null);
        });

        it('should set selectedItem to null and searchText to empty string', () => {
          expect(component.selectedItem).toBeNull();
          expect(component.searchText).toEqual('');
        });

        describe('and value is the same as selectedItem', () => {
          beforeEach(() => {
            setSelectedSpy.calls.reset();
            component.selectedItem = { id: 1, code: 'AL', name: 'Alabama' } as ISearchListItem;
            component.writeValue(component.selectedItem);
          });

          it('should return and not change selected item', () => {
            expect(component.setSelected).not.toHaveBeenCalled();
            expect(component.selectedItem).toEqual(component.selectedItem);
          });
        });
      });
    });
  });

  describe('#setDisabled', () => {
    it('disables the component', () => {
      component.setDisabledState(true);

      expect(component.disabled).toBeTruthy();
    });
  });

  describe('#registerOnChange', () => {
    let dummyFunction: Function;

    beforeEach(() => {
      dummyFunction = () => {
        return 50;
      };
      component.registerOnChange(dummyFunction);
    });

    it('should change the propagateChange function', () => {
      expect(component.propagateChange).toEqual(dummyFunction);
    });
  });

  describe('#registerOnTouched', () => {
    let dummyFunction: Function;

    beforeEach(() => {
      dummyFunction = () => {
        return 50;
      };
      component.registerOnTouched(dummyFunction);
    });

    it('should change the onModelTouched function', () => {
      expect(component.onModelTouched).toEqual(dummyFunction);
    });
  });

  describe('#onInputBlur', () => {
    beforeEach(() => {
      spyOn(component, 'onModelTouched').and.callThrough();
      spyOn(component, 'toggleList');
      spyOn(component, 'select');
    });

    describe('when selectedIndex is null', () => {
      beforeEach(() => {
        component.selectedIndex = null;
      });

      it('and selectedItem is not null it sets valid to true', () => {
        component.selectedItem = {} as ISearchListItem;
        component.valid = false;
        component.onInputBlur();
        expect(component.valid).toBeTruthy();
      });

      it('and selectedItem is null and required it sets valid to false', () => {
        component.selectedItem = null;
        component.required = 'true';
        component.valid = true;
        component.onInputBlur();
        expect(component.valid).toBeFalsy();
      });

      it('and selectedItem is null and not required it sets valid to hasText', () => {
        component.selectedItem = null;
        component.required = null;
        component.searchText = 'BLAH';
        component.valid = true;
        component.onInputBlur();
        expect(component.valid).toBeFalsy();
      });

      it('should call onModelTouched and hide the list', () => {
        component.onInputBlur();
        expect(component.onModelTouched).toHaveBeenCalled();
        expect(component.toggleList).toHaveBeenCalledWith(false);
      });
    });

    describe('when selectedIndex is not null', () => {
      beforeEach(() => {
        component.selectedIndex = 1;
      });

      describe('and selectedIndex is > the count of displayed items', () => {
        beforeEach(() => {
          component.displayedItems = [];
          component.onInputBlur();
        });

        it('should call onModelTouched and hide the list', () => {
          expect(component.onModelTouched).toHaveBeenCalled();
          expect(component.toggleList).toHaveBeenCalledWith(false);
        });
      });

      describe('and selectedIndex is < the count of displayed items', () => {
        beforeEach(() => {
          component.displayedItems = expectedResult;
          component.onInputBlur();
        });

        it('should call select and onModelTouched', () => {
          expect(component.onModelTouched).toHaveBeenCalled();
          expect(component.select).toHaveBeenCalledWith(expectedResult[component.selectedIndex]);
        });
      });
    });

    describe('when displayedItems is null', () => {
      beforeEach(() => {
        component.selectedIndex = 1;
        component.selectedItem = {} as ISearchListItem;
        component.displayedItems = null;
        component.onInputBlur();
      });

      it('should hide the list', () => {
        expect(component.onModelTouched).toHaveBeenCalled();
        expect(component.toggleList).toHaveBeenCalledWith(false);
      });

    });
  });

  describe('#click', () => {
    describe('when there are unfiltered items', () => {
      beforeEach(() => {
        component.isDisplayed = false;
        component.getItems = () => {
          return new Promise(resolve => resolve(expectedResult));
        };
        spyOn(window, 'setTimeout').and.callFake(callback => callback());
        spyOn(component, 'filter').and.callThrough();
      });

      describe('when unfilteredItems is not set', () => {
        it('should set unfilteredItems', fakeAsync(() => {
          component.onInputFocus();
          tick();
          fixture.detectChanges();
          expect(component.unfilteredItems).toEqual(expectedResult);
        }));
      });

      describe('when unfilteredItems is set', () => {
        beforeEach(() => {
          component.unfilteredItems = expectedResult;
        });

        describe('and selectedItem is not null', () => {
          beforeEach(() => {
            component.selectedItem = expectedResult[0];
            component.toggleList(true);
          });

          it('should set selectedIndex', () => {
            expect(component.selectedIndex).toEqual(0);
          });

          it('should filter items', () => {
            expect(component.filter).toHaveBeenCalled();
          });
        });

        describe('when in dropdown mode', () => {
          beforeEach(() => {
            component.isDropdown = true;
            component.toggleList(true);
          });

          it('should not filter items', () => {
            expect(component.filter).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when there are no unfiltered items', () => {
      beforeEach(() => {
        component.unfilteredItems = [];
      });

      it('does not set showList to true', () => {
        component.onInputFocus();
        expect(component.isDisplayed).toBeFalsy();
      });
    });
  });

  describe('#setUnfilteredItems', () => {
    describe('when getItems is null', () => {
      beforeEach(() => {
        component.getItems = null;
        component.originalItems = expectedResult;
      });

      it('should set unfilteredItems based on originalItems', () => {
        component.setUnfilteredItems();
        expect(component.unfilteredItems).toEqual(expectedResult);
      });
    });

    describe('when there is data', () => {
      beforeEach(() => {
        component.getItems = () => {
          return new Promise(resolve => resolve(expectedResult));
        };
      });

      it('should set unfilteredItems', fakeAsync(() => {
        component.setUnfilteredItems();
        tick();
        fixture.detectChanges();
        expect(component.unfilteredItems).toEqual(expectedResult);
      }));
    });

    describe('when there is not data', () => {
      beforeEach(() => {
        component.getItems = () => {
          return new Promise(resolve => resolve(expectedResult));
        };
      });

      it('should not set showlist to true', () => {
        component.setUnfilteredItems();
        expect(component.isDisplayed).toEqual(false);
      });
    });

    describe('when getItems returns an observable', () => {
      beforeEach(() => {
        component.getItems = () => {
          return of(expectedResult);
        };
        spyOn(Observable.prototype, 'toPromise').and.callThrough();
        component.setUnfilteredItems();
      });

      it('should convert observable to promise', () => {
        expect(Observable.prototype.toPromise).toHaveBeenCalled();
      });
    });

    describe('when getItems does not returns an observable', () => {
      beforeEach(() => {
        component.getItems = () => {
          return null;
        };
        spyOn(Observable.prototype, 'toPromise').and.callThrough();
        component.setUnfilteredItems();
      });

      it('should not convert observable to promise', () => {
        expect(Observable.prototype.toPromise).not.toHaveBeenCalled();
      });
    });
  });

  describe('#onChange', () => {
    let filterSpy;
    let toggleSpy;
    describe('when selectedItem is null', () => {
      beforeEach(() => {
        component.selectedItem = null;
        component.isDisplayed = false;
        filterSpy = spyOn(component, 'filter');
        filterSpy.and.callFake(() => {
          component.displayedItems = expectedResult;
        });
        spyOn(component.itemChanged, 'emit');
        spyOn(component, 'propagateChange');
        toggleSpy = spyOn(component, 'toggleList');
        component.onChange();
      });

      afterEach(() => {
        toggleSpy.calls.reset();
        filterSpy.calls.reset();
      });

      it('itemChanged.emit is not called', () => {
        expect(component.itemChanged.emit).not.toHaveBeenCalled();
      });

      it('propagateChange is not called', () => {
        expect(component.propagateChange).not.toHaveBeenCalled();
      });

      it('filter is called', () => {
        expect(component.filter).toHaveBeenCalled();
      });

      it('should call toggleList with true', () => {
        expect(component.toggleList).toHaveBeenCalledWith(true);
      });

      describe('when list is displayed', () => {
        beforeEach(() => {
          component.isDisplayed = true;
        });

        describe('and displayedItems is equal to 0', () => {
          beforeEach(() => {
            filterSpy.and.callFake(() => {
              component.displayedItems = [];
            });
            component.onChange();
          });

          it('should call togglelist with false', () => {
            expect(component.toggleList).toHaveBeenCalledWith(false);
          });
        });

        describe('and displayedItems is undefined', () => {
          beforeEach(() => {
            filterSpy.and.callFake(() => {
              component.displayedItems = undefined;
            });
            toggleSpy.calls.reset();
            component.onChange();
          });

          it('should not call toggleList', () => {
            expect(component.toggleList).not.toHaveBeenCalled();
          });
        });

        describe('and displayedItems is greater to 0', () => {
          beforeEach(() => {
            filterSpy.and.callFake(() => {
              component.displayedItems = expectedResult;
            });
            component.onChange();
            toggleSpy.calls.reset();
          });

          it('should not call toggleList', () => {
            expect(component.toggleList).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when selectedItem is not null', () => {
      beforeEach(() => {
        component.selectedItem = expectedResult[0];
        spyOn(component, 'filter').and.callFake(() => {
          component.displayedItems = [];
        });
        spyOn(component.itemChanged, 'emit');
        spyOn(component, 'propagateChange');
        component.onChange();
      });

      it('selectedItem is set to null', () => {
        expect(component.selectedItem).toBe(null);
      });

      it('itemChanged.emit is called', () => {
        expect(component.itemChanged.emit).toHaveBeenCalled();
      });

      it('propagateChange is called', () => {
        expect(component.propagateChange).toHaveBeenCalled();
      });

      it('filter is called', () => {
        expect(component.filter).toHaveBeenCalled();
      });
    });
  });

  describe('#filter', () => {
    beforeEach(() => {
      component.unfilteredItems = expectedResult;
      component.getItems = () => {
        return new Promise(resolve => resolve(expectedResult));
      };
    });

    describe('when unfilteredItems is null', () => {
      beforeEach(() => {
        component.unfilteredItems = null;
        component.filter();
      });

      it('should not filter any items', () => {
        expect(component.filteredItems).toBeUndefined();
      });
    });

    describe('when searchText is empty', () => {
      beforeEach(() => {
        component.searchText = '';
        component.filter();
      });

      it('should set items to be unfiltered items', () => {
        expect(component.filteredItems).toEqual(expectedResult);
      });
    });

    describe('when selectedIndex is greater than displayedItems length', () => {
      beforeEach(() => {
        component.selectedIndex = 999;
        component.searchText = 'A';
        component.filter();
      });

      it('should set selectedIndex to 0', () => {
        expect(component.selectedIndex).toEqual(0);
      });
    });

    describe('when selectedIndex is equal to displayedItems length', () => {
      beforeEach(() => {
        component.selectedIndex = 1;
        component.searchText = 'DEF';
        component.filter();
      });

      it('should set selectedIndex to 0', () => {
        expect(component.selectedIndex).toEqual(0);
      });
    });

    describe('when selectedIndex is less than or equal to displayedItems length', () => {
      beforeEach(() => {
        component.selectedIndex = 1;
        component.searchText = 'A';
        component.filter();
      });

      it('should set selectedIndex to existing selectedIndex', () => {
        expect(component.selectedIndex).toEqual(1);
      });
    });

    describe('when clear items', () => {
      beforeEach(() => {
        spyOn(component.itemClear, 'emit');
        spyOn(component, 'toggleList');
        spyOn(component, 'filter');
        spyOn(component, 'propagateChange');
        spyOn(component.searchInput.nativeElement, 'focus');
      });

      describe('and toggleList is true', () => {
        beforeEach(() => {
          component.clearSelected(true);
        });

        it('clear selected Invoked', () => {
          expect(component.searchText).toEqual('');
          expect(component.valid).toEqual(true);
          expect(component.selectedItem).toEqual(null);
          expect(component.filter).toHaveBeenCalled();
          expect(component.itemClear.emit).toHaveBeenCalledWith(null);
          expect(component.toggleList).toHaveBeenCalledWith(true);
        });

        describe('and optional event argument is provided', () => {
          const preventDefaultSpy = jasmine.createSpy();
          beforeEach(() => {
            component.clearSelected(true, { preventDefault: preventDefaultSpy });
          });

          it('should call preventDefault', () => {
            expect(preventDefaultSpy).toHaveBeenCalled();
          });
        });
      });

      describe('and toggleList is false', () => {
        beforeEach(() => {
          component.clearSelected(false);
        });

        it('clear selected Invoked', () => {
          expect(component.searchText).toEqual('');
          expect(component.valid).toEqual(true);
          expect(component.selectedItem).toEqual(null);
          expect(component.filter).toHaveBeenCalled();
          expect(component.itemClear.emit).toHaveBeenCalledWith(null);
          expect(component.toggleList).toHaveBeenCalledWith(false);
          expect(component.searchInput.nativeElement.focus).not.toHaveBeenCalled();
        });
      });
    });

    describe('when searchText is set', () => {
      describe('and match is found on all items', () => {
        beforeEach(() => {
          component.searchText = 'B';
          component.filter();
        });

        it('should set items to matched items', () => {
          expect(component.filteredItems).toEqual(expectedResult);
        });

        it('should get the searchtext', () => {
          const selectedtext = component.getSelectedText();
          expect(selectedtext).toEqual('B');
        });
      });

      describe('and match is found on primary and secondary fields', () => {
        beforeEach(() => {
          component.searchText = 'AB';
          component.filter();
        });

        it('should set items to matched items', () => {
          expect(component.filteredItems.length).toBe(2);
          expect(component.filteredItems[0]).toEqual(expectedResult[0]);
          expect(component.filteredItems[1]).toEqual(expectedResult[2]);
        });
      });

      describe('and match is not found', () => {
        beforeEach(() => {
          component.searchText = 'ZZZ';
          component.filter();
        });

        it('items should be empty', () => {
          expect(component.filteredItems.length).toBe(0);
        });
      });

      describe('and maxItemsDisplayed is set', () => {
        beforeEach(() => {
          component.maxItemsDisplayed = 2;
          component.filter();
        });

        it('the number of displayed items should be restricted', () => {
          expect(component.displayedItems).toEqual(component.filteredItems.slice(0, 2));
        });
      });

      describe('and there is no name defined', () => {
        let unfilteredItems;

        beforeEach(() => {
          unfilteredItems = [{
            id: 1,
            code: 'A'
          }, {
            id: 2,
            code: 'B'
          }, {
            id: 3,
            code: 'AB'
          }] as ISearchListItem[];
          component.unfilteredItems = unfilteredItems;
          component.searchText = 'a';
          component.filter();
        });

        it('does not filter based on the name', () => {
          expect(component.filteredItems.length).toBe(2);
          expect(component.filteredItems[0]).toEqual(unfilteredItems[0]);
          expect(component.filteredItems[1]).toEqual(unfilteredItems[2]);
        });
      });
    });
  });

  describe('#select', () => {
    beforeEach(() => {
      component.originalItems = expectedResult;
      component.unfilteredItems = component.originalItems;
      component.select(expectedResult[0]);
    });

    it('should set showList to false', () => {
      expect(component.isDisplayed).toBeFalsy();
    });

    it('should set the searchText', () => {
      expect(component.searchText).toEqual(expectedResult[0].code);
    });

    it('should emit itemChanged when selected item is different from new item', () => {
      component.selectedItem = null;
      spyOn(component.itemChanged, 'emit');
      component.select(expectedResult[0]);
      expect(component.itemChanged.emit).toHaveBeenCalled();
    });

    it('should not emit item changed if selected item matches new item', () => {
      component.selectedItem = expectedResult[0];
      spyOn(component.itemChanged, 'emit');
      component.select(expectedResult[0]);
      expect(component.itemChanged.emit).not.toHaveBeenCalled();
    });

    describe('when hideCode is enabled', () => {
      beforeEach(() => {
        component.hideCode = true;
      });

      it('should set the searchText to description', () => {
        component.select(expectedResult[0]);
        expect(component.searchText).toEqual(expectedResult[0].description);
      });

      it('should set the searchText to name when description is empty', () => {
        expectedResult[0].description = '';
        component.select(expectedResult[0]);
        expect(component.searchText).toEqual(expectedResult[0].name);
      });
    });

    describe('when in dropdown mode', () => {
      beforeEach(() => {
        component.isDropdown = true;
        spyOn(component.searchInput.nativeElement, 'blur');
        component.select(expectedResult[0]);
      });

      it('should blur input', () => {
        expect(component.searchInput.nativeElement.blur).toHaveBeenCalled();
      });

      describe('maxItemsDisplayed is set', () => {
        beforeEach(() => {
          component.maxItemsDisplayed = 2;
          component.select(expectedResult[0]);
        });

        it('should set the displayed items to the maximum allowed items', () => {
          expect(component.displayedItems.length).toEqual(2);
        });
      });
    });
  });

  describe('#setSelected', () => {
    beforeEach(() => {
      component.selectedItem = null;
      component.setSelected(expectedResult[0]);
    });

    it('should set the searchText', () => {
      expect(component.searchText).toEqual(expectedResult[0].code);
    });

    it('should set the selectedItem', () => {
      expect(component.selectedItem).toEqual(expectedResult[0]);
    });

    describe('when hideCode is enabled', () => {
      beforeEach(() => {
        component.hideCode = true;
      });

      it('should set the searchText to description', () => {
        component.setSelected(expectedResult[2]);
        expect(component.searchText).toEqual(expectedResult[2].description);
      });

      it('should set the searchText to name when description is empty', () => {
        component.setSelected(expectedResult[1]);
        expect(component.searchText).toEqual(expectedResult[1].name);
      });
    });
  });

  describe('when document:keydown occurs', () => {
    let keyboardEvent;

    beforeEach(() => {
      component.originalItems = expectedResult;
      component.displayedItems = expectedResult;
      component.isDisplayed = true;
      component.selectedIndex = 1;
      spyOn(component, 'toggleList');
      spyOn(component, 'select');
    });

    function runTest(key: string) {
      keyboardEvent = {
        key,
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      };
      component.handleKeyboardEvent(keyboardEvent);
    }

    it('when showList is false nothing happens', () => {
      component.isDisplayed = false;
      runTest('ArrowUp');
      expect(component.selectedIndex).toBe(1);
    });

    it('when key is ArrowUp it decrements the selectedIndex', () => {
      runTest('ArrowUp');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is ArrowUp and selectedIndex is 0 it does not change the selectedIndex', () => {
      component.selectedIndex = 0;
      runTest('ArrowUp');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is ArrowLeft it decrements the selectedIndex', () => {
      runTest('ArrowLeft');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Up it decrements the selectedIndex', () => {
      runTest('Up');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Left it decrements the selectedIndex', () => {
      runTest('Left');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is ArrowDown it increments the selectedIndex', () => {
      runTest('ArrowDown');
      expect(component.selectedIndex).toBe(2);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is ArrowDown and selectedIndex is at the last employee it does not change the selectedIndex', () => {
      component.selectedIndex = 3;
      runTest('ArrowDown');
      expect(component.selectedIndex).toBe(3);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is ArrowDown and selectedIndex is null it sets the selectedIndex to 0', () => {
      component.selectedIndex = null;
      runTest('ArrowDown');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is ArrowRight it increments the selectedIndex', () => {
      runTest('ArrowRight');
      expect(component.selectedIndex).toBe(2);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Down it increments the selectedIndex', () => {
      runTest('Down');
      expect(component.selectedIndex).toBe(2);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Right it increments the selectedIndex', () => {
      runTest('Right');
      expect(component.selectedIndex).toBe(2);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Enter and selectedIndex is null it does not call select', () => {
      component.selectedIndex = null;
      runTest('Enter');
      expect(component.selectedIndex).toBeNull();
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
      expect(component.select).not.toHaveBeenCalled();
    });

    it('when key is Enter it calls select', () => {
      runTest('Enter');
      expect(component.selectedIndex).toBe(1);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
      expect(component.select).toHaveBeenCalled();
    });

    it('when key is End it sets the selectedIndex to the count of items', () => {
      runTest('End');
      expect(component.selectedIndex).toBe(component.displayedItems.length - 1);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is End and there are no items it sets the selectedIndex to null', () => {
      component.displayedItems = [];
      runTest('End');
      expect(component.selectedIndex).toBeNull();
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Home it sets the selectedIndex to 0', () => {
      runTest('Home');
      expect(component.selectedIndex).toBe(0);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Esc it sets the selectedIndex to 0 and closes the list', () => {
      runTest('Esc');
      expect(component.selectedIndex).toBeNull();
      expect(component.toggleList).toHaveBeenCalledWith(false);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is Escape it sets the selectedIndex to 0 and closes the list', () => {
      runTest('Escape');
      expect(component.selectedIndex).toBeNull();
      expect(component.toggleList).toHaveBeenCalledWith(false);
      expect(keyboardEvent.preventDefault).toHaveBeenCalled();
      expect(keyboardEvent.stopPropagation).toHaveBeenCalled();
    });

    it('when key is anything else it does not change the selectedIndex', () => {
      runTest('a');
      expect(component.selectedIndex).toBe(1);
    });
  });

  describe('#scrollIntoView', () => {
    beforeEach(() => {
      component.selectedIndex = 1;
      component.searchList.nativeElement = {} as ElementRef;
    });

    describe('when searchList has no children', () => {
      beforeEach(() => {
        component.searchList.nativeElement.children = null;
        domHelperMock.scrollInView.calls.reset();
        component.scrollIntoView();
      });

      it('does not call the domHelper scrollInView', () => {
        expect(domHelperMock.scrollInView).not.toHaveBeenCalled();
      });
    });

    describe('when selected index is null', () => {
      beforeEach(() => {
        component.searchList.nativeElement.children = [{
          id: 1
        }, {
          id: 2
        }];
        component.selectedIndex = null;
        domHelperMock.scrollInView.calls.reset();
        component.scrollIntoView();
      });

      it('calls the domHelper scrollInView for the first child', () => {
        expect(domHelperMock.scrollInView).toHaveBeenCalledWith(component.searchList.nativeElement, component.searchList.nativeElement.children[0]);
      });
    });

    describe('when searchList has no children at selected index', () => {
      beforeEach(() => {
        component.searchList.nativeElement.children = [{
          id: 1
        }];
        component.scrollIntoView();
      });

      it('does not call the domHelper scrollInView for the child', () => {
        expect(domHelperMock.scrollInView).not.toHaveBeenCalledWith(component.searchList.nativeElement, component.searchList.nativeElement.children[0]);
      });
    });

    describe('when searchList has a child at selected index', () => {
      beforeEach(() => {
        component.searchList.nativeElement.children = [{
          id: 1
        }, {
          id: 2
        }];
        component.scrollIntoView();
      });

      it('calls the domHelper scrollInView for the first child', () => {
        expect(domHelperMock.scrollInView).toHaveBeenCalledWith(component.searchList.nativeElement, component.searchList.nativeElement.children[0]);
      });

      it('calls the domHelper scrollInView for the correct child', () => {
        expect(domHelperMock.scrollInView).toHaveBeenCalledWith(component.searchList.nativeElement, component.searchList.nativeElement.children[component.selectedIndex]);
      });
    });
  });

  describe('#showMore', () => {
    beforeEach(() => {
      spyOn(component, 'filter');
      component.showMore();
    });

    it('increments the number of displayed pages and filters the list', () => {
      expect(component.displayedPages).toBe(2);
      expect(component.filter).toHaveBeenCalled();
    });
  });

  describe('#validate', () => {
    it('returns null when valid', () => {
      component.valid = true;
      expect(component.validate()).toBeNull();
    });

    it('should return an invalid object when invalid', () => {
      component.valid = false;
      const result = component.validate();
      expect(result).toBeDefined();
      expect(result.valid).toBeFalsy();
    });
  });

  describe('#toggleDropdown', () => {
    describe('dropdown is currently showing', () => {
      beforeEach(() => {
        component.isDisplayed = true;
        component.getItems = () => {
          return new Promise(resolve => resolve(expectedResult));
        };
        component.unfilteredItems = [expectedResult[0]];
        spyOn(window, 'setTimeout').and.callFake(callback => callback());
        component.isDisplayed = true;
        component.toggleList(!component.isDisplayed);
        fixture.detectChanges();
      });

      it('should set list to hidden', () => {
        expect(component.searchList.nativeElement.hidden).toBeTruthy();
      });
    });

    describe('dropdown is currently not showing', () => {
      beforeEach(() => {
        component.isDisplayed = false;
        spyOn(window, 'setTimeout').and.callFake(callback => callback());
        component.isDisplayed = false;
      });

      describe('and there are no unfilteredItems', () => {
        beforeEach(() => {
          component.unfilteredItems = [];
          component.toggleList(!component.isDisplayed);
          fixture.detectChanges();
        });

        it('should not set list to visible', () => {
          expect(component.searchList.nativeElement.hidden).toBeTruthy();
        });
      });

      describe('and there are unfilteredItems', () => {
        beforeEach(() => {
          component.unfilteredItems = [expectedResult[0]];
          component.toggleList(!component.isDisplayed);
          fixture.detectChanges();
        });

        it('should set list to visible', () => {
          expect(component.searchList.nativeElement.hidden).toBeFalsy();
        });
      });
    });
  });

  describe('#clickOut', () => {
    beforeEach(() => {
      spyOn(component, 'toggleList');
    });

    describe('when target is child of search-list', () => {
      beforeEach(() => {
        component.clickOut({ target: component.searchInput.nativeElement });
      });

      it('should not call toggleList', () => {
        expect(component.toggleList).not.toHaveBeenCalled();
      });
    });

    describe('when target is not child of search-list', () => {
      beforeEach(() => {
        component.clickOut({ target: document });
      });

      it('should set isDisplayed to false', () => {
        expect(component.isDisplayed).toBeFalsy();
      });
    });

    describe('when target is show-more button', () => {
      beforeEach(() => {
        component.isDisplayed = true;
        const showMore = document.createElement('div');
        showMore.className = 'show-more';
        component.clickOut({ target: showMore });
      });

      it('should not set isDisplayed to false', () => {
        expect(component.isDisplayed).toBeTruthy();
      });
    });

    describe('when target is not child element of search-list', () => {
      beforeEach(() => {
        component.isDisplayed = true;
        const element = document.createElement('div');
        component.clickOut({ target: element });
      });

      it('should set isDisplayed to false', () => {
        expect(component.isDisplayed).toBeFalsy();
      });
    });
  });

  describe('when translate pipe is called', () => {

    describe('when translationService is provided', () => {
      let pipe;
      beforeEach(() => {
        const translationStringService = jasmine.createSpyObj('translationSerice', ['instant']);
        translationStringService.instant.and.returnValue('result');
        pipe = new TranslatePipe(translationStringService);
      });

      it('should translate string with provided service', () => {
        expect(pipe.transform('string')).toEqual('result');
      });
    });

    describe('when translationService is not provided', () => {
      let pipe;
      beforeEach(() => {
        pipe = new TranslatePipe(undefined);
      });

      it('should pass string though without translation', () => {
        expect(pipe.transform('string')).toEqual('string');
      });
    });
  });
});
