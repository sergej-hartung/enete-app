import { Component, OnInit, TemplateRef} from '@angular/core';
import {NotificationService} from '../../../services/notification.service'
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  title: string | null = '';
  message: string | null = '';
  titleTemplate: TemplateRef<any> | null   = null;
  messageTemplate: TemplateRef<any> | null = null;
  acceptBtnTitle: string | null | undefined  = null;
  declineBtnTitle: string | null | undefined  = null;
  isVisible: boolean | undefined  = false;

  onAccept?: () => void;
  onDecline?: () => void;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notificationConfig$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(config  => {
        console.log(config)
        if (config ) {
          this.title = config .title;
          this.message = config .message;
          this.titleTemplate = config .titleTemplate;
          this.messageTemplate = config ?.messageTemplate;
          this.acceptBtnTitle = config .acceptBtnTitle;
          this.declineBtnTitle = config .declineBtnTitle;
          this.onAccept = config .onAccept;
          this.onDecline = config .onDecline;
        }
      });

    // Subscribe to visibility changes
    this.notificationService.notificationVisibility$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isVisible => {
        this.isVisible = isVisible;
      });
  }

  handleAccept() {
    if (this.onAccept) this.onAccept();
    this.notificationService.hideNotification();
  }

  handleDecline() {
    if (this.onDecline) this.onDecline();
    this.notificationService.hideNotification();
  }
    
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}