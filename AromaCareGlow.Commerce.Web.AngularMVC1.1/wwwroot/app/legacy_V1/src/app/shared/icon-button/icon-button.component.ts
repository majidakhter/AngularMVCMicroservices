

import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wf-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss']

})

export class IconButtonComponent {
  @Input() text: string;
  @Input() iconClass: string;
  @Input() iconPosition = 'right';
  @Input() disabled = false;
  @Input() dropdown = false;

  constructor(public translate: TranslateService) {
  }
}
