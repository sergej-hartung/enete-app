import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MainNavbarService } from '../../services/main-navbar.service';
import { TariffGroupService } from '../../services/product/tariff/tariff-group.service';
import { Subject, take, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  private unsubscribe$ = new Subject<void>();
  @ViewChild('notSaveTitleTemplate') notSaveTitleTemplate!: TemplateRef<any>;
  @ViewChild('notSaveMessageTemplate') notSaveMessageTemplate!: TemplateRef<any>;

  constructor(
    private mainNavbarService: MainNavbarService,
    public tariffGroupService: TariffGroupService,
    private notificationService: NotificationService
  ) {}

  
  ngOnInit() {
    this.initIconStates();
    this.setupProductActions()
  }

  private initIconStates(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);
  }

  private setupProductActions(): void {
    this.tariffGroupService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => this.handleProductAction(action));
  }

  private handleProductAction(action: any): void {
    switch (action.action) {
      // case 'deletePartnerFile':
      //   this.showNotification(action.proceedCallback, this.deleteFileTitleTemplate, this.deleteFileMessageTemplate);
      //   break;
      case 'selectRow':
      case 'sort':
      case 'filter':
        this.handleFormDirty(action.proceedCallback);
        break;
      default:
        action.proceedCallback();
    }
  }

  private handleFormDirty(proceedCallback: () => void): void {
    this.tariffGroupService.getFormDirty()
      .pipe(take(1), takeUntil(this.unsubscribe$))
      .subscribe(isDirty => {
        if (isDirty) {
          this.showNotification(proceedCallback);
        } else {
          proceedCallback();
        }
      });
  }

  private showNotification(proceedCallback: () => void, tpl = this.notSaveTitleTemplate, msg = this.notSaveMessageTemplate) {
    this.notificationService.configureNotification(null, null, tpl, msg, 'Weiter', 'Abbrechen', proceedCallback);
    this.notificationService.showNotification();
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
