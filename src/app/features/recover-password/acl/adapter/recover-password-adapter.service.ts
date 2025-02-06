import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { RecoverPasswordResponseDto } from '../../../../shared/dto/recover-password/recover-password-response-dto';
import { RecoverPasswordErrorResponseDto } from '../../../../shared/dto/recover-password/error/recover-password-error-response-dto';
import { RecoverPasswordRequestContract } from '../../../../shared/contracts/recover-password/request/recover-password-request-contract';
import { RecoverPasswordResponseContract } from '../../../../shared/contracts/recover-password/response/recover-password-response-contract';

@Injectable()
export class RecoverPasswordAdapterService {

  constructor() { }

  public toRecoverPasswordRequestContract(
    email: string,
  ): RecoverPasswordRequestContract {
    return new RecoverPasswordRequestContract(
      email
    );
  }

  public toRecoverPasswordResponseDto(
    recoverPasswordResponseContract: RecoverPasswordResponseContract
  ): RecoverPasswordResponseDto {
    return new RecoverPasswordResponseDto(
      recoverPasswordResponseContract.message
    );
  }

  public toRecoverPasswordErrorResponseDto(
    httpErrorResponse: HttpErrorResponse
  ): RecoverPasswordErrorResponseDto {
    return new RecoverPasswordErrorResponseDto(
      httpErrorResponse.error['message'] ?? 'Ocorreu um erro, tente novamente mais tarde',
    )
  }
}
