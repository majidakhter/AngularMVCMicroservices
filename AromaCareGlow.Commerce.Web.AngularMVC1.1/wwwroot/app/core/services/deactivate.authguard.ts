import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoggerService } from './logger.service';
import { Observable } from 'rxjs';
import { MyAccountComponent } from '../../components/myaccounts';
//@Injectable()
//export class DeActivateAuthGuard implements CanDeactivate<MyAccountComponent> {
//    constructor(private logger: LoggerService) { }

    //canDeactivate(
    //    component: MyAccountComponent,
    //    route: ActivatedRouteSnapshot,
    //    state: RouterStateSnapshot
    //): Observable<boolean> | Promise<boolean> | boolean {

    //    this.logger.log(`CustomerId: ${route.parent.params['id']} URL: ${state.url}`);

        // Check with component to see if we're able to deactivate
        //return component.canDeactivate();
   // }

//}