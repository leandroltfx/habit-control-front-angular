import { LoginResponseContract } from './login-response-contract';
import { LoggedUserModel } from '../../../../shared/models/logged-user/logged-user-model';

describe('LoginResponseContract', () => {
  it('should create an instance', () => {
    const user: LoggedUserModel = new LoggedUserModel('admin@email.com', 'admin');
    expect(new LoginResponseContract('message', user)).toBeTruthy();
  });
});
