import { LoginErrorResponseDto } from './login-error-response-dto';

describe('LoginErrorResponseDto', () => {
  it('should create an instance', () => {
    expect(new LoginErrorResponseDto('erro')).toBeTruthy();
  });
});
