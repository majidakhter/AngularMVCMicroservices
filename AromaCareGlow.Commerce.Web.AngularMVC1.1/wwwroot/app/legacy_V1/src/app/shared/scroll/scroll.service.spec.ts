

import { TestBed, inject } from '@angular/core/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ScrollService]
        });
    });

    it('should be created', inject([ScrollService], (service: ScrollService) => {
        expect(service).toBeTruthy();
    }));

    describe('when getScrolledPosition is called', () => {
        it('broadcasts the scroll value', inject([ScrollService], (service: ScrollService) => {
            service.setScrollPosition(10);
            service.getScrollPosition().subscribe((position) => {
                expect(position).toEqual(10);
            });
        }));
    });
});
