import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginProxyService } from './acl/proxy/login-proxy.service';
import { LoginFacadeService } from './acl/facade/login-facade.service';
import { LoginAdapterService } from './acl/adapter/login-adapter.service';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule
  ],
  providers: [
    LoginProxyService,
    LoginFacadeService,
    LoginAdapterService,
  ],
})
export class LoginModule { }
