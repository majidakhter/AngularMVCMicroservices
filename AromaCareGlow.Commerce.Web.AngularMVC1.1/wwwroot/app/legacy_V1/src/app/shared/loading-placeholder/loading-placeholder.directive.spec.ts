

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoadingPlaceholderDirective } from './loading-placeholder.directive';

const expectedValue = '';

@Component({
  template: `<ul wfLoadingPlaceholder loadingValue='{{value}}'></ul>`
})

class TestLoadingComponent {
  value = expectedValue;
  updateValue(value) {
    this.value = value;
  }
}

describe('LoadingPlaceholderDirective', () => {
  let component: TestLoadingComponent;
  let fixture: ComponentFixture<TestLoadingComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestLoadingComponent, LoadingPlaceholderDirective]
    });
    fixture = TestBed.createComponent(TestLoadingComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('ul'));
  });

  describe('when changes occur', () => {
    describe('and loading value is', () => {
      describe('null', () => {
        it('add loading-background class', () => {
          component.updateValue(null);
          fixture.detectChanges();
          expect(element.nativeElement.classList).toContain('loading-background');
        });
      });
      describe('', () => {
        it('add loading-background class', () => {
          component.updateValue('');
          fixture.detectChanges();
          expect(element.nativeElement.classList).toContain('loading-background');
        });
      });
      describe('length 0', () => {
        it('add loading-background class', () => {
          component.updateValue([]);
          fixture.detectChanges();
          expect(element.nativeElement.classList).toContain('loading-background');
        });
      });
      describe('null and length is not 0', () => {
        it('remove loading-background class', () => {
          component.updateValue('this worked');
          fixture.detectChanges();
          expect(element.nativeElement.classList).not.toContain('loading-background');
        });
      });
    });
  });
});
