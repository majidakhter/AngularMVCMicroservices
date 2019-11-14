import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'myaccount',
    templateUrl: './app/components/myaccounts/myaccount.component.html'
})
export class MyAccountComponent implements OnInit {

    constructor(
        public router: Router) { }

    ngOnInit() {

    }
}