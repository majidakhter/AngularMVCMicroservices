import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../core/services/data.service';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmationDialogModule } from '../../customcomponent/confirmation-dialog/confirmation-dialog.module';
import { ConfirmationDialogService } from '../../customcomponent/confirmation-dialog/confirmation-dialog.service';
import { MyAccountComponent } from './myaccount.component';
import { AddressComponent } from './address.component';
import {OrderComponent } from './order.component';
import { DownloadableProductComponent } from './downloadableproduct.component';
import { ProductReviewComponent } from './productreview.component';
import { RewardPointComponent } from './rewardpoint.component';
import { StockSubscriptionComponent } from './stocksubscription.component';
import { ShoppingCartComponent } from './shoppingcart.component';
import { WishListComponent } from './wishlist.component';
import { ChangePasswordComponent } from './changepassword.component';
import { AddressViewComponent } from './addressview.component';
import { myaccountRouting } from './routes';

@NgModule({
    imports: [
        
        CommonModule,
        FormsModule,
        NgbModule,
        ConfirmationDialogModule,
       
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
        WishListComponent,
        ChangePasswordComponent,
        AddressViewComponent
        
    ],

    providers: [
        DataService,
        MemberShipService,
        NotificationService,
        ConfirmationDialogService
        
    ]
})
export class MyAccountModule { }