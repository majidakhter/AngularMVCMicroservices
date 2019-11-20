"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./index");
exports.accountRoutes = [
    {
        path: 'customerinfoservice',
        component: index_1.CustomerServiceComponent,
        children: [
            { path: 'search', component: index_1.SearchComponent },
            { path: 'recentviewed', component: index_1.RecentViewedComponent },
            { path: 'news', component: index_1.NewsComponent },
            { path: 'newproduct', component: index_1.NewProductComponent },
            { path: 'compareproduct', component: index_1.CompareProductComponent },
        ]
    }
];
exports.customerServiceRouting = router_1.RouterModule.forChild(exports.accountRoutes);
