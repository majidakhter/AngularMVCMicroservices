import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { APP_CONFIG } from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(APP_CONFIG) private config) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url !== this.config.login_url
      && req.url !== this.config.was_url
      && req.url !== this.config.token_url) {
      req = req.clone({
        setHeaders: { Authorization: sessionStorage.getItem('token') }
      });
    }

    // passing on the modified req object
    return next.handle(req);
  }
}
