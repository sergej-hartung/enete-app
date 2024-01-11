import { Component } from '@angular/core';
import { MainNavbarService } from '../../../services/main-navbar.service'
import { Subject, takeUntil } from 'rxjs';
import { PartnerService } from '../../../services/partner.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss'
})
export class MainNavbarComponent {
  
  iconsState: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private partnerService: PartnerService,
    public mainNavbarService: MainNavbarService
    ) {}

  ngOnInit() {
    this.mainNavbarService.iconsState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        this.iconsState = state;
    });
  }

  // Обработка нажатия на иконку
  handleIconClick(iconName: string) {   
    this.partnerService?.confirmAction(iconName, () => { 
      this.mainNavbarService.onIconClick(iconName);
    })
    
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
