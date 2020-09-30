
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ModalButton } from '@wfm/modal';
import { IScheduleValidationWarning } from './model/schedule-validation-warning';

@Component({
  selector: 'wf-schedule-validation-warnings-modal',
  templateUrl: './schedule-validation-warnings-modal.component.html',
  styleUrls: ['./schedule-validation-warnings-modal.component.scss']
})
@AutoUnsubscribe()
export class ScheduleValidationWarningsModalComponent implements OnInit, OnChanges {

  @Input()
  scheduleValidationWarnings: IScheduleValidationWarning = null;
  @Output() submitValidation = new EventEmitter();
  public buttons: ModalButton[];
  public title: () => string;
  displayList: boolean;
  isValidationError: boolean;

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
    this.title = () => {
      if (this.isValidationError) {
        if (this.displayList) {
          return this.translate.instant('schedule.validation-warnings');
        } else {
          return this.translate.instant('schedule.validation-warning');
        }
      } else {
        return this.translate.instant('schedule.save-event-error');
      }
    };

    this.buttons = [
      new ModalButton(
        () => this.translate.instant('button.cancel'),
        close => close(),
        () => (this.scheduleValidationWarnings.override),
        'secondary-button'
      ),
      new ModalButton(
        () => this.translate.instant('button.ok'),
        close => close(),
        () => (!this.scheduleValidationWarnings.override || !this.isValidationError),
        'priority-button'
      ),
      // Validation State
      new ModalButton(
        () => this.translate.instant('button.override'),
        (close) => {
          this.submitValidation.emit(true); close();
        },
        () => (!this.scheduleValidationWarnings.otherExceptions && this.scheduleValidationWarnings.override),
        'priority-button'
      )];
  }

  ngOnChanges() {
    if (this.scheduleValidationWarnings) {
      this.displayList = this.scheduleValidationWarnings.validationException.validationMessages.length > 1;
      this.isValidationError = this.scheduleValidationWarnings.errorCode === this.translate.instant('schedule.error-code-validation-message-exists')
        || this.scheduleValidationWarnings.errorCode === this.translate.instant('schedule.error-code-schedule-trade-validation');
    }
  }
}
