

import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[wfLoadingPlaceholder]'
})

export class LoadingPlaceholderDirective implements OnChanges {
  @Input() loadingValue;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: any) {
    if (!this.loadingValue) {
      this.el.nativeElement.classList.add('loading-background');
      this.el.nativeElement.classList.add('icon-wfm-spinner');
    }
    if (this.loadingValue) {
      this.el.nativeElement.classList.remove('loading-background');
      this.el.nativeElement.classList.remove('icon-wfm-spinner');
    }
  }
}
