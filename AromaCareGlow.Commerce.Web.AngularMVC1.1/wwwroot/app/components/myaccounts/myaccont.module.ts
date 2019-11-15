import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from '../../core/services/data.service';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';

import { MyAccountComponent } from './myaccount.component';
import { AddressComponent } from './address.component';
import {OrderComponent } from './order.component';
import { DownloadableProductComponent } from './downloadableproduct.component';
import { ProductReviewComponent } from './productreview.component';
import { RewardPointComponent } from './rewardpoint.component';
import { StockSubscriptionComponent } from './stocksubscription.component';
import { ShoppingCartComponent } from './shoppingcart.component';
import { WishListComponent } from './wishlist.component';
import { myaccountRouting } from './routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        myaccountRouting
    ],
    declarations: [
        MyAccountComponent,
        AddressComponent,
        OrderComponent,
        DownloadableProductComponent,
        ProductReviewComponent,
        RewardPointComponent,
        StockSubscriptionComponent,
        ShoppingCartComponent,
        WishListComponent
    ],

    providers: [
        DataService,
        MemberShipService,
        NotificationService
    ]
})
export class MyAccountModule { }