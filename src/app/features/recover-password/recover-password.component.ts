import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService } from '../../core/services/message/message.service';
import { RecoverPasswordFacadeService } from './acl/facade/recover-password-facade.service';
import { RecoverPasswordResponseDto } from '../../shared/dto/recover-password/recover-password-response-dto';
import { RecoverPasswordErrorResponseDto } from '../../shared/dto/recover-password/error/recover-password-error-response-dto';

@Component({
  selector: 'hc-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {

  public recoverPasswordForm!: FormGroup;

  private _patternEmail: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly _messageService: MessageService,
    private readonly _recoverPasswordFacadeService: RecoverPasswordFacadeService,
  ) {}

  ngOnInit(): void {
    this.recoverPasswordForm = this._buildRecoverPasswordForm();
  }

  public sendLinktoEmail(): void {
    if (this.recoverPasswordForm.valid) {
      const email = this.recoverPasswordForm.controls['email'].value;
      this._recoverPasswordFacadeService.sendEmail(
        email
      ).subscribe(
        {
          next: (recoverPasswordResponseDto: RecoverPasswordResponseDto) => {
            this._messageService.showMessage(recoverPasswordResponseDto.message, 'success');
            this._router.navigate(['/login']);
          },
          error: (recoverPasswordErrorResponseDto: RecoverPasswordErrorResponseDto) => this._messageService.showMessage(recoverPasswordErrorResponseDto.message, 'error'),
        }
      );
    }
  }

  private _buildRecoverPasswordForm(): FormGroup {
    return this._formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this._patternEmail)]]
    });
  }

}
