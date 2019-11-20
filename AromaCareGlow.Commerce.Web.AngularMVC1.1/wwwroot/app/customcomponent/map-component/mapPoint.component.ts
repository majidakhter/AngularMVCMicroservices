import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'ac-mappoint',
    template: ``
})
export class MapPointComponent implements OnInit {
    @Input() longitude: any;
    @Input() latitude: any;
    @Input() markerText: string;
    constructor() {

    }
    ngOnInit() {

    }
}