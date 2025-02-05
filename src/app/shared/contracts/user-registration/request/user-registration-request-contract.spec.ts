import { UserRegistrationRequestContract } from './user-registration-request-contract';

describe('UserRegistrationRequestContract', () => {
  it('should create an instance', () => {
    expect(new UserRegistrationRequestContract('username', 'email@email.com', 'asd123asd')).toBeTruthy();
  });
});
