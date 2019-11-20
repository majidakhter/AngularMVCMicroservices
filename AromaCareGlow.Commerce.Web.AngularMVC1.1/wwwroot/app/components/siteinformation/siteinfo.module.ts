import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DataService, MemberShipService, NotificationService } from '../../core/services/index';
import { mysiteRouting } from './routes';
import { UseConditionComponent, SiteMapComponent, ShippingReturnComponent, PrivacyNoticeComponent, AboutusComponent, ContactusComponent, SiteInfoComponent } from './index';

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