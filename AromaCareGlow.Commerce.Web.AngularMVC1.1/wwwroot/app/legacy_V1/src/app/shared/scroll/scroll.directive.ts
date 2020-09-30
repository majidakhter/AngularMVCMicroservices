

import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { ScrollService } from '../../shared/scroll/scroll.service';
@Directive({
  selector: '[wfScroll]'
})

export class WfScrollDirective implements AfterViewInit {
  constructor(private scrollService: ScrollService, private el: ElementRef) { }

  ngAfterViewInit() {
    // ion-content tag will place content in div.scroll-content if there is overflow
    (this.el.nativeElement.querySelector('.scroll-content') || this.el.nativeElement).addEventListener('scroll', (ev) => {
      this.scrollService.setScrollPosition(ev.target.scrollTop);
    });
  }
}
