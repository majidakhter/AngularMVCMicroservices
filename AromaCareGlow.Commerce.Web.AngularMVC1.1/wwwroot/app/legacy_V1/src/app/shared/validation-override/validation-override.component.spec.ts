

import { TranslateService } from '@ngx-translate/core';
import { ModalButton } from '@wfm/modal';
import { ValidationOverrideComponent } from './validation-override.component';
import { IValidationWarning } from './model/validation-warning';
import { EventEmitter } from '@angular/core';

describe('Validation', () => {
  let component: ValidationOverrideComponent;
  const mockTranslate = jasmine.createSpyObj<TranslateService>('Translate', ['instant']);
  mockTranslate.instant.and.callFake((stringValue) => {
    switch (stringValue) {
      case 'button.cancel':
        return 'Cancel';
      case 'button.ok':
        return 'OK';
      case 'button.override':
        return `Override`;
      case 'dailySchedule.save-event-error':
        return `Event was not saved`;
      case 'dailySchedule.error-code-validation-message-exists':
        return `VALIDATION_MESSAGES_EXIST`;
      case 'dailySchedule.validation-warnings':
        return `Validation Warnings`;
      case 'dailySchedule.validation-warning':
        return `Validation Warning`;
      default:
        return `translated: ${stringValue}`;
    }
  });

  function createComponent(): ValidationOverrideComponent {
    return new ValidationOverrideComponent(mockTranslate);
  }

  function getActiveButtons(): ModalButton[] {
    return component.buttons.filter(button => button.condition());
  }

  describe('#ngOnInit', () => {
    describe('When warnings are overridable', () => {
      beforeEach(() => {
        component = createComponent();
        component.whenClosed = jasmine.createSpyObj<EventEmitter<unknown>>('whenClosed', ['emit']);
        component.validationWarning = {
          errorCode: 'VALIDATION_MESSAGES_EXIST',
          validationException:
          {
            validationMessages:
              [
                {
                  scheduleId: '1',
                  description: 'Validation Warning 1',
                  severityLevel: 'Warning'
                },
                {
                  scheduleId: '2',
                  description: 'Validation Warning 2',
                  severityLevel: 'Warning'
                }
              ],
            overridable: false
          },
          override: true,
          otherExceptions: false
        } as IValidationWarning;

        component.ngOnInit();
      });

      it('should show cancel and override button', () => {
        expect(component.title).toBeDefined();
        component.buttons = getActiveButtons();
        expect(component.buttons.length).toEqual(2);
      });

      describe('Cancel button', () => {
        let cancelButton: ModalButton;
        beforeEach(() => {
          cancelButton = getActiveButtons().filter(button => button.styleClass === 'secondary-button')[0];
        });

        it('should show the cancel button', () => {
          expect(cancelButton).toBeDefined();
        });

        it('should have title of \'Cancel\'', () => {
          expect(cancelButton.text).toEqual('Cancel');
        });

        describe('When clicked', () => {
          let closeSpy: jasmine.Spy;
          beforeEach(() => {
            closeSpy = jasmine.createSpy('close');
            cancelButton.onClick(closeSpy);
          });

          it('should close when clicked', () => {
            expect(closeSpy).toHaveBeenCalledTimes(1);
          });

          it('should emit OnClosed when clicked', () => {
            expect(component.whenClosed.emit).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('Override button', () => {
        let overrideButton: ModalButton;
        beforeEach(() => {
          overrideButton = getActiveButtons().filter(button => button.styleClass === 'priority-button')[0];
        });

        it('should show the override button', () => {
          expect(overrideButton).toBeDefined();
        });

        it('should have title of \'Override\'', () => {
          expect(overrideButton.text).toEqual('Override');
        });

        describe('When clicked', () => {
          let closeSpy: jasmine.Spy;
          beforeEach(() => {
            closeSpy = jasmine.createSpy('close');
            overrideButton.onClick(closeSpy);
          });

          it('should close when clicked', () => {
            expect(closeSpy).toHaveBeenCalledTimes(1);
          });

          it('should emit OnClosed when clicked', () => {
            expect(component.whenClosed.emit).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('when warnings are non-overridable', () => {
      beforeEach(() => {
        component = createComponent();
        component.whenClosed = jasmine.createSpyObj<EventEmitter<unknown>>('whenClosed', ['emit']);
        component.validationWarning = {
          errorCode: 'VALIDATION_MESSAGES_EXIST',
          validationException:
          {
            entityId: '',
            validationMessages:
              [
                {
                  scheduleId: '1',
                  description: 'Validation Warning 1',
                  severityLevel: 'Warning'
                },
                {
                  scheduleId: '2',
                  description: 'Validation Warning 2',
                  severityLevel: 'Warning'
                }
              ],
            overridable: false
          },
          override: false,
          otherExceptions: false
        } as IValidationWarning;

        component.ngOnInit();
      });

      it('should show cancel and OK button', () => {
        expect(component.title).toBeDefined();
        component.buttons = getActiveButtons();
        expect(component.buttons.length).toEqual(2);
      });

      describe('OK button', () => {
        let OKButton: ModalButton;
        beforeEach(() => {
          OKButton = getActiveButtons().filter(button => button.styleClass === 'priority-button')[0];
        });

        it('should show the OK button', () => {
          expect(OKButton).toBeDefined();
        });

        it('should have title of OK', () => {
          expect(OKButton.text).toEqual('OK');
        });

        describe('When clicked', () => {
          let closeSpy: jasmine.Spy;
          beforeEach(() => {
            closeSpy = jasmine.createSpy('close');
            OKButton.onClick(closeSpy);
          });

          it('should close when clicked', () => {
            expect(closeSpy).toHaveBeenCalledTimes(1);
          });

          it('should emit OnClosed when clicked', () => {
            expect(component.whenClosed.emit).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('When isValidationError is false', () => {
      beforeEach(() => {
        component = createComponent();
        component.validationWarning = {
          errorCode: 'NOT_AUTHORISED',
          validationException: {
            entityId: '',
            employeeId: 1245,
            lastName: 'ARA01',
            firstName: 'ARA01',
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Schedule overlaps an existing schedule 1',
                severityLevel: 'Warning'
              },
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Schedule overlaps an existing schedule 2',
                severityLevel: 'Warning'
              }
            ],
            overridable: false
          },
          override: true,
          otherExceptions: false
        } as IValidationWarning;

        component.isValidationError = false;
        component.ngOnInit();
      });

      it('should set the title to event not saved', () => {
        expect(component.title()).toBe('Event was not saved');
      });
    });

    describe('When single validation exception occurs', () => {
      beforeEach(() => {
        component = createComponent();
        component.validationWarning = {
          errorCode: 'VALIDATION_MESSAGES_EXIST',
          validationException: {
            entityId: '',
            employeeId: 1245,
            lastName: 'ARA01',
            firstName: 'ARA01',
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Schedule overlaps an existing schedule 1',
                severityLevel: 'Warning'
              }
            ],
            overridable: false
          },
          override: true,
          otherExceptions: false
        } as IValidationWarning;

        component.ngOnInit();
      });

      it('should set the title', () => {
        expect(component.title()).toBe('Validation Warning');
      });
    });

    describe('When multiple validation exception occurs', () => {
      beforeEach(() => {
        component = createComponent();
        component.validationWarning = {
          errorCode: 'VALIDATION_MESSAGES_EXIST',
          validationException: {
            entityId: '',
            employeeId: 1245,
            lastName: 'ARA01',
            firstName: 'ARA01',
            validationMessages: [
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Schedule overlaps an existing schedule 1',
                severityLevel: 'Warning'
              },
              {
                scheduleId: '00000000-0000-0000-0000-000000000000',
                description: 'Schedule overlaps an existing schedule 2',
                severityLevel: 'Warning'
              }
            ],
            overridable: false
          },
          override: true,
          otherExceptions: false
        } as IValidationWarning;
        component.ngOnInit();
      });

      it('should set the title', () => {
        expect(component.title()).toBe('Validation Warnings');
      });
    });
  });
});
