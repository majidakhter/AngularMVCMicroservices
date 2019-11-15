"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var customerservice_component_1 = require("./customerservice.component");
var search_component_1 = require("./search.component");
var recentviewedproduct_component_1 = require("./recentviewedproduct.component");
var news_component_1 = require("./news.component");
var newproduct_component_1 = require("./newproduct.component");
var compareproduct_component_1 = require("./compareproduct.component");
exports.accountRoutes = [
    {
        path: 'customerinfoservice',
        component: customerservice_component_1.CustomerServiceComponent,
        children: [
            { path: 'search', component: search_component_1.SearchComponent },
            { path: 'recentviewed', component: recentviewedproduct_component_1.RecentViewedComponent },
            { path: 'news', component: news_component_1.NewsComponent },
            { path: 'newproduct', component: newproduct_component_1.NewProductComponent },
            { path: 'compareproduct', component: compareproduct_component_1.CompareProductComponent },
        ]
    }
];
exports.customerServiceRouting = router_1.RouterModule.forChild(exports.accountRoutes);
//# sourceMappingURL=routes.js.map