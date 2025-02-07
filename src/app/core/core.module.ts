import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RoutesService } from './services/routes/routes.service';
import { MessageService } from './services/message/message.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    MatSnackBarModule,
  ],
  providers: [
    RoutesService,
    MessageService,
  ]
})
export class CoreModule { }
