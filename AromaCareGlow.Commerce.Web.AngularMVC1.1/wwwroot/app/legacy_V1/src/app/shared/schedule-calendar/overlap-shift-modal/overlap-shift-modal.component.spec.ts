import { OverlapShiftModalComponent } from './overlap-shift-modal.component';

describe('OverlapShiftModalComponent', () => {
  const component = new OverlapShiftModalComponent();
  describe('#closeApprovalModal', () => {
    beforeEach(() => {
      spyOn(component, 'close');
      spyOn(component.close, 'emit');
      component.closeOverlapModal();
    });

    it('should call the close', () => {
      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});
