import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerServiceComponent } from './customerservice.component';
import { SearchComponent } from './search.component';
import { RecentViewedComponent } from './recentviewedproduct.component';
import { NewsComponent } from './news.component';
import { NewProductComponent } from './newproduct.component';
import { CompareProductComponent } from './compareproduct.component';
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