import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PartnerService } from '../../services/partner/partner.service';
import { StatusService } from '../../services/partner/status/status.service';
import { take, takeUntil } from 'rxjs/operators';
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
    this.mainNavbarService.setIconState('save', true, true);
    this.mainNavbarService.setIconState('new', true, false);

    this.statusService.fetchData()   
    this.careerService.fetchData()   
    this.categorieService.fetchData()   
    this.partnerService.fetchData({
      'status_id': '0',
    })

    

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
          this.partnerService.getFormDirty()
          .pipe(take(1))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(isDitry => {
            if(isDitry){
              //this.partnerService.setFormDirty(false)
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

    this.partnerService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({action, proceedCallback}) => {
        console.log(action)
        if(action == 'deletePartnerFile'){
          this.showNotification(proceedCallback, this.deleteFileTitleTemplate, this.deleteFileMessageTemplate)
        }

        if(action == 'selectRow' || action == 'sort' || action == 'filter' || action == 'deletePartnerFile' ){
          this.partnerService.getFormDirty()
          .pipe(take(1))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(isDitry => {
            if(isDitry && action != 'deletePartnerFile'){
              this.showNotification(proceedCallback)         
            }else{
              if(action != 'deletePartnerFile'){
                proceedCallback()
              }       
            }
          })
        }else{
          proceedCallback()
        }       
    });
  }

  

  showNotification(proceedCallback: any, tpl = this.notSaveTitleTemplate, msg = this.notSaveMessageTemplate,) {
    this.notificationService.configureNotification(
      null,// 'test',  // No simple title, using a template
      null,// 'Test text',  // No simple message, using a template
      tpl,
      msg,
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
    this.partnerService.resetDetailedData()
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
