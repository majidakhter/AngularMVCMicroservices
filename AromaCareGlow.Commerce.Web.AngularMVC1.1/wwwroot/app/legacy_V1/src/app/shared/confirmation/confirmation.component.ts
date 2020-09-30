

import { Component, OnInit, Input } from '@angular/core';
import { IModalContent, ModalButton } from '@wfm/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wf-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, IModalContent {

  @Input() title = '';
  @Input() buttonText = 'button.yes';
  @Input() action: Function;
  public buttons: ModalButton[];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    if (this.title) {
      this.title = this.translate.instant(this.title);
    }
    this.buttons = [
      new ModalButton(
        this.translate.instant('button.cancel'),
        (close) => {
          close();
        },
        () => true,
        'primary-button'
      ),
      new ModalButton(
        this.translate.instant(this.buttonText),
        (close) => {
          this.action();
          close();
        },
        () => true,
        'priority-button'
      )
    ];
  }

}
