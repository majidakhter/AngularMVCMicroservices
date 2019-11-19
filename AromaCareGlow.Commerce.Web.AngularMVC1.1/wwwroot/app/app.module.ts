import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Headers, RequestOptions, BaseRequestOptions} from '@angular/http';
import { HomeComponent } from './components/home.component';
import { MenComponent } from './components/men.component';
import { WomenComponent } from './components/women.component';
import { AccountModule } from './components/accounts/account.module';
import { MyAccountModule } from './components/myaccounts/myaccont.module';
import { SiteInfoModule } from './components/siteinformation/siteinfo.module';
import { CustomerServiceModule } from './components/customerservices/customerservice.module';
import { ProductComponent } from './components/product.component';
import { CategoryComponent } from './components/category.component';
import { AppComponent }  from './app.component';
import { AccordionComponent } from './customcomponent/accordion/accordion.component';
import { AccordionItemComponent } from './customcomponent/accordion-item/accordion-item.component';

//import { ConfirmationDialogModule } from './customcomponent/confirmation-dialog/confirmation-dialog.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VendorAccountComponent } from './components/vendoraccount.component';
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
        NgbModule,
        SiteInfoModule,
        CustomerServiceModule,
        BrowserAnimationsModule,
        MyAccountModule,
        //ConfirmationDialogModule
        
    ],
    declarations: [AppComponent, HomeComponent, MenComponent, WomenComponent, ProductComponent, CategoryComponent, AccordionItemComponent, AccordionComponent, VendorAccountComponent],
    providers: [DataService, MemberShipService, UtilityService, NotificationService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RequestOptions, useClass: AppBaseRequestOptions }],
    bootstrap: [AppComponent]
})
export class AppModule { }

