import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { TariffGroupService } from '../../../services/product/tariff/tariff-group.service';
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
    public tariffGroupService: TariffGroupService
  ) {
    this.tariffGroupService.fetchData();
  }

  selectedRow(event: any){
    console.log(event)
  }


}
