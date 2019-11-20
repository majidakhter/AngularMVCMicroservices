import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MemberShipService } from './membership.service';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: MemberShipService, private router: Router) {

    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }
    checkLogin(url: string): boolean {
        if (this.authService.isUserAuthenticated()) { return true; }

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;

        // Navigate to the login page with extras
        this.router.navigate(['/accounts/login']);
        return false;
    }
   
}