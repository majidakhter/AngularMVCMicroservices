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
var data_service_1 = require("../../core/services/data.service");
var membership_service_1 = require("../../core/services/membership.service");
var notification_service_1 = require("../../core/services/notification.service");
var usecondition_component_1 = require("./usecondition.component");
var sitemap_component_1 = require("./sitemap.component");
var shippingreturns_component_1 = require("./shippingreturns.component");
var privacynotice_component_1 = require("./privacynotice.component");
var aboutus_component_1 = require("./aboutus.component");
var contactus_component_1 = require("./contactus.component");
var routes_1 = require("./routes");
var siteinfo_component_1 = require("./siteinfo.component");
var SiteInfoModule = /** @class */ (function () {
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
                siteinfo_component_1.SiteInfoComponent,
                usecondition_component_1.UseConditionComponent,
                sitemap_component_1.SiteMapComponent,
                shippingreturns_component_1.ShippingReturnComponent,
                privacynotice_component_1.PrivacyNoticeComponent,
                aboutus_component_1.AboutusComponent,
                contactus_component_1.ContactusComponent
            ],
            providers: [
                data_service_1.DataService,
                membership_service_1.MemberShipService,
                notification_service_1.NotificationService
            ]
        })
    ], SiteInfoModule);
    return SiteInfoModule;
}());
exports.SiteInfoModule = SiteInfoModule;
//# sourceMappingURL=siteinfo.module.js.map