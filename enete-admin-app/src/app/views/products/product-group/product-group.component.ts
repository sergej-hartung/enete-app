import { Component } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { Tablecolumn } from '../../../models/tablecolumn';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrl: './product-group.component.scss'
})
export class ProductGroupComponent {
  active = 1;

  parnerColumns: Tablecolumn[] = [
    { key: 'icon', title: '', sortable: false },
    { key: 'group', title: 'Gruppe', sortable: false }, 
    // { key: 'first_name', title: 'Vorname', sortable: true },
    // { key: 'last_name', title: 'Nachname', sortable: true },
    // { key: 'accesses', title: 'Zugang', isIcon: true },
    // { key: 'status', title: 'Status', sortable: true, isIcon: true },
  ];

  constructor(
    public productService: ProductService,
  ) {}
}
