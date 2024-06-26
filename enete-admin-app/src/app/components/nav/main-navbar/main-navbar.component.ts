import { Component } from '@angular/core';
import { MainNavbarService } from '../../../services/main-navbar.service'
import { Subject, takeUntil } from 'rxjs';
import { PartnerService } from '../../../services/partner/partner.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss'
})
export class MainNavbarComponent {
  
  iconsState: any;
  private unsubscribe$ = new Subject<void>();

  constructor(
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
    this.mainNavbarService?.confirmAction(iconName, () => { 
      this.mainNavbarService.onIconClick(iconName);
    })
    
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
