

import { ErrorValidationWarningsComponent } from './error-validation-warnings.component';
import { TranslateService } from '@ngx-translate/core';
import { IErrorValidationWarning } from './models/error-validation-warnings';

describe('ErrorValidationWarningsComponent', () => {
  let component: ErrorValidationWarningsComponent;

  const mockTranslate = jasmine.createSpyObj<TranslateService>('Translate', ['instant']);

  mockTranslate.instant.and.callFake((stringValue) => {
    switch (stringValue) {
      case 'dailySchedule.error-code-validation-message-exists':
        return `VALIDATION_MESSAGES_EXIST`;
      case 'dailySchedule.content-override-warnings':
        return `Override the warnings to save the event.`;
      case 'dailySchedule.content-override-warning':
        return `Override the warning to save the event.`;
      case 'dailySchedule.content-event-not-saved':
        return `The event was not saved.`;
      default:
        return `translated: ${stringValue}`;
    }
  });

  function createComponent() {
    component = new ErrorValidationWarningsComponent(mockTranslate);
  }

  describe('#getContent', () => {
    let content: string;
    describe('When one non-overridable warning', () => {
      beforeEach(() => {
        createComponent();
        component.errorValidationWarning = {
          validationMessages: [
            {
              scheduleId: '00000000-0000-0000-0000-000000000000',
              description: 'Employee daily hours exceed daily approved hours',
              severityLevel: 'Critical'
            }
          ],
          overridable: false
        } as IErrorValidationWarning;

        content = component.getContent();
      });

      it('should set the description to the description of the single item', () => {
        expect(content).toBe('The event was not saved.');
      });
    });

    describe('When a Validation warning', () => {
      describe('with multiple messages and has override access', () => {
        beforeEach(() => {
          createComponent();
          component.errorValidationWarning = {
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Employee daily hours exceed daily approved hours',
                severityLevel: 'Critical'
              },
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Employee Weekly hours exceed Weekly approved hours',
                severityLevel: 'Critical'
              }
            ],
            overridable: true
          } as IErrorValidationWarning;

          content = component.getContent();
        });

        it('should set the content with override warnings', () => {
          expect(content).toBe('Override the warnings to save the event.');
        });
      });

      describe('with single message and has override access', () => {
        beforeEach(() => {
          createComponent();
          component.errorValidationWarning = {
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Employee daily hours exceed daily approved hours',
                severityLevel: 'Critical'
              }
            ],
            overridable: true
          } as IErrorValidationWarning;

          content = component.getContent();
        });

        it('should set the content with override warning', () => {
          expect(content).toBe('Override the warning to save the event.');
        });
      });
      describe('with multiple messages and has no override access', () => {
        beforeEach(() => {
          createComponent();
          component.errorValidationWarning = {
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Employee daily hours exceed daily approved hours',
                severityLevel: 'Critical'
              },
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Employee Weekly hours exceed Weekly approved hours',
                severityLevel: 'Critical'
              }
            ],
            overridable: false
          } as IErrorValidationWarning;

          content = component.getContent();
        });

        it('should set the content with override warnings', () => {
          expect(content).toBe('The event was not saved.');
        });
      });

      describe('with single message and has no override access', () => {
        beforeEach(() => {
          createComponent();
          component.errorValidationWarning = {
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Employee daily hours exceed daily approved hours',
                severityLevel: 'Critical'
              }
            ],
            overridable: false
          } as IErrorValidationWarning;

          content = component.getContent();
        });

        it('should set the content with override warning', () => {
          expect(content).toBe('The event was not saved.');
        });
      });
    });
  });
});
