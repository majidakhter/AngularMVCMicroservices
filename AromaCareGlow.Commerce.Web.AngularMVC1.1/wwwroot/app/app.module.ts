import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Headers, RequestOptions, BaseRequestOptions} from '@angular/http';
import { HomeComponent } from './components/home.component';
import { AccountModule } from './components/accounts/account.module';
import { MyAccountModule } from './components/myaccounts/myaccont.module';
import { SiteInfoModule } from './components/siteinformation/siteinfo.module';
import { CustomerServiceModule } from './components/customerservices/customerservice.module';
import { AppComponent }  from './app.component';

import { routing } from './routes';
import { DataService } from './core/services/data.service';
import { MemberShipService } from './core/services/membership.service';
import { UtilityService } from './core/services/utility.service';
import { NotificationService } from './core/services/notification.service';


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
        MyAccountModule,
        SiteInfoModule,
        CustomerServiceModule
    ],
    declarations: [AppComponent, HomeComponent],
    providers: [DataService, MemberShipService, UtilityService, NotificationService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RequestOptions, useClass: AppBaseRequestOptions }],
    bootstrap: [AppComponent]
})
export class AppModule { }

