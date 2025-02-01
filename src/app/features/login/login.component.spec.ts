import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { LoginFacadeService } from './acl/facade/login-facade.service';
import { LoginResponseDto } from '../../shared/dto/login/login-response-dto';
import { MessageService } from '../../core/services/message/message.service';
import { LoginErrorResponseDto } from '../../shared/dto/login/error/login-error-response-dto';

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let loginFacadeServiceSpy: jasmine.SpyObj<LoginFacadeService>;
  
  beforeEach(() => {

    loginFacadeServiceSpy = jasmine.createSpyObj('LoginFacadeService', ['login']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['showMessage']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,

        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
      ],
      providers: [
        { provide: LoginFacadeService, useValue: loginFacadeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(loginComponent).toBeTruthy();
  });

  it('deve fazer login se o formulário estiver preenchido', () => {

    const loginResponseDto: LoginResponseDto = new LoginResponseDto(
      'Login efetuado com sucesso!',
      'admin@mail.com',
      'admin'
    );
    loginFacadeServiceSpy.login.and.returnValue(of(loginResponseDto));

    loginComponent.loginForm = loginComponent['_buildLoginForm']();

    loginComponent.loginForm.controls['email'].setValue('email@email.com');
    loginComponent.loginForm.controls['password'].setValue('password');

    loginComponent.login();

    expect(loginFacadeServiceSpy.login).toHaveBeenCalledWith('email@email.com', 'password');
    expect(messageServiceSpy.showMessage).toHaveBeenCalledWith('Login efetuado com sucesso!', 'success');
  });

  it('deve disparar mensagem de erro se der erro no login', () => {

    const loginResponseError: LoginErrorResponseDto = new LoginErrorResponseDto(
      'Ocorreu um erro no login, tente novamente mais tarde.',
    );
    loginFacadeServiceSpy.login.and.returnValue(throwError(() => loginResponseError));

    loginComponent.loginForm = loginComponent['_buildLoginForm']();

    loginComponent.loginForm.controls['email'].setValue('email@email.com');
    loginComponent.loginForm.controls['password'].setValue('password');

    loginComponent.login();

    expect(loginFacadeServiceSpy.login).toHaveBeenCalledWith('email@email.com', 'password');
    expect(messageServiceSpy.showMessage).toHaveBeenCalledWith('Ocorreu um erro no login, tente novamente mais tarde.', 'error');
  });

  it('não deve fazer login se não preencher o email', () => {

    loginComponent.loginForm = loginComponent['_buildLoginForm']();

    loginComponent.loginForm.controls['email'].setValue('');
    loginComponent.loginForm.controls['password'].setValue('password');

    loginComponent.login();

    expect(loginFacadeServiceSpy.login).not.toHaveBeenCalled();
    expect(messageServiceSpy.showMessage).not.toHaveBeenCalled();
  });

  it('não deve fazer login se não preencher a senha', () => {

    loginComponent.loginForm = loginComponent['_buildLoginForm']();

    loginComponent.loginForm.controls['email'].setValue('email@email.com');
    loginComponent.loginForm.controls['password'].setValue('');

    loginComponent.login();

    expect(loginFacadeServiceSpy.login).not.toHaveBeenCalled();
    expect(messageServiceSpy.showMessage).not.toHaveBeenCalled();
  });

  it('não deve fazer login se não preencher o formulário', () => {

    loginComponent.loginForm = loginComponent['_buildLoginForm']();

    loginComponent.loginForm.controls['email'].setValue('');
    loginComponent.loginForm.controls['password'].setValue('');

    loginComponent.login();

    expect(loginFacadeServiceSpy.login).not.toHaveBeenCalled();
    expect(messageServiceSpy.showMessage).not.toHaveBeenCalled();
  });
});
