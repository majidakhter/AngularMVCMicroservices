import { Component } from '@angular/core';
import { CustomerTest } from '../../core/domain/customertest'
@Component({
    selector: 'order',
    templateUrl: './app/components/myaccounts/changepassword.component.html'
})
export class ChangePasswordComponent {
    customer: CustomerTest;
    constructor() {
        this.customer = new CustomerTest('','','');
    }
}