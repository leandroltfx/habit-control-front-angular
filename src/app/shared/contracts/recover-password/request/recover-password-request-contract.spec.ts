import { RecoverPasswordRequestContract } from './recover-password-request-contract';

describe('RecoverPasswordRequestContract', () => {
  it('should create an instance', () => {
    expect(new RecoverPasswordRequestContract('email@email.com')).toBeTruthy();
  });
});
