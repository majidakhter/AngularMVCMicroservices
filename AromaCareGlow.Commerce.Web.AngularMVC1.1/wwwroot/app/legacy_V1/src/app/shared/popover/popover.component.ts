
import {
  Component, ViewChild, Inject, ElementRef, ComponentFactoryResolver, ViewContainerRef,
  HostListener, OnInit, AfterViewInit, Renderer2, OnDestroy, DoCheck, Injector
} from '@angular/core';
import { WindowRef } from '../window-ref/window-ref.service';
import { DocumentRef } from '../document-ref/document-ref.service';
import { IPopoverConfig } from './popover.directive';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs/Subscription';

@AutoUnsubscribe()
@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class WfmPopoverComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
  @ViewChild('popoverContainer', { read: ViewContainerRef }) popoverContainer: ViewContainerRef;
  public top: string;
  public left: string;
  public arrowTop: string;
  public arrowLeft: string;
  public cssClass: string;
  public loading = true;
  public scrollSubscription: Subscription;
  public above = false;
  public below = false;
  public besideLeft = false;
  public besideRight = false;
  private readonly WINDOW_SIDE_PADDING = 20;
  private previousHeight = 0;
  private popoverOffsetLeft = 35;

  constructor(
    @Inject('popoverConfig') private config: IPopoverConfig,
    public element: ElementRef<HTMLElement>,
    private resolver: ComponentFactoryResolver,
    private windowRef: WindowRef,
    private documentRef: DocumentRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(this.config.contentType);
    // tslint:disable-next-line:deprecation
    const injector = Injector.create([
      {
        provide: 'config',
        useValue: this.config.contentConfig
      }
    ]);
    this.cssClass = this.config.cssClass;
    this.popoverContainer.createComponent(factory, 0, injector);
    this.scrollSubscription = this.config.scrollListener.subscribe(this.setLocation.bind(this));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setLocation();
    });

    // this timeout prevents the popover displaying in one location and then jumping to the calculated location on slower systems
    setTimeout(() => {
      this.loading = false;
    }, 100);
  }

  /* istanbul ignore next */
  ngOnDestroy() { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setLocation();
  }

  ngDoCheck() {
    this.checkPosition(this.element.nativeElement.children[0].getBoundingClientRect());
  }

  private checkPosition(popOver: ClientRect) {
    if (this.previousHeight !== popOver.height) {
      const { top, left, right, height } = this.config.host.getBoundingClientRect();
      const topOffset = top + this.windowRef.getWindow().pageYOffset - this.documentRef.getDocument().documentElement.clientTop;
      this.previousHeight = popOver.height;
      this.setPosition(popOver, topOffset, height, left, right);
    }
  }

  private setPosition(popOver: ClientRect, topOffset: number, hostHeight: number, left: number, right: number) {
    const tentativeTop = topOffset + hostHeight + this.config.topPadding;
    const tentativeBottom = tentativeTop + popOver.height;
    const arrowHost = (this.config.host as HTMLElement).querySelector('.icon-ge-dropdown');
    const arrowHostLoc = arrowHost.getBoundingClientRect();
    const popLeft = parseFloat(this.left.replace('px', ''));
    if (!this.config.staticVerticalAlignment && tentativeBottom > this.windowRef.getWindow().innerHeight && topOffset > popOver.height) {
      this.above = true;
      this.below = false;
      this.besideLeft = false;
      this.besideRight = false;
      this.top = `${topOffset - this.config.topPadding - popOver.height}px`;
      this.arrowLeft = `${arrowHostLoc.right - (popLeft) - 18}px`;
    } else if (this.windowRef.getWindow().innerHeight - tentativeTop > popOver.height) {
      this.above = false;
      this.below = true;
      this.besideLeft = false;
      this.besideRight = false;
      this.top = `${tentativeTop}px`;
      this.arrowLeft = `${arrowHostLoc.right - (popLeft) - 18}px`;
    } else if (left > popOver.width) {
      this.above = false;
      this.below = false;
      this.besideLeft = true;
      this.besideRight = false;
      this.top = `${tentativeTop / tentativeBottom + hostHeight}px`;
      this.left = `${left - popOver.width}px`;
      this.arrowTop = `${topOffset - hostHeight}px`;
    } else {
      this.above = false;
      this.below = false;
      this.besideLeft = false;
      this.besideRight = true;
      this.top = `${tentativeTop / tentativeBottom + hostHeight}px`;
      this.left = `${right + 8}px`;
      this.arrowTop = `${topOffset - hostHeight}px`;
    }
  }

  private setLocation(): void {
    const { top, height, left, width, right } = this.config.host.getBoundingClientRect();
    const topOffset = top + this.windowRef.getWindow().pageYOffset - this.documentRef.getDocument().documentElement.clientTop;
    const popover = this.element.nativeElement.children[0].getBoundingClientRect();
    if (this.config.alignment === 'right') {
      this.doRightAlignment(popover.width, right);
    } else if (this.config.alignment === 'full-width') {
      this.doFullWidthAlignment(width, left);
    } else if (this.config.alignment === 'left') {
      this.doLeftAlignment(left, this.config.leftPadding || 0);
    } else {
      this.doCenterAlignment(popover.width, left, width);
    }
    this.setPosition(popover, topOffset, height, left, right);
  }

  private doCenterAlignment(popoverWidth: number, hostLeft: number, hostWidth: number): void {
    const windowWidth = this.windowRef.getWindow().innerWidth;
    const widthOffset = (hostWidth - popoverWidth) / 2;
    const left = (hostLeft + popoverWidth) > (windowWidth - this.WINDOW_SIDE_PADDING) ? windowWidth - popoverWidth - this.WINDOW_SIDE_PADDING : hostLeft + widthOffset;
    this.left = `${left + this.popoverOffsetLeft}px`;
  }

  private doFullWidthAlignment(hostWidth: number, hostLeft: number): void {
    this.left = `${hostLeft + this.popoverOffsetLeft}px`;
    if (this.element.nativeElement.children[0]) {
      this.renderer.setStyle(this.element.nativeElement.children[0], 'width', hostWidth + 'px');
    }
  }

  private doRightAlignment(popoverWidth: number, hostRight: number): void {
    const left = (hostRight - popoverWidth) < 0 ? 0 : hostRight - popoverWidth;
    this.left = `${left + this.popoverOffsetLeft}px`;
  }

  private doLeftAlignment(hostLeft: number, leftPadding: number = 0) {
    this.left = `${hostLeft + leftPadding + this.popoverOffsetLeft}px`;
  }
}
