import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Registration } from '../domain/registration';
import { Customer } from '../domain/customer';
import { Address } from '../domain/address';
import { Configuration } from './service.constant'
@Injectable()
export class MemberShipService {
  
   

    // store the URL so we can redirect after logging in
    redirectUrl: string;
    constructor(public accountService: DataService, private configuration: Configuration) {

    }
    register(newUser: Registration) {

        this.accountService.set(this.configuration._accountRegisterAPI);

        return this.accountService.post(JSON.stringify(newUser));
    }
    saveAddress(newCustomer: Address) {
        this.accountService.set(this.configuration._accountAddressAPI);

        return this.accountService.post(JSON.stringify(newCustomer));
    }
    login(creds: Customer) {
        this.accountService.set(this.configuration._accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds));
    }

    logout() {
        this.accountService.set(this.configuration._accountLogoutAPI);
        return this.accountService.post(null, false);
    }
    isUserAuthenticated(): boolean {
        var _user: any = localStorage.getItem('user');
        if (_user != null)
            return true;
        else
            return false;
    }

    getLoggedInUser(): Customer {
        var _user: Customer;

        if (this.isUserAuthenticated()) {
            var _userData = JSON.parse(localStorage.getItem('user'));
            _user = new Customer(_userData.Username, _userData.Password);
        }

        return _user;
    }
}