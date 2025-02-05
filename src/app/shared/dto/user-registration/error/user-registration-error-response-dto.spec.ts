import { UserRegistrationErrorResponseDto } from './user-registration-error-response-dto';

describe('UserRegistrationErrorResponseDto', () => {
  it('should create an instance', () => {
    expect(new UserRegistrationErrorResponseDto('error')).toBeTruthy();
  });
});
