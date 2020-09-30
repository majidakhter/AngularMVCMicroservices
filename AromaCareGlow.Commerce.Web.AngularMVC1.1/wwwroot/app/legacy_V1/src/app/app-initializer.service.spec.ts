

import { AppInitializerService } from './app-initializer.service';

describe('AppInitializerService', () => {
  let service: AppInitializerService;
  beforeEach(() => {
    service = new AppInitializerService();
  });
  describe('#load', () => {
    beforeEach(() => {
      (<any> window).parent.ga = { test: 'test' };
      service.load();
    });

    it('should set Google Analytics object', () => {
      expect((<any> window).ga.test).toEqual('test');
    });
  });
});
