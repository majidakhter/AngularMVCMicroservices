﻿import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/services/auth.guard';
import {
    MyAccountComponent, AddressComponent, OrderComponent, DownloadableProductComponent, ProductReviewComponent, RewardPointComponent, StockSubscriptionComponent,
     WishListComponent, ChangePasswordComponent, AddressViewComponent
} from './index';

export const accountRoutes: Routes = [
    {
        path: 'myaccounts',
        component: MyAccountComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'address', component: AddressComponent },
            { path: 'order', component: OrderComponent },
            { path: 'downloadproduct', component: DownloadableProductComponent },
            { path: 'productreview', component: ProductReviewComponent },
            { path: 'rewardpoint', component: RewardPointComponent },
            { path: 'stocksubscription', component: StockSubscriptionComponent },
            { path: 'wishlist', component: WishListComponent },
            { path: 'changepassword', component: ChangePasswordComponent },
            { path: 'addressview', component: AddressViewComponent }
        ]
    }
];

export const myaccountRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);