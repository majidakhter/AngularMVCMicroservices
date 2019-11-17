import { Component, Input, Output, HostBinding, EventEmitter, OnInit } from '@angular/core';
import {trigger, state, transition, animate, style, group} from '@angular/animations';

@Component({
    selector: 'app-accordion-item',
    templateUrl: './app/customcomponent/accordion-item/accordion-item.component.html',
    styleUrls: ['./app/customcomponent/accordion-item/accordion-item.component.css'],
   
})

export class AccordionItemComponent implements OnInit {
   
    @Input() title: string;
    @Input() active: boolean = false;
    @Output() toggleAccordion: EventEmitter<boolean> = new EventEmitter();
    constructor() { }
    ngOnInit() {
    }
    onClick(event:any) {
        event.preventDefault();
        this.toggleAccordion.emit(this.active);
    }
}