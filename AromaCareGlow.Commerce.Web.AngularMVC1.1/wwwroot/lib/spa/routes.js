"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./components/index");
var appRoutes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: index_1.HomeComponent
    },
    {
        path: 'men',
        component: index_1.MenComponent
    },
    {
        path: 'women',
        component: index_1.WomenComponent
    },
    {
        path: 'product',
        component: index_1.ProductComponent
    },
    {
        path: 'category',
        component: index_1.CategoryComponent
    },
    {
        path: 'vendor',
        component: index_1.VendorAccountComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
