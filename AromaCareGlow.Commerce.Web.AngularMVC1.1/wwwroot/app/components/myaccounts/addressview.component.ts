import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../../core/domain/address';
@Component({
    selector: 'myaccount',
    templateUrl: './app/components/myaccounts/addressview.component.html'
})
export class AddressViewComponent implements OnInit {
    private _address1: Address;

    constructor(
        public router: Router) { }

    ngOnInit() {
        this._address1 = new Address('', '', '', null, null, '', '', '', '', '', '','','');
        let obj: Address = JSON.parse(sessionStorage.getItem('customeraddress'));
        this._address1 = obj;
    }
    addNew() {
        sessionStorage.removeItem('customeraddress');
        this.router.navigate(['myaccounts/address']);
    }
}