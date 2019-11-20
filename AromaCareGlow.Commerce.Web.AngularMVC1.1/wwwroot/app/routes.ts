import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule} from '@angular/router';


import { HomeComponent, MenComponent, WomenComponent, ProductComponent, CategoryComponent, VendorAccountComponent } from './components/index';
import { PreloadModulesStrategy } from './core/stratagies/preload-modules.strategy';
import { accountRoutes, accountRouting } from './components/accounts/routes';

const appRoutes: Routes = [
    //{ path: '', pathMatch: 'full', redirectTo: '/home' },
    //{ path: 'order/:id', data: { preload: true }, loadChildren: () => import('./components/myaccounts/myaccount.module').then(m => m.MyAccountModule) },
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
