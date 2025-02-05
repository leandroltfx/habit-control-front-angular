import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { UserRegistrationFacadeService } from './user-registration-facade.service';
import { UserRegistrationProxyService } from '../proxy/user-registration-proxy.service';
import { UserRegistrationAdapterService } from '../adapter/user-registration-adapter.service';
import { UserRegistrationResponseContract } from '../../../../shared/contracts/user-registration/response/user-registration-response-contract';

describe('UserRegistrationFacadeService', () => {
  let userRegistrationFacadeService: UserRegistrationFacadeService;
  let userRegistrationProxyServiceSpy: jasmine.SpyObj<UserRegistrationProxyService>;
  let userRegistrationAdapterServiceSpy: jasmine.SpyObj<UserRegistrationAdapterService>;

  beforeEach(() => {

    userRegistrationProxyServiceSpy = jasmine.createSpyObj('LoginProxyService', ['registerUser']);
    userRegistrationAdapterServiceSpy = jasmine.createSpyObj('LoginAdapterService', ['toUserRegistrationRequestContract', 'toUserRegistrationResponseDto', 'toUserRegistrationErrorResponseDto']);

    TestBed.configureTestingModule({
      providers: [
        UserRegistrationFacadeService,
        { provide: UserRegistrationAdapterService, useValue: userRegistrationAdapterServiceSpy },
        { provide: UserRegistrationProxyService, useValue: userRegistrationProxyServiceSpy },
      ]
    });
    userRegistrationFacadeService = TestBed.inject(UserRegistrationFacadeService);
  });

  it('should be created', () => {
    expect(userRegistrationFacadeService).toBeTruthy();
  });

  it('deve montar a requisição e tratar a resposta de sucesso por meio do adapter', () => {

    const userRegistrationResponseContract: UserRegistrationResponseContract = new UserRegistrationResponseContract(
      'Usuário cadastrado com sucesso!',
      {
        email: 'admin@email.com',
        username: 'admin'
      }
    );
    userRegistrationProxyServiceSpy.registerUser.and.returnValue(of(userRegistrationResponseContract))

    userRegistrationFacadeService.registerUser('username', 'email@email.com', 'admin123').subscribe(
      {
        next: () => {
          expect(userRegistrationProxyServiceSpy.registerUser).toHaveBeenCalled();
          expect(userRegistrationAdapterServiceSpy.toUserRegistrationRequestContract).toHaveBeenCalled();
          expect(userRegistrationAdapterServiceSpy.toUserRegistrationResponseDto).toHaveBeenCalled();
        }
      }
    );
  });

  it('deve montar a requisição e tratar a resposta de erro por meio do adapter', () => {

    const userRegistrationResponseError: Partial<HttpErrorResponse> = {
      error: {
        message: 'Ocorreu um erro no cadastro de usuário, tente novamente mais tarde.'
      }
    };
    userRegistrationProxyServiceSpy.registerUser.and.returnValue(throwError(() => userRegistrationResponseError));

    userRegistrationFacadeService.registerUser('username', 'email@email.com', 'admin123').subscribe(
      {
        error: () => {
          expect(userRegistrationProxyServiceSpy.registerUser).toHaveBeenCalled();
          expect(userRegistrationAdapterServiceSpy.toUserRegistrationRequestContract).toHaveBeenCalled();
          expect(userRegistrationAdapterServiceSpy.toUserRegistrationErrorResponseDto).toHaveBeenCalled();
        }
      }
    );
  });
});
