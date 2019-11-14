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
var registration_1 = require("../../core/domain/registration");
var operationResult_1 = require("../../core/domain/operationResult");
var membership_service_1 = require("../../core/services/membership.service");
var notification_service_1 = require("../../core/services/notification.service");
var mock_data_1 = require("../../core/common/mock-data");
var birthyear_1 = require("../../core/common/birthyear");
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(membershipService, notificationService, router) {
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this._newUser = new registration_1.Registration('', '', '', '', '', null, '', false, '', '', null, null, null);
        this._newUser.Gender = mock_data_1.ITEMS;
        this._newUser.Day = birthyear_1.DAYITEMS;
        this._newUser.Month = birthyear_1.MONTHITEMS;
        this._newUser.Year = birthyear_1.YEARITEMS;
        this.radioSelected = "Male";
        this.yearSelected = "0";
        this.monthSelected = "00";
        this.daySelected = "00";
        this.getSelecteditem();
    };
    RegisterComponent.prototype.getSelecteditem = function () {
        var _this = this;
        this.radioSel = mock_data_1.ITEMS.find(function (Item) { return Item.value === _this.radioSelected; });
        this.radioSelectedString = JSON.stringify(this.radioSel);
        this.yearselectedString = JSON.stringify(birthyear_1.YEARITEMS.find(function (Item) { return Item.value === _this.yearSelected; }));
        this.monthselectedString = JSON.stringify(birthyear_1.MONTHITEMS.find(function (Item) { return Item.value === _this.monthSelected; }));
        this.daaySelectedString = JSON.stringify(birthyear_1.DAYITEMS.find(function (Item) { return Item.value === _this.daySelected; }));
    };
    RegisterComponent.prototype.onItemChange = function (item) {
        this.getSelecteditem();
    };
    RegisterComponent.prototype.register = function () {
        var _this = this;
        var _registrationResult = new operationResult_1.OperationResult(false, '');
        this._newUser.SelectedGender = this.radioSelected;
        if (this.daySelected !== "00" && this.monthSelected !== "00" && this.yearSelected !== "0") {
            this._newUser.DateOfBirth = this.daySelected + '/' + this.monthSelected + '/' + this.yearSelected;
        }
        else {
            this._newUser.DateOfBirth = "01/01/1970";
        }
        this.membershipService.register(this._newUser)
            .subscribe(function (res) {
            _registrationResult.Succeeded = res.Succeeded;
            _registrationResult.Message = res.Message;
        }, function (error) { return console.error('Error: ' + error); }, function () {
            if (_registrationResult.Succeeded) {
                _this.notificationService.printSuccessMessage('Dear ' + _this._newUser.Username + ', please login with your credentials');
                _this.router.navigate(['accounts/login']);
            }
            else {
                _this.notificationService.printErrorMessage(_registrationResult.Message);
            }
        });
    };
    ;
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'register',
            providers: [membership_service_1.MemberShipService, notification_service_1.NotificationService],
            templateUrl: './app/components/accounts/register.component.html'
        }),
        __metadata("design:paramtypes", [membership_service_1.MemberShipService,
            notification_service_1.NotificationService,
            router_1.Router])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map