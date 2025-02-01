import { LoggedUserModel } from './logged-user-model';

describe('LoggedUserModel', () => {
  it('should create an instance', () => {
    expect(new LoggedUserModel('admin@email.com', 'admin')).toBeTruthy();
  });
});
