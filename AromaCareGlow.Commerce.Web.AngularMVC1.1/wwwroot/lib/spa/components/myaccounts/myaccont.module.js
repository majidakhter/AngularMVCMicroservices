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
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var index_1 = require("../../core/services/index");
//import { ConfirmationDialogModule } from '../../customcomponent/confirmation-dialog/confirmation-dialog.module';
//import { ConfirmationDialogService } from '../../customcomponent/confirmation-dialog/confirmation-dialog.service';
var index_2 = require("./index");
var customgrid_component_1 = require("../../customcomponent/grid-component/customgrid.component");
var routes_1 = require("./routes");
var MyAccountModule = (function () {
    function MyAccountModule() {
    }
    MyAccountModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                ng_bootstrap_1.NgbModule,
                //ConfirmationDialogModule,
                routes_1.myaccountRouting
            ],
            declarations: [
                index_2.MyAccountComponent,
                index_2.AddressComponent,
                index_2.OrderComponent,
                index_2.DownloadableProductComponent,
                index_2.ProductReviewComponent,
                index_2.RewardPointComponent,
                index_2.StockSubscriptionComponent,
                index_2.ShoppingCartComponent,
                index_2.WishListComponent,
                index_2.ChangePasswordComponent,
                index_2.AddressViewComponent,
                customgrid_component_1.CustomGridComponent
            ],
            providers: [
                index_1.DataService,
                index_1.MemberShipService,
                index_1.NotificationService,
                index_1.LoggerService
                //ConfirmationDialogService
            ]
        })
    ], MyAccountModule);
    return MyAccountModule;
}());
exports.MyAccountModule = MyAccountModule;
