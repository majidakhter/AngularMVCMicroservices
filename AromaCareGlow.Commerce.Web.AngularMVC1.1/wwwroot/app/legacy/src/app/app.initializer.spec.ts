import { of } from 'rxjs/internal/observable/of';
import { environment } from '../environments/environment';
import { AppConfig } from './app.config';
import { AppInitializer } from './app.initializer';

describe('AppInitializer', () => {
  const mockHttpClient = jasmine.createSpyObj('HttpClient', ['post', 'get']);
  const config = AppConfig;
  const translate = jasmine.createSpyObj("TranslateService",
    ["getBrowserCultureLang", "setDefaultLang", "use", "defaultLang"]);

  const createService = (): AppInitializer => {
    environment.loginUser = {
      username: 'TestUser',
      password: 'password',
      timeout: '12'
    };
    environment.baseApiPath = '';
    return new AppInitializer(mockHttpClient, config, translate);
  };

  describe('#load', () => {
    beforeEach(() => {
      mockHttpClient.get = jasmine.createSpy('get');
      mockHttpClient.get.and.callFake((url: string) => {
        let response = {};
        if (url === config.was_url) {
          response = 'Base Api Path';
        } else if (url === config.token_url) {
          response = 'tokenValue';
        }
        return of(response);
      });
    });

    describe('when environment is standalone', () => {
      beforeEach(() => {
        mockHttpClient.post = jasmine.createSpy('post');
        mockHttpClient.post.and.returnValue(of({ token: 'tokenValue' }));
        sessionStorage.setItem('token', null);
        environment.isStandalone = true;
      });
      it('should set the token and set browser language', () => {
        createService().load();
        expect(sessionStorage.getItem('token')).toEqual('jwt tokenValue');

      });
    });

    describe('when environment is not standalone', () => {
      beforeEach(() => {
        mockHttpClient.get.calls.reset();
        environment.isStandalone = false;
      });
      it('should set the token', () => {
        createService().load();
        expect(sessionStorage.getItem('token')).toEqual('jwt tokenValue');
        expect(environment.baseApiPath).toEqual('Base Api Path');
      });
    });
  });
});
