

// tslint:disable-next-line:max-line-length
import {
  ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EmbeddedViewRef,
  EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Type, Injector
} from '@angular/core';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs/Observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { DocumentRef } from '../document-ref/document-ref.service';
import { ScrollService } from '../scroll/scroll.service';
import { WfmPopoverComponent } from './popover.component';

@Directive({
  selector: '[wfPopover]'
})
export class WfmPopoverDirective implements OnInit, OnDestroy {
  // The component type that should be displayed
  @Input('wfPopover') content: Type<any>;

  // Put any information in this object that needs to get passed into the component
  @Input() context: IPopoverContext<any>;

  // How the popover is aligned with the anchor elements: supports 'center' and 'right'
  @Input() alignment = 'center';

  // The css class that will be added to the popover component to allow for custom styling
  // tslint:disable-next-line:no-input-rename
  @Input('popoverCssClass') cssClass = '';

  // If the popover should be sized/located relative to an element other than the element clicked on, set this property to the element
  // that should be used
  @Input() hostElement?: ElementRef;

  // The number of pixels between the top of the popover and the bottom of the element clicked on.
  @Input() topPadding = 5;

  // The number of pixels between the left edge of the popover and the left edge of the element clicked on.
  @Input() leftPadding = 0;

  // Set to true to have the popover close when a scroll event occurs.
  @Input() closeOnScroll = false;

  // If the popover is located in a scroll area other than the window scroll, then an observable for changes in that
  // scroll area can be provided so the popover can adjust location based on scroll events.
  @Input() customScrollListener?: Observable<number>;

  @Input() staticVerticalAlignment = false;

  // Emits a single event when the popover is created.
  @Output() popoverCreated: EventEmitter<any> = new EventEmitter<any>();

  // When the popover is dismissed, data is emitted on this event emitter. This is not called if the popover closes because the user
  // clicked outside the popover area.
  @Output() popoverOutput: EventEmitter<any> = new EventEmitter<any>();

  // Emits an event whenever the popover is destroyed. This can happen when 1) the popover is dismissed, 2) the user clicks outside
  // the popover, or 3) the element the popover is anchored to is destroyed.
  @Output() popoverDestroyed: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadDayBar = new EventEmitter();

  private componentRef: ComponentRef<WfmPopoverComponent>;
  private dismissPopover: Subject<any> = new Subject<any>();
  private clickOutSub: Subscription;
  private dismissSubscription: Subscription;
  private scrollListenerSubscription: Subscription;
  private initialScrollPosition: number;

  constructor(
    private element: ElementRef,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private documentRef: DocumentRef,
    private scrollService: ScrollService // tslint:disable-line:no-unused-variable
  ) { }

  ngOnInit() {
    if (!this.context) {
      this.context = {
        dismiss: this.dismissPopover
      } as IPopoverContext<any>;
    } else {
      this.context.dismiss = this.dismissPopover;
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  @HostListener('click')
  mouseClick() {
    if (this.componentRef) {
      this.destroy();
      return;
    }

    if (!this.context.dismiss) {
      this.context.dismiss = this.dismissPopover;
    }

    this.createPopover();
  }

  private destroy() {
    this.popoverDestroyed.emit();
    this.loadDayBar.emit();
    if (this.clickOutSub) {
      this.clickOutSub.unsubscribe();
    }
    this.clickOutSub = null;

    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
    this.dismissSubscription = null;

    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.componentRef = null;

    if (this.scrollListenerSubscription) {
      this.scrollListenerSubscription.unsubscribe();
    }
    this.scrollListenerSubscription = null;
    this.initialScrollPosition = null;
  }

  private createPopover() {
    const scrollListener: Observable<number> = this.customScrollListener ? this.customScrollListener : this.scrollService.getScrollPosition();

    this.scrollListenerSubscription = scrollListener.subscribe((scrollPosition: number) => {
      // Don't close on the initial value because this could be a Behavior Subject which will return its current value.
      if (!this.initialScrollPosition && this.initialScrollPosition !== 0) {
        this.initialScrollPosition = scrollPosition;
      } else if (this.closeOnScroll && this.initialScrollPosition !== scrollPosition) {
        this.destroy();
      }
    });

    // tslint:disable-next-line:deprecation
    const injector = Injector.create([
      {
        provide: 'popoverConfig',
        useValue: {
          host: this.hostElement ? this.hostElement.nativeElement : this.element.nativeElement,
          contentType: this.content,
          contentConfig: this.context,
          alignment: this.alignment,
          cssClass: this.cssClass,
          topPadding: this.topPadding,
          leftPadding: this.leftPadding,
          scrollListener: scrollListener,
          staticVerticalAlignment: this.staticVerticalAlignment
        } as IPopoverConfig
      }
    ]);

    this.dismissSubscription = this.dismissPopover.asObservable().subscribe(this.doDismiss.bind(this));
    this.clickOutSub = fromEvent(this.documentRef.getDocument(), 'click').subscribe(this.clickOut.bind(this));

    this.componentRef = this.resolver
      .resolveComponentFactory(WfmPopoverComponent)
      .create(injector);

    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    this.documentRef.getDocument().body.appendChild(domElem);
    this.popoverCreated.emit();
  }

  private doDismiss(output: any): void {
    if (output) {
      this.popoverOutput.emit(output);
    }

    this.destroy();
  }

  private clickOut = (event) => {
    const clickX = event.pageX;
    const clickY = event.pageY;
    if (this.componentRef && !this.element.nativeElement.contains(event.target) && this.clickOutsideComponentRef(clickX, clickY)) {
      this.destroy();
    }
  }

  private clickOutsideComponentRef(x: number, y: number) {
    if (!this.componentRef.location || x <= 0) {
      return false;
    }
    const boundRect = this.componentRef.location.nativeElement.children[0].getBoundingClientRect();
    const outsideHorizontal = x < boundRect.left || x > boundRect.right;
    const outsideVertical = y < boundRect.top || y > boundRect.bottom;

    return outsideHorizontal || outsideVertical;
  }
}

export interface IPopoverContext<T> {
  dismiss?: Subject<T>;
}

export interface IPopoverConfig {
  /// <summary>
  /// The element the popover should be positioned relative to.
  /// </summary>
  host: any;

  /// <summary>
  /// The class of the component that should be created and embedded in the popover, e.g., ScheduleExceptionListPopover.
  /// </summary>
  contentType: Type<any>;

  /// <summary>
  /// Any data that should be injected into the popover.
  /// </summary>
  contentConfig: IPopoverContext<any>;

  /// <summary>
  /// How the popover should be aligned relative to the host element, e.g., right, center, left, or full-width
  /// </summary>
  alignment: string;

  /// <summary>
  /// The css class that should be added to the popover. This allows customization of the popover that will not affect other instances of the popover component.
  /// </summary>
  cssClass: string;

  /// <summary>
  /// The number of pixels that should be between the bottom of the host element and the top of the popover.
  /// </summary>
  topPadding: number;

  /// <summary>
  /// When using left alignment, the number of pixels between the left edge of the host element and the left edge of the popover.
  /// </summary>
  leftPadding: number;

  /// <summary>
  /// The default scroll is the window scroll. A custom scroll observable can be provided that will be used instead of the window scroll.
  /// </summary>
  scrollListener?: Observable<number>;

  /// <summary>
  /// The popover will be placed below the host element by default, but will switch to being above the host element if there is not enough room below the host element.
  /// Set staticVerticalAlignment to true to stop this behavior and always have the popover appear below the host element regardless of space available below the host element.
  /// </summary>
  staticVerticalAlignment: boolean;
}
