import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

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