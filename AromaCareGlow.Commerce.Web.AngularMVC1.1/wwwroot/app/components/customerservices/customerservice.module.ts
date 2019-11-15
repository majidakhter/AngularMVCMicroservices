import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from '../../core/services/data.service';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';

import { CustomerServiceComponent } from './customerservice.component';
import { SearchComponent } from './search.component';
import { RecentViewedComponent } from './recentviewedproduct.component';
import { NewsComponent } from './news.component';
import { NewProductComponent } from './newproduct.component';
import { CompareProductComponent } from './compareproduct.component';
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