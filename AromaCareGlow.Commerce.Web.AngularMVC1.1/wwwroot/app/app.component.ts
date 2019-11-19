import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/add/operator/map';
import { enableProdMode } from '@angular/core';

enableProdMode();
import { MemberShipService } from './core/services/membership.service';


@Component({
    selector: 'dashboard-app',
    templateUrl: './app/app.component.html',
    styleUrls: ['./app/app.component.css']
})
export class AppComponent implements OnInit {
    CopyRightDate: number;
    constructor(public membershipService: MemberShipService,
        public location: Location) { }

    ngOnInit() {
        this.CopyRightDate = new Date().getFullYear();
    }

    isUserLoggedIn(): boolean {
        //use the below code to check everywhere wherever page can be accssed only by login user i.e my account orders wishlist
        return this.membershipService.isUserAuthenticated();
    }

    getUserName(): string {
        if (this.isUserLoggedIn()) {
            var _user = this.membershipService.getLoggedInUser();
            return _user.Username;
        }
        else
            return 'Account';
    }

    logout(): void {
        this.membershipService.logout()
            .subscribe(res => {
                localStorage.removeItem('user');
            },
                error => console.error('Error: ' + error),
                () => { });
    }
   
}
