import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  private unsubscribe$ = new Subject<void>();
  notificationOpen: boolean = false

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notificationVisibility$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isVisible => {
        isVisible ? this.openNotification() : this.closeNotification()
      });

    
  }

  openNotification() {
    setTimeout(() => {
      this.notificationOpen = true
    }, 100)
  }

  closeNotification() {
    setTimeout(() => {
      this.notificationOpen = false
    }, 500)
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
