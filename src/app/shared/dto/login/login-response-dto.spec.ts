import { LoginResponseDto } from './login-response-dto';

describe('LoginResponseDto', () => {
  it('should create an instance', () => {
    expect(new LoginResponseDto('message', 'admin@email.com', 'Admin')).toBeTruthy();
  });
});
