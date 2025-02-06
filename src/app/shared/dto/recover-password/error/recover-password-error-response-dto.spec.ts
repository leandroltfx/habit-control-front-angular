import { RecoverPasswordErrorResponseDto } from './recover-password-error-response-dto';

describe('RecoverPasswordErrorResponseDto', () => {
  it('should create an instance', () => {
    expect(new RecoverPasswordErrorResponseDto('message')).toBeTruthy();
  });
});
