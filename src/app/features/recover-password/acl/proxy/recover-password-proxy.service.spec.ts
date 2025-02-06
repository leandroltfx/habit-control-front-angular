import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RecoverPasswordProxyService } from './recover-password-proxy.service';
import { RecoverPasswordRequestContract } from '../../../../shared/contracts/recover-password/request/recover-password-request-contract';
import { RecoverPasswordResponseContract } from '../../../../shared/contracts/recover-password/response/recover-password-response-contract';

describe('RecoverPasswordProxyService', () => {
  let recoverPasswordProxyService: RecoverPasswordProxyService;
  let httpMock: HttpTestingController;

  const recoverPasswordRequestContract: RecoverPasswordRequestContract = {
    email: 'admin@email.com',
  };

  const recoverPasswordResponseContract: RecoverPasswordResponseContract = {
    message: 'Login efetuado com sucesso!',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecoverPasswordProxyService]
    });

    recoverPasswordProxyService = TestBed.inject(RecoverPasswordProxyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(recoverPasswordProxyService).toBeTruthy();
  });

  it('deve retornar uma resposta com sucesso quando a requisição for bem-sucedida', () => {

    recoverPasswordProxyService.sendEmail(recoverPasswordRequestContract).subscribe((response: RecoverPasswordResponseContract) => {
      expect(response).toEqual(recoverPasswordResponseContract);
    });

    const req = httpMock.expectOne('http://localhost:3000/recover-password');
    expect(req.request.method).toBe('POST');
    req.flush(recoverPasswordResponseContract);
  });

  it('deve tratar erro HTTP quando a requisição falhar', () => {

    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
    });

    recoverPasswordProxyService.sendEmail(recoverPasswordRequestContract).subscribe({
      next: () => fail('esperava um erro, mas o sucesso ocorreu'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/recover-password');
    expect(req.request.method).toBe('POST');
    req.flush('', errorResponse);
  });
});
