"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var account_component_1 = require("./account.component");
var login_component_1 = require("./login.component");
var register_component_1 = require("./register.component");
var forgetpassword_component_1 = require("./forgetpassword.component");
exports.accountRoutes = [
    {
        path: 'accounts',
        component: account_component_1.AccountComponent,
        children: [
            { path: 'register', component: register_component_1.RegisterComponent },
            { path: 'login', component: login_component_1.LoginComponent },
            { path: 'forgetpassword', component: forgetpassword_component_1.ForgotPasswordComponent },
        ]
    }
];
exports.accountRouting = router_1.RouterModule.forChild(exports.accountRoutes);
