import { Selector, State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { Login } from '../actions/auth.actions';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { EnvironmentService } from 'src/app/environment/environment.service';

export interface IAuthModel {
  token: string;
  employeeCode: string;
}

@State<IAuthModel>({
  name: 'auth',
  defaults: {
    token: null,
    employeeCode: 'AdminAmzad'
  }
})
export class AuthState implements NgxsOnInit {
  //  tslint ignore as this property will be used while module is called.
  //  tslint:disable-next-line
  constructor(
    private authService: AuthenticationService,
    private envService: EnvironmentService
  ) {
  }

  @Selector()
  static getToken(state: IAuthModel) {
    return state.token;
  }

  @Selector()
  static getEmployeeCode(state: IAuthModel) {
    return state.employeeCode;
  }

  ngxsOnInit(ctx: StateContext<IAuthModel>) {
    if (ctx.getState().employeeCode === null) {
      //  This is used only for standalone when a code isn't provided by the portal
      ctx.patchState({
        employeeCode: this.envService.loginUser.username
      });
    }
  }

  @Action(Login)
  public login(ctx: StateContext<IAuthModel>, { payload }: Login): Observable<string> {
    return this.authService.login(payload).pipe(
      tap(token => {
        ctx.patchState({
          token: token
        });
      })
    );
  }
}
