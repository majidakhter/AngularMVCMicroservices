
import { Injectable } from '@angular/core';

/**
 * @file This is a helper class for dom calculation/manipulation.
 * This is essentially a custom implementation of a subset of functions
 * from primeNG's DomHandler (https:// github.com/primefaces/primeng/blob/master/src/app/components/dom/domhandler.ts)
 * @overview This should be pulled into a utility component.
 */
@Injectable()
export class DomHelper {

  anchorToTarget(element: any, target: any): void {
    const elementHeight = element.offsetParent ? element.offsetHeight : this.getHiddenElementHeight(element);
    const targetHeight = target.offsetHeight;
    const targetOffsetTop = target.offsetParent.offsetTop;
    const windowScrollTop = this.getWindowScrollTop();
    const viewportHeight = this.getViewportHeight();
    let top;

    if (targetOffsetTop + targetHeight + elementHeight > viewportHeight) {
      top = windowScrollTop - elementHeight;
      if (top < 0) {
        let margin = 0;
        const elementStyle = this.getStyle(element);
        margin += elementStyle.marginTop ? parseFloat(elementStyle.marginTop) : 0;
        margin += elementStyle.marginBottom ? parseFloat(elementStyle.marginBottom) : 0;
        top -= margin;
      }
    } else {
      top = targetHeight + windowScrollTop;
    }

    element.style.top = top + 'px';
  }

  getDocument(): any {
    return document;
  }

  /* istanbul ignore next */
  getStyle(element: any): any {
    return getComputedStyle(element);
  }

  /* istanbul ignore next */
  getWindowScrollTop(): number {
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  getViewportHeight(): number {
    const modals = document.getElementsByClassName('modal-wrapper');
    const container = modals.length > 0 ? modals[modals.length - 1] : document.getElementsByTagName('body')[0];

    return container.clientHeight;
  }

  getHiddenElementHeight(element: any): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const height = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return height;
  }

  scrollInView(container: any, item: any): void {
    const containerStyle: any = this.getStyle(container);
    const borderTop: number = containerStyle.borderTopWidth ? parseFloat(containerStyle.borderTopWidth) : 0;
    const paddingTop: number = containerStyle.paddingTop ? parseFloat(containerStyle.paddingTop) : 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    const scroll = container.scrollTop;
    const elementHeight = container.clientHeight;
    const itemHeight = item.offsetHeight;

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if ((offset + itemHeight) > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }
}
