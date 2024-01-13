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
  @ViewChild('customTitleTemplate') customTitleTemplate!: TemplateRef<any>;
  @ViewChild('customMessageTemplate') customMessageTemplate!: TemplateRef<any>;
  
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
      'status_id': '1'
    })

    

    this.mainNavbarService.iconClicks$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(iconName => {
        if (iconName === 'new') {
          // this.partnerService.data$.subscribe(data => {
          //   console.log(data)
          // })
          // this.partnerService.resetDetailedData();
          console.log('new')
          //this.showNotification()
          // Обработка нажатия на иконку save
        }
    });

    this.partnerService.confirmAction$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({action, proceedCallback}) => {
        console.log(action)
        if(action == 'new' || action == 'selectRow' || action == 'sort' || action == 'filter'){
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
      () => console.log('Declined!')
    );

    this.notificationService.showNotification();
  }

  

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
