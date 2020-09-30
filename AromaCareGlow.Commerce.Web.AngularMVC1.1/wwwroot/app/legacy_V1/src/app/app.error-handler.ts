

import { Injectable, ErrorHandler } from '@angular/core';
import { ToastService } from './shared/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastEvents } from './shared/toast/models/wfm-toast-events';
import { ToastOptions } from './shared/toast/models/wfm-toast-options.model';
import { MessageSeverity } from './shared/toast/models/wfm-message-severity';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  private errorMessage: ToastOptions = new ToastOptions(MessageSeverity.ERROR, 'error.title', '');

  constructor(
    private toast: ToastService,
    private translate: TranslateService
  ) { }

  handleError(error) {
    if (!error.message) {
      error.message = 'unknown-error';
    }

    console.error(error);

    let translatedError = this.translate.instant(error.message);

    if (translatedError === error.message) {
      translatedError = this.translate.instant('unknown-error');
    }

    this.errorMessage.title = error.name;
    this.errorMessage.message = translatedError;

    this.toast.activate(ToastEvents.SHOW_DISMISSIBLE_TOAST, this.errorMessage);
  }
}
