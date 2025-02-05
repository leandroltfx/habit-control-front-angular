import { UserRegistrationResponseDto } from './user-registration-response-dto';

describe('UserRegistrationResponseDto', () => {
  it('should create an instance', () => {
    expect(new UserRegistrationResponseDto('message', 'admin@email.com', 'Admin')).toBeTruthy();
  });
});
