import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from '../../core/services/data.service';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ForgotPasswordComponent } from './forgetpassword.component';
import { ShoppingCartComponent } from './shoppingcart.component';
import { CheckoutComponent } from './checkout.component';

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