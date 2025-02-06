import { RecoverPasswordResponseDto } from './recover-password-response-dto';

describe('RecoverPasswordResponseDto', () => {
  it('should create an instance', () => {
    expect(new RecoverPasswordResponseDto('message')).toBeTruthy();
  });
});
