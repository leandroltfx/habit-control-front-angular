import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { UserRegistrationAdapterService } from './user-registration-adapter.service';
import { UserRegistrationRequestContract } from '../../../../shared/contracts/user-registration/request/user-registration-request-contract';
import { UserRegistrationResponseContract } from '../../../../shared/contracts/user-registration/response/user-registration-response-contract';
import { UserRegistrationResponseDto } from '../../../../shared/dto/user-registration/user-registration-response-dto';
import { UserRegistrationErrorResponseDto } from '../../../../shared/dto/user-registration/error/user-registration-error-response-dto';

describe('UserRegistrationAdapterService', () => {
  let userRegistrationAdapterService: UserRegistrationAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserRegistrationAdapterService,
      ]
    });
    userRegistrationAdapterService = TestBed.inject(UserRegistrationAdapterService);
  });

  it('should be created', () => {
    expect(userRegistrationAdapterService).toBeTruthy();
  });

  it('deve montar a requisição do cadastro de usuário', () => {

    const email: string = 'admin@email.com';
    const password: string = 'admin123';
    const username: string = 'username';

    const userRegistrationRequestContract = userRegistrationAdapterService.toUserRegistrationRequestContract(username, email, password);

    expect(userRegistrationRequestContract instanceof UserRegistrationRequestContract).toBeTrue();
    expect(userRegistrationRequestContract.email).toBe('admin@email.com');
    expect(userRegistrationRequestContract.password).toBe('admin123');
  });

  it('deve montar o DTO a partir da resposta de sucesso do cadastro de usuário', () => {

    const userRegistrationResponseContract: UserRegistrationResponseContract = {
      message: 'Usuário cadastrado com sucesso!',
      user: {
        email: 'admin@email.com',
        username: 'admin',
      }
    };

    const userRegistrationResponseDto = <UserRegistrationResponseDto>userRegistrationAdapterService.toUserRegistrationResponseDto(userRegistrationResponseContract);

    expect(userRegistrationResponseDto instanceof UserRegistrationResponseDto).toBeTrue();
    expect(userRegistrationResponseDto.message).toBe('Usuário cadastrado com sucesso!');
    expect(userRegistrationResponseDto.user.email).toBe('admin@email.com');
    expect(userRegistrationResponseDto.user.username).toBe('admin');
  });

  it('deve montar o DTO a partir da resposta de erro do cadastro de usuário', () => {

    const userRegistrationResponseError: HttpErrorResponse = new HttpErrorResponse({ error: { message: 'Ocorreu um erro no cadastro de usuário, tente novamente mais tarde.' } });

    const userRegistrationResponseDto = <UserRegistrationErrorResponseDto>userRegistrationAdapterService.toUserRegistrationErrorResponseDto(userRegistrationResponseError);

    expect(userRegistrationResponseDto instanceof UserRegistrationErrorResponseDto).toBeTrue();
    expect(userRegistrationResponseDto.message).toBe('Ocorreu um erro no cadastro de usuário, tente novamente mais tarde.');
  });

  it('deve montar o DTO a partir da resposta de erro do cadastro de usuário com mensagem de erro genérica', () => {

    const userRegistrationResponseError: HttpErrorResponse = new HttpErrorResponse({ error: {} });

    const userRegistrationResponseDto = <UserRegistrationErrorResponseDto>userRegistrationAdapterService.toUserRegistrationErrorResponseDto(userRegistrationResponseError);

    expect(userRegistrationResponseDto instanceof UserRegistrationErrorResponseDto).toBeTrue();
    expect(userRegistrationResponseDto.message).toBe('Ocorreu um erro, tente novamente mais tarde');
  });
});
