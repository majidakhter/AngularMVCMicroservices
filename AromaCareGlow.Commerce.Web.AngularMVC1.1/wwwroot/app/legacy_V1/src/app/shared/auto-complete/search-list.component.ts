import { AfterViewInit, Attribute, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener } from '@angular/core';
import { Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild, Inject, Pipe, PipeTransform } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { DomHelper } from '../helpers/dom-api/dom-helper';
import { ISearchListItem } from './model/search-list-item';

@Component({
  selector: 'wf-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchListComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchListComponent),
      multi: true
    }
  ]
})
export class SearchListComponent implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor, Validator {

  constructor(
    @Attribute('disabled') public disabledAttr: string,
    @Attribute('required') public required: string,
    private renderer: Renderer2,
    private domHelper: DomHelper,
    private ref: ChangeDetectorRef,
    private element: ElementRef
  ) {
  }
  isInitialized = false;
  selectedItem: ISearchListItem;
  selectedIndex?: number = null;
  isDisplayed = false;
  searchText = '';
  unfilteredItems: ISearchListItem[];
  filteredItems: ISearchListItem[];
  displayedItems: ISearchListItem[];
  displayedPages = 1;
  valid = true;
  showMoreText = 'Show More';

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchList') searchList: ElementRef;

  @Input() disabled: boolean;
  @Input() originalItems: ISearchListItem[];
  @Input() getItems: Function;
  @Input() maxItemsDisplayed: number = null;

  @Input() isDropdown = false;
  @Input() placeholder = '';
  @Input() defaultValue: ISearchListItem;
  @Input() hideCode = false;
  @Output() itemChanged: EventEmitter<ISearchListItem> = new EventEmitter<ISearchListItem>();
  @Output() itemClear: EventEmitter<any> = new EventEmitter();
  onModelTouched: Function = () => { };

  ngAfterViewInit(): void {
    //  The disabled attribute will override the disabled input.
    if (this.disabledAttr !== null) {
      this.disabled = true;
    }

    this.isInitialized = true;
  }

  ngOnDestroy(): void {
    this.ref.detach();
  }

  writeValue(value: ISearchListItem): void {
    if (!this.isInitialized) {
      return;
    }

    if (value && this.selectedItem && value.id === this.selectedItem.id) {
      return;
    }

    if (value) {
      this.setSelected(value);
    } else if (this.selectedItem) {
      this.valid = true;
      this.selectedItem = null;
      this.searchText = '';
      this.itemClear.emit(null);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.defaultValue && changes.defaultValue.isFirstChange() && changes.defaultValue.currentValue && this.originalItems) {
      this.setSelected(changes.defaultValue.currentValue);
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn): void {
    this.onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  onInputFocus(): void {
    this.toggleList(true);
  }

  onInputBlur(): void {
    if (this.selectedIndex !== null && !this.selectedItem && this.displayedItems && this.displayedItems.length > this.selectedIndex) {
      this.select(this.displayedItems[this.selectedIndex]);
      this.valid = true;
    } else {
      this.valid = this.selectedItem ? true : this.required ? false : !this.hasText();
      this.toggleList(false);
      this.propagateChange(this.selectedItem);
    }
    this.onModelTouched();
  }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event) {
    if (!this.isDisplayed || !this.searchList) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'Up':
      case 'Left':
        event.preventDefault();
        event.stopPropagation();
        if (this.selectedIndex !== null && this.selectedIndex !== 0) {
          this.selectedIndex -= 1;
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
      case 'Down':
      case 'Right':
        event.preventDefault();
        event.stopPropagation();
        if (this.selectedIndex === null) {
          this.selectedIndex = 0;
        } else if (this.selectedIndex < this.displayedItems.length - 1) {
          this.selectedIndex += 1;
        }
        break;
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        if (this.selectedIndex !== null) {
          this.select(this.displayedItems[this.selectedIndex]);
        }
        break;
      case 'End':
        event.preventDefault();
        event.stopPropagation();
        this.selectedIndex = this.displayedItems.length > 0 ? this.displayedItems.length - 1 : null;
        break;
      case 'Home':
        event.preventDefault();
        event.stopPropagation();
        this.selectedIndex = 0;
        break;
      case 'Esc':
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.selectedIndex = null;
        this.toggleList(false);
        break;
      default:
        break;
    }
    this.scrollIntoView();
  }

  setUnfilteredItems(): Promise<number> {
    return new Promise((resolve) => {
      if (this.getItems) {
        let getItems = this.getItems();
        if (getItems) {
          if (getItems.constructor.name === Observable.name) {
            getItems = getItems.toPromise();
          }
          getItems.then((result) => {
            this.originalItems = result;
            this.setItems();
            resolve(result.length);
          });
        }
      } else {
        this.setItems();
        resolve(this.unfilteredItems ? this.unfilteredItems.length : 0);
      }
    });
  }

  onChange(): void {
    if (this.selectedItem) {
      this.selectedItem = null;
      this.itemChanged.emit(null);
      this.propagateChange(this.selectedItem);
    }
    this.displayedPages = 1;
    this.filter();
    this.domHelper.anchorToTarget(this.searchList.nativeElement, this.searchInput.nativeElement);
    if (this.displayedItems && this.displayedItems.length < 1) {
      this.toggleList(false);
    } else if (!this.isDisplayed) {
      this.toggleList(true);
    }
  }

  @HostListener('document:click', ['$event'])
  clickOut = (event) => {
    if (this.element && event.target !== document
      && ((!this.element.nativeElement.contains(event.target)
        && !event.target.classList.contains('show-more'))
        || event.target.classList.contains('search-box-clear'))) {
      this.isDisplayed = false;
      this.hideList();
    }
  }

  filter(): void {
    if (!this.unfilteredItems) {
      return;
    }

    const hasText: boolean = this.hasText();

    if (hasText) {
      const searchString = this.searchText.toLowerCase();
      this.filteredItems = this.unfilteredItems.filter(item => item.code.toLowerCase().includes(searchString)
        || (item.description ? item.description.toLowerCase().includes(searchString)
          : item.name ? item.name.toLowerCase().includes(searchString) : false));
      this.valid = this.filteredItems.length > 0;
    } else {
      this.valid = true;
      this.filteredItems = this.unfilteredItems;
    }

    this.displayedItems = this.maxItemsDisplayed ? this.filteredItems.slice(0, this.maxItemsDisplayed * this.displayedPages) : this.filteredItems;
    this.selectedIndex = hasText && this.displayedItems.length > 0 ? this.selectedIndex && this.selectedIndex < this.displayedItems.length ? this.selectedIndex : 0 : null;
    /* istanbul ignore next */
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  setSelected(item: ISearchListItem): void {
    this.searchText = this.hideCode ? (item.description || item.name) : item.code;
    this.selectedItem = item;
    this.propagateChange(this.selectedItem);
  }

  select(item: ISearchListItem): void {
    const isTrueChange = item !== this.selectedItem;

    this.toggleList(false);

    if (this.isDropdown) {
      this.searchInput.nativeElement.blur();
      this.displayedItems = this.maxItemsDisplayed ? this.unfilteredItems.slice(0, this.maxItemsDisplayed * this.displayedPages) : this.unfilteredItems;
    }

    this.searchText = this.hideCode ? (item.description || item.name) : item.code;

    this.selectedItem = this.originalItems.find((orig) => {
      return orig.id === item.id;
    });
    this.propagateChange(this.selectedItem);

    if (isTrueChange) {
      this.itemChanged.emit(this.selectedItem);
    }
  }

  clearSelected(toggleList: boolean, event?: any): void {
    this.searchInput.nativeElement.blur();
    this.valid = true;
    this.selectedItem = null;
    this.searchText = '';
    this.propagateChange(this.selectedItem);
    this.filter();
    this.itemClear.emit(null);
    this.toggleList(toggleList);
    this.searchInput.nativeElement.click();
    if (event) {
      event.preventDefault();
    }
  }

  getSelectedText(): string {
    return this.searchText;
  }

  scrollIntoView(): void {
    if (!this.searchList.nativeElement.children) {
      return;
    }

    if (this.searchList.nativeElement.children[this.selectedIndex || 0]) {
      this.domHelper.scrollInView(this.searchList.nativeElement, this.searchList.nativeElement.children[this.selectedIndex || 0]);
    }
  }

  toggleList(show: boolean): void {
    this.itemClear.emit(null);
    setTimeout(() => {
      if (!this.unfilteredItems) {
        this.setUnfilteredItems().then((resultsLength) => {
          if (resultsLength > 0) {
            this.setListDisplay(show);
          }
        });
      } else {
        if (this.unfilteredItems.length > 0) {
          this.setListDisplay(show);
        }
      }
    });
  }

  private setListDisplay(show: boolean) {
    this.isDisplayed = show;

    /* istanbul ignore next */
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
      this.scrollIntoView();
    }

    if (!this.isDisplayed) {
      this.hideList();
    } else {
      this.showList();
    }
  }

  private hideList(): void {
    this.displayedPages = 1;
  }

  private showList(): void {
    if (!this.isDropdown) {
      this.filter();
    }

    if (this.selectedItem) {
      const newIndex = this.displayedItems.map(unfilteredItem => unfilteredItem.id).indexOf(this.selectedItem.id);
      this.selectedIndex = newIndex;
    }
    this.renderer.setStyle(
      this.searchList.nativeElement,
      'display',
      'block');
    this.renderer.setStyle(
      this.searchList.nativeElement,
      'width',
      this.searchInput.nativeElement.offsetWidth + 'px');

    this.domHelper.anchorToTarget(this.searchList.nativeElement, this.searchInput.nativeElement);
  }

  private setItems(): void {
    this.unfilteredItems = this.originalItems;
    this.filter();
  }

  showMore() {
    this.displayedPages++;
    this.filter();
    this.domHelper.anchorToTarget(this.searchList.nativeElement, this.searchInput.nativeElement);
  }

  validate() {
    return this.valid ? null : { valid: false };
  }

  hasText(): boolean {
    const val: string = this.searchText;
    return val && val.trim() !== '';
  }
}

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(
    @Inject('translateService') private translateService: any
  ) { }

  transform(value: string): string {
    if (this.translateService && this.translateService.instant) {
      return this.translateService.instant(value);
    }
    return value;
  }
}
