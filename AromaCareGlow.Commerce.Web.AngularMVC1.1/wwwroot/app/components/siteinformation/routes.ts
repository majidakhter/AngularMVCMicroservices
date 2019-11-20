import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UseConditionComponent, SiteMapComponent, ShippingReturnComponent, PrivacyNoticeComponent, AboutusComponent, ContactusComponent, SiteInfoComponent } from './index';

export const accountRoutes: Routes = [
    {
        path: 'siteinfopage',
        component: SiteInfoComponent,
        children: [
            { path: 'usecondition', component: UseConditionComponent },
            { path: 'sitemap', component: SiteMapComponent },
            { path: 'shippingreturn', component: ShippingReturnComponent },
            { path: 'privacynotice', component: PrivacyNoticeComponent },
            { path: 'aboutus', component: AboutusComponent },
            { path: 'contactus', component: ContactusComponent }
        ]
    }
];

export const mysiteRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);