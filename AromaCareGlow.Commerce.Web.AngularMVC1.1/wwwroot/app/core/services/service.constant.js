"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Configuration = /** @class */ (function () {
    function Configuration() {
        //public ApiServer: string = "http://localhost:6001/";  // when you run with IIS
        // if you run the project with IIS express, please use the address http://localhost:51214/
        //public ApiUrl: string = "api/notes";
        this._accountRegisterAPI = 'api/customer/register/';
        this._accountLoginAPI = 'api/customer/authenticate/';
        this._accountLogoutAPI = 'api/customer/logout/';
        this._accountAddressAPI = 'api/customer/saveaddress/';
        //public ServerWithApiUrl: string = this.ApiServer + this.ApiUrl;
    }
    Configuration = __decorate([
        core_1.Injectable()
    ], Configuration);
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=service.constant.js.map