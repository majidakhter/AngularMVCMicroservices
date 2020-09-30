import { AuthModule } from './auth.module';
import { ModuleWithProviders } from '@angular/core';

describe('AuthModule', () => {
  let authModule: AuthModule;
  let moduleForRoot: ModuleWithProviders;

  beforeEach(() => {
    authModule = new AuthModule();
    moduleForRoot = AuthModule.forRoot();
  });

  it('should create an instance', () => {
    expect(authModule).toBeTruthy();
    expect(moduleForRoot).toBeTruthy();
  });
});
