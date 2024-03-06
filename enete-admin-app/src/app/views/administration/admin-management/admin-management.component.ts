import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { AdminService } from '../../../services/admin/admin.service';
import { MainNavbarService } from '../../../services/main-navbar.service';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.scss'
})
export class AdminManagementComponent {

  private unsubscribe$ = new Subject<void>();
  @ViewChild('customTitleTemplate') customTitleTemplate!: TemplateRef<any>;
  @ViewChild('customMessageTemplate') customMessageTemplate!: TemplateRef<any>;
  
  constructor(
    public adminService: AdminService,
    // private statusService: StatusService, 
    // private categorieService: CategorieService,
    // private careerService: CareerService,
    private mainNavbarService: MainNavbarService,
    private notificationService: NotificationService
  ) {}
  


  

  
  ngOnInit() {
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);

    this.adminService.fetchData()


    // this.mainNavbarService.iconClicks$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(iconName => {
    //     if (iconName === 'new') {
    //       // this.partnerService.data$.subscribe(data => {
    //       //   console.log(data)
    //       // })
    //       // this.partnerService.resetDetailedData();
    //       console.log('new')
    //       //this.showNotification()
    //       // Обработка нажатия на иконку save
    //     }
    // });

    this.mainNavbarService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({action, proceedCallback}) => {
        console.log(action)
        if(action == 'new'){
          this.adminService.getFormDirty()
          .pipe(take(1))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(isDitry => {
            if(isDitry){
              //this.adminService.setFormDirty(false)
              this.showNotification(proceedCallback)
              //proceedCallback()
            }else{
              proceedCallback()
            }
          })
        }else{
          proceedCallback()
        }       
    });

    this.adminService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({action, proceedCallback}) => {
        console.log(action)
        if(action == 'selectRow' || action == 'sort' || action == 'filter'){
          this.adminService.getFormDirty()
          .pipe(take(1))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(isDitry => {
            if(isDitry){
              //this.adminService.setFormDirty(false)
              this.showNotification(proceedCallback)
              //proceedCallback()
            }else{
              proceedCallback()
            }
          })
        }else{
          proceedCallback()
        }       
    });
  }

  showNotification(proceedCallback: any) {
    this.notificationService.configureNotification(
      null,// 'test',  // No simple title, using a template
      null,// 'Test text',  // No simple message, using a template
      this.customTitleTemplate,
      this.customMessageTemplate,
      // null,
      // null,
      'Weiter',  // acceptBtnTitle
      'Abbrechen',  // declineBtnTitle
      () => proceedCallback(),
      () => ''
    );

    this.notificationService.showNotification();
  }


  

  ngOnDestroy() {
    this.adminService.resetDetailedData()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
