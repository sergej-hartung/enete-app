import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MainNavbarService } from '../../services/main-navbar.service';
import { TariffGroupService } from '../../services/product/tariff/tariff-group.service';
import { Subject, take, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { TariffService } from '../../services/product/tariff/tariff.service';
import { ProductService } from '../../services/product/product.service';
import { FormService } from '../../services/form.service';
import { PreloaderService } from '../../services/preloader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  addOrEditProducts:boolean = false
  errors = ''
  private unsubscribe$ = new Subject<void>();
  @ViewChild('errorWhileSavingTitleTemplate') errorWhileSavingTitleTemplate!: TemplateRef<any>;
  @ViewChild('errorWhileSavingTemplate') errorWhileSavingTemplate!: TemplateRef<any>;
  @ViewChild('notSaveTitleTemplate') notSaveTitleTemplate!: TemplateRef<any>;
  @ViewChild('notSaveMessageTemplate') notSaveMessageTemplate!: TemplateRef<any>;

  constructor(
    private mainNavbarService: MainNavbarService,
    public tariffGroupService: TariffGroupService,
    public tariffService: TariffService,
    private notificationService: NotificationService,
    private productService: ProductService,
    private formService: FormService,
    private preloaderService: PreloaderService,
    private snackBar: MatSnackBar
  ) {}

  loadingMessage = 'Loading'
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

    // Acktion nach dem Knopf drucken
    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(button => {
        if(button == 'new'){
          this.preloaderService.show('Loading')
          this.addOrEditProducts = true
          this.productService.setProductMode(button)
        }
        if(button == 'edit'){
          this.preloaderService.show('Loading')
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
            if(id) this.mainNavbarService.setIconState('edit', true, false);
          })
          this.productService.resetProductMode()
          this.formService.tariffForm = null
        }
        
      })

      // Tarif gespeichert
      this.tariffService.detailedData$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(data => {  
              if(data?.entityType == 'Tariff' && data.requestType == 'post'){
                this.addOrEditProducts = false
                this.mainNavbarService.setIconState('save', true, true);
                this.mainNavbarService.setIconState('new', true, false);

                this.productService.resetTariffId()
                this.productService.resetSelectedTariff()

                this.productService.tariffGroupId$ 
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe(id =>{
                    if(id) this.tariffService.fetchDataByGroupId(id) 
                  })

                setTimeout(() => {
                  // Скрыть прелоадер
                  this.preloaderService.hide();
                  this.snackBar.open('Tarif wurde erfolgreich gespeichert!', '', {
                    duration: 3000, // Уведомление исчезнет через 3 секунды
                    horizontalPosition: 'right', // Позиция по горизонтали
                    verticalPosition: 'bottom', // Позиция по вертикали
                    panelClass: ['success-snackbar']
                  });
                }, 1000);
                //this.preloaderService.hide();

                  // this.snackBar.open('Тариф успешно сохранён!', '', {
                  //   duration: 3000, // Уведомление исчезнет через 3 секунды
                  //   horizontalPosition: 'right', // Позиция по горизонтали
                  //   verticalPosition: 'top', // Позиция по вертикали
                  //   panelClass: ['success-snackbar']
                  // });

                
                //this.isLoading = true
              }

              if(data?.entityType == 'Tariff' && data.requestType == 'patch'){
                this.addOrEditProducts = false
                this.mainNavbarService.setIconState('save', true, true);
                this.mainNavbarService.setIconState('new', true, false);

                this.productService.tariffId$ 
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe(id =>{
                    if(id) this.mainNavbarService.setIconState('edit', true, false);
                  })

                setTimeout(() => {
                  this.preloaderService.hide();
                  this.snackBar.open('Tarif wurde erfolgreich aktualisiert!', '', {
                    duration: 3000, // Уведомление исчезнет через 3 секунды
                    horizontalPosition: 'right', // Позиция по горизонтали
                    verticalPosition: 'bottom', // Позиция по вертикали
                    panelClass: ['success-snackbar']
                  });
                }, 1000)
              }
              
          });

      this.tariffService.errors$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(errors => {
          console.log(errors)
          if(errors.requestType == 'post' && errors.entityType == 'Tariff'){
            this.errors = errors.msg
            this.showNotificationError(() => {
              this.errors = ''
            })
          }
          if(errors.requestType == 'patch' && errors.entityType == 'Tariff'){
            this.errors = errors.msg
            this.showNotificationError(() => {
              this.errors = ''
            })
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

  private showNotificationError(proceedCallback: () => void, tpl = this.errorWhileSavingTitleTemplate, msg = this.errorWhileSavingTemplate) {
    this.notificationService.configureNotification(null, null, tpl, msg, 'OK', undefined, proceedCallback);
    this.notificationService.showNotification();
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.productService.resetProductMode()
    this.productService.resetSelectedTariff()
    this.productService.resetTariffGroupId()
    this.productService.resetTariffId()
    this.formService.tariffForm = null
    console.log('destroy product component')
  }
}
