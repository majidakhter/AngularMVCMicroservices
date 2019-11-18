import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAccountComponent } from './myaccount.component';
import { AddressComponent } from './address.component';
import { OrderComponent } from './order.component';
import { DownloadableProductComponent } from './downloadableproduct.component';
import { ProductReviewComponent } from './productreview.component';
import { RewardPointComponent } from './rewardpoint.component';
import { StockSubscriptionComponent } from './stocksubscription.component';
import { ShoppingCartComponent } from './shoppingcart.component';
import { WishListComponent } from './wishlist.component';
import { ChangePasswordComponent } from './changepassword.component';
import { AddressViewComponent } from './addressview.component';
export const accountRoutes: Routes = [
    {
        path: 'myaccounts',
        component: MyAccountComponent,
        children: [
            { path: 'address', component: AddressComponent },
            { path: 'order', component: OrderComponent },
            { path: 'downloadproduct', component: DownloadableProductComponent },
            { path: 'productreview', component: ProductReviewComponent },
            { path: 'rewardpoint', component: RewardPointComponent },
            { path: 'stocksubscription', component: StockSubscriptionComponent },
            { path: 'shoppingcart', component: ShoppingCartComponent },
            { path: 'wishlist', component: WishListComponent },
            { path: 'changepassword', component: ChangePasswordComponent },
            { path: 'addressview', component: AddressViewComponent }
        ]
    }
];

export const myaccountRouting: ModuleWithProviders = RouterModule.forChild(accountRoutes);