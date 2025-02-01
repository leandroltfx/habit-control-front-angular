import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoginProxyService } from './login-proxy.service';
import { LoginRequestContract } from '../../../../shared/contracts/login/request/login-request-contract';
import { LoginResponseContract } from '../../../../shared/contracts/login/response/login-response-contract';

describe('LoginProxyService', () => {
  let loginProxyService: LoginProxyService;

  let httpMock: HttpTestingController;

  const loginRequest: LoginRequestContract = {
    email: 'admin@email.com',
    password: 'admin123',
  };

  const loginResponse: LoginResponseContract = {
    message: 'Login efetuado com sucesso!',
    user: {
      email: 'admin@email.com',
      username: 'username',
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginProxyService],
    });

    loginProxyService = TestBed.inject(LoginProxyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(loginProxyService).toBeTruthy();
  });

  it('deve retornar uma resposta com sucesso quando a requisição for bem-sucedida', () => {

    loginProxyService.login(loginRequest).subscribe((response: LoginResponseContract) => {
      expect(response).toEqual(loginResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    req.flush(loginResponse);
  });

  it('deve tratar erro HTTP quando a requisição falhar', () => {

    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    loginProxyService.login(loginRequest).subscribe({
      next: () => fail('esperava um erro, mas o sucesso ocorreu'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    req.flush('', errorResponse);
  });
});
