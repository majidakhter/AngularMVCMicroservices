import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService, MemberShipService, NotificationService } from '../../core/services/index';
import { AccountComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent, ShoppingCartComponent, CheckoutComponent } from './index';


import { accountRouting } from './routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        accountRouting
    ],
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ShoppingCartComponent,
        CheckoutComponent
    ],

    providers: [
        DataService,
        MemberShipService,
        NotificationService
    ]
})
export class AccountModule { }