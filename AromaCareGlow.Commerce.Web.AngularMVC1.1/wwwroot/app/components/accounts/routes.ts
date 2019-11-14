import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ForgotPasswordComponent } from './forgetpassword.component';
export const accountRoutes: Routes = [
    {
        path: 'accounts',
        component: AccountComponent,
        children: [
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'forgetpassword', component: ForgotPasswordComponent },
        ]
    }
];

export const accountRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);