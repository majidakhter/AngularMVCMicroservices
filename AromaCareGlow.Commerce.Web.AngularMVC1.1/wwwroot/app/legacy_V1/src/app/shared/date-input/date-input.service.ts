

import { Injectable } from '@angular/core';
import { DocumentRef } from '../document-ref/document-ref.service';

@Injectable()
export class DateInputService {

  constructor(
    private documentRef: DocumentRef
  ) {
  }

  //  We have to set the date/time nav buttons manually because PrimeNG uses FontAwesome icons with no built-in way to customize
  //  Setting the css content attribute will not work with our index-based WFM icons
  public setNavigationIcons() {
    setTimeout(() => {
      const prevButton = this.documentRef.getDocument().querySelector('.pi-chevron-left');
      if (prevButton) {
        prevButton.classList.add('icon-ge');
        prevButton.classList.add('icon-ge-chevron_left');
      }

      const nextButton = this.documentRef.getDocument().querySelector('.pi-chevron-right');
      if (nextButton) {
        nextButton.classList.add('icon-ge');
        nextButton.classList.add('icon-ge-chevron_right');
      }
    });
  }
}
