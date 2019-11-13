import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../../core/domain/registration';
import { OperationResult } from '../../core/domain/operationResult';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';
import { Item } from '../../core/common/item';
import { ITEMS } from '../../core/common/mock-data';

@Component({
    selector: 'register',
    providers: [MemberShipService, NotificationService],
    templateUrl: './app/components/accounts/register.component.html'
})
export class RegisterComponent implements OnInit {

    private _newUser: Registration;
    radioSel: any;
    radioSelected: string;
    radioSelectedString: string;
   // itemsList: Item[] = ITEMS;
    constructor(public membershipService: MemberShipService,
        public notificationService: NotificationService,
        public router: Router) { }

    ngOnInit() {
        this._newUser = new Registration('', '', '', '', '', null, '', false, new Date(),'');
        this._newUser.Gender = ITEMS;
        this.radioSelected = "2";
        this.getSelecteditem();
    }
    getSelecteditem() {
        this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
        this.radioSelectedString  = JSON.stringify(this.radioSel);
    }

    onItemChange(item:any) {
        this.getSelecteditem();
    }
    register(): void {
        var _registrationResult: OperationResult = new OperationResult(false, '');
        this._newUser.SelectedGender = this.radioSelected;
        //this.getSelecteditem();
       // this._newUser.Gender = this.radioSel.name;
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