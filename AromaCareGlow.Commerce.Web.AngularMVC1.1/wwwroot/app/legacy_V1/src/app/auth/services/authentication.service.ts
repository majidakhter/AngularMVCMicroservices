import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from '../../app.config';
import { Observable } from 'rxjs';
import { EnvironmentService, ILoginUser } from '../../environment/environment.service';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient,
    private envService: EnvironmentService,
    @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  login(loginUser: ILoginUser): Observable<string> {
    //  called if isStandalone
    if (this.envService.isStandalone) {
      const loginPath = this.envService.baseApiPath + this.config.login_url;

      const header = new HttpHeaders({ Authorization: 'Bearer ' + this.envService.auth.accessToken });
      return this.http.post(loginPath, loginUser, {
        headers: header
      }).pipe(
        map(res => `jwt ${res['token']}`)
      );
    }
    return this.getBaseUrl().pipe(concatMap(() => this.getToken()));
  }

  private getBaseUrl(): Observable<any> {
    //  called if !isStandAlone
    return this.http.get(this.config.was_url)
      .pipe(
        map((res: string) => this.envService.baseApiPath = res)
      );
  }

  private getToken(): Observable<string> {
    //  called if !isStandAlone after getBaseUrl
    return this.http.get(this.config.token_url)
      .pipe(
        map(token => `jwt ${token}`)
      );
  }
}
