import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../../core/domain/address';
import { OperationResult } from '../../core/domain/operationResult';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';
import { STATELIST, COUNTRYLIST } from '../../core/common/statelist'
@Component({
    selector: 'address',
    templateUrl: './app/components/myaccounts/address.component.html'
})
export class AddressComponent {
    private _address: Address;
    selectedCountry: string;
    selectedState: string;
    constructor(public membershipService: MemberShipService,
        public notificationService: NotificationService, public router: Router
        ) {

    }
    ngOnInit() {
            this._address = new Address('', '', '', null, null, '', '', '', '', '', '', '', '');
        if (sessionStorage.getItem('customeraddress') !== null) {
            this._address = JSON.parse(sessionStorage.getItem('customeraddress'));
            let selected1 = this._address.Country.filter((item) => item.countryname == this._address.SelectedCountry);
            let selected2 = this._address.State.filter((item) => item.statename == this._address.SelectedState);
            this.selectedCountry = selected1[0]['countrycode'];
            this.selectedState = selected2[0]['statecode'];
        }
        else {
            this._address.Country = COUNTRYLIST;
            this.selectedCountry = "00";
            this._address.State = STATELIST.filter((item) => item.countrycode == "00");
            this.selectedState = "00";
        }
      
      
    }
    
    onItemChange(item1: string) {
        this._address.State = STATELIST.filter((item) => item.countrycode == item1);
    }
    save(): void {
        var _addressSaveResult: OperationResult = new OperationResult(false, '');
        let selected1 = COUNTRYLIST.filter((item) => item.countrycode == this.selectedCountry);
        let selected2 = STATELIST.filter((item) => item.statecode == this.selectedState);
       
        this._address.SelectedCountry = selected1[0]['countryname'];
        this._address.SelectedState = selected2[0]['statename'];
      
        this.membershipService.saveAddress(this._address)
            .subscribe((res: any) => {
                _addressSaveResult.Succeeded = res.Succeeded;
                _addressSaveResult.Message = res.Message;

            },
                error => console.error('Error: ' + error),
                () => {
                    if (_addressSaveResult.Succeeded) {
                        this.notificationService.printSuccessMessage('Dear ' + this._address.Email + ', please login with your credentials');
                        sessionStorage.setItem('customeraddress', JSON.stringify(this._address));
                        this.router.navigate(['myaccounts/addressview']);
                    }
                    else {
                        this.notificationService.printErrorMessage(_addressSaveResult.Message);
                    }
                });
    };
}