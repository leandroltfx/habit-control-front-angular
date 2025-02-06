import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { RecoverPasswordComponent } from './recover-password.component';
import { RecoverPasswordRoutingModule } from './recover-password-routing.module';
import { RecoverPasswordProxyService } from './acl/proxy/recover-password-proxy.service';
import { RecoverPasswordFacadeService } from './acl/facade/recover-password-facade.service';
import { RecoverPasswordAdapterService } from './acl/adapter/recover-password-adapter.service';

@NgModule({
  declarations: [
    RecoverPasswordComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,

    RecoverPasswordRoutingModule,
  ],
  providers: [
    RecoverPasswordProxyService,
    RecoverPasswordFacadeService,
    RecoverPasswordAdapterService,
  ]
})
export class RecoverPasswordModule { }
