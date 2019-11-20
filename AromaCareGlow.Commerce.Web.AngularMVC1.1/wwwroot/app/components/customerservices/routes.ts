import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerServiceComponent, SearchComponent, RecentViewedComponent, NewsComponent, NewProductComponent, CompareProductComponent } from './index';

export const accountRoutes: Routes = [
    {
        path: 'customerinfoservice',
        component: CustomerServiceComponent,
        children: [
           
            { path: 'search', component: SearchComponent },
            { path: 'recentviewed', component: RecentViewedComponent },
            { path: 'news', component: NewsComponent },
            { path: 'newproduct', component: NewProductComponent },
            { path: 'compareproduct', component: CompareProductComponent },
            
        ]
    }
];

export const customerServiceRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);