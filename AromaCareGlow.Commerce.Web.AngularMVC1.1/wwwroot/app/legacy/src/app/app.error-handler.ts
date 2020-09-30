import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private logger: NGXLogger,
    private snackBar: MatSnackBar
  ) { }

  handleError(error: any) {

    if (error instanceof HttpErrorResponse) {
      // Backend returns unsuccessful response codes such as 404, 500 etc.
      // TODO: move this into interceptor?
      this.logger.error('Backend returned status code: ' + error.status);
      this.logger.error('Response body:', error.message);
    } else {
      // A client-side or network error occurred.
      this.logger.error('An error occurred:', error.message);

      const snackBarRef = this.snackBar.open(error.message, 'close', { duration: 2500 });
    }
  }
}
