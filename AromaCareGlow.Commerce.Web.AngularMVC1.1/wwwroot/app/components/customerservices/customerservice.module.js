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
var index_2 = require("./index");
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
                index_2.CustomerServiceComponent,
                index_2.SearchComponent,
                index_2.RecentViewedComponent,
                index_2.NewsComponent,
                index_2.NewProductComponent,
                index_2.CompareProductComponent
            ],
            providers: [
                index_1.DataService,
                index_1.MemberShipService,
                index_1.NotificationService
            ]
        })
    ], CustomerServiceModule);
    return CustomerServiceModule;
}());
exports.CustomerServiceModule = CustomerServiceModule;
//# sourceMappingURL=customerservice.module.js.map