import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { TariffGroupService } from '../../../services/product/tariff/tariff-group.service';
import { TariffService } from '../../../services/product/tariff/tariff.service';
import { Tablecolumn } from '../../../models/tablecolumn';
import { Subject, takeUntil } from 'rxjs';
import { MainNavbarService } from '../../../services/main-navbar.service';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrl: './product-group.component.scss'
})
export class ProductGroupComponent {
  active = 1;

  isLoading = false

  tariffColumns: Tablecolumn[] = [
    { key: 'icon', title: '', isIcon: true  },
    { key: 'name', title: 'Gruppe', sortable: false }, 
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    public tariffGroupService: TariffGroupService,
    private tariffService: TariffService,
    private productService: ProductService,
    private mainNavbarService: MainNavbarService,
  ) {
    this.tariffGroupService.fetchData();
  }

  ngOnInit() {
    this.productService.setTariffOrHardwareTabActive(this.active)
    this.tariffService.data$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {  
        this.isLoading = false
      });
  }

  

  selectedTariffRow(event: any){
    this.productService.setTariffGroupId(event.id)
    this.tariffService.fetchDataByGroupId(event.id)
    this.mainNavbarService.setIconState('edit', true, true);
    this.mainNavbarService.setIconState('new', true, false);
    this.isLoading = true
  }

  navChange(event: any){
    if(event['nextId'] === 2){
      this.productService._resetTariffData.emit()
      //this.productService.resetTariffGroupId()
    }
    this.mainNavbarService.setIconState('new', true, true);
    this.productService.setTariffOrHardwareTabActive(event['nextId'])  
  }

  ngOnDestroy() {
    console.log('destroy Group')
    this.tariffGroupService.resetData()

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
