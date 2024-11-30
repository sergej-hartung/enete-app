import { Component } from '@angular/core';
import { MainNavbarService } from '../../../../services/main-navbar.service';
import { TariffGroupService } from '../../../../services/product/tariff/tariff-group.service';
import { TariffService } from '../../../../services/product/tariff/tariff.service';
import { NotificationService } from '../../../../services/notification.service';
import { ProductService } from '../../../../services/product/product.service';
import { FormService } from '../../../../services/form.service';
import { PreloaderService } from '../../../../services/preloader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tariff } from '../../../../models/tariff/tariff';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tariff-details',
  templateUrl: './tariff-details.component.html',
  styleUrl: './tariff-details.component.scss'
})
export class TariffDetailsComponent {

  tariff: Tariff | null = null
  private unsubscribe$ = new Subject<void>();

  constructor(
    // private mainNavbarService: MainNavbarService,
    // public tariffGroupService: TariffGroupService,
    public tariffService: TariffService,
    // private notificationService: NotificationService,
    // private productService: ProductService,
    // private formService: FormService,
    // private preloaderService: PreloaderService,
    // private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
    this.tariffService.detailedData$
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(response => {
          if(response && response?.data && response.entityType == 'Tariff' && response.requestType == "get"){
            this.tariff = response.data
            console.log(this.tariff)
          }
        })
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
