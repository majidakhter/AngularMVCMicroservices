import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Headers, RequestOptions, BaseRequestOptions } from '@angular/http';

import { HomeComponent, MenComponent, WomenComponent, ProductComponent, CategoryComponent, VendorAccountComponent } from './components/index';
import { AccordionComponent, AccordionItemComponent } from './customcomponent/index';
import { AppComponent } from './app.component';
import { DataService, MemberShipService, UtilityService, NotificationService, Configuration } from './core/services/index';

import { AccountModule } from './components/accounts/account.module';
import { MyAccountModule } from './components/myaccounts/myaccont.module';
import { SiteInfoModule } from './components/siteinformation/siteinfo.module';
import { CustomerServiceModule } from './components/customerservices/customerservice.module';

import { routing } from './routes';

class AppBaseRequestOptions extends BaseRequestOptions {
    headers: Headers = new Headers();

    constructor() {
        super();
        this.headers.append('Content-Type', 'application/json');
        this.body = '';
    }
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        AccountModule,
        NgbModule,
        SiteInfoModule,
        CustomerServiceModule,
        BrowserAnimationsModule,
        MyAccountModule,
        //ConfirmationDialogModule
        
    ],
    declarations: [AppComponent, HomeComponent, MenComponent, WomenComponent, ProductComponent, CategoryComponent, AccordionItemComponent, AccordionComponent, VendorAccountComponent],
    providers: [DataService, MemberShipService, UtilityService, NotificationService, Configuration,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RequestOptions, useClass: AppBaseRequestOptions }],
    bootstrap: [AppComponent]
})
export class AppModule { }

