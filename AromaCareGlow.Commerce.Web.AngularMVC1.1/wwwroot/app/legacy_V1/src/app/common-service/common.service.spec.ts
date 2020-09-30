import { CommonService } from './common.service';

describe('CommonService', () => {
  let commonService: CommonService;

  beforeEach(() => {
    commonService = new CommonService();
  });

  it('should be created', () => {
    expect(commonService).toBeTruthy();
  });

  describe('#setUnsavedOption', () => {
    let unsavedOptionEventSpy: jasmine.Spy;
    beforeEach(() => {
      unsavedOptionEventSpy = spyOn(commonService.unsavedOption, 'emit').and.stub();
    });

    describe('when unsaved is false', () => {
      beforeEach(() => {
        commonService.setUnsavedOption(false);
      });

      it('should emit unsavedOption event with false as the value', () => {
        expect(unsavedOptionEventSpy).toHaveBeenCalledWith(false);
      });
    });

    describe('when unsaved is true', () => {
      beforeEach(() => {
        commonService.setUnsavedOption(true);
      });

      it('should emit unsavedOption event with true as the value', () => {
        expect(unsavedOptionEventSpy).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('#getUnsavedOption', () => {
    beforeEach(() => {
      commonService.unsavedOption.emit(true);
    });

    it('should return observable<boolean>', () => {
      commonService.getUnsavedOption().subscribe((value) => {
        expect(value).toBeTruthy();
      });
    });
  });
});
