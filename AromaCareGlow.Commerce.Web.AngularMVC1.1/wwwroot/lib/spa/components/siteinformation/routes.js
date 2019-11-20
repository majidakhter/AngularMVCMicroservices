"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var index_1 = require("./index");
exports.accountRoutes = [
    {
        path: 'siteinfopage',
        component: index_1.SiteInfoComponent,
        children: [
            { path: 'usecondition', component: index_1.UseConditionComponent },
            { path: 'sitemap', component: index_1.SiteMapComponent },
            { path: 'shippingreturn', component: index_1.ShippingReturnComponent },
            { path: 'privacynotice', component: index_1.PrivacyNoticeComponent },
            { path: 'aboutus', component: index_1.AboutusComponent },
            { path: 'contactus', component: index_1.ContactusComponent }
        ]
    }
];
exports.mysiteRouting = router_1.RouterModule.forChild(exports.accountRoutes);
