import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { MenComponent } from './components/men.component';
import { WomenComponent } from './components/women.component';
import { ProductComponent } from './components/product.component';
import { CategoryComponent } from './components/category.component';
import { VendorAccountComponent } from './components/vendoraccount.component'
import { accountRoutes, accountRouting } from './components/accounts/routes';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'men',
        component: MenComponent
    },
    {
        path: 'women',
        component: WomenComponent
    },
    {
        path: 'product',
        component: ProductComponent
    },
    {
        path: 'category',
        component: CategoryComponent
    },
    {
        path: 'vendor',
        component: VendorAccountComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
