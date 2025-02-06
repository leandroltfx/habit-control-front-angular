import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, map, Observable, throwError } from 'rxjs';

import { RecoverPasswordRequestContract } from '../../../../shared/contracts/recover-password/request/recover-password-request-contract';
import { RecoverPasswordResponseContract } from '../../../../shared/contracts/recover-password/response/recover-password-response-contract';

@Injectable()
export class RecoverPasswordProxyService {

  private _basePathBackMockoon: string = 'http://localhost:3000';

  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  public sendEmail(
    recoverPasswordRequestContract: RecoverPasswordRequestContract,
  ): Observable<RecoverPasswordResponseContract> {
    return this._httpClient.post<RecoverPasswordResponseContract>(
      `${this._basePathBackMockoon}/recover-password`,
      recoverPasswordRequestContract
    ).pipe(
      map((recoverPasswordResponseContract: RecoverPasswordResponseContract) => recoverPasswordResponseContract),
      catchError((httpErrorResponse: HttpErrorResponse) => throwError(() => httpErrorResponse)),
    )
  }
}
