import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DataService, MemberShipService, NotificationService } from '../../core/services/index';

//import { ConfirmationDialogModule } from '../../customcomponent/confirmation-dialog/confirmation-dialog.module';
//import { ConfirmationDialogService } from '../../customcomponent/confirmation-dialog/confirmation-dialog.service';
import {
    MyAccountComponent, AddressComponent, OrderComponent, DownloadableProductComponent, ProductReviewComponent, RewardPointComponent, StockSubscriptionComponent,
    ShoppingCartComponent, WishListComponent, ChangePasswordComponent, AddressViewComponent
} from './index';

import { CustomGridComponent } from '../../customcomponent/grid-component/customgrid.component';
import { myaccountRouting } from './routes';

@NgModule({
    imports: [
        
        CommonModule,
        FormsModule,
        NgbModule,
        //ConfirmationDialogModule,
       
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
        AddressViewComponent,
        CustomGridComponent
        
    ],

    providers: [
        DataService,
        MemberShipService,
        NotificationService,
        //ConfirmationDialogService
        
    ]
})
export class MyAccountModule { }