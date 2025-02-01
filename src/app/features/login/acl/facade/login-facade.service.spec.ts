import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { LoginFacadeService } from './login-facade.service';
import { LoginProxyService } from '../proxy/login-proxy.service';
import { LoginAdapterService } from '../adapter/login-adapter.service';
import { LoginResponseContract } from '../../../../shared/contracts/login/response/login-response-contract';

describe('LoginFacadeService', () => {
  let loginFacadeService: LoginFacadeService;
  let loginProxyServiceSpy: jasmine.SpyObj<LoginProxyService>;
  let loginAdapterServiceSpy: jasmine.SpyObj<LoginAdapterService>;

  beforeEach(() => {

    loginProxyServiceSpy = jasmine.createSpyObj('LoginProxyService', ['login']);
    loginAdapterServiceSpy = jasmine.createSpyObj('LoginAdapterService', ['toLoginRequestContract', 'toLoginResponseDto', 'toLoginErrorResponseDto']);

    TestBed.configureTestingModule({
      providers: [
        LoginFacadeService,
        { provide: LoginAdapterService, useValue: loginAdapterServiceSpy },
        { provide: LoginProxyService, useValue: loginProxyServiceSpy }
      ]
    });
    loginFacadeService = TestBed.inject(LoginFacadeService);
  });

  it('should be created', () => {
    expect(loginFacadeService).toBeTruthy();
  });

  it('deve montar a requisição e tratar a resposta de sucesso por meio do adapter', () => {

    const loginResponseContract: LoginResponseContract = new LoginResponseContract(
      'Login efetuado com sucesso!',
      {
        email: 'admin@email.com',
        username: 'admin'
      }
    );
    loginProxyServiceSpy.login.and.returnValue(of(loginResponseContract))

    loginFacadeService.login('email@email.com', 'admin123').subscribe(
      {
        next: () => {
          expect(loginProxyServiceSpy.login).toHaveBeenCalled();
          expect(loginAdapterServiceSpy.toLoginRequestContract).toHaveBeenCalled();
          expect(loginAdapterServiceSpy.toLoginResponseDto).toHaveBeenCalled();
        }
      }
    );
  });

  it('deve montar a requisição e tratar a resposta de erro por meio do adapter', () => {

    const loginResponseError: Partial<HttpErrorResponse> = {
      error: {
        message: 'Ocorreu um erro no login, tente novamente mais tarde.'
      }
    };
    loginProxyServiceSpy.login.and.returnValue(throwError(() => loginResponseError));

    loginFacadeService.login('email@email.com', 'admin123').subscribe(
      {
        error: () => {
          expect(loginProxyServiceSpy.login).toHaveBeenCalled();
          expect(loginAdapterServiceSpy.toLoginRequestContract).toHaveBeenCalled();
          expect(loginAdapterServiceSpy.toLoginErrorResponseDto).toHaveBeenCalled();
        }
      }
    );
  });
});
