import { Router } from '@angular/router';
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

import { UserRegistrationComponent } from './user-registration.component';
import { MessageService } from '../../core/services/message/message.service';
import { UserRegistrationFacadeService } from './acl/facade/user-registration-facade.service';
import { UserRegistrationResponseDto } from '../../shared/dto/user-registration/user-registration-response-dto';
import { UserRegistrationErrorResponseDto } from '../../shared/dto/user-registration/error/user-registration-error-response-dto';

describe('UserRegistrationComponent', () => {
  let userRegistrationComponent: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;
  let userRegistrationFacadeServiceSpy: jasmine.SpyObj<UserRegistrationFacadeService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let router: Router;

  beforeEach(() => {

    userRegistrationFacadeServiceSpy = jasmine.createSpyObj('UserRegistrationFacadeService', ['registerUser']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['showMessage']);

    TestBed.configureTestingModule({
      declarations: [UserRegistrationComponent],
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
        { provide: UserRegistrationFacadeService, useValue: userRegistrationFacadeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    });
    fixture = TestBed.createComponent(UserRegistrationComponent);
    userRegistrationComponent = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(userRegistrationComponent).toBeTruthy();
  });

  it('_buildUserRegistrationForm - deve montar o formulário para cadastro de usuário', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    expect(userRegistrationComponent.userRegistrationForm.controls['username']).toBeDefined();
    expect(userRegistrationComponent.userRegistrationForm.controls['email']).toBeDefined();
    expect(userRegistrationComponent.userRegistrationForm.controls['password']).toBeDefined();
    expect(userRegistrationComponent.userRegistrationForm.controls['confirmPassword']).toBeDefined();
  });

  it('registerUser - deve seguir o fluxo para cadastro de usuário se o formulário estiver válido', () => {

    const navigateSpy = spyOn(router, 'navigate');

    const userRegistrationResponseDto: UserRegistrationResponseDto = new UserRegistrationResponseDto(
      'Usuário cadastrado com sucesso!',
      'admin@mail.com',
      'admin'
    );
    userRegistrationFacadeServiceSpy.registerUser.and.returnValue(of(userRegistrationResponseDto));

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    expect(userRegistrationFacadeServiceSpy.registerUser).toHaveBeenCalledWith('username', 'email@email.com', 'abc123abc');
  });

  it('deve disparar mensagem de erro se der erro no cadastro de usuário', () => {

    const userRegistrationResponseError: UserRegistrationErrorResponseDto = new UserRegistrationErrorResponseDto(
      'Ocorreu um erro no cadastro de usuário, tente novamente mais tarde.',
    );
    userRegistrationFacadeServiceSpy.registerUser.and.returnValue(throwError(() => userRegistrationResponseError));

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('asd123asd');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('asd123asd');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).toHaveBeenCalledWith('username', 'email@email.com', 'asd123asd');
    expect(messageServiceSpy.showMessage).toHaveBeenCalledWith('Ocorreu um erro no cadastro de usuário, tente novamente mais tarde.', 'error');
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o nome de usuário não for preenchido', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o nome de usuário estiver com espaços', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('admin admin');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o nome de usuário estiver com menos de 3 caracteres', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('us');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o nome de usuário estiver com mais de 30 caracteres', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('adminadminadminadminadminadminx');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o email estiver com mais de 254 caracteres', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('emailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemailemail@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o email não for preenchido', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se o email estiver inválido', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se a senha não for preenchida', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('asd123asd');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se a senha estiver com menos de 8 caracteres', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc1234');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc1234');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se a senha estiver com mais de 64 caracteres', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc123abc1abc123abc1abc123abc1abc123abc1abc123abc1abc123abc1abc123');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc123abc1abc123abc1abc123abc1abc123abc1abc123abc1abc123abc1abc123');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se a confirmação de senha não for preenchida', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc12345');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('registerUser - não deve seguir o fluxo para cadastro de usuário se a confirmação de senha estiver diferente da senha', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc12345');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc12347');

    userRegistrationComponent.registerUser();

    expect(userRegistrationFacadeServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('updateConfirmValidator - deve verificar o campo de confirmação de senha se o campo senha for alterado', () => {

    userRegistrationComponent.userRegistrationForm = userRegistrationComponent['_buildUserRegistrationForm']();

    userRegistrationComponent.userRegistrationForm.controls['username'].setValue('username');
    userRegistrationComponent.userRegistrationForm.controls['email'].setValue('email@email.com');
    userRegistrationComponent.userRegistrationForm.controls['password'].setValue('abc12345');
    userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].setValue('abc12347');

    userRegistrationComponent.updateConfirmValidator();

    expect(userRegistrationComponent.userRegistrationForm.controls['confirmPassword'].hasError('confirm')).toBeTrue();
  });
});
