"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var home_component_1 = require("./components/home.component");
var men_component_1 = require("./components/men.component");
var women_component_1 = require("./components/women.component");
var product_component_1 = require("./components/product.component");
var category_component_1 = require("./components/category.component");
var vendoraccount_component_1 = require("./components/vendoraccount.component");
var appRoutes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent
    },
    {
        path: 'men',
        component: men_component_1.MenComponent
    },
    {
        path: 'women',
        component: women_component_1.WomenComponent
    },
    {
        path: 'product',
        component: product_component_1.ProductComponent
    },
    {
        path: 'category',
        component: category_component_1.CategoryComponent
    },
    {
        path: 'vendor',
        component: vendoraccount_component_1.VendorAccountComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=routes.js.map