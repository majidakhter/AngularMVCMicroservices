import { ILoginUser } from 'src/app/environment/environment.service';

export class Login {
  static readonly type = '[Auth] Login';

  constructor(public payload: ILoginUser) { }
}
