import { Component, OnInit } from '@angular/core';
import { IApplyVendor } from '../core/domain/applyvendor'
@Component({
    selector: 'home',
    templateUrl: './app/components/vendoraccount.component.html'
})
export class VendorAccountComponent implements OnInit {
    ApplyVendor: IApplyVendor;
    constructor() {

    }
    ngOnInit() {
        this.ApplyVendor = this.getVendor();
    }
    send(vendor: IApplyVendor) {

    }
    getVendor(): IApplyVendor {
        var vendor = {
            'Email': '',
            'Name': '',
            'Description': '',
            
        }
        return vendor;
    }
}