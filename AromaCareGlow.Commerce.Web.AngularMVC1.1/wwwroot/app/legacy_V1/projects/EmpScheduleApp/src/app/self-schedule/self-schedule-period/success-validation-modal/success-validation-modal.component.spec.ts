
import { SuccessValidationModalComponent } from './success-validation-modal.component';

describe('SuccessValidationModalComponent', () => {
  const component = new SuccessValidationModalComponent();
  describe('#closeApprovalModal', () => {
    beforeEach(() => {
      spyOn(component, 'close');
      spyOn(component.close, 'emit');
      component.closeApprovalModal();
    });

    it('should call the close', () => {
      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});
