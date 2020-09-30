

import { Component, Input } from '@angular/core';
import { IErrorValidationWarning } from './models/error-validation-warnings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wf-error-validation-warnings',
  templateUrl: './error-validation-warnings.component.html',
  styleUrls: ['./error-validation-warnings.component.scss']
})

export class ErrorValidationWarningsComponent {
  @Input() errorValidationWarning: IErrorValidationWarning;
  @Input() isValidationError = false;
  public content: string;

  constructor(
    private translateService: TranslateService
  ) { }

  public getContent(): string {
    if (this.errorValidationWarning.overridable) {
      if (this.errorValidationWarning.validationMessages.length > 1) {
        return this.translateService.instant('dailySchedule.content-override-warnings');
      } else {
        return this.translateService.instant('dailySchedule.content-override-warning');
      }
    } else {
      return this.translateService.instant('dailySchedule.content-event-not-saved');
    }
  }
}
