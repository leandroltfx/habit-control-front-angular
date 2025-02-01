import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginResponseDto } from '../../../../shared/dto/login/login-response-dto';
import { LoginErrorResponseDto } from '../../../../shared/dto/login/error/login-error-response-dto';
import { LoginRequestContract } from '../../../../shared/contracts/login/request/login-request-contract';
import { LoginResponseContract } from '../../../../shared/contracts/login/response/login-response-contract';

@Injectable()
export class LoginAdapterService {

  constructor() { }

  public toLoginRequestContract(email: string, password: string): LoginRequestContract {
    return new LoginRequestContract(email, password);
  }

  public toLoginResponseDto(
    loginResponseContract: LoginResponseContract,
  ): LoginResponseDto {
    return new LoginResponseDto(
      loginResponseContract.message,
      loginResponseContract.user.email,
      loginResponseContract.user.username,
    );
  }

  public toLoginErrorResponseDto(
    httpErrorResponse: HttpErrorResponse
  ): LoginErrorResponseDto {
    return new LoginErrorResponseDto(
      httpErrorResponse.error['message'] ?? 'Ocorreu um erro, tente novamente mais tarde',
    )
  }
}
