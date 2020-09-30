

import { TranslateService } from '@ngx-translate/core';
import { ScheduleValidationWarningsModalComponent } from './schedule-validation-warnings-modal.component';
import { IScheduleValidationWarning } from './model/schedule-validation-warning';
import { ModalButton } from '@wfm/modal';

describe('ScheduleValidationWarningsModalComponent', () => {
  const mockTranslate = jasmine.createSpyObj<TranslateService>('Translate', ['instant']);
  mockTranslate.instant.and.callFake((stringValue) => {
    switch (stringValue) {
      case 'button.cancel':
        return 'Cancel';
      case 'button.ok':
        return 'OK';
      case 'button.override':
        return `Override`;
      case 'schedule.save-event-error':
        return `Event was not saved`;
      case 'schedule.error-code-validation-message-exists':
        return `VALIDATION_MESSAGES_EXIST`;
      case 'schedule.validation-warnings':
        return `Validation Warnings`;
      case 'schedule.validation-warning':
        return `Validation Warning`;
      default:
        return `translated: ${stringValue}`;
    }
  });

  let component: ScheduleValidationWarningsModalComponent;

  function createComponent(): ScheduleValidationWarningsModalComponent {
    return new ScheduleValidationWarningsModalComponent(mockTranslate);
  }

  function getActiveButtons(): ModalButton[] {
    return component.buttons.filter(button => button.condition());
  }

  beforeEach(() => {
  });
  describe('#ngOnInit', () => {
    describe('When warnings are overridable', () => {
      beforeEach(() => {
        component = createComponent();
        component.scheduleValidationWarnings = {
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
        } as IScheduleValidationWarning;
        component.ngOnInit();
        component.ngOnChanges();
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
        it('Cancel button title', () => {
          expect((cancelButton.text as () => string)()).toEqual('Cancel');
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
        it('Override button title', () => {
          expect((overrideButton.text as () => string)()).toEqual('Override');
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
        });
      });
    });
    describe('when warnings are non-overridable', () => {
      beforeEach(() => {
        component = createComponent();
        component.scheduleValidationWarnings = {
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
        } as IScheduleValidationWarning;
        component.ngOnInit();
        component.ngOnChanges();
      });

      it('should show cancel and override button', () => {
        expect(component.title).toBeDefined();
        component.buttons = getActiveButtons();
        expect(component.buttons.length).toEqual(1);
      });
      describe('OK button', () => {
        let OKButton: ModalButton;
        beforeEach(() => {
          OKButton = getActiveButtons().filter(button => button.styleClass === 'priority-button')[0];
        });
        it('should show the OK button', () => {
          expect(OKButton).toBeDefined();
        });
        it('OK button title', () => {
          expect((OKButton.text as () => string)()).toEqual('OK');
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
        });
      });
    });
    describe('When other exception occurs', () => {
      beforeEach(() => {
        component = createComponent();
        component.scheduleValidationWarnings = {
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
        } as IScheduleValidationWarning;
        component.ngOnInit();
        component.ngOnChanges();
      });
      it('should set the title to event not saved', () => {
        expect(component.title()).toBe('Event was not saved');
      });
      it('should set the isValidationError flag to false', () => {
        expect(component.isValidationError).toBeFalsy();
      });
    });
    describe('When no validation exception occurs', () => {
      beforeEach(() => {
        component = createComponent();
        component.scheduleValidationWarnings = null as IScheduleValidationWarning;
        component.ngOnInit();
        component.ngOnChanges();
      });
      it('should set the displayList flag to false', () => {
        expect(component.displayList).toBeFalsy();
      });
      it('should set the isValidationError flag to false', () => {
        expect(component.isValidationError).toBeFalsy();
      });
    });
    describe('When single validation exception occurs', () => {
      beforeEach(() => {
        component = createComponent();
        component.scheduleValidationWarnings = {
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
        } as IScheduleValidationWarning;
        component.ngOnInit();
        component.ngOnChanges();
      });
      it('should set the displayList flag to false', () => {
        expect(component.displayList).toBeFalsy();
      });
      it('should set the isValidationError flag to true', () => {
        expect(component.isValidationError).toBeTruthy();
      });
      it('should set the title', () => {
        expect(component.title()).toBe('Validation Warning');
      });
    });
    describe('When multiple validation exception occurs', () => {
      beforeEach(() => {
        component = createComponent();
        component.scheduleValidationWarnings = {
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
        } as IScheduleValidationWarning;
        component.ngOnInit();
        component.ngOnChanges();
      });
      it('should set the displayList flag to false', () => {
        expect(component.displayList).toBeTruthy();
      });
      it('should set the isValidationError flag to true', () => {
        expect(component.isValidationError).toBeTruthy();
      });
      it('should set the title', () => {
        expect(component.title()).toBe('Validation Warnings');
      });
    });
  });
});
