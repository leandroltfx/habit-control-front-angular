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

import { RecoverPasswordComponent } from './recover-password.component';
import { MessageService } from '../../core/services/message/message.service';
import { RecoverPasswordFacadeService } from './acl/facade/recover-password-facade.service';
import { RecoverPasswordResponseDto } from '../../shared/dto/recover-password/recover-password-response-dto';
import { RecoverPasswordErrorResponseDto } from '../../shared/dto/recover-password/error/recover-password-error-response-dto';

describe('RecoverPasswordComponent', () => {
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let recoverPasswordComponent: RecoverPasswordComponent;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let recoverPasswordFacadeServiceSpy: jasmine.SpyObj<RecoverPasswordFacadeService>;
  let router: Router;

  beforeEach(() => {

    messageServiceSpy = jasmine.createSpyObj('MessageService', ['showMessage']);
    recoverPasswordFacadeServiceSpy = jasmine.createSpyObj('RecoverPasswordFacadeService', ['sendEmail']);

    TestBed.configureTestingModule({
      declarations: [RecoverPasswordComponent],
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
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: RecoverPasswordFacadeService, useValue: recoverPasswordFacadeServiceSpy }
      ]
    });
    fixture = TestBed.createComponent(RecoverPasswordComponent);
    router = TestBed.inject(Router);
    recoverPasswordComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(recoverPasswordComponent).toBeTruthy();
  });

  it('sendLinktoEmail - deve enviar link de recuperação de senha se o email for preenchido corretamente', () => {

    const navigateSpy = spyOn(router, 'navigate');

    const recoverPasswordResponseDto: RecoverPasswordResponseDto = new RecoverPasswordResponseDto(
      'Um link para a recuperação da senha foi enviada para seu email.'
    );

    recoverPasswordFacadeServiceSpy.sendEmail.and.returnValue(of(recoverPasswordResponseDto));

    recoverPasswordComponent.recoverPasswordForm = recoverPasswordComponent['_buildRecoverPasswordForm']();

    recoverPasswordComponent.recoverPasswordForm.controls['email'].setValue('email@email.com');

    recoverPasswordComponent.sendLinktoEmail();

    expect(recoverPasswordFacadeServiceSpy.sendEmail).toHaveBeenCalledWith('email@email.com');
    expect(messageServiceSpy.showMessage).toHaveBeenCalledWith('Um link para a recuperação da senha foi enviada para seu email.', 'success');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('deve disparar mensagem de erro se der erro na recuperação de senha', () => {

    const recoverPasswordResponseError: RecoverPasswordErrorResponseDto = new RecoverPasswordErrorResponseDto(
      'Ocorreu um erro, tente novamente mais tarde.',
    );
    recoverPasswordFacadeServiceSpy.sendEmail.and.returnValue(throwError(() => recoverPasswordResponseError));

    recoverPasswordComponent.recoverPasswordForm = recoverPasswordComponent['_buildRecoverPasswordForm']();

    recoverPasswordComponent.recoverPasswordForm.controls['email'].setValue('email@email.com');

    recoverPasswordComponent.sendLinktoEmail();

    expect(recoverPasswordFacadeServiceSpy.sendEmail).toHaveBeenCalledWith('email@email.com');
    expect(messageServiceSpy.showMessage).toHaveBeenCalledWith('Ocorreu um erro, tente novamente mais tarde.', 'error');
  });

  it('sendLinktoEmail - não deve enviar link de recuperação de senha se o email não for preenchido', () => {

    recoverPasswordComponent.recoverPasswordForm = recoverPasswordComponent['_buildRecoverPasswordForm']();

    recoverPasswordComponent.recoverPasswordForm.controls['email'].setValue('');

    recoverPasswordComponent.sendLinktoEmail();

    expect(recoverPasswordFacadeServiceSpy.sendEmail).not.toHaveBeenCalled();
  });

  it('sendLinktoEmail - não deve enviar link de recuperação de senha se o email estiver inválido', () => {

    recoverPasswordComponent.recoverPasswordForm = recoverPasswordComponent['_buildRecoverPasswordForm']();

    recoverPasswordComponent.recoverPasswordForm.controls['email'].setValue('email@email');

    recoverPasswordComponent.sendLinktoEmail();

    expect(recoverPasswordFacadeServiceSpy.sendEmail).not.toHaveBeenCalled();
  });
});
