import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RoutesEnum } from '../../shared/enum/routes.enum';
import { LoginFacadeService } from './acl/facade/login-facade.service';
import { RoutesService } from '../../core/services/routes/routes.service';
import { MessageService } from '../../core/services/message/message.service';
import { LoginResponseDto } from '../../shared/dto/login/login-response-dto';
import { LoginErrorResponseDto } from '../../shared/dto/login/error/login-error-response-dto';

@Component({
  selector: 'hc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public hidePassword: boolean = true;

  constructor(
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly _routesService: RoutesService,
    private readonly _messageService: MessageService,
    private readonly _loginFacadeService: LoginFacadeService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this._buildLoginForm();
  }

  public login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;
      this._loginFacadeService.login(
        email,
        password,
      ).subscribe(
        {
          next: (loginResponseDto: LoginResponseDto) => {
            this._messageService.showMessage(loginResponseDto.message, 'success');
            this._routesService.navigateToHome();
          },
          error: (loginErrorResponseDto: LoginErrorResponseDto) => this._messageService.showMessage(loginErrorResponseDto.message, 'error'),
        }
      );
    }
  }

  public navigateToRecoverPassword(): void {
    this._routesService.navigateToRecoverPassword();
  }

  public navigateToUserRegistration(): void {
    this._routesService.navigateToUserRegistration();
  }

  private _buildLoginForm(): FormGroup {
    return this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

}
