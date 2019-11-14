import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../../core/domain/registration';
import { OperationResult } from '../../core/domain/operationResult';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';
import { ITEMS } from '../../core/common/mock-data';
import { YEARITEMS, MONTHITEMS, DAYITEMS } from '../../core/common/birthyear';
@Component({
    selector: 'register',
    providers: [MemberShipService, NotificationService],
    templateUrl: './app/components/accounts/register.component.html'
})
export class RegisterComponent implements OnInit {

    private _newUser: Registration;
    radioSel: any;
    radioSelected: string;
    daySelected: string;
    yearSelected: string;
    monthSelected: string;
    radioSelectedString: string;
    yearselectedString: string;
    monthselectedString: string;
    daaySelectedString: string;
    constructor(public membershipService: MemberShipService,
        public notificationService: NotificationService,
        public router: Router) { }

    ngOnInit() {
        this._newUser = new Registration('', '', '', '', '', null, '', false,'','',null,null,null);
        this._newUser.Gender = ITEMS;
        this._newUser.Day = DAYITEMS;
        this._newUser.Month = MONTHITEMS;
        this._newUser.Year = YEARITEMS;
        this.radioSelected = "Male";
        this.yearSelected = "0";
        this.monthSelected = "00";
        this.daySelected = "00";
        this.getSelecteditem();
    }
    getSelecteditem() {
        this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
        this.radioSelectedString = JSON.stringify(this.radioSel);
        this.yearselectedString = JSON.stringify(YEARITEMS.find(Item => Item.value === this.yearSelected));
        this.monthselectedString = JSON.stringify(MONTHITEMS.find(Item => Item.value === this.monthSelected));
        this.daaySelectedString = JSON.stringify(DAYITEMS.find(Item => Item.value === this.daySelected));
    }

    onItemChange(item:any) {
        this.getSelecteditem();
    }
    register(): void {
        var _registrationResult: OperationResult = new OperationResult(false, '');
        this._newUser.SelectedGender = this.radioSelected;
        if (this.daySelected !== "00" && this.monthSelected !== "00" && this.yearSelected !== "0") {
            this._newUser.DateOfBirth = this.daySelected + '/' + this.monthSelected + '/' + this.yearSelected;
        }
        else {
            this._newUser.DateOfBirth = "01/01/1970";
        }
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