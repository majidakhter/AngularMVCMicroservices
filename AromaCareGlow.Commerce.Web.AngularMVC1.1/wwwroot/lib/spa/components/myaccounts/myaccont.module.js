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
var myaccount_component_1 = require("./myaccount.component");
var address_component_1 = require("./address.component");
var order_component_1 = require("./order.component");
var downloadableproduct_component_1 = require("./downloadableproduct.component");
var productreview_component_1 = require("./productreview.component");
var rewardpoint_component_1 = require("./rewardpoint.component");
var stocksubscription_component_1 = require("./stocksubscription.component");
var shoppingcart_component_1 = require("./shoppingcart.component");
var wishlist_component_1 = require("./wishlist.component");
var routes_1 = require("./routes");
var MyAccountModule = (function () {
    function MyAccountModule() {
    }
    MyAccountModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                routes_1.myaccountRouting
            ],
            declarations: [
                myaccount_component_1.MyAccountComponent,
                address_component_1.AddressComponent,
                order_component_1.OrderComponent,
                downloadableproduct_component_1.DownloadableProductComponent,
                productreview_component_1.ProductReviewComponent,
                rewardpoint_component_1.RewardPointComponent,
                stocksubscription_component_1.StockSubscriptionComponent,
                shoppingcart_component_1.ShoppingCartComponent,
                wishlist_component_1.WishListComponent
            ],
            providers: [
                data_service_1.DataService,
                membership_service_1.MemberShipService,
                notification_service_1.NotificationService
            ]
        })
    ], MyAccountModule);
    return MyAccountModule;
}());
exports.MyAccountModule = MyAccountModule;
