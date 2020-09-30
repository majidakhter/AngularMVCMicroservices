import { IAppConfig } from 'src/app/app.config';
import { AuthInterceptor } from './auth.interceptor';
import { Store } from '@ngxs/store';

describe('Auth.InterceptorService', () => {
  const config: IAppConfig = {
    was_url: 'Was Url',
    token_url: 'Token Url',
    web_service_url: 'Web Url',
    user_url: 'User Url',
    login_url: 'Login Url'
  };

  describe('#intercept', () => {
    let request;
    let handler;
    let mockStore: jasmine.SpyObj<Store>;

    beforeEach(() => {
      request = jasmine.createSpyObj('HttpRequest', ['setHeaders']);
      request.clone = jasmine.createSpy('clone').and.returnValue(request);
      handler = jasmine.createSpyObj('HttpHandler', ['handle']);
      handler.handle = jasmine.createSpy('handle');
      mockStore = jasmine.createSpyObj('Store', ['selectSnapshot']);
      mockStore.selectSnapshot.and.returnValue('jwt token');
    });

    it('should not change login call', () => {
      request.url = config.login_url;
      new AuthInterceptor(config, mockStore).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.setHeaders).not.toHaveBeenCalled();
    });

    it('should not change was url call', () => {
      request.url = config.was_url;
      new AuthInterceptor(config, mockStore).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.setHeaders).not.toHaveBeenCalled();
    });

    it('should not change was token url', () => {
      request.url = config.token_url;
      new AuthInterceptor(config, mockStore).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.setHeaders).not.toHaveBeenCalled();
      sessionStorage.setItem('token', 'jwt token');
    });

    it('should change other calls', () => {
      request.url = config.web_service_url;
      new AuthInterceptor(config, mockStore).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.clone).toHaveBeenCalledWith({ setHeaders: { Authorization: 'jwt token' } });
    });
  });
});
