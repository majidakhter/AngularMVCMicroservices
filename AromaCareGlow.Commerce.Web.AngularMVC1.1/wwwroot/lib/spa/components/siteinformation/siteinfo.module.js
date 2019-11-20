"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var index_1 = require("../../core/services/index");
var routes_1 = require("./routes");
var index_2 = require("./index");
var SiteInfoModule = (function () {
    function SiteInfoModule() {
    }
    SiteInfoModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                routes_1.mysiteRouting
            ],
            declarations: [
                index_2.SiteInfoComponent,
                index_2.UseConditionComponent,
                index_2.SiteMapComponent,
                index_2.ShippingReturnComponent,
                index_2.PrivacyNoticeComponent,
                index_2.AboutusComponent,
                index_2.ContactusComponent
            ],
            providers: [
                index_1.DataService,
                index_1.MemberShipService,
                index_1.NotificationService
            ]
        })
    ], SiteInfoModule);
    return SiteInfoModule;
}());
exports.SiteInfoModule = SiteInfoModule;
