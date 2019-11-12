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
var data_service_1 = require("./data.service");
var customer_1 = require("../domain/customer");
var MemberShipService = /** @class */ (function () {
    function MemberShipService(accountService) {
        this.accountService = accountService;
        this._accountRegisterAPI = 'api/customer/register/';
        this._accountLoginAPI = 'api/customer/authenticate/';
        this._accountLogoutAPI = 'api/customer/logout/';
    }
    MemberShipService.prototype.register = function (newUser) {
        this.accountService.set(this._accountRegisterAPI);
        return this.accountService.post(JSON.stringify(newUser));
    };
    MemberShipService.prototype.login = function (creds) {
        this.accountService.set(this._accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds));
    };
    MemberShipService.prototype.logout = function () {
        this.accountService.set(this._accountLogoutAPI);
        return this.accountService.post(null, false);
    };
    MemberShipService.prototype.isUserAuthenticated = function () {
        var _user = localStorage.getItem('user');
        if (_user != null)
            return true;
        else
            return false;
    };
    MemberShipService.prototype.getLoggedInUser = function () {
        var _user;
        if (this.isUserAuthenticated()) {
            var _userData = JSON.parse(localStorage.getItem('user'));
            _user = new customer_1.Customer(_userData.Username, _userData.Password);
        }
        return _user;
    };
    MemberShipService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], MemberShipService);
    return MemberShipService;
}());
exports.MemberShipService = MemberShipService;
//# sourceMappingURL=membership.service.js.map