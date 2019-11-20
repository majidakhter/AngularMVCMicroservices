"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var address_1 = require("../../core/domain/address");
var index_1 = require("../../core/services/index");
//import { ConfirmationDialogService } from '../../customcomponent/confirmation-dialog/confirmation-dialog.service';
var AddressViewComponent = (function () {
    function AddressViewComponent(router, confirmModelService, _logger) {
        this.router = router;
        this.confirmModelService = confirmModelService;
        this._logger = _logger;
    }
    AddressViewComponent.prototype.ngOnInit = function () {
        this._address1 = new address_1.Address('', '', '', null, null, '', '', '', '', '', '', '', '');
        var obj = JSON.parse(sessionStorage.getItem('customeraddress'));
        this._address1 = obj;
    };
    AddressViewComponent.prototype.addNew = function () {
        sessionStorage.removeItem('customeraddress');
        this.router.navigate(['myaccounts/address']);
    };
    AddressViewComponent.prototype.deleteAddress = function () {
        this.confirmModelService.printConfirmationDialog('Are you sure you want to delete the address?', function () {
            //    this.dataService.deleteResource(this._photosAPI + photo.Id)
            //        .subscribe(res => {
            //            _removeResult.Succeeded = res.Succeeded;
            //            _removeResult.Message = res.Message;
            //        },
            //            error => this._logger.log(error),
            //            () => {
            //                if (_removeResult.Succeeded) {
            //                    this.notificationService.printSuccessMessage(photo.Title + ' removed from gallery.');
            //                    this.getAlbumPhotos();
            //                }
            //                else {
            //                    this.notificationService.printErrorMessage('Failed to remove photo');
            //                }
            //            });
        });
    };
    AddressViewComponent = __decorate([
        core_1.Component({
            selector: 'myaccount',
            templateUrl: './app/components/myaccounts/addressview.component.html'
        }),
        __metadata("design:paramtypes", [router_1.Router, index_1.NotificationService, index_1.LoggerService])
    ], AddressViewComponent);
    return AddressViewComponent;
}());
exports.AddressViewComponent = AddressViewComponent;
