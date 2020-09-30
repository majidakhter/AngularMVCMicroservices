import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG, IAppConfig } from '../../app.config';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/states/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    private store: Store
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!(req.url.endsWith(this.config.login_url)
      || req.url === this.config.was_url
      || req.url === this.config.token_url)) {
      req = req.clone({
        setHeaders: {
          Authorization: this.store.selectSnapshot<string>(AuthState.getToken)
        }
      });
    }

    return next.handle(req);
  }
}
