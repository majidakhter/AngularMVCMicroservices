

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { WfScrollDirective } from './scroll.directive';
import { ScrollService } from '../../shared/scroll/scroll.service';

@Component({
  template: `<div wfScroll></div>`
})

class TestScrollComponent {}

describe('ScrollDirective', () => {
    let fixture: ComponentFixture<TestScrollComponent>;
    let directive;
    const mockScrollService = jasmine.createSpyObj('ScrollService', ['setScrollPosition']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestScrollComponent, WfScrollDirective],
            providers: [{provide: ScrollService, useValue: mockScrollService}]
        });
        fixture = TestBed.createComponent(TestScrollComponent);
        directive = fixture.debugElement.query(By.directive(WfScrollDirective)).injector.get(WfScrollDirective);
    });

    describe('when scrolled', () => {
        beforeEach(() => {
            directive.ngAfterViewInit();
            const event = new Event('scroll');
            directive.el.nativeElement.dispatchEvent(event);
        });

        it('calls the scroll service to set the scrollTop', () => {
            expect(mockScrollService.setScrollPosition).toHaveBeenCalled();
        });
    });
});
