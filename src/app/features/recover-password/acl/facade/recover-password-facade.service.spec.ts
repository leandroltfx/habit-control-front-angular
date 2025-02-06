import { TestBed } from '@angular/core/testing';

import { RecoverPasswordFacadeService } from './recover-password-facade.service';
import { RecoverPasswordProxyService } from '../proxy/recover-password-proxy.service';
import { RecoverPasswordAdapterService } from '../adapter/recover-password-adapter.service';
import { of, throwError } from 'rxjs';
import { RecoverPasswordResponseContract } from 'src/app/shared/contracts/recover-password/response/recover-password-response-contract';
import { HttpErrorResponse } from '@angular/common/http';

describe('RecoverPasswordFacadeService', () => {
  let recoverPasswordFacadeService: RecoverPasswordFacadeService;
  let recoverPasswordProxyServiceSpy: jasmine.SpyObj<RecoverPasswordProxyService>;
  let recoverPasswordAdapterServiceSpy: jasmine.SpyObj<RecoverPasswordAdapterService>;

  beforeEach(() => {

    recoverPasswordProxyServiceSpy = jasmine.createSpyObj('RecoverPasswordProxyService', ['sendEmail']);
    recoverPasswordAdapterServiceSpy = jasmine.createSpyObj('RecoverPasswordAdapterService', ['toRecoverPasswordRequestContract', 'toRecoverPasswordResponseDto', 'toRecoverPasswordErrorResponseDto']);

    TestBed.configureTestingModule({
      providers: [
        RecoverPasswordFacadeService,
        { provide: RecoverPasswordProxyService, useValue: recoverPasswordProxyServiceSpy },
        { provide: RecoverPasswordAdapterService, useValue: recoverPasswordAdapterServiceSpy },
      ]
    });
    recoverPasswordFacadeService = TestBed.inject(RecoverPasswordFacadeService);
  });

  it('should be created', () => {
    expect(recoverPasswordFacadeService).toBeTruthy();
  });

  it('deve montar a requisição e tratar a resposta de sucesso por meio do adapter', () => {

    const recoverPasswordResponseContract: RecoverPasswordResponseContract = new RecoverPasswordResponseContract(
      'Um link para a recuperação da senha foi enviada para seu email.',
    );
    recoverPasswordProxyServiceSpy.sendEmail.and.returnValue(of(recoverPasswordResponseContract))

    recoverPasswordFacadeService.sendEmail('email@email.com').subscribe(
      {
        next: () => {
          expect(recoverPasswordProxyServiceSpy.sendEmail).toHaveBeenCalled();
          expect(recoverPasswordAdapterServiceSpy.toRecoverPasswordRequestContract).toHaveBeenCalled();
          expect(recoverPasswordAdapterServiceSpy.toRecoverPasswordResponseDto).toHaveBeenCalled();
        }
      }
    );
  });

  it('deve montar a requisição e tratar a resposta de erro por meio do adapter', () => {

    const recoverPasswordResponseError: Partial<HttpErrorResponse> = {
      error: {
        message: 'Ocorreu um erro, tente novamente mais tarde.'
      }
    };
    recoverPasswordProxyServiceSpy.sendEmail.and.returnValue(throwError(() => recoverPasswordResponseError));

    recoverPasswordFacadeService.sendEmail('email@email.com').subscribe(
      {
        error: () => {
          expect(recoverPasswordProxyServiceSpy.sendEmail).toHaveBeenCalled();
          expect(recoverPasswordAdapterServiceSpy.toRecoverPasswordRequestContract).toHaveBeenCalled();
          expect(recoverPasswordAdapterServiceSpy.toRecoverPasswordErrorResponseDto).toHaveBeenCalled();
        }
      }
    );
  });
});
