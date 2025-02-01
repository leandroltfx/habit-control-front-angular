import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, map, Observable, throwError } from 'rxjs';

import { LoginRequestContract } from '../../../../shared/contracts/login/request/login-request-contract';
import { LoginResponseContract } from '../../../../shared/contracts/login/response/login-response-contract';

@Injectable()
export class LoginProxyService {

  private _basePathBackMockoon: string = 'http://localhost:3000';

  constructor(
    private readonly _httpClient: HttpClient,
  ) { }

  public login(
    loginRequestContract: LoginRequestContract,
  ): Observable<LoginResponseContract> {
    return this._httpClient.post<LoginResponseContract>(
      `${this._basePathBackMockoon}/login`,
      loginRequestContract
    ).pipe(
      map((loginResponseContract: LoginResponseContract) => loginResponseContract),
      catchError((httpErrorResponse: HttpErrorResponse) => throwError(() => httpErrorResponse)),
    );
  }
}
