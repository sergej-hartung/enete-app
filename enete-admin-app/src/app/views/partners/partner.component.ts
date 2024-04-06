import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Subject, of } from 'rxjs';
import { PartnerService } from '../../services/partner/partner.service';
import { StatusService } from '../../services/partner/status/status.service';
import { mergeMap, take, takeUntil } from 'rxjs/operators';
import { MainNavbarService } from '../../services/main-navbar.service';
import { NotificationService } from '../../services/notification.service';
import { CategorieService } from '../../services/partner/categorie/categorie.service';
import { CareerService } from '../../services/partner/career/career.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss'
})
export class PartnerComponent {

  private unsubscribe$ = new Subject<void>();
  @ViewChild('notSaveTitleTemplate') notSaveTitleTemplate!: TemplateRef<any>;
  @ViewChild('notSaveMessageTemplate') notSaveMessageTemplate!: TemplateRef<any>;
  @ViewChild('deleteFileTitleTemplate') deleteFileTitleTemplate!: TemplateRef<any>;
  @ViewChild('deleteFileMessageTemplate') deleteFileMessageTemplate!: TemplateRef<any>;
  
  constructor(
    private partnerService: PartnerService,
    private statusService: StatusService, 
    private categorieService: CategorieService,
    private careerService: CareerService,
    private mainNavbarService: MainNavbarService,
    private notificationService: NotificationService
  ) {}
  
  

  
  ngOnInit() {
    this.initIconStates();
    this.fetchInitialData();
    this.setupNavbarActions();
    this.setupPartnerActions();
  }


  private setupNavbarActions(): void {
    this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => this.handleNavbarAction(action));
  }

  private setupPartnerActions(): void {
    this.partnerService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => this.handlePartnerAction(action));
  }

  private handleNavbarAction(action: any): void {
    if (action.action === 'new') {
      this.handleFormDirty(action.proceedCallback);
    } else {
      action.proceedCallback();
    }
  }

  private handleFormDirty(proceedCallback: () => void): void {
    this.partnerService.getFormDirty()
      .pipe(take(1), takeUntil(this.unsubscribe$))
      .subscribe(isDirty => {
        if (isDirty) {
          this.showNotification(proceedCallback);
        } else {
          proceedCallback();
        }
      });
  }

  private handlePartnerAction(action: any): void {
    switch (action.action) {
      case 'deletePartnerFile':
        this.showNotification(action.proceedCallback, this.deleteFileTitleTemplate, this.deleteFileMessageTemplate);
        break;
      case 'selectRow':
      case 'sort':
      case 'filter':
        this.handleFormDirty(action.proceedCallback);
        break;
      default:
        action.proceedCallback();
    }
  }

  private initIconStates(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);
  }

  private fetchInitialData(): void {
    this.statusService.fetchData();
    this.careerService.fetchData();
    this.categorieService.fetchData();
    this.partnerService.fetchData({'status_id': '0'});
  }

 

  private showNotification(proceedCallback: () => void, tpl = this.notSaveTitleTemplate, msg = this.notSaveMessageTemplate) {
    this.notificationService.configureNotification(null, null, tpl, msg, 'Weiter', 'Abbrechen', proceedCallback);
    this.notificationService.showNotification();
  }


  ngOnDestroy() {
    this.partnerService.resetDetailedData()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
