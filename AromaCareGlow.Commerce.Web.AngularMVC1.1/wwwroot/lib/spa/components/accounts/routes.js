"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./index");
exports.accountRoutes = [
    {
        path: 'accounts',
        component: index_1.AccountComponent,
        children: [
            { path: 'register', component: index_1.RegisterComponent },
            { path: 'login', component: index_1.LoginComponent },
            { path: 'forgetpassword', component: index_1.ForgotPasswordComponent },
            { path: 'shoppingcart', component: index_1.ShoppingCartComponent },
            { path: 'checkout', component: index_1.CheckoutComponent }
        ]
    }
];
exports.accountRouting = router_1.RouterModule.forChild(exports.accountRoutes);
