"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./index");
exports.accountRoutes = [
    {
        path: 'myaccounts',
        component: index_1.MyAccountComponent,
        children: [
            { path: 'address', component: index_1.AddressComponent },
            { path: 'order', component: index_1.OrderComponent },
            { path: 'downloadproduct', component: index_1.DownloadableProductComponent },
            { path: 'productreview', component: index_1.ProductReviewComponent },
            { path: 'rewardpoint', component: index_1.RewardPointComponent },
            { path: 'stocksubscription', component: index_1.StockSubscriptionComponent },
            { path: 'shoppingcart', component: index_1.ShoppingCartComponent },
            { path: 'wishlist', component: index_1.WishListComponent },
            { path: 'changepassword', component: index_1.ChangePasswordComponent },
            { path: 'addressview', component: index_1.AddressViewComponent }
        ]
    }
];
exports.myaccountRouting = router_1.RouterModule.forChild(exports.accountRoutes);
