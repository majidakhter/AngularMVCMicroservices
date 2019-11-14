"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var usecondition_component_1 = require("./usecondition.component");
var sitemap_component_1 = require("./sitemap.component");
var shippingreturns_component_1 = require("./shippingreturns.component");
var privacynotice_component_1 = require("./privacynotice.component");
var aboutus_component_1 = require("./aboutus.component");
var contactus_component_1 = require("./contactus.component");
var siteinfo_component_1 = require("./siteinfo.component");
exports.accountRoutes = [
    {
        path: 'siteinfopage',
        component: siteinfo_component_1.SiteInfoComponent,
        children: [
            { path: 'usecondition', component: usecondition_component_1.UseConditionComponent },
            { path: 'sitemap', component: sitemap_component_1.SiteMapComponent },
            { path: 'shippingreturn', component: shippingreturns_component_1.ShippingReturnComponent },
            { path: 'privacynotice', component: privacynotice_component_1.PrivacyNoticeComponent },
            { path: 'aboutus', component: aboutus_component_1.AboutusComponent },
            { path: 'contactus', component: contactus_component_1.ContactusComponent }
        ]
    }
];
exports.mysiteRouting = router_1.RouterModule.forChild(exports.accountRoutes);
//# sourceMappingURL=routes.js.map