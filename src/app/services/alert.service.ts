import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {ALERT_DANGER, ALERT_SUCCESS} from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private bar: MatSnackBar) {
  }

  public showAlertMessage(message: string, error?: HttpErrorResponse, style?: string) {
    this.bar.open(message + this.parseError(error), 'close', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: error || style === ALERT_DANGER ? ALERT_DANGER : ALERT_SUCCESS,
    });
  }

  private parseError(error: HttpErrorResponse): string[] {
    const messages: string[] = [];
    if (error && error.error && error.error.errors) {
      if (Array.isArray(error.error.errors)) {
        error.error.errors.forEach(
          (data) => messages.push(data.defaultMessage));
      } else if (error.error.errors.defaultMessage) {
        messages.push(error.error.errors.defaultMessage);
      }
    }
    return messages;
  }
}
