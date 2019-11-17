import { Component } from '@angular/core';

@Component({
    selector: 'order',
    templateUrl: './app/components/product.component.html'
})
export class ProductComponent {
    accordionItems :any = [
        { title: 'INFORMATION', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pharetra tempor so dales. Phasellus sagittis auctor gravida. Integer bibendum sodales arcu id te mpus. Ut consectetur lacus leo, non scelerisque nulla euismod nec.' },
        { title: 'CARE DETAILS', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pharetra tempor so dales. Phasellus sagittis auctor gravida. Integer bibendum sodales arcu id te mpus. Ut consectetur lacus leo, non scelerisque nulla euismod nec.' },
        { title: 'SHIPPING & RETURNS', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pharetra tempor so dales. Phasellus sagittis auctor gravida. Integer bibendum sodales arcu id te mpus. Ut consectetur lacus leo, non scelerisque nulla euismod nec.' },
    ];
    constructor() {

    }
}