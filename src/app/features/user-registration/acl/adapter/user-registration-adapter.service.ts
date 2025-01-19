import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { UserRegistrationResponseDto } from '../../../../shared/dto/user-registration/user-registration-response-dto';
import { UserRegistrationErrorResponseDto } from '../../../../shared/dto/user-registration/error/user-registration-error-response-dto';
import { UserRegistrationRequestContract } from '../../../../shared/contracts/user-registration/request/user-registration-request-contract';
import { UserRegistrationResponseContract } from '../../../../shared/contracts/user-registration/response/user-registration-response-contract';

@Injectable()
export class UserRegistrationAdapterService {

  constructor() { }

  public toUserRegistrationRequestContract(
    username: string,
    email: string,
    password: string,
  ): UserRegistrationRequestContract {
    return new UserRegistrationRequestContract(
      username,
      email,
      password,
    );
  }

  public toUserRegistrationResponseDto(
    userRegistrationResponseContract: UserRegistrationResponseContract
  ): UserRegistrationResponseDto {
    return new UserRegistrationResponseDto(
      userRegistrationResponseContract.message,
      userRegistrationResponseContract.user.email,
      userRegistrationResponseContract.user.username,
    );
  }

  public toUserRegistrationErrorResponseDto(
    httpErrorResponse: HttpErrorResponse
  ): UserRegistrationErrorResponseDto {
    return new UserRegistrationErrorResponseDto(
      httpErrorResponse.error['message'] ?? 'Ocorreu um erro, tente novamente mais tarde',
    )
  }
}
