import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Login } from 'src/app/store/auth/actions/auth.actions';

@Component({
  selector: 'wf-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store,
    private translate: TranslateService,
    private environment: EnvironmentService,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics // tslint:disable-line:no-unused-variable
  ) { }
  subscribeToLogin: Subscription;
  loginSuccess = false;

  private currentCodeSeries: IKeySeriesMap[] = [];

  ngOnInit(): void {
    this.subscribeToLogin = this.store.dispatch(new Login(this.environment.loginUser)).subscribe(() => {
      this.loginSuccess = true;
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const SecretKeyCodes: IKeySeriesMap[] = [
      {
        keyCodeSeries: [
          'arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'backspace'
        ],
        action: () => {
          const employeeScreenPath = 'EmployeeLoad.aspx?redirect=TCS.aspx';
          const topPath = top.location.href.substr(0, top.location.href.lastIndexOf('/') + 1);
          (top as any).Root().NavigateTo(topPath + employeeScreenPath);
        }
      }
    ];

    this.currentCodeSeries = [...this.currentCodeSeries, ...SecretKeyCodes]
      .filter(series => series.keyCodeSeries[0] === event.key.toLowerCase())
      .map(series => ({
        keyCodeSeries: [...series.keyCodeSeries].splice(1, series.keyCodeSeries.length - 1),
        action: series.action
      }))
      .filter(series => {
        if (series.keyCodeSeries.length === 0) {
          series.action();
          return false;
        }
        return true;
      });
  }

  /* istanbul ignore next */
  ngOnDestroy() {
  }
}

interface IKeySeriesMap {
  keyCodeSeries: string[];
  action: () => void;
}
