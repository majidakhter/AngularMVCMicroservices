

import { TranslateService } from '@ngx-translate/core';
import { AppErrorHandler } from './app.error-handler';
import { ToastService } from './shared/toast/toast';
import { ToastOptions } from './shared/toast/models/wfm-toast-options.model';

describe('AppErrorHandler', () => {
  const mockTranslateService: jasmine.SpyObj<TranslateService> = jasmine.createSpyObj('TranslateService', ['instant']);
  const mockToastService: jasmine.SpyObj<ToastService> = jasmine.createSpyObj('ToastService', ['activate']);
  let errorHandler: AppErrorHandler;

  beforeAll(() => {
    spyOn(console, 'error').and.stub();
    errorHandler = new AppErrorHandler(mockToastService, mockTranslateService);
  });

  describe('#handleError', () => {
    const errorMessage: any = {
      severity: 'error',
      title: 'Error!',
      message: 'Unknown Error'
    };

    beforeEach(() => {
      mockToastService.activate.calls.reset();
    });

    describe('when error has a message', () => {
      let translatedText: string;
      beforeEach(() => {
        const error = new Error();
        error.name = 'Test Error Name';
        error.message = 'Test Error Message';
        translatedText = 'Test Error Message';
        mockTranslateService.instant.and.returnValue(translatedText);
        try {
          errorHandler.handleError(error);
        } catch (error) {

        }
      });

      it('should call setMessage', () => {
        expect(mockToastService.activate).toHaveBeenCalledWith('showDismissibleToast', new ToastOptions('error', 'Test Error Name', 'Test Error Message'));
      });
    });

    describe('when error does not have a message', () => {
      let translatedText: string;
      beforeEach(() => {
        translatedText = 'Unknown error';
        mockTranslateService.instant.and.returnValue(translatedText);
        errorMessage.message = translatedText;
        try {
          errorHandler.handleError(new Error());
        } catch (error) {

        }
      });

      it('should call setMessage', () => {
        expect(mockToastService.activate).toHaveBeenCalledWith('showDismissibleToast', new ToastOptions('error', 'Error', 'Unknown error'));
      });
    });
  });
});
