import { Http, Response, Request } from '@angular/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Registration } from '../domain/registration';
import { Customer } from '../domain/customer';
import { Address } from '../domain/address';

@Injectable()
export class MemberShipService {
    private _accountRegisterAPI: string = 'api/customer/register/';
    private _accountLoginAPI: string = 'api/customer/authenticate/';
    private _accountLogoutAPI: string = 'api/customer/logout/';
    private _accountAddressAPI: string = 'api/customer/saveaddress/';

    constructor(public accountService: DataService) {

    }
    register(newUser: Registration) {

        this.accountService.set(this._accountRegisterAPI);

        return this.accountService.post(JSON.stringify(newUser));
    }
    saveAddress(newCustomer: Address) {
        this.accountService.set(this._accountAddressAPI);

        return this.accountService.post(JSON.stringify(newCustomer));
    }
    login(creds: Customer) {
        this.accountService.set(this._accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds));
    }

    logout() {
        this.accountService.set(this._accountLogoutAPI);
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