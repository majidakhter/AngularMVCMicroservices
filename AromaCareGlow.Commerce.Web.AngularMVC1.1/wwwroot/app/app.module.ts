import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Headers, RequestOptions, BaseRequestOptions } from '@angular/http';

import { HomeComponent, MenComponent, WomenComponent, ProductComponent, CategoryComponent, VendorAccountComponent } from './components/index';
import { AccordionComponent, AccordionItemComponent } from './customcomponent/index';
import { AppComponent } from './app.component';
import { DataService, MemberShipService, UtilityService, NotificationService, Configuration, AuthGuard, ShoppingCartService, ShoppingCartWrapperService, StorageService } from './core/services/index';

import { AccountModule } from './components/accounts/account.module';
import { MyAccountModule } from './components/myaccounts/myaccont.module';
import { SiteInfoModule } from './components/siteinformation/siteinfo.module';
import { CustomerServiceModule } from './components/customerservices/customerservice.module';
import { MapModule } from './customcomponent/map-component/map.module';
//import { ToolTipModule } from './customcomponent/tooltip-component/tooltip.module';
import { OverlayModule } from '@angular/cdk/overlay';
//import { ToolTipDirective } from './customcomponent/tooltip-component/tooltip.directive';
//import { TooltipOverlayComponent } from './customcomponent/tooltipoverlay-component/tooltipoverlay.component';
//import { Tooltipdirective } from './customcomponent/tooltipoverlay-component/tooltipoverlay.directive';
import { PreloadModulesStrategy } from './core/stratagies/preload-modules.strategy';
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
        AccountModule,
        NgbModule,
        SiteInfoModule,
        CustomerServiceModule,
        BrowserAnimationsModule,
        MyAccountModule,
        MapModule,
        //ToolTipModule,
        OverlayModule ,
        routing
        //RouterModule.forRoot({ preloadingStrategy: PreloadModulesStrategy })
        //ConfirmationDialogModule
        
    ],
    declarations: [AppComponent, HomeComponent, MenComponent, WomenComponent, ProductComponent, CategoryComponent, AccordionItemComponent, AccordionComponent, VendorAccountComponent],
    providers: [DataService, MemberShipService, UtilityService, NotificationService, Configuration, AuthGuard, ShoppingCartService, ShoppingCartWrapperService, StorageService,
    //PreloadModulesStrategy,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: RequestOptions, useClass: AppBaseRequestOptions }],
    bootstrap: [AppComponent]
})
export class AppModule { }

