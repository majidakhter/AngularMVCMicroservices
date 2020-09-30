
import { WindowRef } from './window-ref.service';

describe('WindowRef', () => {
  const buildService = (): WindowRef => {
    return new WindowRef();
  };

  describe('#getWindow', () => {
    let windowResult;
    beforeEach(() => {
      const service = buildService();
      windowResult = service.getWindow();
    });

    it('should get the global window object', () => {
      expect(windowResult).toEqual(window);
    });
  });
});
