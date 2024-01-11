import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationConfigSubject  = new BehaviorSubject<{
    title: string | null,
    message: string | null,
    titleTemplate: TemplateRef<any> | null,
    messageTemplate: TemplateRef<any> | null,
    acceptBtnTitle?: string,
    declineBtnTitle?: string,
    onAccept?: () => void,
    onDecline?: () => void,
  } | null>(null);


  private notificationVisibilitySubject = new BehaviorSubject<boolean>(false);

  public notificationConfig$ = this.notificationConfigSubject.asObservable();
  public notificationVisibility$ = this.notificationVisibilitySubject.asObservable();

  configureNotification(
    title: string | null,
    message: string | null,
    titleTemplate: TemplateRef<any> | null,
    messageTemplate: TemplateRef<any> | null,
    acceptBtnTitle: string  = 'Accept',
    declineBtnTitle: string = 'Decline',
    onAccept?: () => void,
    onDecline?: () => void
  ) {
    this.notificationConfigSubject.next({
      title, // HTML content as a string
      message, // HTML content as a string
      titleTemplate,
      messageTemplate,
      acceptBtnTitle,
      declineBtnTitle,
      onAccept,
      onDecline,
    });
  }

  showNotification() {
    this.notificationVisibilitySubject.next(true);
  }

  hideNotification() {
    this.notificationVisibilitySubject.next(false);
  }
}