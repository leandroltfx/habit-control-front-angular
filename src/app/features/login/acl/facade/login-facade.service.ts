import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, map, Observable, throwError } from 'rxjs';

import { LoginProxyService } from '../proxy/login-proxy.service';
import { LoginAdapterService } from '../adapter/login-adapter.service';
import { LoginResponseDto } from '../../../../shared/dto/login/login-response-dto';
import { LoginResponseContract } from '../../../../shared/contracts/login/response/login-response-contract';

@Injectable()
export class LoginFacadeService {

  constructor(
    private readonly _loginProxyService: LoginProxyService,
    private readonly _loginAdapterService: LoginAdapterService,
  ) { }

  public login(
    email: string,
    password: string,
  ): Observable<LoginResponseDto> {
    return this._loginProxyService.login(
      this._loginAdapterService.toLoginRequestContract(email, password)
    ).pipe(
      map((loginResponseContract: LoginResponseContract) => this._loginAdapterService.toLoginResponseDto(loginResponseContract)),
      catchError((httpErrorResponse: HttpErrorResponse) => throwError(() => this._loginAdapterService.toLoginErrorResponseDto(httpErrorResponse))),
    );
  }
}
