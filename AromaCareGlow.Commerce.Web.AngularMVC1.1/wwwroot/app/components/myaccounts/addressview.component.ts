import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../../core/domain/address';
import { NotificationService } from '../../core/services/notification.service';
//import { ConfirmationDialogService } from '../../customcomponent/confirmation-dialog/confirmation-dialog.service';
@Component({
    selector: 'myaccount',
    templateUrl: './app/components/myaccounts/addressview.component.html'
})
export class AddressViewComponent implements OnInit {
    private _address1: Address;

    constructor(
        public router: Router, private confirmModelService: NotificationService) { }

    ngOnInit() {
        this._address1 = new Address('', '', '', null, null, '', '', '', '', '', '','','');
        let obj: Address = JSON.parse(sessionStorage.getItem('customeraddress'));
        this._address1 = obj;
    }
    addNew() {
        sessionStorage.removeItem('customeraddress');
        this.router.navigate(['myaccounts/address']);
    }
    deleteAddress() {
       
        this.confirmModelService.printConfirmationDialog('Are you sure you want to delete the address?',
            () => {
            //    this.dataService.deleteResource(this._photosAPI + photo.Id)
            //        .subscribe(res => {
            //            _removeResult.Succeeded = res.Succeeded;
            //            _removeResult.Message = res.Message;
            //        },
            //            error => console.error('Error: ' + error),
            //            () => {
            //                if (_removeResult.Succeeded) {
            //                    this.notificationService.printSuccessMessage(photo.Title + ' removed from gallery.');
            //                    this.getAlbumPhotos();
            //                }
            //                else {
            //                    this.notificationService.printErrorMessage('Failed to remove photo');
            //                }
            //            });
            }
        );
      
    }
}