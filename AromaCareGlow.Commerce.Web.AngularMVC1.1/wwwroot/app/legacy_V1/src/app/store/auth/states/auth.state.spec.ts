import { NgxsModule, Store, StateContext } from '@ngxs/store';
import { async, TestBed } from '@angular/core/testing';
import { AuthState, IAuthModel } from './auth.state';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { Login } from '../actions/auth.actions';
import { of } from 'rxjs';
import { EnvironmentService } from 'src/app/environment/environment.service';

describe('AuthState', () => {
  let store: Store;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let envServiceMock: EnvironmentService;

  beforeEach(async(() => {
    authService = jasmine.createSpyObj('authenticationService', ['login']);
    authService.login.and.returnValue(of('jwt tokenValue'));

    envServiceMock = {
      loginUser: {
        username: 'testemployee'
      }
    } as EnvironmentService;

    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([AuthState], { developmentMode: true })
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService, multi: false },
        { provide: EnvironmentService, useValue: envServiceMock }
      ]
    });
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
  });

  describe('When initializing the state when employee code is preloaded from storage', () => {
    let stateMock: jasmine.SpyObj<StateContext<IAuthModel>>;
    beforeEach(() => {
      const authState = new AuthState(authService, envServiceMock);
      stateMock = jasmine.createSpyObj('StateContext', ['getState', 'patchState']);
      stateMock.getState.and.returnValue({
        employeeCode: 'SessionStoredEmployeeCode'
      });

      authState.ngxsOnInit(stateMock);
    });

    it('should persist the employee code set in storage', () => {
      expect(stateMock.patchState).not.toHaveBeenCalled();
    });
  });

  describe('Token', () => {
    describe('when token is null', () => {
      let token: string;

      beforeEach(() => {
        token = AuthState.getToken({
          token: null,
          employeeCode: null
        });
      });
      it('should return null by default', () => {
        expect(token).toBeNull();
      });
    });

    describe('when token is set', () => {
      let token: string;
      const mockToken = 'jwt tokenValue';
      beforeEach(() => {
        token = AuthState.getToken({
          token: mockToken,
          employeeCode: null
        });
      });

      it('should return set value', () => {
        expect(token).toEqual(mockToken);
      });
    });

    describe('when logging in', () => {
      let dispatch;
      beforeEach(() => {
        dispatch = store.dispatch(new Login({ username: 'user', password: 'password', timeout: '1:00:00' }));
      });

      it('should be set to new token value', (done) => {
        dispatch.subscribe(state => {
          expect(state.auth.token).toEqual('jwt tokenValue');
          done();
        });
      });
    });
  });

  describe('EmployeeCode', () => {
    describe('when employeeCode is allowed to set to default', () => {
      let resultEmployeeCode: string;
      beforeEach(() => {
        resultEmployeeCode = store.selectSnapshot(AuthState.getEmployeeCode);
      });

      it('should get the default value based on the environment service', () => {
        expect(resultEmployeeCode).toBe(envServiceMock.loginUser.username);
      });
    });

    describe('when employeeCode is not set', () => {
      let employeeCode: string;
      beforeEach(() => {
        employeeCode = AuthState.getEmployeeCode({
          token: null,
          employeeCode: undefined
        });
      });
      it('should return undefined', () => {
        expect(employeeCode).toBeUndefined();
      });
    });

    describe('when employeeCode is set', () => {
      let employeeCode: string;
      const mockEmployeeCode = 'emp123';
      beforeEach(() => {
        employeeCode = AuthState.getEmployeeCode({
          token: null,
          employeeCode: mockEmployeeCode
        });
      });

      it('should return set value', () => {
        expect(employeeCode).toEqual(mockEmployeeCode);
      });
    });
  });
});
