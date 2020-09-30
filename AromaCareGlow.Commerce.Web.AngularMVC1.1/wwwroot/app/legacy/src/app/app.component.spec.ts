import { async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockTranlateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async(() => {
    mockTranlateService = jasmine.createSpyObj("TranslateService",
      ["getBrowserCultureLang", "setDefaultLang", "use", "defaultLang"]);
    component = new AppComponent(
      mockTranlateService
    );
  }
  ));

  describe('#OnInit', () => {
    let translateSuffix = '';
    beforeEach(() => {
      mockTranlateService.getBrowserCultureLang.and.returnValue('en-US' + translateSuffix);
      component.ngOnInit();
    });

    it(`should have spied the translate methods'`, () => {
      expect(component.translate.getBrowserCultureLang().toLowerCase()).toBe('en-us');
      expect(mockTranlateService.setDefaultLang).toHaveBeenCalledWith('en-us');
      expect(mockTranlateService.use).toHaveBeenCalledWith('en-us');
    });
  });
});


