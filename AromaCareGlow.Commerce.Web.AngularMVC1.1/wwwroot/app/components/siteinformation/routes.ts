import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UseConditionComponent } from './usecondition.component';
import { SiteMapComponent } from './sitemap.component';
import { ShippingReturnComponent } from './shippingreturns.component';
import { PrivacyNoticeComponent } from './privacynotice.component';
import { AboutusComponent } from './aboutus.component';
import { ContactusComponent } from './contactus.component';
import { SiteInfoComponent } from './siteinfo.component';

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