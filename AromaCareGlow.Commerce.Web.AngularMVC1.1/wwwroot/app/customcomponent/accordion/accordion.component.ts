import { Component, ContentChildren, QueryList, AfterContentInit, OnInit } from '@angular/core';
import { trigger, state, transition, animate, style, group } from '@angular/animations';
import { AccordionItemComponent } from '../accordion-item/accordion-item.component';
import { fadeAnimation } from '../animation';
@Component({
    selector: 'app-accordion',
    templateUrl: './app/customcomponent/accordion/accordion.component.html',
    styleUrls: ['./app/customcomponent/accordion/accordion.component.css'],
})

export class AccordionComponent implements OnInit, AfterContentInit {
    @ContentChildren(AccordionItemComponent) items: QueryList<AccordionItemComponent>;
    private subscriptions: any = [];

    private _accordions: any = [];

    constructor() { }

    ngOnInit() {
    }

   
    ngAfterContentInit() {

        this._accordions = this.items;
        this.removeSubscriptions();
        this.addSubscriptions();

        this.items.changes.subscribe(rex => {
            this._accordions = rex;
            this.removeSubscriptions();
            this.addSubscriptions();
        });
    }
    addSubscriptions() {
        this._accordions.forEach((a:any) => {
            let subscription = a.toggleAccordion.subscribe((e:any) => {
                this.toogleAccordion(a);
            });
            this.subscriptions.push(subscription);
        });
    }

    removeSubscriptions() {
        this.subscriptions.forEach((sub:any) => {
            sub.unsubscribe();
        });
    }

    toogleAccordion(accordion: AccordionItemComponent) {
        if (!accordion.active) {
            this.items.forEach(a => a.active = false);
        }
        // set active accordion
        accordion.active = !accordion.active;
    }

    ngOnDestroy() {
        this.removeSubscriptions();
    }

}