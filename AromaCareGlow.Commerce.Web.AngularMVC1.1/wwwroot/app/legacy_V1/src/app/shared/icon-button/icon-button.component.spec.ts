
import { IconButtonComponent } from './icon-button.component';
import { TranslateService } from '@ngx-translate/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { ViewChild, Component } from '@angular/core';

@Component({
  selector: 'button-host',
  template: '<wf-icon-button></wf-icon-button>'
})
class ButtonHostComponent {
  @ViewChild(IconButtonComponent)
  public iconButtonComponent: IconButtonComponent;
}

describe('IconButtonComponent', () => {
  const translateServiceMock: jasmine.SpyObj<TranslateService> = jasmine.createSpyObj('TranslateService', ['instant']);
  let buttonHostFixture: ComponentFixture<ButtonHostComponent>;
  let buttonHostComponent: ButtonHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconButtonComponent, ButtonHostComponent],
      providers: [{ provide: TranslateService, useValue: translateServiceMock }]
    }).compileComponents();
  }));

  translateServiceMock.instant.and.callFake((input: string) => {
    return input;
  });

  const runTest = (text: string, iconClass: string, position: string, disabled: boolean) => {
    buttonHostFixture = TestBed.createComponent(ButtonHostComponent);
    buttonHostComponent = buttonHostFixture.componentInstance;
    buttonHostComponent.iconButtonComponent.text = text;
    buttonHostComponent.iconButtonComponent.iconClass = iconClass;
    buttonHostComponent.iconButtonComponent.iconPosition = position;
    buttonHostComponent.iconButtonComponent.disabled = disabled;
    buttonHostFixture.detectChanges();
  };

  describe('when created', () => {
    describe('when disabled is true', () => {
      beforeEach(() => {
        runTest('Hello', '', '', true);
      });

      it('should add the disabled attribute to the button', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').hasAttribute('disabled')).toEqual(true);
      });

      it('should display the text', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').innerText).toEqual('Hello');
      });
    });

    describe('when disabled is false', () => {
      beforeEach(() => {
        runTest('Goodbye', '', '', false);
      });

      it('should not add the disabled attribute to the button', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').hasAttribute('disabled')).toEqual(false);
      });

      it('should display the text', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').innerText).toEqual('Goodbye');
      });
    });

    describe('when position is left', () => {
      beforeEach(() => {
        runTest('Text On Right', 'rainbow-icon', 'left', false);
      });

      it('should place the text after the button', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[0] instanceof HTMLElement).toEqual(true);
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[0].classList.contains('rainbow-icon')).toEqual(true);
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[1] instanceof HTMLSpanElement).toEqual(true);
      });

      it('should display the text', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').innerText).toEqual('Text On Right');
      });
    });

    describe('when position is right', () => {
      beforeEach(() => {
        runTest('Text On Left', 'rainbow-icon', 'right', false);
      });

      it('should place the text before the button', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[0] instanceof HTMLSpanElement).toEqual(true);
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[1] instanceof HTMLElement).toEqual(true);
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[1].classList.contains('rainbow-icon')).toEqual(true);
      });

      it('should display the text', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').innerText).toEqual('Text On Left');
      });
    });

    describe('when position is not provided', () => {
      beforeEach(() => {
        runTest('Text On Left', 'rainbow-icon', null, false);
      });

      it('should place the text before the button', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[0] instanceof HTMLSpanElement).toEqual(true);
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[1] instanceof HTMLElement).toEqual(true);
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').children[1].classList.contains('rainbow-icon')).toEqual(true);
      });

      it('should display the text', () => {
        expect(buttonHostFixture.nativeElement.querySelector('.wf-icon-button').innerText).toEqual('Text On Left');
      });
    });
  });
});
