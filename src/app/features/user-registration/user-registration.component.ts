import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageService } from '../../core/services/message/message.service';
import { UserRegistrationFacadeService } from './acl/facade/user-registration-facade.service';
import { UserRegistrationResponseDto } from '../../shared/dto/user-registration/user-registration-response-dto';
import { UserRegistrationErrorResponseDto } from '../../shared/dto/user-registration/error/user-registration-error-response-dto';

@Component({
  selector: 'hc-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {

  public userRegistrationForm!: FormGroup;
  public hidePassword: boolean = true;
  public hideConfirmPassword: boolean = true;

  private _patternEmail: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private _patternUsername: RegExp = /^[^\s]+$/;
  private _minLengthUsername: number = 3;
  private _maxLengthUsername: number = 30;
  private _maxLengthEmail: number = 254;
  private _minLengthPassword: number = 8;
  private _maxLengthPassword: number = 64;

  constructor(
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly _messageService: MessageService,
    private readonly _userRegistrationFacadeService: UserRegistrationFacadeService,
  ) { }

  ngOnInit(): void {
    this.userRegistrationForm = this._buildUserRegistrationForm();
  }

  public updateConfirmValidator(): void {
    Promise.resolve().then(() => this.userRegistrationForm.controls['confirmPassword'].updateValueAndValidity());
  }

  public registerUser(): void {
    if (this.userRegistrationForm.valid) {
      const username = this.userRegistrationForm.controls['username'].value;
      const email = this.userRegistrationForm.controls['email'].value;
      const password = this.userRegistrationForm.controls['password'].value;
      this._userRegistrationFacadeService.registerUser(
        username,
        email,
        password,
      ).subscribe(
        {
          next: (userRegistrationResponseDto: UserRegistrationResponseDto) => {
            this._messageService.showMessage(userRegistrationResponseDto.message, 'success');
            this._router.navigate(['/home']);
          },
          error: (userRegistrationErrorResponseDto: UserRegistrationErrorResponseDto) => this._messageService.showMessage(userRegistrationErrorResponseDto.message, 'error'),
        }
      );
    }
  }

  private _buildUserRegistrationForm(): FormGroup {
    return this._formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this._patternUsername), Validators.minLength(this._minLengthUsername), Validators.maxLength(this._maxLengthUsername)]],
      email: ['', [Validators.required, Validators.pattern(this._patternEmail), Validators.maxLength(this._maxLengthEmail)]],
      password: ['', [Validators.required, Validators.minLength(this._minLengthPassword), Validators.maxLength(this._maxLengthPassword)]],
      confirmPassword: ['', [Validators.required, this._confirmationValidator]],
    });
  }

  private _confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.userRegistrationForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

}
