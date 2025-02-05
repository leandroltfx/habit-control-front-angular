import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, map, Observable, throwError } from 'rxjs';

import { UserRegistrationProxyService } from '../proxy/user-registration-proxy.service';
import { UserRegistrationAdapterService } from '../adapter/user-registration-adapter.service';
import { UserRegistrationResponseDto } from '../../../../shared/dto/user-registration/user-registration-response-dto';
import { UserRegistrationResponseContract } from '../../../../shared/contracts/user-registration/response/user-registration-response-contract';

@Injectable()
export class UserRegistrationFacadeService {

  constructor(
    private readonly _userRegistrationProxyService: UserRegistrationProxyService,
    private readonly _userRegistrationAdapterService: UserRegistrationAdapterService,
  ) { }

  public registerUser(
    username: string,
    email: string,
    password: string,
  ): Observable<UserRegistrationResponseDto> {
    return this._userRegistrationProxyService.registerUser(
      this._userRegistrationAdapterService.toUserRegistrationRequestContract(username, email, password)
    ).pipe(
      map((userRegistrationResponseContract: UserRegistrationResponseContract) => this._userRegistrationAdapterService.toUserRegistrationResponseDto(userRegistrationResponseContract)),
      catchError((httpErrorResponse: HttpErrorResponse) => throwError(() => this._userRegistrationAdapterService.toUserRegistrationErrorResponseDto(httpErrorResponse))),
    );
  }
}
