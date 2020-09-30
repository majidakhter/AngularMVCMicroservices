import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { APP_CONFIG } from './app.config';
import { Observable } from 'rxjs/internal/Observable';
import { TranslateService } from '@ngx-translate/core';

@Injectable()

export class AppInitializer {
  jwtToken: string;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) private config, public translate: TranslateService) { }

  /**
   * This is the method you want to call at bootstrap
   */
  load() {
    return this.login().toPromise();
  }

  private login(): Observable<any> {
    // called if isStandalone
    if (environment.isStandalone) {
      const header = new HttpHeaders({ Authorization: 'Bearer ' + environment.auth.accessToken });
      return this.http
        .post(this.config.login_url, environment.loginUser, {
          headers: header
        })
        .pipe(
          map((res: any) => {
            this.jwtToken = 'jwt ' + res['token'];
            sessionStorage.setItem('token', this.jwtToken);
          })
        );
    }

    return this.getBaseUrl().pipe(concatMap(() => this.getToken()));
  }

  private getBaseUrl(): Observable<any> {
    // called if !isStandAlone
    return this.http.get(this.config.was_url).pipe(map((res: string) => (environment.baseApiPath = res)));
  }

  private getToken(): Observable<any> {
    // called if !isStandAlone after getBaseUrl
    return this.http.get(this.config.token_url).pipe(
      map(res => {
        this.jwtToken = 'jwt ' + res;
        sessionStorage.setItem('token', `jwt ${res}`);
      })
    );
  }
}
