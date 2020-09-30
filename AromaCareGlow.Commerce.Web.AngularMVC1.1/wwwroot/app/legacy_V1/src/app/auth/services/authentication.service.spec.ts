import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from '../../app.config';
import { EnvironmentService } from 'src/app/environment/environment.service';
import { HttpClient } from '@angular/common/http';

describe('AuthenticationService', () => {
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let mockEnvironment: EnvironmentService;
  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    mockEnvironment = {
      loginUser: {
        username: 'TestUser',
        password: 'password',
        timeout: '12'
      },
      baseApiPath: '',
      isLocal: true,
      isStandalone: true,
      auth: {
        clientId: '1ee3c715-c817-4c98-b023-c771dfd31e05',
        clientSecret: 'PIfevVI4uCpQM6CyR+91h4Bi58BVAeCJT8sKf7hLxLI=',
        realm: 'https:// localhost:44308',
        directory: '7e652abe-8af5-464f-a272-9c4c5d6a9170',
        //  tslint:disable-next-line:max-line-length
        accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik4tbEMwbi05REFMcXdodUhZbkhRNjNHZUNYYyIsImtpZCI6Ik4tbEMwbi05REFMcXdodUhZbkhRNjNHZUNYYyJ9.eyJhdWQiOiJodHRwczovL2FwaWF6dXJlZGV2Z2Uub25taWNyb3NvZnQuY29tL3RtL3dlYi1zZXJ2aWNlcyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzE0N2EyYjcxLTVjZTktNDkzMy05NGM0LTIwNTQzMjhkZTU2NS8iLCJpYXQiOjE1NTUzMjA5NjksIm5iZiI6MTU1NTMyMDk2OSwiZXhwIjoxNTU1MzI0ODY5LCJhaW8iOiI0MlpnWU5DZWVYRHphYjBwUjZ4enYvNmFlMmVDSXdBPSIsImFwcGlkIjoiYWIyODNkYmQtY2VmOC00YTQzLWI4OWYtOTRmMzg2ZTY0MDkzIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTQ3YTJiNzEtNWNlOS00OTMzLTk0YzQtMjA1NDMyOGRlNTY1LyIsIm9pZCI6IjI0MTNkMjQ3LWMwOTgtNDNlMi1hOWNhLTk0NGU3MzgzZTA5MiIsInN1YiI6IjI0MTNkMjQ3LWMwOTgtNDNlMi1hOWNhLTk0NGU3MzgzZTA5MiIsInRpZCI6IjE0N2EyYjcxLTVjZTktNDkzMy05NGM0LTIwNTQzMjhkZTU2NSIsInV0aSI6IkMtNjB0YVJXOFVhOTB0aEZERzFZQUEiLCJ2ZXIiOiIxLjAifQ.F5Uc5kaW_D2-Q5bZctcz1_9SvqhZzB5bVNxaCCdkQJaom6IRz2MqymUJmzpWGZbiQTIJlU3LKSfFSmerbMZxdLt3_aGF5BJlM1GXj5-rf2e7zWz7uvcrh5Ae8dZ8h1UqhIBc81sE4H49hHeH4fZ4e-eYu0jGNjVH7N4CnW1J5Kr9IJ-7zHfJMKwvh_6-Mya41b_9NfXcChzio68D1ynXLDFzNbAJ4eZog1-Wdn0kA8AC_nb0GdyKF7XH0na13DJsk-8X92Uam8e4FvJgEuB89oTWlulaCikFsVH0Ki5Jp0rc_F0qSS1MgRa2XVdtwQtsUDiuD3ejV4x6dfHjV7T9BA',
        tokenRequested: ''
      }
    };
  });
  const config = AppConfig;

  const createService = (): AuthenticationService => {
    mockEnvironment.baseApiPath = '';
    return new AuthenticationService(mockHttpClient, mockEnvironment, config);
  };

  describe('#login', () => {
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
        mockEnvironment.isStandalone = true;
      });

      it('should set the token, payRulesConfig, and org hierarchy', (done) => {
        createService().login(mockEnvironment.loginUser).subscribe((result) => {
          expect(result).toEqual('jwt tokenValue');
          done();
        });
      });
    });

    describe('when environment is not standalone', () => {
      beforeEach(() => {
        mockHttpClient.get.calls.reset();
        mockEnvironment.isStandalone = false;
      });

      it('should set the token, payRulesConfig, org hierarchy, and baseApiPath', (done) => {
        createService().login(mockEnvironment.loginUser).subscribe((result) => {
          expect(result).toEqual('jwt tokenValue');
          done();
        });
      });
    });
  });
});
