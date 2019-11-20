"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var animations_1 = require("@angular/platform-browser/animations");
var common_1 = require("@angular/common");
var http_2 = require("@angular/http");
var index_1 = require("./components/index");
var index_2 = require("./customcomponent/index");
var app_component_1 = require("./app.component");
var index_3 = require("./core/services/index");
var account_module_1 = require("./components/accounts/account.module");
var myaccont_module_1 = require("./components/myaccounts/myaccont.module");
var siteinfo_module_1 = require("./components/siteinformation/siteinfo.module");
var customerservice_module_1 = require("./components/customerservices/customerservice.module");
var routes_1 = require("./routes");
var AppBaseRequestOptions = (function (_super) {
    __extends(AppBaseRequestOptions, _super);
    function AppBaseRequestOptions() {
        var _this = _super.call(this) || this;
        _this.headers = new http_2.Headers();
        _this.headers.append('Content-Type', 'application/json');
        _this.body = '';
        return _this;
    }
    return AppBaseRequestOptions;
}(http_2.BaseRequestOptions));
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                routes_1.routing,
                account_module_1.AccountModule,
                ng_bootstrap_1.NgbModule,
                siteinfo_module_1.SiteInfoModule,
                customerservice_module_1.CustomerServiceModule,
                animations_1.BrowserAnimationsModule,
                myaccont_module_1.MyAccountModule,
            ],
            declarations: [app_component_1.AppComponent, index_1.HomeComponent, index_1.MenComponent, index_1.WomenComponent, index_1.ProductComponent, index_1.CategoryComponent, index_2.AccordionItemComponent, index_2.AccordionComponent, index_1.VendorAccountComponent],
            providers: [index_3.DataService, index_3.MemberShipService, index_3.UtilityService, index_3.NotificationService, index_3.Configuration,
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
                { provide: http_2.RequestOptions, useClass: AppBaseRequestOptions }],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
