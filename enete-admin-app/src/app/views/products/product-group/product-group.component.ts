import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { TariffGroupService } from '../../../services/product/tariff/tariff-group.service';
import { TariffService } from '../../../services/product/tariff/tariff.service';
import { Tablecolumn } from '../../../models/tablecolumn';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrl: './product-group.component.scss'
})
export class ProductGroupComponent {
  active = 1;

  parnerColumns: Tablecolumn[] = [
    { key: 'icon', title: '', isIcon: true  },
    { key: 'name', title: 'Gruppe', sortable: false }, 
  ];

  constructor(
    public tariffGroupService: TariffGroupService,
    private tariffService: TariffService
  ) {
    this.tariffGroupService.fetchData();
  }

  selectedRow(event: any){
    console.log(event)
    this.tariffService.tariffGroupId.emit(event.id)
    this.tariffService.fetchDataByGroupId(event.id)
  }

  navChange(event: any){
    if(event['nextId'] === 2){
      this.tariffService._resetData.emit()
    }
  }

  ngOnDestroy() {
    console.log('destroy Group')
    this.tariffGroupService.resetData()
  }

}
