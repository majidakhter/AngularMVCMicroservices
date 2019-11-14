import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService } from '../../core/services/data.service';
import { MemberShipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';

import { UseConditionComponent } from './usecondition.component';
import { SiteMapComponent } from './sitemap.component';
import { ShippingReturnComponent } from './shippingreturns.component';
import { PrivacyNoticeComponent } from './privacynotice.component';
import { AboutusComponent } from './aboutus.component';
import { ContactusComponent } from './contactus.component';
import { mysiteRouting } from './routes';
import { SiteInfoComponent } from './siteinfo.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        mysiteRouting
    ],
    declarations: [
        SiteInfoComponent,
        UseConditionComponent,
        SiteMapComponent,
        ShippingReturnComponent,
        PrivacyNoticeComponent,
        AboutusComponent,
        ContactusComponent
    ],

    providers: [
        DataService,
        MemberShipService,
        NotificationService
    ]
})
export class SiteInfoModule { }