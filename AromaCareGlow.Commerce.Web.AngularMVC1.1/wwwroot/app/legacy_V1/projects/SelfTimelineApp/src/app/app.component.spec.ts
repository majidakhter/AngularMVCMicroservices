

import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockStore: jasmine.SpyObj<Store>;
  let mockEnvironmentService;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockAnalyticsService: jasmine.SpyObj<Angulartics2GoogleAnalytics>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockEnvironmentService = {};
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    mockAnalyticsService = jasmine.createSpyObj('Angulartics2GoogleAnalytics', ['eventTrack']);
  });

  function CreateComponent() {
    return new AppComponent(mockStore, mockTranslateService, mockEnvironmentService, mockAnalyticsService);
  }
  describe('#ngOnInit', () => {
    beforeEach(() => {
      mockStore.dispatch.and.returnValue(of({}));
      component = CreateComponent();
      component.ngOnInit();
    });

    it('when login success', () => {
      expect(component.loginSuccess).toBe(true);
    });
  });

  describe('konami code', () => {
    let navigationSpy: jasmine.Spy;
    beforeEach(() => {
      navigationSpy = jasmine.createSpy('NavigateTo');
      component = CreateComponent();
      const topReference = window.top;
      (topReference as any).Root = () => ({ NavigateTo: navigationSpy });
    });

    describe('when one key is entered incorrectly', () => {
      beforeEach(() => {
        component.keyEvent({ code: 'ArrowUp' } as any);
        component.keyEvent({ code: 'ArrowUp' } as any);
        component.keyEvent({ code: 'ArrowDown' } as any);
        component.keyEvent({ code: 'ArrowDown' } as any);
        component.keyEvent({ code: 'ArrowLeft' } as any);
        component.keyEvent({ code: 'ArrowRight' } as any);
        component.keyEvent({ code: 'ArrowLeft' } as any);
        component.keyEvent({ code: 'ArrowLeft' } as any);
      });

      it('should not call any event', () => {
        expect(navigationSpy).not.toHaveBeenCalled();
      });
    });

    describe('when all keys are entered correctly', () => {
      beforeEach(() => {
        component.keyEvent({ code: 'ArrowUp' } as any);
        component.keyEvent({ code: 'ArrowUp' } as any);
        component.keyEvent({ code: 'ArrowDown' } as any);
        component.keyEvent({ code: 'ArrowDown' } as any);
        component.keyEvent({ code: 'ArrowLeft' } as any);
        component.keyEvent({ code: 'ArrowRight' } as any);
        component.keyEvent({ code: 'ArrowLeft' } as any);
        component.keyEvent({ code: 'ArrowRight' } as any);
        component.keyEvent({ code: 'BackSpace' } as any);
      });

      it('should call into navigation to go to the employee page and escape the grip of the monthly view', () => {
        expect(navigationSpy).toHaveBeenCalled();
        expect(navigationSpy.calls.mostRecent().args[0].startsWith('http://')).toBeTruthy();
        expect(navigationSpy.calls.mostRecent().args[0].endsWith('/EmployeeLoad.aspx?redirect=TCS.aspx')).toBeTruthy();
      });
    });
  });
});
