import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MessageType } from '../../../shared/types/message.type';

@Injectable()
export class MessageService {

  private classesByMessageType: Map<string, string> = new Map(
    [
      ['success', 'hc-success-message'],
      ['error', 'hc-error-message'],
    ]
  );

  constructor(
    private readonly matSnackBar: MatSnackBar
  ) { }

  showMessage(
    message: string,
    type: MessageType,
  ): void {
    this.matSnackBar.open(
      message,
      '',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: this.classesByMessageType.get(type),
      }
    )
  }
}
