import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService, MemberShipService, NotificationService } from '../../core/services/index';
import { CustomerServiceComponent, SearchComponent, RecentViewedComponent, NewsComponent, NewProductComponent, CompareProductComponent } from './index';
import  { customerServiceRouting } from './routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        customerServiceRouting
    ],
    declarations: [
        CustomerServiceComponent,
        SearchComponent,
        RecentViewedComponent,
        NewsComponent,
        NewProductComponent,
        CompareProductComponent
      
    ],

    providers: [
        DataService,
        MemberShipService,
        NotificationService
    ]
})
export class CustomerServiceModule { }