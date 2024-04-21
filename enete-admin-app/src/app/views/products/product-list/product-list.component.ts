import { Component } from '@angular/core';
import { Tablecolumn } from '../../../models/tablecolumn';
import { FilterOption } from '../../../shared/components/generic-table/generic-table.component';
import { ProductService } from '../../../services/product/product.service'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  active = 1;

  dataLoadedOrNew = false
  IsExpandable = false;
  parnerColumns: Tablecolumn[] = [
    { key: 'id', title: '#', sortable: true },
    { key: 'vp_nr', title: 'Id-Ext.', sortable: true }, 
    { key: 'first_name', title: 'Provider', sortable: true },
    { key: 'last_name', title: 'Tarifname', sortable: true },
    { key: 'accesses', title: 'Erstellt am', isIcon: true },
    { key: 'status', title: 'Geändert am', sortable: true, isIcon: true },
    { key: 'status', title: 'Connect', sortable: true, isIcon: true },
    { key: 'status', title: 'Status', sortable: true, isIcon: true },
    { key: 'status', title: 'Web Ativ', sortable: true, isIcon: true },
  ];

  filters: FilterOption[] = [
    { type: 'text', key: 'search', label: 'Search' },
    { type: 'select', key: 'status_id', label: 'Status', options: [] },
    { type: 'select', key: 'categorie_id', label: 'Provider', options: [] },
    { type: 'select', key: 'categorie_id', label: 'Netzbetreiber', options: [] },
  ];

  constructor(
    public productService: ProductService,
  ) {}
  
}
