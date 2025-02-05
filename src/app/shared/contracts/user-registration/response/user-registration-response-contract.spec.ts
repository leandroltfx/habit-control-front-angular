import { UserRegistrationResponseContract } from './user-registration-response-contract';
import { LoggedUserModel } from '../../../../shared/models/logged-user/logged-user-model';

describe('UserRegistrationResponseContract', () => {
  it('should create an instance', () => {
    const user: LoggedUserModel = new LoggedUserModel('admin@email.com', 'admin');
    expect(new UserRegistrationResponseContract('message', user)).toBeTruthy();
  });
});
