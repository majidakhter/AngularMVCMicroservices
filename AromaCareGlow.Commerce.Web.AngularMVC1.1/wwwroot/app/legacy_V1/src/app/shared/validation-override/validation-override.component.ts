
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { IValidationWarning } from './model/validation-warning';
import { ModalButton, IModalContent } from '@wfm/modal';

@Component({
  selector: 'wf-validation-override',
  templateUrl: './validation-override.component.html',
  styleUrls: ['./validation-override.component.scss']
})
@AutoUnsubscribe()
export class ValidationOverrideComponent implements OnInit, IModalContent {

  @Input() validationWarning: IValidationWarning = null;
  @Input() isValidationError = true;
  @Output() submitValidation = new EventEmitter();
  @Output() whenClosed = new EventEmitter();
  public buttons: ModalButton[];
  public title: () => string;

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.title = () => {
      if (this.isValidationError) {
        return this.validationWarning.validationException.validationMessages.length > 1
          ? this.translate.instant('dailySchedule.validation-warnings') : this.translate.instant('dailySchedule.validation-warning');
      } else {
        return this.translate.instant('dailySchedule.save-event-error');
      }
    };

    this.buttons = [
      new ModalButton(
        this.translate.instant('button.cancel'),
        close => {
          this.whenClosed.emit();
          close();
        },
        () => true,
        'secondary-button'
      ),
      new ModalButton(
        this.translate.instant('button.ok'),
        close => {
          this.whenClosed.emit();
          close();
        },
        () => !this.validationWarning.override,
        'priority-button'
      ),
      new ModalButton(
        this.translate.instant('button.override'),
        (close) => {
          this.whenClosed.emit();
          this.submitValidation.emit(true);
          close();
        },
        () => !this.validationWarning.otherExceptions && this.validationWarning.override,
        'priority-button'
      )];
  }
}
