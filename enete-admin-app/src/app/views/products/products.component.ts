import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MainNavbarService } from '../../services/main-navbar.service';
import { TariffGroupService } from '../../services/product/tariff/tariff-group.service';
import { Subject, take, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { TariffService } from '../../services/product/tariff/tariff.service';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  addOrEditProducts:boolean = false

  private unsubscribe$ = new Subject<void>();
  @ViewChild('notSaveTitleTemplate') notSaveTitleTemplate!: TemplateRef<any>;
  @ViewChild('notSaveMessageTemplate') notSaveMessageTemplate!: TemplateRef<any>;

  constructor(
    private mainNavbarService: MainNavbarService,
    public tariffGroupService: TariffGroupService,
    public tariffService: TariffService,
    private notificationService: NotificationService,
    private productService: ProductService
  ) {}

  
  ngOnInit() {
    this.initIconStates();
    this.setupProductActions()

    this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => {
        if (action.action === 'new') {
          this.handleFormDirty(action.proceedCallback);
        } else {
          action.proceedCallback();
        }
        // this.addOrNewProducts = !this.addOrNewProducts
        // console.log(button)
      })

    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(button => {
        if(button == 'new'){
          this.addOrEditProducts = true
          this.productService.setProductMode(button)
        }
        if(button == 'edit'){
          this.addOrEditProducts = true
          this.productService.setProductMode(button)
        }
        if(button == 'back'){
          this.addOrEditProducts = false
          this.productService.tariffGroupId$ 
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(id =>{
            if(id) this.mainNavbarService.setIconState('new', true, false);
          })
          this.productService.tariffId$ 
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(id =>{
            console.log(id)
            if(id) this.mainNavbarService.setIconState('edit', true, false);
          })
          this.productService.resetProductMode()
        }
        
      })
  }

  private initIconStates(): void {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, true);
    this.mainNavbarService.setIconState('back', true, true);
    this.mainNavbarService.setIconState('edit', true, true);
  }

  private setupProductActions(): void {
    this.tariffGroupService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => this.handleProductAction(action));

    this.tariffService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(action => this.handleProductAction(action));
  }

  private handleProductAction(action: any): void {
    console.log(action)
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
    console.log('destroy product component')
  }
}
