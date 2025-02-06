import { RecoverPasswordResponseContract } from './recover-password-response-contract';

describe('RecoverPasswordResponseContract', () => {
  it('should create an instance', () => {
    expect(new RecoverPasswordResponseContract('message')).toBeTruthy();
  });
});
