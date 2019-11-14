"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var myaccount_component_1 = require("./myaccount.component");
var address_component_1 = require("./address.component");
var order_component_1 = require("./order.component");
var downloadableproduct_component_1 = require("./downloadableproduct.component");
var productreview_component_1 = require("./productreview.component");
var rewardpoint_component_1 = require("./rewardpoint.component");
var stocksubscription_component_1 = require("./stocksubscription.component");
exports.accountRoutes = [
    {
        path: 'myaccounts',
        component: myaccount_component_1.MyAccountComponent,
        children: [
            { path: 'address', component: address_component_1.AddressComponent },
            { path: 'order', component: order_component_1.OrderComponent },
            { path: 'downloadproduct', component: downloadableproduct_component_1.DownloadableProductComponent },
            { path: 'productreview', component: productreview_component_1.ProductReviewComponent },
            { path: 'rewardpoint', component: rewardpoint_component_1.RewardPointComponent },
            { path: 'stocksubscription', component: stocksubscription_component_1.StockSubscriptionComponent }
        ]
    }
];
exports.accountRouting = router_1.RouterModule.forChild(exports.accountRoutes);
