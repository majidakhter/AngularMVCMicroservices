import { AuthInterceptor } from './auth.interceptor';

describe('Auth.InterceptorService', () => {
  const config = {
    login_url: 'Login Url',
    org_level: 'Org Level',
    was_url: 'Was Url',
    token_url: 'Token Url'
  };

  describe('#intercept', () => {
    let request;
    let handler;
    beforeEach(() => {
      request = jasmine.createSpyObj('HttpRequest', ['setHeaders']);
      request.clone = jasmine.createSpy('clone').and.returnValue(request);
      handler = jasmine.createSpyObj('HttpHandler', ['handle']);
      handler.handle = jasmine.createSpy('handle');
    });
    it('should not change login call', () => {
      request.url = config.login_url;
      new AuthInterceptor(config).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.setHeaders).not.toHaveBeenCalled();
    });
    it('should not change WAS url call', () => {
      request.url = config.was_url;
      new AuthInterceptor(config).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.setHeaders).not.toHaveBeenCalled();
    });
    it('should not change WAS token url', () => {
      request.url = config.token_url;
      new AuthInterceptor(config).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.setHeaders).not.toHaveBeenCalled();
      sessionStorage.setItem('token', 'jwt token');
    });
    it('should change other calls', () => {
      request.url = config.org_level;
      sessionStorage.setItem('token', 'jwt token');
      new AuthInterceptor(config).intercept(request, handler);
      expect(handler.handle).toHaveBeenCalledWith(request);
      expect(request.clone).toHaveBeenCalledWith({ setHeaders: { Authorization: 'jwt token' } });
    });
  });
});
