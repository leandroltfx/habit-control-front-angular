import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserRegistrationProxyService } from './user-registration-proxy.service';
import { UserRegistrationRequestContract } from '../../../../shared/contracts/user-registration/request/user-registration-request-contract';
import { UserRegistrationResponseContract } from '../../../../shared/contracts/user-registration/response/user-registration-response-contract';

describe('UserRegistrationProxyService', () => {
  let userRegistrationProxyService: UserRegistrationProxyService;
  let httpMock: HttpTestingController;

  const userRegistrationRequestContract: UserRegistrationRequestContract = {
    username: 'username',
    email: 'admin@email.com',
    password: 'admin123',
  };

  const userRegistrationResponseContract: UserRegistrationResponseContract = {
    message: 'Usuário cadastrado com sucesso!',
    user: {
      email: 'admin@email.com',
      username: 'username',
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserRegistrationProxyService],
    });

    userRegistrationProxyService = TestBed.inject(UserRegistrationProxyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(userRegistrationProxyService).toBeTruthy();
  });

  it('deve retornar uma resposta com sucesso quando a requisição for bem-sucedida', () => {

    userRegistrationProxyService.registerUser(userRegistrationRequestContract).subscribe((response: UserRegistrationResponseContract) => {
      expect(response).toEqual(userRegistrationResponseContract);
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('POST');
    req.flush(userRegistrationResponseContract);
  });

  it('deve tratar erro HTTP quando a requisição falhar', () => {

    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    userRegistrationProxyService.registerUser(userRegistrationRequestContract).subscribe({
      next: () => fail('esperava um erro, mas o sucesso ocorreu'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/user');
    expect(req.request.method).toBe('POST');
    req.flush('', errorResponse);
  });
});
