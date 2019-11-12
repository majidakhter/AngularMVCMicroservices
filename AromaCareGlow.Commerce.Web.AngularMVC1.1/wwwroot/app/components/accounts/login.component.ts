import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../core/domain/customer';
import { OperationResult } from '../../core/domain/operationResult';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'albums',
    templateUrl: './app/components/accounts/login.component.html'
})
export class LoginComponent implements OnInit {
    private _user: Customer;

    constructor(public membershipService: MemberShipService,
        public notificationService: NotificationService,
        public router: Router) { }

    ngOnInit() {
        this._user = new Customer('', '');
    }

    login(): void {
        var _authenticationResult: OperationResult = new OperationResult(false, '');

        this.membershipService.login(this._user)
            .subscribe((res: any) => {
                _authenticationResult.Succeeded = res.Succeeded;
                _authenticationResult.Message = res.Message;
            },
                error => console.error('Error: ' + error),
                () => {
                    if (_authenticationResult.Succeeded) {
                        this.notificationService.printSuccessMessage('Welcome back ' + this._user.Username + '!');
                        localStorage.setItem('user', JSON.stringify(this._user));
                        this.router.navigate(['home']);
                    }
                    else {
                        this.notificationService.printErrorMessage(_authenticationResult.Message);
                    }
                });
    };
}