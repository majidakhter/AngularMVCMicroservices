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
var customerservice_component_1 = require("./customerservice.component");
var search_component_1 = require("./search.component");
var recentviewedproduct_component_1 = require("./recentviewedproduct.component");
var news_component_1 = require("./news.component");
var newproduct_component_1 = require("./newproduct.component");
var compareproduct_component_1 = require("./compareproduct.component");
var routes_1 = require("./routes");
var CustomerServiceModule = /** @class */ (function () {
    function CustomerServiceModule() {
    }
    CustomerServiceModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                routes_1.customerServiceRouting
            ],
            declarations: [
                customerservice_component_1.CustomerServiceComponent,
                search_component_1.SearchComponent,
                recentviewedproduct_component_1.RecentViewedComponent,
                news_component_1.NewsComponent,
                newproduct_component_1.NewProductComponent,
                compareproduct_component_1.CompareProductComponent
            ],
            providers: [
                data_service_1.DataService,
                membership_service_1.MemberShipService,
                notification_service_1.NotificationService
            ]
        })
    ], CustomerServiceModule);
    return CustomerServiceModule;
}());
exports.CustomerServiceModule = CustomerServiceModule;
//# sourceMappingURL=customerservice.module.js.map