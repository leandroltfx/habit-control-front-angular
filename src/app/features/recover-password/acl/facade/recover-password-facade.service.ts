import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, map, Observable, throwError } from 'rxjs';

import { RecoverPasswordProxyService } from '../proxy/recover-password-proxy.service';
import { RecoverPasswordAdapterService } from '../adapter/recover-password-adapter.service';
import { RecoverPasswordResponseDto } from '../../../../shared/dto/recover-password/recover-password-response-dto';
import { RecoverPasswordResponseContract } from '../../../../shared/contracts/recover-password/response/recover-password-response-contract';

@Injectable()
export class RecoverPasswordFacadeService {

  constructor(
    private readonly _recoverPasswordProxyService: RecoverPasswordProxyService,
    private readonly _recoverPasswordAdapterService: RecoverPasswordAdapterService,
  ) { }

  public sendEmail(
    email: string
  ): Observable<RecoverPasswordResponseDto> {
    return this._recoverPasswordProxyService.sendEmail(
      this._recoverPasswordAdapterService.toRecoverPasswordRequestContract(email)
    ).pipe(
      map((recoverPasswordResponseContract: RecoverPasswordResponseContract) => this._recoverPasswordAdapterService.toRecoverPasswordResponseDto(recoverPasswordResponseContract)),
      catchError((httpErrorResponse: HttpErrorResponse) => throwError(() => this._recoverPasswordAdapterService.toRecoverPasswordErrorResponseDto(httpErrorResponse))),
    )
  }
}
