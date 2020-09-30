

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ScrollService {
    // We want this to be a Behavior Subject so it fires immediately
    private scrollPosition = new BehaviorSubject<number>(0);

    constructor() { }

    public getScrollPosition() {
        return this.scrollPosition.asObservable();
    }

    public setScrollPosition(scrolledTop) {
        this.scrollPosition.next(scrolledTop);
    }
}
