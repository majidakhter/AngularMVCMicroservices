import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent, ShoppingCartComponent, CheckoutComponent } from './index';

export const accountRoutes: Routes = [
    {
        path: 'accounts',
        component: AccountComponent,
        children: [
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'forgetpassword', component: ForgotPasswordComponent },
            { path: 'shoppingcart', component: ShoppingCartComponent },
            { path: 'checkout', component: CheckoutComponent }
        ]
    }
];

export const accountRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);