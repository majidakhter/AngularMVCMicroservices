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
var operationResult_1 = require("../../core/domain/operationResult");
var membership_service_1 = require("../../core/services/membership.service");
var notification_service_1 = require("../../core/services/notification.service");
var statelist_1 = require("../../core/common/statelist");
var AddressComponent = /** @class */ (function () {
    function AddressComponent(membershipService, notificationService, router) {
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
    }
    AddressComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._address = new address_1.Address('', '', '', null, null, '', '', '', '', '', '', '', '');
        if (sessionStorage.getItem('customeraddress') !== null) {
            this._address = JSON.parse(sessionStorage.getItem('customeraddress'));
            var selected1 = this._address.Country.filter(function (item) { return item.countryname == _this._address.SelectedCountry; });
            var selected2 = this._address.State.filter(function (item) { return item.statename == _this._address.SelectedState; });
            this.selectedCountry = selected1[0]['countrycode'];
            this.selectedState = selected2[0]['statecode'];
        }
        else {
            this._address.Country = statelist_1.COUNTRYLIST;
            this.selectedCountry = "00";
            this._address.State = statelist_1.STATELIST.filter(function (item) { return item.countrycode == "00"; });
            this.selectedState = "00";
        }
    };
    AddressComponent.prototype.onItemChange = function (item1) {
        this._address.State = statelist_1.STATELIST.filter(function (item) { return item.countrycode == item1; });
    };
    AddressComponent.prototype.save = function () {
        var _this = this;
        var _addressSaveResult = new operationResult_1.OperationResult(false, '');
        var selected1 = statelist_1.COUNTRYLIST.filter(function (item) { return item.countrycode == _this.selectedCountry; });
        var selected2 = statelist_1.STATELIST.filter(function (item) { return item.statecode == _this.selectedState; });
        this._address.SelectedCountry = selected1[0]['countryname'];
        this._address.SelectedState = selected2[0]['statename'];
        this.membershipService.saveAddress(this._address)
            .subscribe(function (res) {
            _addressSaveResult.Succeeded = res.Succeeded;
            _addressSaveResult.Message = res.Message;
        }, function (error) { return console.error('Error: ' + error); }, function () {
            if (_addressSaveResult.Succeeded) {
                _this.notificationService.printSuccessMessage('Dear ' + _this._address.Email + ', please login with your credentials');
                sessionStorage.setItem('customeraddress', JSON.stringify(_this._address));
                _this.router.navigate(['myaccounts/addressview']);
            }
            else {
                _this.notificationService.printErrorMessage(_addressSaveResult.Message);
            }
        });
    };
    ;
    AddressComponent = __decorate([
        core_1.Component({
            selector: 'address',
            templateUrl: './app/components/myaccounts/address.component.html'
        }),
        __metadata("design:paramtypes", [membership_service_1.MemberShipService,
            notification_service_1.NotificationService, router_1.Router])
    ], AddressComponent);
    return AddressComponent;
}());
exports.AddressComponent = AddressComponent;
//# sourceMappingURL=address.component.js.map