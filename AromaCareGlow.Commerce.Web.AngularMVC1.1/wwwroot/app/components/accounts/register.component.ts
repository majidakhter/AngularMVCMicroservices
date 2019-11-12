import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../../core/domain/registration';
import { OperationResult } from '../../core/domain/operationResult';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'register',
    providers: [MemberShipService, NotificationService],
    templateUrl: './app/components/accounts/register.component.html'
})
export class RegisterComponent implements OnInit {

    private _newUser: Registration;

    constructor(public membershipService: MemberShipService,
        public notificationService: NotificationService,
        public router: Router) { }

    ngOnInit() {
        this._newUser = new Registration('', '', '', '', '', '', '', false);
      
    }

    register(): void {
        var _registrationResult: OperationResult = new OperationResult(false, '');
        this.membershipService.register(this._newUser)
            .subscribe((res: any) => {
                _registrationResult.Succeeded = res.Succeeded;
                _registrationResult.Message = res.Message;

            },
                error => console.error('Error: ' + error),
                () => {
                    if (_registrationResult.Succeeded) {
                        this.notificationService.printSuccessMessage('Dear ' + this._newUser.Username + ', please login with your credentials');
                        this.router.navigate(['accounts/login']);
                    }
                    else {
                        this.notificationService.printErrorMessage(_registrationResult.Message);
                    }
                });
    };
}