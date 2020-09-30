

import { ConfirmationComponent } from './confirmation.component';
import { TranslateService } from '@ngx-translate/core';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  function createComponent(): ConfirmationComponent {
    return new ConfirmationComponent(mockTranslateService);
  }

  beforeEach(() => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockTranslateService.instant.and.callFake(value => {
      if (value === 'button.retract') {
        return 'Retract';
      } else if (value === 'button.cancel') {
        return 'Cancel';
      } else if (value === 'title') {
        return 'Title';
      }
      return value;
    });
  });

  describe('when modal title is blank', () => {
    beforeEach(() => {
      component = createComponent();
      component.ngOnInit();
    });

    it('should not set title', () => {
      expect(mockTranslateService.instant).not.toHaveBeenCalledWith('title');
    });
  });

  describe('when modal title is not blank', () => {
    beforeEach(() => {
      component = createComponent();
      component.title = 'title';
      component.ngOnInit();
    });

    it('should not set title', () => {
      expect(component.title).toEqual('Title');
    });
  });

  describe('modal buttons', () => {
    let closeSpy: jasmine.Spy;

    beforeEach(() => {
      component = createComponent();
      component.buttonText = 'button.retract';
      component.action = jasmine.createSpy('action');
      component.ngOnInit();
    });

    describe('cancel button', () => {
      beforeEach(() => {
        closeSpy = jasmine.createSpy('close');
      });

      it('should always show button', () => {
        expect(component.buttons[0].condition()).toBeTruthy();
      });

      it('should set button text to Cancel', () => {
        expect(component.buttons[0].text).toEqual('Cancel');
      });

      describe('button action', () => {
        beforeEach(() => {
          component.buttons[0].onClick(closeSpy);
        });

        it('should call close', () => {
          expect(closeSpy).toHaveBeenCalled();
        });
      });
    });

    describe('confirm button', () => {
      beforeEach(() => {
        closeSpy = jasmine.createSpy('close');
      });

      it('should always show button', () => {
        expect(component.buttons[1].condition()).toBeTruthy();
      });

      it('should set confirm text to input vlaue', () => {
        expect(component.buttons[1].text).toEqual('Retract');
      });

      describe('button action', () => {
        beforeEach(() => {
          component.buttons[1].onClick(closeSpy);
        });

        it('should call action and close', () => {
          expect(component.action).toHaveBeenCalled();
          expect(closeSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
