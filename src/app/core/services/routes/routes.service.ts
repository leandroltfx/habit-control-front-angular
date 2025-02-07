import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { RoutesEnum } from '../../../shared/enum/routes.enum';

@Injectable()
export class RoutesService {

  constructor(
    private readonly _router: Router,
  ) { }

  public navigateToLogin(): void {
    this._router.navigate([`/${RoutesEnum.LOGIN}`]);
  }

  public navigateToUserRegistration(): void {
    this._router.navigate([`/${RoutesEnum.USER_REGISTRATION}`]);
  }

  public navigateToRecoverPassword(): void {
    this._router.navigate([`/${RoutesEnum.RECOVER_PASSWORD}`]);
  }

  public navigateToHome(): void {
    this._router.navigate([`/${RoutesEnum.HOME}`]);
  }
}
